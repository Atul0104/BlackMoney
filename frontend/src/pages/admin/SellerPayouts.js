import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, DollarSign, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { format } from 'date-fns';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

export default function SellerPayouts() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [paymentRef, setPaymentRef] = useState('');

  useEffect(() => {
    fetchPayouts();
  }, []);

  const fetchPayouts = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/seller-payouts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPayouts(response.data);
    } catch (error) {
      toast.error('Failed to fetch payouts');
    } finally {
      setLoading(false);
    }
  };

  const generatePayouts = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/admin/generate-payouts`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(response.data.message);
      fetchPayouts();
    } catch (error) {
      toast.error('Failed to generate payouts');
    }
  };

  const processPayout = async () => {
    if (!paymentRef.trim()) {
      toast.error('Payment reference required');
      return;
    }
    try {
      await axios.put(
        `${API_URL}/admin/seller-payouts/${selectedPayout.id}/process`,
        null,
        {
          params: { payment_reference: paymentRef },
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      toast.success('Payout processed!');
      fetchPayouts();
      setSelectedPayout(null);
      setPaymentRef('');
    } catch (error) {
      toast.error('Failed to process payout');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-500',
      processed: 'bg-blue-500',
      paid: 'bg-green-500'
    };
    return <Badge className={styles[status]}>{status.toUpperCase()}</Badge>;
  };

  if (loading) {
    return <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>;
  }

  return (
    <div className="space-y-6 p-6">
      <Button variant="ghost" onClick={() => navigate('/admin')} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Seller Payouts</h1>
          <p className="text-gray-500 mt-1">Manage weekly seller payments</p>
        </div>
        <Button onClick={generatePayouts} className="gap-2">
          <DollarSign className="w-4 h-4" />
          Generate Payouts
        </Button>
      </div>

      <div className="grid gap-4">
        {payouts.map((payout) => (
          <Card key={payout.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Seller ID: {payout.seller_id.slice(0, 8)}...</CardTitle>
                  <p className="text-sm text-gray-500">
                    {format(new Date(payout.period_start), 'PP')} - {format(new Date(payout.period_end), 'PP')}
                  </p>
                </div>
                {getStatusBadge(payout.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Orders</p>
                  <p className="text-xl font-bold">{payout.total_orders}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gross Amount</p>
                  <p className="text-xl font-bold">₹{payout.gross_amount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Platform Fee</p>
                  <p className="text-xl font-bold text-red-600">-₹{payout.platform_fee.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Promotion Fee</p>
                  <p className="text-xl font-bold text-red-600">-₹{payout.promotion_fee.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Net Payout</p>
                  <p className="text-xl font-bold text-green-600">₹{payout.net_payout.toFixed(2)}</p>
                </div>
              </div>
              {payout.status === 'pending' && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button onClick={() => setSelectedPayout(payout)} className="gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Process Payment
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Process Payout</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <p>Amount: ₹{payout.net_payout.toFixed(2)}</p>
                      <div>
                        <label className="text-sm font-medium">Payment Reference/Transaction ID</label>
                        <Input
                          value={paymentRef}
                          onChange={(e) => setPaymentRef(e.target.value)}
                          placeholder="TXN123456789"
                        />
                      </div>
                      <Button onClick={processPayout} className="w-full">
                        Confirm Payment
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              {payout.status === 'paid' && payout.payment_reference && (
                <p className="text-sm text-gray-500">Ref: {payout.payment_reference}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {payouts.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <DollarSign className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 mb-4">No payouts generated yet</p>
            <Button onClick={generatePayouts}>Generate Payouts</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
