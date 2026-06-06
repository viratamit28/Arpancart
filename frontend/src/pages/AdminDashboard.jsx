import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, Users, Download, LogOut, Loader2, Plus, Trash2 } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  // 🔥 TABS STATE
  const [activeTab, setActiveTab] = useState('dashboard');

  // DATA STATES
  const [stats, setStats] = useState({ totalOrders: 0, totalProducts: 0, totalUsers: 0, totalRevenue: 0 });
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]); // For managing products
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // NEW PRODUCT FORM STATE
  const [newProduct, setNewProduct] = useState({
    title: '', description: '', price: '', category: '', imageUrl: '', stockQuantity: '', discountedPrice: ''
  });

  const API_BASE_URL = 'https://arpancart-production.up.railway.app/api';

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

    const fetchAdminData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        // Fetching Stats, Orders and Existing Products together
        const [statsRes, ordersRes, productsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/admin/stats`, config),
          axios.get(`${API_BASE_URL}/admin/orders`, config),
          axios.get(`${API_BASE_URL}/products`) // Assuming public products API
        ]);

        if (statsRes.data.success) setStats(statsRes.data.data);
        if (ordersRes.data.success) setOrders(ordersRes.data.data);
        if (productsRes.data.success) setProducts(productsRes.data.data);
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

  // ==========================================
  // ⚙️ ADMIN ACTIONS: ORDERS
  // ==========================================
  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const res = await axios.put(`${API_BASE_URL}/admin/orders/${orderId}/status`, { status: newStatus }, config);
      
      if (res.data.success) {
        // Update local state instantly
        setOrders(orders.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
        alert(`Order #${orderId} status updated to ${newStatus}! ✅`);
      }
    } catch (error) {
      console.error("Status update error:", error);
      alert("Status update fail ho gaya.");
    }
  };

  // ==========================================
  // ⚙️ ADMIN ACTIONS: PRODUCTS
  // ==========================================
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const res = await axios.post(`${API_BASE_URL}/admin/products`, newProduct, config);
      
      if (res.data.success) {
        setProducts([res.data.data, ...products]); // Add to top of list
        setStats({ ...stats, totalProducts: stats.totalProducts + 1 }); // Update stats
        alert("Product Successfully Added! 🛍️");
        setNewProduct({ title: '', description: '', price: '', category: '', imageUrl: '', stockQuantity: '', discountedPrice: '' }); // Clear form
      }
    } catch (error) {
      console.error("Product add error:", error);
      alert("Product add karne mein error aayi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const res = await axios.delete(`${API_BASE_URL}/admin/products/${productId}`, config);
      
      if (res.data.success) {
        setProducts(products.filter(p => p.id !== productId));
        setStats({ ...stats, totalProducts: Math.max(0, stats.totalProducts - 1) });
        alert("Product Deleted! 🗑️");
      }
    } catch (error) {
      console.error("Product delete error:", error);
      alert("Delete failed. Shayad kisi order mein yeh product already use hua hai.");
    }
  };

  // 🔥 DOWNLOAD REPORT (CSV EXPORT LOGIC)
  const downloadReport = () => {
    let csvContent = "Order ID,Customer Name,Customer Email,Total Amount (Rs),Status,Order Date\n";
    orders.forEach(order => {
      const orderId = `ARP_${order.id.toString().padStart(5, '0')}`;
      const customerName = order.user?.name || "N/A";
      const customerEmail = order.user?.email || "N/A";
      const amount = order.totalAmount;
      const status = order.status;
      const date = new Date(order.createdAt).toLocaleDateString('en-IN');
      csvContent += `"${orderId}","${customerName}","${customerEmail}","${amount}","${status}","${date}"\n`;
    });

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
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 font-bold py-3 px-4 rounded-sm transition-colors ${activeTab === 'dashboard' ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
          >
            <LayoutDashboard className={`w-5 h-5 ${activeTab === 'dashboard' ? 'text-[#f7941d]' : ''}`} /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 font-bold py-3 px-4 rounded-sm transition-colors ${activeTab === 'products' ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
          >
            <Package className={`w-5 h-5 ${activeTab === 'products' ? 'text-[#f7941d]' : ''}`} /> Products Management
          </button>
          <button className="w-full flex items-center gap-3 text-white/70 cursor-not-allowed font-bold py-3 px-4 rounded-sm transition-colors">
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
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 uppercase tracking-wide">
              {activeTab === 'dashboard' ? 'Overview' : 'Product Management'}
            </h2>
            <p className="text-sm font-bold text-gray-500">Live data from Hostinger Database</p>
          </div>
          
          {activeTab === 'dashboard' && (
            <button 
              onClick={downloadReport}
              className="flex items-center gap-2 bg-[#f7941d] hover:bg-[#e0861a] text-white font-extrabold px-6 py-2.5 rounded-sm shadow-sm transition-all active:scale-95 text-sm uppercase tracking-wider"
            >
              <Download className="w-4 h-4" /> Download CSV Report
            </button>
          )}
        </div>

        {/* ================== TAB: DASHBOARD ================== */}
        {activeTab === 'dashboard' && (
          <>
            {/* STATS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 border-l-4 border-l-[#8b1818]">
                <p className="text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-2">Total Revenue</p>
                <h3 className="text-3xl font-extrabold text-gray-800">₹{stats.totalRevenue?.toLocaleString()}</h3>
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
                <h3 className="font-extrabold text-gray-800 uppercase tracking-wide">Manage Orders</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-[11px] font-extrabold text-gray-500 uppercase tracking-widest border-b border-gray-200">
                      <th className="p-4 whitespace-nowrap">Order ID</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Action / Status</th>
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
                            {/* 🔥 EDITABLE STATUS DROPDOWN */}
                            <select 
                              value={order.status}
                              onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                              className={`px-3 py-1.5 text-xs font-extrabold rounded-sm uppercase tracking-wider border outline-none cursor-pointer ${
                                order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                                order.status === 'Shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                'bg-orange-50 text-[#f7941d] border-orange-200'
                              }`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ================== TAB: PRODUCTS ================== */}
        {activeTab === 'products' && (
          <div className="flex flex-col xl:flex-row gap-8">
            
            {/* ADD PRODUCT FORM */}
            <div className="w-full xl:w-1/3">
              <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-6 sticky top-8">
                <h3 className="font-extrabold text-gray-800 uppercase tracking-wide mb-6 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-[#8b1818]" /> Add New Product
                </h3>
                
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div>
                    <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-1">Title</label>
                    <input required type="text" value={newProduct.title} onChange={e => setNewProduct({...newProduct, title: e.target.value})} className="w-full border border-gray-200 p-2.5 rounded-sm text-sm outline-none focus:border-[#8b1818]" placeholder="Brass Pooja Thali" />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-1">Description</label>
                    <textarea required value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full border border-gray-200 p-2.5 rounded-sm text-sm outline-none focus:border-[#8b1818]" placeholder="Details about the product..." rows="2" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-1">Price (₹)</label>
                      <input required type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full border border-gray-200 p-2.5 rounded-sm text-sm outline-none focus:border-[#8b1818]" placeholder="999" />
                    </div>
                    <div>
                      <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-1">Stock</label>
                      <input required type="number" value={newProduct.stockQuantity} onChange={e => setNewProduct({...newProduct, stockQuantity: e.target.value})} className="w-full border border-gray-200 p-2.5 rounded-sm text-sm outline-none focus:border-[#8b1818]" placeholder="50" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-1">Category</label>
                      <input required type="text" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full border border-gray-200 p-2.5 rounded-sm text-sm outline-none focus:border-[#8b1818]" placeholder="Pooja Items" />
                    </div>
                    <div>
                      <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-1">Discount Price</label>
                      <input type="number" value={newProduct.discountedPrice} onChange={e => setNewProduct({...newProduct, discountedPrice: e.target.value})} className="w-full border border-gray-200 p-2.5 rounded-sm text-sm outline-none focus:border-[#8b1818]" placeholder="899" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-1">Image URL</label>
                    <input required type="text" value={newProduct.imageUrl} onChange={e => setNewProduct({...newProduct, imageUrl: e.target.value})} className="w-full border border-gray-200 p-2.5 rounded-sm text-sm outline-none focus:border-[#8b1818]" placeholder="https://image-link.com/photo.jpg" />
                  </div>
                  
                  <button disabled={isSubmitting} type="submit" className="w-full bg-[#8b1818] hover:bg-red-900 text-white font-extrabold py-3 rounded-sm transition-colors mt-4 uppercase tracking-widest text-sm flex justify-center items-center gap-2">
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4" /> Save Product</>}
                  </button>
                </form>
              </div>
            </div>

            {/* EXISTING PRODUCTS LIST */}
            <div className="w-full xl:w-2/3 bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h3 className="font-extrabold text-gray-800 uppercase tracking-wide">Live Inventory</h3>
                <span className="text-xs font-bold bg-[#f7941d]/10 text-[#f7941d] px-3 py-1 rounded-sm">{products.length} Items</span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-[11px] font-extrabold text-gray-500 uppercase tracking-widest border-b border-gray-200">
                      <th className="p-4">Item</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-gray-500 font-bold">No products found. Add some from the form.</td>
                      </tr>
                    ) : (
                      products.map((item) => (
                        <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <td className="p-4 flex items-center gap-3">
                            <img src={item.imageUrl} alt={item.title} className="w-10 h-10 object-cover rounded-sm border border-gray-200" />
                            <span className="font-bold text-gray-800 line-clamp-1">{item.title}</span>
                          </td>
                          <td className="p-4 font-medium text-gray-600">{item.category}</td>
                          <td className="p-4 font-extrabold text-[#8b1818]">₹{item.price}</td>
                          <td className="p-4">
                            <span className={`font-bold ${item.stockQuantity < 10 ? 'text-red-500' : 'text-green-600'}`}>
                              {item.stockQuantity}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button 
                              onClick={() => handleDeleteProduct(item.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-sm transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;