import React from 'react';

/**
 * ChargeArc Component — Circular gauge showing charge/capacity status
 * 
 * Props:
 *   - percentage: number (0-100) — fill level
 *   - size: 'sm' | 'md' | 'lg' — relative size
 *   - label: string — display text (e.g., "35%", "Active")
 *   - subLabel: string — optional second line
 *   - icon: React component — optional icon to show in center
 *   - animate: boolean — whether to animate the fill
 */
const ChargeArc = ({
  percentage = 65,
  size = 'md',
  label = '65%',
  subLabel = null,
  icon: Icon = null,
  animate = true,
  className = '',
}) => {
  // Size configuration
  const sizeConfig = {
    sm: { radius: 36, circumference: 226, strokeWidth: 4, fontSize: '0.75rem' },
    md: { radius: 54, circumference: 339, strokeWidth: 6, fontSize: '1rem' },
    lg: { radius: 80, circumference: 503, strokeWidth: 8, fontSize: '1.5rem' },
  };

  const config = sizeConfig[size];
  const diameter = config.radius * 2;
  const offset = config.circumference - (percentage / 100) * config.circumference;

  return (
    <div className={`charge-arc-container charge-arc-${size} ${className}`}>
      <svg
        width={diameter}
        height={diameter}
        viewBox={`0 0 ${diameter} ${diameter}`}
        className={`charge-arc-svg ${animate ? 'animate' : ''}`}
      >
        <defs>
          <linearGradient id="chargeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C6FF3D" /> {/* volt-lime */}
            <stop offset="100%" stopColor="#33E1ED" /> {/* circuit-cyan */}
          </linearGradient>
        </defs>

        {/* Background circle */}
        <circle
          cx={config.radius}
          cy={config.radius}
          r={config.radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={config.strokeWidth}
        />

        {/* Progress circle */}
        <circle
          cx={config.radius}
          cy={config.radius}
          r={config.radius}
          fill="none"
          stroke="url(#chargeGradient)"
          strokeWidth={config.strokeWidth}
          strokeDasharray={config.circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="charge-arc-progress"
          style={{
            transition: animate ? 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
          }}
        />
      </svg>

      {/* Center content */}
      <div className="charge-arc-center">
        {Icon && <Icon className="charge-arc-icon" size={size === 'lg' ? 48 : size === 'md' ? 32 : 24} />}
        <div className="charge-arc-label" style={{ fontSize: config.fontSize }}>
          {label}
        </div>
        {subLabel && (
          <div className="charge-arc-sublabel">
            {subLabel}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChargeArc;
