import React from 'react';
import './RopeOverlay.css';

interface RopeOverlayProps {
  visible: boolean;
}

export const RopeOverlay: React.FC<RopeOverlayProps> = ({ visible }) => {
  if (!visible) return null;

  return (
    <div className="rope-overlay">
      <div className="rope-line" />
    </div>
  );
};

