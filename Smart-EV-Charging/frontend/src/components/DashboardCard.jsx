import React from 'react';

const DashboardCard = ({ title, value, subtitle, icon: Icon, color = 'volt', trend }) => {
  // Map color names to CSS class-friendly names
  const colorMap = {
    emerald: 'volt',    // Legacy support - emerald now maps to volt
    volt: 'volt',
    cyan: 'cyan',
    blue: 'blue',
    purple: 'purple'
  };
  
  const mappedColor = colorMap[color] || color;

  return (
    <div className={`dashboard-stat-card border-${mappedColor}`}>
      <div className="stat-card-header">
        <div className="stat-info">
          <span className="stat-title">{title}</span>
          <h3 className="stat-value">{value}</h3>
        </div>
        {Icon && (
          <div className={`stat-icon-wrapper bg-${mappedColor}`}>
            <Icon size={24} className={`icon-${mappedColor}`} />
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="stat-card-footer">
          {trend && (
            <span className={`trend-badge ${trend > 0 ? 'trend-up' : 'trend-neutral'}`}>
              {trend > 0 ? `+${trend}%` : trend}
            </span>
          )}
          {subtitle && <span className="stat-subtitle">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
