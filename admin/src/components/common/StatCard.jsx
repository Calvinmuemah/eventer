import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, color = 'primary' }) => {
  const colorMap = {
    primary: { bg: 'rgba(8, 26, 43, 0.08)', text: 'var(--admin-primary)' },
    accent: { bg: 'rgba(201, 162, 39, 0.15)', text: 'var(--admin-accent-hover)' },
    success: { bg: '#DCFCE7', text: '#166534' },
    warning: { bg: '#FEF3C7', text: '#92400E' },
    info: { bg: '#E0F2FE', text: '#075985' },
  };

  const style = colorMap[color] || colorMap.primary;

  return (
    <div className="admin-card" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <div>
        <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--admin-text-muted)', fontWeight: 600 }}>
          {title}
        </div>
        <div style={{ fontSize: '1.85rem', fontWeight: 700, color: 'var(--admin-primary)', margin: '0.35rem 0 0.2rem' }}>
          {value}
        </div>
        {subtitle && (
          <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
            {subtitle}
          </div>
        )}
      </div>

      {Icon && (
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '8px',
          backgroundColor: style.bg,
          color: style.text,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon size={22} />
        </div>
      )}
    </div>
  );
};

export default StatCard;
