import React, { useEffect } from 'react';

interface ScreenShakeOverlayProps {
  isShaking: boolean;
  shockwaveActive: boolean;
}

export const ScreenShakeOverlay: React.FC<ScreenShakeOverlayProps> = ({
  isShaking,
  shockwaveActive,
}) => {
  return (
    <>
      {/* Chromatic Aberration & Screen Shake Class Layer */}
      {isShaking && (
        <div className="fixed inset-0 pointer-events-none z-[999] border-4 border-cyber-pink/60 animate-ping opacity-75" />
      )}

      {/* Radial Shockwave Expansion */}
      {shockwaveActive && (
        <div className="fixed inset-0 pointer-events-none z-[998] flex items-center justify-center overflow-hidden">
          <div className="w-[100px] h-[100px] rounded-full border-8 border-cyber-cyan opacity-80 animate-[ping_0.8s_cubic-bezier(0,0,0.2,1)_forwards]" />
          <div className="absolute w-[80px] h-[80px] rounded-full border-4 border-cyber-yellow opacity-90 animate-[ping_0.6s_cubic-bezier(0,0,0.2,1)_forwards]" />
        </div>
      )}
    </>
  );
};
