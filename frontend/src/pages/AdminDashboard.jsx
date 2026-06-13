import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, ShoppingCart, Package, Users, Download, 
  LogOut, Loader2, Plus, Trash2, Edit, X, Settings, 
  Image as ImageIcon, Save, Ticket, Layers, CalendarHeart, TrendingUp
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  // DATA STATES
  const [stats, setStats] = useState({ totalOrders: 0, totalProducts: 0, totalUsers: 0, totalRevenue: 0 });
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]); 
  const [customers, setCustomers] = useState([]); 
  
  // DYNAMIC PLAN STATES
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [planForm, setPlanForm] = useState({ name: '', price: '', durationDays: '' });

  // SOCIAL LINK SETTINGS STATE
  const [siteSettings, setSiteSettings] = useState({ 
    whatsappNumber: '', 
    facebookUrl: '', 
    instagramUrl: '', 
    trendingBannerUrls: [''], 
    trendingTitle: '' 
  });
  
  // CAROUSEL, COUPONS & SUBSCRIPTIONS STATE
  const [carousels, setCarousels] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [allSubscriptions, setAllSubscriptions] = useState([]); 
  const [couponForm, setCouponForm] = useState({ code: '', discountType: 'PERCENTAGE', discountValue: '', minOrderValue: '', expiryDate: '' });

  // CATEGORIES STATE
  const [categories, setCategories] = useState([]);
  const [categoryForm, setCategoryForm] = useState({ name: '', imageUrl: '' });
  const [subCategoryForm, setSubCategoryForm] = useState({ name: '', categoryId: '' });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // PRODUCT FORM STATE
  const [productForm, setProductForm] = useState({
    title: '', description: '', price: '', category: '', categoryId: '', subCategoryId: '', imageUrl: '', stockQuantity: '', discountedPrice: '', deliveryCharge: '',
    isTrending: false 
  });
  const [editingId, setEditingId] = useState(null); 

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
        
        const checkAuth = (err) => {
          console.error("API Error:", err);
          if (err.response?.status === 401 || err.response?.status === 403) {
            localStorage.removeItem('token');
            navigate('/admin/login');
          }
        };

        await Promise.allSettled([
          axios.get(`${API_BASE_URL}/admin/stats`, config).then(res => { 
            const data = res.data.data || res.data;
            if(data) setStats(data); 
          }).catch(checkAuth),
          
          // 🚨 FIX: Orders Data Extra Safe Fetching
          axios.get(`${API_BASE_URL}/admin/orders`, config).then(res => { 
            console.log("🔥 Orders Data API Response:", res.data); // Debugging ke liye
            let fetchedOrders = [];
            if (Array.isArray(res.data)) fetchedOrders = res.data;
            else if (Array.isArray(res.data?.data)) fetchedOrders = res.data.data;
            else if (Array.isArray(res.data?.orders)) fetchedOrders = res.data.orders;
            setOrders(fetchedOrders);
          }).catch(checkAuth),
          
          axios.get(`${API_BASE_URL}/products`).then(res => { 
            const data = res.data.data || res.data;
            setProducts(Array.isArray(data) ? data : []); 
          }).catch(e => console.error("Product Error")),
          
          // 🚨 FIX: Customers Data Extra Safe Fetching
          axios.get(`${API_BASE_URL}/admin/users`, config).then(res => { 
            console.log("🔥 Users Data API Response:", res.data); // Debugging ke liye
            let fetchedUsers = [];
            if (Array.isArray(res.data)) fetchedUsers = res.data;
            else if (Array.isArray(res.data?.data)) fetchedUsers = res.data.data;
            else if (Array.isArray(res.data?.users)) fetchedUsers = res.data.users;
            setCustomers(fetchedUsers);
          }).catch(checkAuth),
          
          axios.get(`${API_BASE_URL}/subscriptions/plans`).then(res => { 
            if(res.data.success) setSubscriptionPlans(res.data.data); 
          }).catch(e => console.error("Plans Error")),
          
          axios.get(`${API_BASE_URL}/public-settings`).then(res => { 
            if(res.data.success && res.data.data) {
              const data = res.data.data;
              let parsedUrls = [''];
              if (data.trendingBannerUrl) {
                try {
                  const parsed = JSON.parse(data.trendingBannerUrl);
                  parsedUrls = Array.isArray(parsed) ? parsed : [data.trendingBannerUrl];
                } catch (e) {
                  parsedUrls = data.trendingBannerUrl.includes(',') ? data.trendingBannerUrl.split(',') : [data.trendingBannerUrl];
                }
              }
              setSiteSettings({
                ...data,
                trendingBannerUrls: parsedUrls.length ? parsedUrls : ['']
              });
            } 
          }).catch(e => console.error("Settings Error")),
          
          axios.get(`${API_BASE_URL}/admin/coupons`, config).then(res => { if(res.data.success) setCoupons(res.data.data); }).catch(checkAuth),
          axios.get(`${API_BASE_URL}/admin/categories`, config).then(res => { if(res.data.success) setCategories(res.data.data); }).catch(checkAuth),
          axios.get(`${API_BASE_URL}/subscriptions/all`, config).then(res => { if(res.data.success) setAllSubscriptions(res.data.data); }).catch(e => console.error("Subs Error")),
          
          axios.get(`${API_BASE_URL}/admin/carousel`, config).then(res => { 
            if(res.data.success) {
              const formattedCarousels = res.data.data.map(c => {
                let parsedUrls = [''];
                if (c.imageUrl) {
                  try {
                    const parsed = JSON.parse(c.imageUrl);
                    parsedUrls = Array.isArray(parsed) ? parsed : [c.imageUrl];
                  } catch (e) {
                    parsedUrls = c.imageUrl.includes(',') ? c.imageUrl.split(',') : [c.imageUrl];
                  }
                }
                return { ...c, imageUrls: parsedUrls };
              });
              setCarousels(formattedCarousels);
            } 
          }).catch(checkAuth)
        ]);

      } catch (error) {
        console.error("Admin data fetch error:", error);
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
  // 🌸 SUBSCRIPTION PLANS ACTIONS
  // ==========================================
  const handlePlanSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.post(`${API_BASE_URL}/subscriptions/admin/plans`, planForm, config);
      if (res.data.success) {
        setSubscriptionPlans([...subscriptionPlans, res.data.data]);
        setPlanForm({ name: '', price: '', durationDays: '' });
        alert("Subscription Plan Added Successfully! 🌸");
      }
    } catch (error) {
      alert("Plan save error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePlan = async (id) => {
    if (!window.confirm("Delete this plan?")) return;
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`${API_BASE_URL}/subscriptions/admin/plans/${id}`, config);
      setSubscriptionPlans(subscriptionPlans.filter(p => p.id !== id));
      alert("Plan deleted successfully!");
    } catch (error) { alert("Delete failed."); }
  };

  // ==========================================
  // 🗂️ CATEGORY ACTIONS
  // ==========================================
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.post(`${API_BASE_URL}/admin/categories`, categoryForm, config);
      if (res.data.success) {
        setCategories([...categories, { ...res.data.data, subCategories: [] }]);
        setCategoryForm({ name: '', imageUrl: '' });
        alert("Category Added Successfully! 🎉");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Category save error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubCategorySubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.post(`${API_BASE_URL}/admin/subcategories`, subCategoryForm, config);
      if (res.data.success) {
        setCategories(categories.map(cat => cat.id === parseInt(subCategoryForm.categoryId) ? { ...cat, subCategories: [...cat.subCategories, res.data.data] } : cat));
        setSubCategoryForm({ name: '', categoryId: '' });
        alert("Sub-Category Added Successfully! 🎉");
      }
    } catch (error) {
      alert("Sub-Category save error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // 🎟️ COUPON ACTIONS 
  // ==========================================
  const handleCouponSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.post(`${API_BASE_URL}/admin/coupons`, couponForm, config);
      if (res.data.success) {
        setCoupons([res.data.data, ...coupons]);
        setCouponForm({ code: '', discountType: 'PERCENTAGE', discountValue: '', minOrderValue: '', expiryDate: '' });
        alert("Coupon successfully generated! 🎉");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Coupon save error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`${API_BASE_URL}/admin/coupons/${id}`, config);
      setCoupons(coupons.filter(c => c.id !== id));
    } catch (error) { alert("Delete failed."); }
  };

  // ==========================================
  // 🌅 CAROUSEL UPDATE LOGIC
  // ==========================================
  const handleCarouselChange = (id, index, newUrl) => {
    setCarousels(carousels.map(c => {
      if (c.id === id) {
        const updatedUrls = [...c.imageUrls];
        updatedUrls[index] = newUrl;
        return { ...c, imageUrls: updatedUrls };
      }
      return c;
    }));
  };

  const addCarouselImage = (id) => {
    setCarousels(carousels.map(c => c.id === id ? { ...c, imageUrls: [...c.imageUrls, ''] } : c));
  };

  const removeCarouselImage = (id, index) => {
    setCarousels(carousels.map(c => {
      if (c.id === id) {
        const updatedUrls = c.imageUrls.filter((_, i) => i !== index);
        return { ...c, imageUrls: updatedUrls.length ? updatedUrls : [''] };
      }
      return c;
    }));
  };

  const handleUpdateCarousel = async (id, imageUrlsArray, currentIsActive) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const cleanUrls = imageUrlsArray.filter(url => url.trim() !== '');
      const res = await axios.put(`${API_BASE_URL}/admin/carousel/${id}`, { 
        imageUrl: JSON.stringify(cleanUrls), 
        isActive: currentIsActive 
      }, config);
      if (res.data.success) alert("Carousel Updated Successfully! 🌅");
    } catch (error) { 
      alert("Update fail ho gaya."); 
    }
  };

  // ==========================================
  // ⚙️ SETTINGS ACTIONS 
  // ==========================================
  const handleTrendingBannerChange = (index, value) => {
    const newUrls = [...siteSettings.trendingBannerUrls];
    newUrls[index] = value;
    setSiteSettings({ ...siteSettings, trendingBannerUrls: newUrls });
  };

  const addTrendingBannerImage = () => {
    setSiteSettings({ ...siteSettings, trendingBannerUrls: [...siteSettings.trendingBannerUrls, ''] });
  };

  const removeTrendingBannerImage = (index) => {
    const newUrls = siteSettings.trendingBannerUrls.filter((_, i) => i !== index);
    setSiteSettings({ ...siteSettings, trendingBannerUrls: newUrls.length ? newUrls : [''] });
  };

  const handleSettingsUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const cleanUrls = siteSettings.trendingBannerUrls.filter(url => url.trim() !== '');
      
      const payload = {
        whatsappNumber: siteSettings.whatsappNumber,
        facebookUrl: siteSettings.facebookUrl,
        instagramUrl: siteSettings.instagramUrl,
        trendingTitle: siteSettings.trendingTitle,
        trendingBannerUrl: JSON.stringify(cleanUrls)
      };

      const res = await axios.put(`${API_BASE_URL}/admin/settings`, payload, config);
      if (res.data.success) alert("Settings Updated Successfully! ✅");
    } catch (error) { alert("Settings save karne mein error aayi."); } 
    finally { setIsSubmitting(false); }
  };

  // ==========================================
  // 📦 ADMIN ACTIONS: ORDERS & PRODUCTS
  // ==========================================
  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      // 🚨 FIX: Status Update API call. Prisma schema matches uppercase enums.
      const res = await axios.put(`${API_BASE_URL}/admin/orders/${orderId}/status`, { status: newStatus }, config);
      
      if (res.data?.success || res.status === 200) {
        setOrders(orders.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
        alert(`Order #${orderId} status updated to ${newStatus}! ✅`);
      }
    } catch (error) { 
      console.error("Status Update Error:", error);
      alert(error.response?.data?.message || "Status update fail ho gaya. Apne backend console me check karein."); 
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      if (editingId) {
        const res = await axios.put(`${API_BASE_URL}/admin/products/${editingId}`, productForm, config);
        if (res.data.success) {
          setProducts(products.map(p => p.id === editingId ? res.data.data : p));
          alert("Product Successfully Updated! ✏️");
        }
      } else {
        const res = await axios.post(`${API_BASE_URL}/admin/products`, productForm, config);
        if (res.data.success) {
          setProducts([res.data.data, ...products]);
          setStats({ ...stats, totalProducts: stats.totalProducts + 1 });
          alert("Product Successfully Added! 🛍️");
        }
      }
      setProductForm({ title: '', description: '', price: '', category: '', categoryId: '', subCategoryId: '', imageUrl: '', stockQuantity: '', discountedPrice: '', deliveryCharge: '', isTrending: false });
      setEditingId(null);
    } catch (error) { alert("Product save karne mein error aayi."); } 
    finally { setIsSubmitting(false); }
  };

  const handleEditClick = (product) => {
    setProductForm({
      title: product.title, description: product.description, price: product.price, 
      category: product.category || product.categoryString, 
      categoryId: product.categoryId || '', subCategoryId: product.subCategoryId || '',
      imageUrl: product.imageUrl, stockQuantity: product.stockQuantity, 
      discountedPrice: product.discountedPrice || '', deliveryCharge: product.deliveryCharge || '',
      isTrending: product.isTrending || false 
    });
    setEditingId(product.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setProductForm({ title: '', description: '', price: '', category: '', categoryId: '', subCategoryId: '', imageUrl: '', stockQuantity: '', discountedPrice: '', deliveryCharge: '', isTrending: false });
    setEditingId(null);
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
    } catch (error) { alert("Delete failed."); }
  };

  const downloadReport = () => {
    let csvContent = "Order ID,Customer Name,Customer Email,Total Amount (Rs),Status,Order Date\n";
    orders.forEach(order => {
      const orderId = `ARP_${order.id?.toString().padStart(5, '0')}`;
      const customerName = order.user?.name || "N/A";
      const customerEmail = order.user?.email || "N/A";
      const amount = order.totalAmount;
      const status = order.status;
      const date = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : 'N/A';
      csvContent += `"${orderId}","${customerName}","${customerEmail}","${amount}","${status}","${date}"\n`;
    });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Arpancart_Orders_Report_${new Date().toISOString().split('T')[0]}.csv`;
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
      
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-[#8b1818] text-white flex flex-col">
        <div className="p-6 border-b border-white/10 text-center md:text-left">
          <h1 className="text-2xl font-extrabold tracking-widest uppercase">Admin Panel</h1>
          <p className="text-xs text-orange-200 mt-1 font-medium">ArpanCart Control Center</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 font-bold py-3 px-4 rounded-sm transition-colors ${activeTab === 'dashboard' ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}><LayoutDashboard className="w-5 h-5" /> Dashboard</button>
          <button onClick={() => setActiveTab('categories')} className={`w-full flex items-center gap-3 font-bold py-3 px-4 rounded-sm transition-colors ${activeTab === 'categories' ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}><Layers className="w-5 h-5" /> Categories</button>
          <button onClick={() => setActiveTab('products')} className={`w-full flex items-center gap-3 font-bold py-3 px-4 rounded-sm transition-colors ${activeTab === 'products' ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}><Package className="w-5 h-5" /> Products</button>
          <button onClick={() => setActiveTab('subscriptions')} className={`w-full flex items-center gap-3 font-bold py-3 px-4 rounded-sm transition-colors ${activeTab === 'subscriptions' ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}><CalendarHeart className="w-5 h-5" /> Daily Flowers</button>
          <button onClick={() => setActiveTab('customers')} className={`w-full flex items-center gap-3 font-bold py-3 px-4 rounded-sm transition-colors ${activeTab === 'customers' ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}><Users className="w-5 h-5" /> Customers</button>
          <button onClick={() => setActiveTab('carousel')} className={`w-full flex items-center gap-3 font-bold py-3 px-4 rounded-sm transition-colors ${activeTab === 'carousel' ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}><ImageIcon className="w-5 h-5" /> 7-Day Banners</button>
          <button onClick={() => setActiveTab('coupons')} className={`w-full flex items-center gap-3 font-bold py-3 px-4 rounded-sm transition-colors ${activeTab === 'coupons' ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}><Ticket className="w-5 h-5" /> Promo Codes</button>
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 font-bold py-3 px-4 rounded-sm transition-colors ${activeTab === 'settings' ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}><Settings className="w-5 h-5" /> Site Settings</button>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-red-900/50 hover:bg-red-900 text-white font-bold py-3 rounded-sm transition-colors"><LogOut className="w-4 h-4" /> Secure Logout</button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 uppercase tracking-wide">
              {activeTab === 'dashboard' ? 'Overview' : activeTab === 'categories' ? 'Category Management' : activeTab === 'products' ? 'Product Management' : activeTab === 'subscriptions' ? 'Flower Subscriptions' : activeTab === 'customers' ? 'Customer Database' : activeTab === 'carousel' ? 'Daily Banners' : activeTab === 'coupons' ? 'Promo Codes' : 'Website Settings'}
            </h2>
          </div>
          {activeTab === 'dashboard' && (
            <button onClick={downloadReport} className="flex items-center gap-2 bg-[#f7941d] hover:bg-[#e0861a] text-white font-extrabold px-6 py-2.5 rounded-sm shadow-sm transition-all text-sm uppercase tracking-wider"><Download className="w-4 h-4" /> Download CSV Report</button>
          )}
        </div>

        {/* ================== TAB: DASHBOARD ================== */}
        {activeTab === 'dashboard' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 border-l-4 border-l-[#8b1818]"><p className="text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-2">Total Revenue</p><h3 className="text-3xl font-extrabold text-gray-800">₹{(stats.totalRevenue || 0).toLocaleString()}</h3></div>
              <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 border-l-4 border-l-[#f7941d]"><p className="text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-2">Total Orders</p><h3 className="text-3xl font-extrabold text-gray-800">{stats.totalOrders || orders.length || 0}</h3></div>
              <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 border-l-4 border-l-blue-500"><p className="text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-2">Active Products</p><h3 className="text-3xl font-extrabold text-gray-800">{stats.totalProducts || products.length || 0}</h3></div>
              <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 border-l-4 border-l-green-500"><p className="text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-2">Total Customers</p><h3 className="text-3xl font-extrabold text-gray-800">{stats.totalUsers || customers.length || 0}</h3></div>
            </div>

            <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-[#8b1818]" />
                <h3 className="font-extrabold text-gray-800 uppercase tracking-wide">Manage Orders</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-[11px] font-extrabold text-gray-500 uppercase tracking-widest border-b border-gray-200">
                      <th className="p-4 whitespace-nowrap">Order ID</th><th className="p-4">Customer</th><th className="p-4">Date</th><th className="p-4">Amount</th><th className="p-4">Status Update</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {orders.length === 0 ? (
                      <tr><td colSpan="5" className="p-8 text-center text-gray-500 font-bold">No orders found in database.</td></tr>
                    ) : (
                      orders.map((order) => {
                        // Backend user fail-safe
                        const customerInfo = order.user || customers.find(c => c.id === order.userId) || {};
                        const currentStatus = order.status?.toUpperCase() || "PENDING";
                        
                        return (
                        <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <td className="p-4 font-bold text-gray-800">#ARP_{order.id?.toString().padStart(5, '0')}</td>
                          <td className="p-4">
                            <p className="font-bold text-gray-800">{customerInfo.name || 'Unknown User'}</p>
                            <p className="text-xs text-gray-500 font-medium">{customerInfo.email || 'No Email'}</p>
                          </td>
                          <td className="p-4 font-medium text-gray-600">{order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : 'N/A'}</td>
                          <td className="p-4 font-extrabold text-[#8b1818]">₹{order.totalAmount || 0}</td>
                          <td className="p-4">
                            {/* 🚨 FIX: Strict Dropdown Enums corresponding to schema */}
                            <select 
                              value={currentStatus} 
                              onChange={(e) => handleOrderStatusChange(order.id, e.target.value)} 
                              className={`px-3 py-1.5 text-xs font-extrabold rounded-sm uppercase tracking-wider border outline-none cursor-pointer 
                                ${currentStatus === 'DELIVERED' ? 'bg-green-50 text-green-700 border-green-200' : 
                                  currentStatus === 'SHIPPED' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                                  currentStatus === 'CANCELLED' ? 'bg-red-50 text-red-700 border-red-200' : 
                                  currentStatus === 'CONFIRMED' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                  'bg-orange-50 text-[#f7941d] border-orange-200'}`}
                            >
                              <option value="PENDING">Pending</option>
                              <option value="CONFIRMED">Confirmed</option>
                              <option value="SHIPPED">Shipped</option>
                              <option value="DELIVERED">Delivered</option>
                              <option value="CANCELLED">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      )})
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ================== TAB: SUBSCRIPTIONS ================== */}
        {activeTab === 'subscriptions' && (
          <div className="flex flex-col xl:flex-row gap-8">
            <div className="w-full xl:w-1/3 space-y-6">
              <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-6 sticky top-8">
                <h3 className="font-extrabold text-gray-800 uppercase tracking-wide mb-6 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-[#8b1818]" /> Create New Plan
                </h3>
                <form onSubmit={handlePlanSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-1">Plan Name</label>
                    <input required type="text" value={planForm.name} onChange={e => setPlanForm({...planForm, name: e.target.value})} className="w-full border p-2.5 rounded-sm text-sm outline-none" placeholder="e.g. 30 Days Marigold Box" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-1">Price (₹)</label>
                      <input required type="number" value={planForm.price} onChange={e => setPlanForm({...planForm, price: e.target.value})} className="w-full border p-2.5 rounded-sm text-sm outline-none" placeholder="599" />
                    </div>
                    <div>
                      <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-1">Duration (Days)</label>
                      <input required type="number" value={planForm.durationDays} onChange={e => setPlanForm({...planForm, durationDays: e.target.value})} className="w-full border p-2.5 rounded-sm text-sm outline-none" placeholder="30" />
                    </div>
                  </div>
                  <button disabled={isSubmitting} type="submit" className="w-full bg-[#8b1818] hover:bg-red-900 text-white font-extrabold py-3 rounded-sm mt-4 uppercase text-sm flex justify-center items-center">
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Subscription Plan'}
                  </button>
                </form>
              </div>
            </div>

            <div className="w-full xl:w-2/3 space-y-6">
              <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-6">
                <h3 className="font-extrabold text-gray-800 uppercase tracking-wide mb-4">Active Plans on Website</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subscriptionPlans.length === 0 ? <p className="text-gray-500 text-sm font-bold">No plans created yet.</p> : subscriptionPlans.map((plan) => (
                    <div key={plan.id} className="border border-orange-100 bg-orange-50/30 rounded-sm p-4 flex justify-between items-center">
                      <div>
                        <h4 className="font-extrabold text-[#8b1818]">{plan.name}</h4>
                        <p className="text-xs font-bold text-gray-600">₹{plan.price} for {plan.durationDays} Days</p>
                      </div>
                      <button onClick={() => handleDeletePlan(plan.id)} className="text-red-500 hover:bg-red-100 p-2 rounded-full transition-colors"><Trash2 className="w-4 h-4"/></button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                  <CalendarHeart className="w-5 h-5 text-[#8b1818]" />
                  <h3 className="font-extrabold text-gray-800 uppercase tracking-wide">Customer Subscriptions</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-[11px] font-extrabold text-gray-500 uppercase tracking-widest border-b border-gray-200">
                        <th className="p-4">Sub ID</th><th className="p-4">Customer</th><th className="p-4">Plan</th><th className="p-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {allSubscriptions.length === 0 ? (
                        <tr><td colSpan="4" className="p-8 text-center text-gray-500 font-bold">No customer subscriptions active right now.</td></tr>
                      ) : (
                        allSubscriptions.map((sub) => {
                          const subCustomer = sub.user || customers.find(c => c.id === sub.userId) || {};
                          return (
                          <tr key={sub.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                            <td className="p-4 font-bold text-gray-800">#SUB_{sub.id}</td>
                            <td className="p-4">
                              <p className="font-bold text-gray-800">{subCustomer.name || 'Unknown'}</p>
                              <p className="text-xs text-gray-500 font-medium">{subCustomer.email}</p>
                            </td>
                            <td className="p-4 font-extrabold text-[#8b1818]">{sub.plan?.name}</td>
                            <td className="p-4 text-center">
                              <span className={`px-3 py-1.5 text-[10px] font-extrabold rounded-sm uppercase tracking-wider ${sub.status === 'ACTIVE' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-600'}`}>
                                {sub.status}
                              </span>
                            </td>
                          </tr>
                        )})
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================== TAB: CATEGORIES ================== */}
        {activeTab === 'categories' && (
          <div className="flex flex-col xl:flex-row gap-8">
            <div className="w-full xl:w-1/3 space-y-6">
              <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-6">
                <h3 className="font-extrabold text-gray-800 uppercase tracking-wide mb-6 flex items-center gap-2"><Plus className="w-5 h-5 text-[#8b1818]" /> Add Main Category</h3>
                <form onSubmit={handleCategorySubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-1">Category Name</label>
                    <input required type="text" value={categoryForm.name} onChange={e => setCategoryForm({...categoryForm, name: e.target.value})} className="w-full border p-2.5 rounded-sm text-sm outline-none" placeholder="e.g. BIRTHDAY & EVENTS" />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-1">Icon / Image Emoji</label>
                    <input type="text" value={categoryForm.imageUrl} onChange={e => setCategoryForm({...categoryForm, imageUrl: e.target.value})} className="w-full border p-2.5 rounded-sm text-sm outline-none" placeholder="e.g. 🌸 or Image URL" />
                  </div>
                  <button disabled={isSubmitting} type="submit" className="w-full bg-[#8b1818] hover:bg-red-900 text-white font-extrabold py-3 rounded-sm mt-4 uppercase text-sm">{isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Save Category'}</button>
                </form>
              </div>

              <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-6">
                <h3 className="font-extrabold text-gray-800 uppercase tracking-wide mb-6 flex items-center gap-2"><Layers className="w-5 h-5 text-[#f7941d]" /> Add Sub-Category / Kit</h3>
                <form onSubmit={handleSubCategorySubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-1">Parent Category</label>
                    <select required value={subCategoryForm.categoryId} onChange={e => setSubCategoryForm({...subCategoryForm, categoryId: e.target.value})} className="w-full border p-2.5 rounded-sm text-sm outline-none bg-white">
                      <option value="">Select Main Category</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-1">Sub-Category Name</label>
                    <input required type="text" value={subCategoryForm.name} onChange={e => setSubCategoryForm({...subCategoryForm, name: e.target.value})} className="w-full border p-2.5 rounded-sm text-sm outline-none" placeholder="e.g. Weekly Vrat Kits" />
                  </div>
                  <button disabled={isSubmitting} type="submit" className="w-full bg-[#f7941d] hover:bg-[#e0861a] text-white font-extrabold py-3 rounded-sm mt-4 uppercase text-sm">{isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Save Sub-Category'}</button>
                </form>
              </div>
            </div>

            <div className="w-full xl:w-2/3 bg-white rounded-sm shadow-sm border border-gray-100 p-6">
              <h3 className="font-extrabold text-gray-800 uppercase tracking-wide mb-6">Website Categories ({categories.length}/10)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.length === 0 ? <p className="text-gray-500 text-sm">No categories added yet.</p> : categories.map((cat) => (
                  <div key={cat.id} className="border border-gray-200 rounded-sm p-4 bg-gray-50/50">
                    <h4 className="font-extrabold text-[#8b1818] text-lg mb-2 flex items-center gap-2">
                      {cat.imageUrl && <span>{cat.imageUrl}</span>} {cat.name}
                    </h4>
                    {cat.subCategories && cat.subCategories.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 font-medium">
                        {cat.subCategories.map(sub => <li key={sub.id}>{sub.name}</li>)}
                      </ul>
                    ) : <p className="text-xs text-gray-400 italic">No sub-categories</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================== TAB: PRODUCTS ================== */}
        {activeTab === 'products' && (
          <div className="flex flex-col xl:flex-row gap-8">
            <div className="w-full xl:w-1/3">
              <div className={`rounded-sm shadow-sm border p-6 sticky top-8 ${editingId ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-100'}`}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-extrabold text-gray-800 uppercase tracking-wide flex items-center gap-2">
                    {editingId ? <><Edit className="w-5 h-5 text-blue-600" /> Edit Product</> : <><Plus className="w-5 h-5 text-[#8b1818]" /> Add New Product</>}
                  </h3>
                  {editingId && <button onClick={handleCancelEdit} className="text-gray-500 hover:text-red-500 transition-colors p-1"><X className="w-5 h-5" /></button>}
                </div>
                <form onSubmit={handleProductSubmit} className="space-y-4">
                  <div><label className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-1">Title</label><input required type="text" value={productForm.title} onChange={e => setProductForm({...productForm, title: e.target.value})} className="w-full border p-2.5 rounded-sm text-sm outline-none" placeholder="Brass Pooja Thali" /></div>
                  <div><label className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-1">Description</label><textarea required value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} className="w-full border p-2.5 rounded-sm text-sm outline-none" placeholder="Details..." rows="2" /></div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-[#8b1818] uppercase tracking-widest mb-1">Category</label>
                      <select required value={productForm.categoryId} onChange={e => {
                          const catId = e.target.value;
                          const catName = categories.find(c => c.id === parseInt(catId))?.name || '';
                          setProductForm({...productForm, categoryId: catId, category: catName, subCategoryId: ''});
                        }} className="w-full border p-2.5 rounded-sm text-sm outline-none border-red-200 focus:border-[#8b1818] bg-white">
                        <option value="">Select...</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-extrabold text-[#f7941d] uppercase tracking-widest mb-1">Sub-Category</label>
                      <select value={productForm.subCategoryId} onChange={e => setProductForm({...productForm, subCategoryId: e.target.value})} disabled={!productForm.categoryId || categories.find(c => c.id === parseInt(productForm.categoryId))?.subCategories?.length === 0} className="w-full border p-2.5 rounded-sm text-sm outline-none border-orange-200 bg-white disabled:bg-gray-100">
                        <option value="">Select Kit...</option>
                        {productForm.categoryId && categories.find(c => c.id === parseInt(productForm.categoryId))?.subCategories?.map(sub => (
                          <option key={sub.id} value={sub.id}>{sub.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-1">Price (₹)</label><input required type="number" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} className="w-full border p-2.5 rounded-sm text-sm outline-none" placeholder="999" /></div>
                    <div><label className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-1">Discount Price</label><input type="number" value={productForm.discountedPrice} onChange={e => setProductForm({...productForm, discountedPrice: e.target.value})} className="w-full border p-2.5 rounded-sm text-sm outline-none" placeholder="899" /></div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-1">Stock</label><input required type="number" value={productForm.stockQuantity} onChange={e => setProductForm({...productForm, stockQuantity: e.target.value})} className="w-full border p-2.5 rounded-sm text-sm outline-none" placeholder="50" /></div>
                    <div><label className="block text-xs font-extrabold text-[#8b1818] uppercase tracking-widest mb-1">Delivery Fee</label><input type="number" value={productForm.deliveryCharge} onChange={e => setProductForm({...productForm, deliveryCharge: e.target.value})} className="w-full border p-2.5 rounded-sm text-sm outline-none" placeholder="0 for Free" /></div>
                  </div>

                  <div><label className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-1">Image URL</label><input required type="text" value={productForm.imageUrl} onChange={e => setProductForm({...productForm, imageUrl: e.target.value})} className="w-full border p-2.5 rounded-sm text-sm outline-none" /></div>
                  
                  <div className="flex items-center gap-3 mt-4 p-3 border border-orange-200 bg-orange-50 rounded-sm">
                    <input type="checkbox" id="isTrending" checked={productForm.isTrending} onChange={e => setProductForm({...productForm, isTrending: e.target.checked})} className="w-5 h-5 text-[#f7941d] cursor-pointer" />
                    <label htmlFor="isTrending" className="text-sm font-extrabold text-gray-800 uppercase cursor-pointer flex items-center gap-2">Show in Trending Section <TrendingUp className="w-4 h-4 text-[#8b1818]"/></label>
                  </div>

                  <button disabled={isSubmitting} type="submit" className={`w-full text-white font-extrabold py-3 rounded-sm transition-colors mt-4 uppercase text-sm flex justify-center items-center gap-2 ${editingId ? 'bg-blue-600' : 'bg-[#8b1818]'}`}>
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : editingId ? 'Update Product' : 'Save Product'}
                  </button>
                </form>
              </div>
            </div>

            <div className="w-full xl:w-2/3 bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h3 className="font-extrabold text-gray-800 uppercase tracking-wide">Live Inventory</h3>
                <span className="text-xs font-bold bg-[#f7941d]/10 text-[#f7941d] px-3 py-1 rounded-sm">{products.length} Items</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-[11px] font-extrabold text-gray-500 uppercase tracking-widest border-b border-gray-200">
                      <th className="p-4">Item</th><th className="p-4">Category</th><th className="p-4">Price / Stock</th><th className="p-4 text-center">Status</th><th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {products.map((item) => (
                      <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="p-4 flex items-center gap-3">
                          <img src={item.imageUrl} alt={item.title} className="w-10 h-10 object-cover rounded-sm border" />
                          <span className="font-bold text-gray-800 line-clamp-1">{item.title}</span>
                        </td>
                        <td className="p-4 font-medium text-gray-600">{item.category}</td>
                        <td className="p-4">
                          <div className="font-extrabold text-[#8b1818]">₹{item.price}</div>
                          <div className="text-xs font-bold text-gray-400">Stock: {item.stockQuantity}</div>
                        </td>
                        <td className="p-4 text-center">
                          {item.isTrending && <span className="bg-orange-100 text-[#f7941d] px-2 py-1 rounded-sm text-[10px] font-extrabold uppercase flex items-center justify-center gap-1"><TrendingUp className="w-3 h-3"/> Trending</span>}
                        </td>
                        <td className="p-4 text-right whitespace-nowrap">
                          <button onClick={() => handleEditClick(item)} className="text-blue-500 mr-2 p-2"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteProduct(item.id)} className="text-red-500 p-2"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================== TAB: CUSTOMERS ================== */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#8b1818]" />
              <h3 className="font-extrabold text-gray-800 uppercase tracking-wide">Registered Users</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-[11px] font-extrabold text-gray-500 uppercase border-b border-gray-200">
                    <th className="p-4">Name</th><th className="p-4">Email ID</th><th className="p-4">Role</th><th className="p-4">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {customers && customers.length > 0 ? (
                    customers.map((user) => (
                      <tr key={user.id} className="border-b border-gray-50">
                        <td className="p-4 font-bold text-gray-800">{user.name || 'Unknown'}</td>
                        <td className="p-4 text-gray-600 font-medium">{user.email || 'No Email'}</td>
                        <td className="p-4"><span className={`px-3 py-1 text-[10px] font-extrabold rounded-sm uppercase ${user.role === 'admin' ? 'bg-[#8b1818] text-white' : 'bg-gray-200'}`}>{user.role || 'customer'}</span></td>
                        <td className="p-4 text-gray-500 font-medium">{user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN') : 'N/A'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="4" className="p-8 text-center text-gray-500 font-bold">No customers found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================== TAB: CAROUSEL ================== */}
        {activeTab === 'carousel' && (
          <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#8b1818]" />
              <h3 className="font-extrabold text-gray-800 uppercase tracking-wide">Manage Daily Banners (Slideshow)</h3>
            </div>
            <div className="p-6 space-y-8">
              {carousels.map((item) => (
                <div key={item.id} className="flex flex-col xl:flex-row gap-6 p-6 border border-gray-200 rounded-sm bg-gray-50/50 relative">
                  <div className="w-full xl:w-64 flex-shrink-0 flex flex-col gap-2">
                    <h4 className="font-extrabold text-[#8b1818] text-lg uppercase tracking-wide border-b border-gray-200 pb-2 mb-2">{item.dayOfWeek}</h4>
                    <div className="w-full h-32 border border-gray-200 rounded-sm overflow-hidden bg-white shadow-sm">
                      <img src={(item.imageUrls && item.imageUrls[0]) || "https://placehold.co/1200x400/f7941d/fff?text=No+Image"} alt={item.dayOfWeek} className="w-full h-full object-cover" />
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col gap-3">
                    {item.imageUrls?.map((url, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="bg-gray-200 text-gray-600 font-bold px-3 py-2.5 rounded-sm text-xs">Slide {idx + 1}</span>
                        <input type="text" value={url} onChange={(e) => handleCarouselChange(item.id, idx, e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-sm text-sm outline-none focus:border-[#f7941d]" />
                        <button onClick={() => removeCarouselImage(item.id, idx)} className="bg-red-50 text-red-500 p-2.5 rounded-sm border border-red-100"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                    <div className="flex justify-between items-center mt-2 pt-4 border-t border-gray-200 border-dashed">
                      <button onClick={() => addCarouselImage(item.id)} className="flex items-center gap-1.5 text-xs font-extrabold text-[#f7941d]"><Plus className="w-4 h-4" /> Add Another Slide</button>
                      <button onClick={() => handleUpdateCarousel(item.id, item.imageUrls, item.isActive)} className="bg-[#f7941d] text-white font-extrabold px-8 py-2.5 rounded-sm text-sm uppercase shadow-sm"><Save className="w-4 h-4" /> Save Banners</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================== TAB: COUPONS ================== */}
        {activeTab === 'coupons' && (
          <div className="flex flex-col xl:flex-row gap-8">
            <div className="w-full xl:w-1/3">
              <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-6 sticky top-8">
                <h3 className="font-extrabold text-gray-800 uppercase tracking-wide mb-6 flex items-center gap-2"><Plus className="w-5 h-5 text-[#8b1818]" /> Generate Coupon</h3>
                <form onSubmit={handleCouponSubmit} className="space-y-4">
                  <div><label className="block text-xs font-extrabold text-gray-500 uppercase mb-1">Coupon Code</label><input required type="text" value={couponForm.code} onChange={e => setCouponForm({...couponForm, code: e.target.value.toUpperCase()})} className="w-full border p-2.5 rounded-sm text-sm outline-none uppercase" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-xs font-extrabold text-gray-500 uppercase mb-1">Type</label>
                      <select value={couponForm.discountType} onChange={e => setCouponForm({...couponForm, discountType: e.target.value})} className="w-full border p-2.5 rounded-sm text-sm outline-none bg-white">
                        <option value="PERCENTAGE">Percentage (%)</option><option value="FIXED">Fixed Amount (₹)</option>
                      </select>
                    </div>
                    <div><label className="block text-xs font-extrabold text-gray-500 uppercase mb-1">Discount Value</label><input required type="number" value={couponForm.discountValue} onChange={e => setCouponForm({...couponForm, discountValue: e.target.value})} className="w-full border p-2.5 rounded-sm text-sm outline-none" /></div>
                  </div>
                  <div><label className="block text-xs font-extrabold text-gray-500 uppercase mb-1">Min Order Value (₹)</label><input required type="number" value={couponForm.minOrderValue} onChange={e => setCouponForm({...couponForm, minOrderValue: e.target.value})} className="w-full border p-2.5 rounded-sm text-sm outline-none" /></div>
                  <div><label className="block text-xs font-extrabold text-gray-500 uppercase mb-1">Expiry Date</label><input required type="date" value={couponForm.expiryDate} onChange={e => setCouponForm({...couponForm, expiryDate: e.target.value})} className="w-full border p-2.5 rounded-sm text-sm outline-none" /></div>
                  <button disabled={isSubmitting} type="submit" className="w-full bg-[#8b1818] text-white font-extrabold py-3 rounded-sm mt-4 uppercase text-sm">Create Promo Code</button>
                </form>
              </div>
            </div>
            
            <div className="w-full xl:w-2/3 bg-white rounded-sm shadow-sm border border-gray-100 p-6">
              <h3 className="font-extrabold text-gray-800 uppercase tracking-wide mb-6">Active Coupons</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-[11px] font-extrabold text-gray-500 uppercase border-b border-gray-200">
                      <th className="p-4">Code</th><th className="p-4">Discount</th><th className="p-4">Condition</th><th className="p-4">Expiry</th><th className="p-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {coupons.map((c) => (
                      <tr key={c.id} className="border-b hover:bg-gray-50">
                        <td className="p-4 font-black text-[#8b1818]">{c.code}</td>
                        <td className="p-4 font-bold">{c.discountType === 'PERCENTAGE' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}</td>
                        <td className="p-4 text-xs">Min: ₹{c.minOrderValue}</td>
                        <td className="p-4 text-xs font-medium">{new Date(c.expiryDate).toLocaleDateString()}</td>
                        <td className="p-4"><button onClick={() => handleDeleteCoupon(c.id)} className="text-red-500 p-2"><Trash2 className="w-4 h-4" /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================== TAB: SETTINGS ================== */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-8 max-w-3xl">
            <div className="flex items-center gap-3 mb-6 border-b pb-4">
              <Settings className="w-6 h-6 text-[#8b1818]" />
              <h3 className="text-xl font-extrabold text-gray-800 uppercase tracking-wide">Website Settings & Campaigns</h3>
            </div>
            
            <form onSubmit={handleSettingsUpdate} className="space-y-8">
              <div className="space-y-6">
                <h4 className="font-extrabold text-[#f7941d] uppercase tracking-widest text-xs border-b pb-2">Contact & Social</h4>
                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-2">WhatsApp Business Number</label>
                  <div className="flex items-center border border-gray-200 rounded-sm overflow-hidden focus-within:border-[#8b1818]">
                    <span className="bg-gray-100 px-4 py-3 text-sm font-bold text-gray-600 border-r border-gray-200">+91</span>
                    <input required type="text" value={siteSettings.whatsappNumber?.replace('91', '') || ''} onChange={e => setSiteSettings({...siteSettings, whatsappNumber: '91' + e.target.value})} className="w-full p-3 text-sm outline-none font-medium" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-2">Facebook Page URL</label><input type="url" value={siteSettings.facebookUrl || ''} onChange={e => setSiteSettings({...siteSettings, facebookUrl: e.target.value})} className="w-full border border-gray-200 p-3 text-sm outline-none" /></div>
                  <div><label className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-2">Instagram Profile URL</label><input type="url" value={siteSettings.instagramUrl || ''} onChange={e => setSiteSettings({...siteSettings, instagramUrl: e.target.value})} className="w-full border border-gray-200 p-3 text-sm outline-none" /></div>
                </div>
              </div>

              <div className="space-y-6 bg-orange-50/50 p-6 rounded-sm border border-orange-100">
                <h4 className="font-extrabold text-[#8b1818] uppercase tracking-widest text-xs border-b border-orange-200 pb-2 flex items-center gap-2"><TrendingUp className="w-4 h-4"/> Trending Section Banners</h4>
                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-2">Campaign Title</label>
                  <input type="text" value={siteSettings.trendingTitle || ''} onChange={e => setSiteSettings({...siteSettings, trendingTitle: e.target.value})} className="w-full border border-gray-300 p-3 text-sm outline-none" />
                </div>
                <div className="space-y-3">
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-1">Banner Images</label>
                  {siteSettings.trendingBannerUrls.map((url, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="bg-white border border-gray-200 text-gray-600 font-bold px-3 py-3 text-xs">Slide {index + 1}</span>
                      <input type="text" value={url} onChange={(e) => handleTrendingBannerChange(index, e.target.value)} className="w-full border border-gray-300 p-3 text-sm outline-none" />
                      <button type="button" onClick={() => removeTrendingBannerImage(index)} className="bg-white border border-red-200 text-red-500 p-3 rounded-sm"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                  <button type="button" onClick={addTrendingBannerImage} className="flex items-center gap-1.5 text-xs font-extrabold text-[#f7941d] mt-2"><Plus className="w-4 h-4" /> Add Another Banner</button>
                </div>
              </div>
              
              <button disabled={isSubmitting} type="submit" className="w-full bg-[#8b1818] text-white font-extrabold py-4 rounded-sm uppercase text-sm flex justify-center items-center shadow-md">
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save All Settings'}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;