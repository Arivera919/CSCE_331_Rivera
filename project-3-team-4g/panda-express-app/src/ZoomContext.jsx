import React, { createContext, useState, useEffect } from 'react';

export const ZoomContext = createContext();

export const ZoomProvider = ({ children }) => {
  const [zoomLevel, setZoomLevel] = useState(100);

  useEffect(() => {
    document.documentElement.style.zoom = `${zoomLevel}%`;
  }, [zoomLevel]);

  const handleZoom = (delta) => {
    setZoomLevel(prev => {
      const newZoom = prev + delta;
      return Math.min(Math.max(newZoom, 50), 200);
    });
  };

  return (
    <ZoomContext.Provider value={{ zoomLevel, handleZoom }}>
      {children}
    </ZoomContext.Provider>
  );
};