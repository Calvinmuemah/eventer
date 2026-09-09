import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, ExternalLink, RotateCcw } from 'lucide-react';
import { adminApi } from '../api/adminApi';
import ServiceModal from '../components/services/ServiceModal';

export const ServicesAdminPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminApi.getServices();
      setServices(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load services.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleCreateNew = () => {
    setEditingService(null);
    setModalOpen(true);
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setModalOpen(true);
  };

  const handleSave = async (data, id) => {
    if (id) {
      await adminApi.updateService(id, data);
    } else {
      await adminApi.createService(data);
    }
    fetchServices();
  };

  const handleDelete = async (service) => {
    if (!window.confirm(`Are you sure you want to deactivate or remove "${service.name}"?`)) return;
    try {
      await adminApi.deleteService(service.id);
      fetchServices();
    } catch (err) {
      alert(err.message || 'Failed to remove service.');
    }
  };

  const toggleActive = async (service) => {
    try {
      await adminApi.updateService(service.id, { is_active: !service.is_active });
      fetchServices();
    } catch (err) {
      alert(err.message || 'Failed to toggle service status.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="admin-title">Services Catalogue</h1>
          <p className="admin-subtitle">Create, update, and manage services displayed on the public website and event planner.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handleCreateNew} className="admin-btn admin-btn-primary">
            <Plus size={16} /> Add New Service
          </button>
          <button onClick={fetchServices} className="admin-btn admin-btn-outline">
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>Loading services...</div>
      ) : error ? (
        <div style={{ padding: '2rem', backgroundColor: '#FFFFFF', borderRadius: '8px' }}>
          <p style={{ color: '#EF4444', marginBottom: '1rem' }}>{error}</p>
          <button onClick={fetchServices} className="admin-btn admin-btn-outline admin-btn-sm">Retry</button>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Image</th>
                <th>Service Name & Slug</th>
                <th>Description</th>
                <th style={{ textAlign: 'center' }}>Sort</th>
                <th style={{ textAlign: 'center' }}>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id}>
                  <td>
                    <div style={{
                      width: '60px',
                      height: '42px',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      backgroundColor: 'var(--admin-border)',
                    }}>
                      <img 
                        src={service.image_url} 
                        alt={service.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--admin-primary)' }}>{service.name}</div>
                    <div style={{ fontSize: '0.775rem', color: 'var(--admin-text-muted)' }}>/{service.slug}</div>
                  </td>
                  <td>
                    <div style={{ maxWidth: '420px', fontSize: '0.85rem', color: 'var(--admin-text-muted)', lineHeight: 1.4 }}>
                      {service.short_description}
                    </div>
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 600 }}>
                    {service.sort_order}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      onClick={() => toggleActive(service)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: service.is_active ? '#166534' : '#991B1B',
                      }}
                      title="Click to toggle visibility"
                    >
                      {service.is_active ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                      {service.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                      <a
                        href={`http://localhost:5173/services/${service.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="admin-btn admin-btn-outline admin-btn-sm"
                        title="View on Client Website"
                      >
                        <ExternalLink size={13} />
                      </a>
                      <button
                        onClick={() => handleEdit(service)}
                        className="admin-btn admin-btn-outline admin-btn-sm"
                        title="Edit Service"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(service)}
                        className="admin-btn admin-btn-outline admin-btn-sm"
                        style={{ color: '#EF4444' }}
                        title="Remove / Deactivate"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Service Modal */}
      <ServiceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        service={editingService}
      />
    </div>
  );
};

export default ServicesAdminPage;
