import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Users, ShoppingBag, TrendingUp, LogOut, UserCheck, Bell, Home, Menu, Package, Percent, Ticket, Settings, Tag, CreditCard, Image, Eye } from 'lucide-react';
import SellerApprovals from './admin/SellerApprovals';
import PlatformAnalytics from './admin/PlatformAnalytics';
import BroadcastNotifications from './admin/BroadcastNotifications';
import CouponManagement from './admin/CouponManagement';
import TicketManagement from './admin/TicketManagement';
import FooterManagement from './admin/FooterManagement';
import OfferCardsManagement from './admin/OfferCardsManagement';
import BankOffersManagement from './admin/BankOffersManagement';
import PlatformSettings from './admin/PlatformSettings';
import SellerPayouts from './admin/SellerPayouts';
import StorefrontSettings from './admin/StorefrontSettings';
import HeroBannerManagement from './admin/HeroBannerManagement';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

// Common Header Component
function AdminHeader({ user, logout, navigate }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="menu-btn">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Admin Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3"
                    onClick={() => { navigate('/'); setMenuOpen(false); }}
                  >
                    <Home className="w-5 h-5" />
                    <span>Home</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3"
                    onClick={() => { navigate('/admin'); setMenuOpen(false); }}
                  >
                    <TrendingUp className="w-5 h-5" />
                    <span>Dashboard</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3"
                    onClick={() => { navigate('/admin/sellers'); setMenuOpen(false); }}
                  >
                    <UserCheck className="w-5 h-5" />
                    <span>Seller Approvals</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3"
                    onClick={() => { navigate('/admin/analytics'); setMenuOpen(false); }}
                  >
                    <TrendingUp className="w-5 h-5" />
                    <span>Analytics</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3"
                    onClick={() => { navigate('/admin/notifications'); setMenuOpen(false); }}
                  >
                    <Bell className="w-5 h-5" />
                    <span>Notifications</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3"
                    onClick={() => { navigate('/admin/coupons'); setMenuOpen(false); }}
                  >
                    <Percent className="w-5 h-5" />
                    <span>Coupon Management</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3"
                    onClick={() => { navigate('/admin/tickets'); setMenuOpen(false); }}
                  >
                    <Ticket className="w-5 h-5" />
                    <span>Support Tickets</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3"
                    onClick={() => { navigate('/admin/offers'); setMenuOpen(false); }}
                  >
                    <Tag className="w-5 h-5" />
                    <span>Offer Cards</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3"
                    onClick={() => { navigate('/admin/bank-offers'); setMenuOpen(false); }}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Bank Offers</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3"
                    onClick={() => { navigate('/admin/footer'); setMenuOpen(false); }}
                  >
                    <Settings className="w-5 h-5" />
                    <span>Footer Settings</span>
                  </Button>
                  <div className="border-t my-2"></div>
                  <p className="text-xs text-gray-500 px-3 py-1 font-semibold">PLATFORM</p>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3"
                    onClick={() => { navigate('/admin/settings'); setMenuOpen(false); }}
                  >
                    <Settings className="w-5 h-5" />
                    <span>Platform Settings</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3"
                    onClick={() => { navigate('/admin/payouts'); setMenuOpen(false); }}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Seller Payouts</span>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
            
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate('/')}
              data-testid="brand-logo"
            >
              <Package className="w-8 h-8 text-purple-600" />
              <div className="hidden sm:block">
                <p className="font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Black Money
                </p>
                <p className="text-xs text-gray-500">Admin Portal</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              title="Go to Home"
              data-testid="home-btn"
            >
              <Home className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" data-testid="notifications-btn">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" onClick={logout} data-testid="logout-btn" className="hidden sm:flex">
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
            <Button variant="ghost" size="icon" onClick={logout} className="sm:hidden" data-testid="logout-btn-mobile">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

function AdminHome() {
  const [stats, setStats] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/analytics/admin`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader user={user} logout={logout} navigate={navigate} />

      {/* Navigation */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            <Button variant="default" onClick={() => navigate('/admin')} data-testid="nav-home">Dashboard</Button>
            <Button variant="ghost" onClick={() => navigate('/admin/sellers')} data-testid="nav-sellers">Seller Approvals</Button>
            <Button variant="ghost" onClick={() => navigate('/admin/analytics')} data-testid="nav-analytics">Analytics</Button>
            <Button variant="ghost" onClick={() => navigate('/admin/notifications')} data-testid="nav-notifications">Notifications</Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-4">
          <h2 className="text-2xl font-bold">Platform Overview</h2>
          <p className="text-gray-600">Manage your marketplace</p>
        </div>

        {stats && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card data-testid="stat-users">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total_users}</div>
              </CardContent>
            </Card>

            <Card data-testid="stat-sellers">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Sellers</CardTitle>
                <UserCheck className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total_sellers}</div>
                {stats.pending_sellers > 0 && (
                  <p className="text-xs text-orange-600 mt-1">
                    {stats.pending_sellers} pending approval
                  </p>
                )}
              </CardContent>
            </Card>

            <Card data-testid="stat-products">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <ShoppingBag className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total_products}</div>
              </CardContent>
            </Card>

            <Card data-testid="stat-revenue" className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/admin/analytics')}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{stats.total_revenue.toFixed(2)}</div>
                <p className="text-xs text-blue-600 mt-1">Click for seller-wise breakdown</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <Button
                onClick={() => navigate('/admin/sellers')}
                className="w-full justify-start"
                data-testid="quick-approve-sellers"
              >
                <UserCheck className="w-4 h-4 mr-2" /> Approve Sellers
              </Button>
              <Button
                onClick={() => navigate('/admin/notifications')}
                variant="outline"
                className="w-full justify-start"
                data-testid="quick-send-notification"
              >
                <Bell className="w-4 h-4 mr-2" /> Send Notification
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Routes>
      <Route path="/" element={<AdminHome />} />
      <Route path="/sellers" element={<SellerApprovals />} />
      <Route path="/analytics" element={<PlatformAnalytics />} />
      <Route path="/notifications" element={<BroadcastNotifications />} />
      <Route path="/coupons" element={<CouponManagement />} />
      <Route path="/tickets" element={<TicketManagement />} />
      <Route path="/offers" element={<OfferCardsManagement />} />
      <Route path="/bank-offers" element={<BankOffersManagement />} />
      <Route path="/footer" element={<FooterManagement />} />
      <Route path="/settings" element={<PlatformSettings />} />
      <Route path="/payouts" element={<SellerPayouts />} />
      <Route path="/storefront" element={<StorefrontSettings />} />
      <Route path="/banners" element={<HeroBannerManagement />} />
    </Routes>
  );
}
