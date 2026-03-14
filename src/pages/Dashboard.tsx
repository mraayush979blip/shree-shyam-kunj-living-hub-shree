import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getGeneralProperties, getFeaturedProperties, addPropertyToStorage, removePropertyFromStorage, updatePropertyInStorage, getSubscribers, uploadImage, sendPropertyAlert, Property } from '../lib/storage';
import { convertGDriveLink } from '../lib/utils';
import { supabase } from '../lib/supabase';
import { LayoutDashboard, Home, Users, Settings, Plus, LogOut, ExternalLink, X, Edit2, UserPlus, TrendingUp, Building } from 'lucide-react';
import '../dashboard.css';

const Dashboard: React.FC = () => {
  const [featured, setFeatured] = useState<Property[]>([]);
  const [general, setGeneral] = useState<Property[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const { tab } = useParams<{ tab: string }>();
  const [activeTab, setActiveTab] = useState<'featured' | 'general' | 'users'>(
    (tab as any) || 'featured'
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notifySubscribers, setNotifySubscribers] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentType, setCurrentType] = useState<'featured' | 'general'>('general');
  const navigate = useNavigate();

  // Form states
  const [formData, setFormData] = useState({ 
    title: '', 
    type: '', 
    location: '', 
    price: '', 
    image: '', 
    instagramLink: '',
    address: '',
    googleMapsLink: ''
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
      }
    };
    checkAuth();
    updateData();
  }, []);

  useEffect(() => {
    initReveal();
  }, [activeTab, modalOpen]); // Fix: Re-run when modal opens to detect .reveal inside it

  const initReveal = () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    // Select all reveal variants
    document.querySelectorAll('[class*="reveal"]').forEach(el => observer.observe(el));
  };

  const updateData = async () => {
    const fData = await getFeaturedProperties();
    const gData = await getGeneralProperties();
    const sData = await getSubscribers();
    setFeatured(fData);
    setGeneral(gData);
    setSubscribers(sData);
  };

  const handleOpenModal = (type: 'featured' | 'general', editProperty?: Property) => {
    setCurrentType(type);
    if (editProperty) {
      setIsEditing(true);
      setEditingId(editProperty.id);
      setFormData({
        title: editProperty.title,
        type: editProperty.type,
        location: editProperty.location,
        price: editProperty.price || '',
        image: editProperty.image,
        instagramLink: editProperty.instagramLink || '',
        address: editProperty.address || '',
        googleMapsLink: editProperty.googleMapsLink || ''
      });
    } else {
      setIsEditing(false);
      setEditingId(null);
      setFormData({ title: '', type: '', location: '', price: '', image: '', instagramLink: '', address: '', googleMapsLink: '' });
    }
    setModalOpen(true);
  };

  const handleAddProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalData: any = { ...formData, image: convertGDriveLink(formData.image) };
    if (currentType === 'featured') {
      delete finalData.price;
      delete finalData.instagramLink;
      delete finalData.address;
      delete finalData.googleMapsLink;
    }

    try {
      if (isEditing && editingId) {
        await updatePropertyInStorage(editingId, finalData);
      } else {
        await addPropertyToStorage(currentType, finalData);
        if (notifySubscribers && currentType === 'general') {
          await sendPropertyAlert(finalData, subscribers);
        }
      }
      setModalOpen(false);
      setNotifySubscribers(false);
      await updateData();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleRemove = async (id: any) => {
    if (!confirm("Remove this asset from portfolio?")) return;
    try {
      await removePropertyFromStorage(id);
      await updateData();
    } catch (err: any) {
      alert("Failed to remove property: " + err.message);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setFormData({ ...formData, image: url });
    } catch (err: any) {
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dash-container">
      {/* Mobile Header */}
      <div className="admin-mobile-header">
        <div className="logo">Shyam Kunj Living Hub</div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="admin-toggle">
          {sidebarOpen ? <X size={24} /> : <LayoutDashboard size={24} />}
        </button>
      </div>

      <aside className={`dash-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="logo">Shyam Kunj Living Hub</div>
        <nav className="dash-nav">
          <button onClick={() => { navigate('/dashboard/featured'); setActiveTab('featured'); setSidebarOpen(false); }} className={`dash-link ${activeTab === 'featured' ? 'active' : ''}`}>
            <TrendingUp size={20} /> Home Page Property
          </button>
          <button onClick={() => { navigate('/dashboard/general'); setActiveTab('general'); setSidebarOpen(false); }} className={`dash-link ${activeTab === 'general' ? 'active' : ''}`}>
            <Building size={20} /> Properties
          </button>
          <button onClick={() => { navigate('/dashboard/users'); setActiveTab('users'); setSidebarOpen(false); }} className={`dash-link ${activeTab === 'users' ? 'active' : ''}`}>
            <Users size={20} /> Verified Leads
          </button>
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <button onClick={() => navigate('/')} className="dash-link">
            <ExternalLink size={20} /> View Portal
          </button>
          <button onClick={handleSignOut} className="dash-link" style={{ color: '#ef4444' }}>
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      </aside>

      <main className="dash-main">
        <header className="dash-header">
          <div>
            <h1 className="dash-title">
              {activeTab === 'featured' ? 'Home Page Property' : 
               activeTab === 'general' ? 'Property Management' : 
               'Verified Lead Network'}
            </h1>
            <p style={{ color: 'var(--admin-text-soft)', marginTop: '0.5rem' }}>Management Dashboard • Shyam Kunj Living Hub</p>
          </div>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--admin-text-soft)', textTransform: 'uppercase' }}>Live Inventory</p>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--admin-accent)' }}>{featured.length + general.length} Units</h3>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--admin-text-soft)', textTransform: 'uppercase' }}>Network Size</p>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--admin-accent)' }}>{subscribers.length} Verified</h3>
            </div>
          </div>
        </header>

        {activeTab === 'featured' && (
          <div className="reveal">
            <div className="dash-card">
              <div className="table-header">
                <h2 style={{ fontSize: '1.25rem' }}>Home Page Collection <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--admin-text-soft)', marginLeft: '0.5rem' }}>(Featured)</span></h2>
                <button onClick={() => handleOpenModal('featured')} className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.8rem' }}>
                  <Plus size={16} /> New Asset
                </button>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Asset Name</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {featured.map((p) => (
                    <tr key={p.id}>
                      <td><strong>{p.title}</strong></td>
                      <td>{p.location}</td>
                      <td><span style={{ padding: '0.3rem 0.6rem', background: '#f0fdf4', color: '#166534', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>Active</span></td>
                      <td style={{ textAlign: 'right' }}>
                        <button onClick={() => handleOpenModal('featured', p)} style={{ color: 'var(--admin-text-soft)', transition: '0.2s', background: 'none', border: 'none', cursor: 'pointer', marginRight: '1rem' }}><Edit2 size={18} /></button>
                        <button onClick={() => handleRemove(p.id)} style={{ color: '#ef4444', transition: '0.2s', background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
                      </td>
                    </tr>
                  ))}
                  {featured.length === 0 && <tr><td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--admin-text-soft)' }}>No home page properties added yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'general' && (
          <div className="reveal">
            <div className="dash-card">
              <div className="table-header">
                <h2 style={{ fontSize: '1.25rem' }}>General Portfolio</h2>
                <button onClick={() => handleOpenModal('general')} className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.8rem' }}>
                  <Plus size={16} /> New Asset
                </button>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Asset Name</th>
                    <th>Price</th>
                    <th>Type</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {general.map((p) => (
                    <tr key={p.id}>
                      <td><strong>{p.title}</strong><br/><small style={{ color: 'var(--admin-text-soft)' }}>{p.location}</small></td>
                      <td className="price-tag">₹ {p.price}</td>
                      <td>{p.type}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button onClick={() => handleOpenModal('general', p)} style={{ color: 'var(--admin-text-soft)', background: 'none', border: 'none', cursor: 'pointer', marginRight: '1rem' }}><Edit2 size={18} /></button>
                        <button onClick={() => handleRemove(p.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
                      </td>
                    </tr>
                  ))}
                  {general.length === 0 && <tr><td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--admin-text-soft)' }}>No general properties added yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="dash-card reveal">
            <div className="table-header">
              <h2 style={{ fontSize: '1.25rem' }}>Verified Lead Repository</h2>
              <div style={{ padding: '0.5rem 1rem', background: 'var(--admin-bg)', borderRadius: '10px', fontSize: '0.8rem' }}>
                Total: <strong>{subscribers.length} Users</strong>
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>WhatsApp Access</th>
                  <th>Email ID</th>
                  <th>Joined Date</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((s) => (
                  <tr key={s.id}>
                    <td><strong>{s.name}</strong></td>
                    <td style={{ color: 'var(--color-success)', fontWeight: 600 }}>{s.phone}</td>
                    <td>{s.email}</td>
                    <td style={{ color: 'var(--admin-text-soft)' }}>{new Date(s.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {subscribers.length === 0 && <tr><td colSpan={4} style={{ textAlign: 'center', padding: '3rem', color: 'var(--admin-text-soft)' }}>No verified leads found.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Modern Modal System */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content reveal">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem' }}>{isEditing ? 'Modify Inventory' : 'Add New Entry'}</h2>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--admin-text-soft)' }}><X size={24} /></button>
            </div>
            <form onSubmit={handleAddProperty} style={{ display: 'grid', gap: '0.5rem' }}>
              <div className="form-group">
                <label className="form-label">Asset Title</label>
                <input className="form-input" type="text" placeholder="e.g. Luxury 3BHK Apartment" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Location/Area</label>
                  <input className="form-input" type="text" placeholder="e.g. Shree Nagar" required value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Asset Category</label>
                  <input className="form-input" type="text" placeholder="e.g. Residential Plot" required value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} />
                </div>
              </div>
              
              {currentType === 'general' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div className="form-group">
                    <label className="form-label">Investment Amount (₹)</label>
                    <input className="form-input" type="text" placeholder="e.g. 45,00,000" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Instagram Link (Optional)</label>
                    <input className="form-input" type="text" placeholder="Paste Reel URL" value={formData.instagramLink} onChange={(e) => setFormData({ ...formData, instagramLink: e.target.value })} />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Google Maps Location URL</label>
                <input className="form-input" type="text" placeholder="https://maps.google.com/..." value={formData.googleMapsLink} onChange={(e) => setFormData({ ...formData, googleMapsLink: e.target.value })} />
              </div>

              <div className="form-group">
                <label className="form-label">Portfolio Photo</label>
                <input type="file" onChange={handleFileChange} style={{ display: 'none' }} id="file-upload" />
                <label htmlFor="file-upload" className="btn btn-outline" style={{ width: '100%', marginBottom: '1rem', height: '60px' }}>
                  {uploading ? 'Processing Assets...' : 'Upload from Local Device'}
                </label>
                <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--admin-text-soft)', marginBottom: '1rem' }}>OR PASTE GOOGLE DRIVE LINK BELOW</p>
                <input className="form-input" type="text" placeholder="https://drive.google.com/..." value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
                {formData.image && (
                  <div style={{ marginTop: '1.5rem', borderRadius: '12px', overflow: 'hidden', height: '150px', border: '1px solid var(--admin-border)' }}>
                    <img src={convertGDriveLink(formData.image)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </div>

              {currentType === 'general' && !isEditing && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#f0fdf4', padding: '1rem', borderRadius: '15px', marginBottom: '1.5rem', border: '1px solid #dcfce7' }}>
                  <input type="checkbox" id="notify" style={{ width: '20px', height: '20px' }} checked={notifySubscribers} onChange={e => setNotifySubscribers(e.target.checked)} />
                  <label htmlFor="notify" style={{ fontSize: '0.85rem', color: '#166534', cursor: 'pointer' }}>
                    <strong>Broadcast Update</strong> (Notify {subscribers.length} Leads)
                  </label>
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setModalOpen(false)}>Discard</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{isEditing ? 'Commit Changes' : 'Confirm & Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
