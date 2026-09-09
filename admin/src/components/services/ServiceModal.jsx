import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';

export const ServiceModal = ({ isOpen, onClose, onSave, service }) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    short_description: '',
    description: '',
    image_url: '',
    featuresText: '',
    sort_order: 10,
    is_active: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name || '',
        slug: service.slug || '',
        short_description: service.short_description || '',
        description: service.description || '',
        image_url: service.image_url || '',
        featuresText: Array.isArray(service.features) ? service.features.join('\n') : '',
        sort_order: service.sort_order || 0,
        is_active: service.is_active !== undefined ? service.is_active : true,
      });
    } else {
      setFormData({
        name: '',
        slug: '',
        short_description: '',
        description: '',
        image_url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
        featuresText: '',
        sort_order: 10,
        is_active: true,
      });
    }
    setError(null);
  }, [service, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Service name is required.');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      const features = formData.featuresText
        .split('\n')
        .map(f => f.trim())
        .filter(Boolean);

      const payload = {
        name: formData.name.trim(),
        slug: formData.slug.trim() || undefined,
        short_description: formData.short_description.trim(),
        description: formData.description.trim(),
        image_url: formData.image_url.trim(),
        features,
        sort_order: parseInt(formData.sort_order, 10) || 0,
        is_active: formData.is_active,
      };

      await onSave(payload, service?.id);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save service.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={service ? `Edit Service: ${service.name}` : 'Create New Event Service'}
      footer={
        <>
          <button type="button" onClick={onClose} className="admin-btn admin-btn-outline" disabled={saving}>
            Cancel
          </button>
          <button type="button" onClick={handleSubmit} className="admin-btn admin-btn-primary" disabled={saving}>
            {saving ? 'Saving...' : service ? 'Update Service' : 'Create Service'}
          </button>
        </>
      }
    >
      {error && (
        <div style={{
          padding: '0.75rem 1rem',
          backgroundColor: '#FEE2E2',
          border: '1px solid #EF4444',
          color: '#991B1B',
          borderRadius: '6px',
          marginBottom: '1rem',
          fontSize: '0.85rem',
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label className="admin-label">Service Name *</label>
          <input
            type="text"
            className="admin-input"
            placeholder="e.g. Drone Cinematography & Video Staging"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label className="admin-label">Custom Slug (Optional)</label>
            <input
              type="text"
              className="admin-input"
              placeholder="e.g. drone-cinematography"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            />
          </div>
          <div>
            <label className="admin-label">Sort Order (Rank)</label>
            <input
              type="number"
              className="admin-input"
              value={formData.sort_order}
              onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="admin-label">Short Summary (Featured in grids)</label>
          <input
            type="text"
            className="admin-input"
            placeholder="One or two compelling sentences about this service..."
            value={formData.short_description}
            onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
          />
        </div>

        <div>
          <label className="admin-label">Detailed Service Description</label>
          <textarea
            className="admin-textarea"
            rows="3"
            placeholder="Comprehensive overview of equipment, acoustics, staging, and technical capabilities..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div>
          <label className="admin-label">Image URL (Unsplash or CDN link)</label>
          <input
            type="url"
            className="admin-input"
            placeholder="https://images.unsplash.com/..."
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          />
        </div>

        <div>
          <label className="admin-label">Features & Deliverables (One item per line)</label>
          <textarea
            className="admin-textarea"
            rows="4"
            placeholder="4K broadcast live streaming&#10;Dedicated licensed drone pilot&#10;Same-day highlight reel"
            value={formData.featuresText}
            onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.5rem' }}>
          <input
            type="checkbox"
            id="is_active"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            style={{ width: '16px', height: '16px', accentColor: 'var(--admin-accent)' }}
          />
          <label htmlFor="is_active" style={{ fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
            Service is Active & Visible in Catalogue
          </label>
        </div>
      </form>
    </Modal>
  );
};

export default ServiceModal;
