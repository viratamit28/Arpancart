import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, Users, Download, LogOut, Loader2 } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalOrders: 0, totalProducts: 0, totalUsers: 0, totalRevenue: 0 });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      navigate('/admin/login');
      return;
    }

    const user = JSON.parse(userStr);
    if (user.role !== 'admin') {
      navigate('/');
      return;
    }

    // Fetch Admin Data
    const fetchAdminData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const [statsRes, ordersRes] = await Promise.all([
          axios.get('https://arpancart-production.up.railway.app/api/admin/stats', config),
          axios.get('https://arpancart-production.up.railway.app/api/admin/orders', config)
        ]);

        if (statsRes.data.success) setStats(statsRes.data.data);
        if (ordersRes.data.success) setOrders(ordersRes.data.data);
      } catch (error) {
        console.error("Admin data fetch error:", error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem('token');
          navigate('/admin/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  // 🔥 DOWNLOAD REPORT (CSV EXPORT LOGIC)
  const downloadReport = () => {
    // 1. CSV Header Set Karo
    let csvContent = "Order ID,Customer Name,Customer Email,Total Amount (Rs),Status,Order Date\n";
    
    // 2. Data loop karke CSV rows banao
    orders.forEach(order => {
      const orderId = `ARP_${order.id.toString().padStart(5, '0')}`;
      const customerName = order.user?.name || "N/A";
      const customerEmail = order.user?.email || "N/A";
      const amount = order.totalAmount;
      const status = order.status;
      const date = new Date(order.createdAt).toLocaleDateString('en-IN');
      
      csvContent += `"${orderId}","${customerName}","${customerEmail}","${amount}","${status}","${date}"\n`;
    });

    // 3. File Create & Download Trigger
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Arpancart_Orders_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcfaf5]">
        <Loader2 className="w-10 h-10 text-[#8b1818] animate-spin mb-4" />
        <h2 className="text-xl font-bold text-gray-800">Loading Admin Portal...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      
      {/* =========================================
          SIDEBAR
      ========================================= */}
      <aside className="w-full md:w-64 bg-[#8b1818] text-white flex flex-col">
        <div className="p-6 border-b border-white/10 text-center md:text-left">
          <h1 className="text-2xl font-extrabold tracking-widest uppercase">Admin Panel</h1>
          <p className="text-xs text-orange-200 mt-1 font-medium">ArpanCart Control Center</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button className="w-full flex items-center gap-3 bg-white/10 text-white font-bold py-3 px-4 rounded-sm transition-colors">
            <LayoutDashboard className="w-5 h-5 text-[#f7941d]" /> Dashboard
          </button>
          <button className="w-full flex items-center gap-3 text-white/70 hover:bg-white/5 hover:text-white font-bold py-3 px-4 rounded-sm transition-colors">
            <Package className="w-5 h-5" /> Products (Soon)
          </button>
          <button className="w-full flex items-center gap-3 text-white/70 hover:bg-white/5 hover:text-white font-bold py-3 px-4 rounded-sm transition-colors">
            <Users className="w-5 h-5" /> Customers (Soon)
          </button>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-red-900/50 hover:bg-red-900 text-white font-bold py-3 rounded-sm transition-colors">
            <LogOut className="w-4 h-4" /> Secure Logout
          </button>
        </div>
      </aside>

      {/* =========================================
          MAIN CONTENT AREA
      ========================================= */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 uppercase tracking-wide">Overview</h2>
            <p className="text-sm font-bold text-gray-500">Live data from Hostinger Database</p>
          </div>
          
          <button 
            onClick={downloadReport}
            className="flex items-center gap-2 bg-[#f7941d] hover:bg-[#e0861a] text-white font-extrabold px-6 py-2.5 rounded-sm shadow-sm transition-all active:scale-95 text-sm uppercase tracking-wider"
          >
            <Download className="w-4 h-4" /> Download CSV Report
          </button>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 border-l-4 border-l-[#8b1818]">
            <p className="text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-2">Total Revenue</p>
            <h3 className="text-3xl font-extrabold text-gray-800">₹{stats.totalRevenue.toLocaleString()}</h3>
          </div>
          <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 border-l-4 border-l-[#f7941d]">
            <p className="text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-2">Total Orders</p>
            <h3 className="text-3xl font-extrabold text-gray-800">{stats.totalOrders}</h3>
          </div>
          <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 border-l-4 border-l-blue-500">
            <p className="text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-2">Active Products</p>
            <h3 className="text-3xl font-extrabold text-gray-800">{stats.totalProducts}</h3>
          </div>
          <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 border-l-4 border-l-green-500">
            <p className="text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-2">Total Customers</p>
            <h3 className="text-3xl font-extrabold text-gray-800">{stats.totalUsers}</h3>
          </div>
        </div>

        {/* RECENT ORDERS TABLE */}
        <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-[#8b1818]" />
            <h3 className="font-extrabold text-gray-800 uppercase tracking-wide">Recent Orders</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-[11px] font-extrabold text-gray-500 uppercase tracking-widest border-b border-gray-200">
                  <th className="p-4 whitespace-nowrap">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500 font-bold">No orders found in database.</td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-bold text-gray-800">#ARP_{order.id.toString().padStart(5, '0')}</td>
                      <td className="p-4">
                        <p className="font-bold text-gray-800">{order.user?.name || 'Unknown'}</p>
                        <p className="text-xs text-gray-500 font-medium">{order.user?.email}</p>
                      </td>
                      <td className="p-4 font-medium text-gray-600">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                      <td className="p-4 font-extrabold text-[#8b1818]">₹{order.totalAmount}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 text-[10px] font-extrabold rounded-sm uppercase tracking-widest ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                          order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                          'bg-orange-100 text-[#f7941d]'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
};

export default AdminDashboard;