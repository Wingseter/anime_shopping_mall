import React from 'react';
import { X, Orbit, Rocket, ShieldCheck, CheckCircle2, Navigation } from 'lucide-react';
import { WarpShipment } from '../../types';
import { sound } from '../../engine/soundEngine';

interface WarpTrackingModalProps {
  isOpen: boolean;
  shipments: WarpShipment[];
  onClose: () => void;
}

export const WarpTrackingModal: React.FC<WarpTrackingModalProps> = ({
  isOpen,
  shipments,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#060a22] border border-cyber-cyan/50 box-glow-cyan p-6 md:p-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-lg border border-white/10 hover:border-white/30"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 rounded-2xl bg-cyber-cyan/20 border border-cyber-cyan text-cyber-cyan">
            <Orbit className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <div className="text-xs font-mono text-cyber-cyan tracking-widest font-bold">
              REAL-TIME HYPERSPACE RADAR
            </div>
            <h3 className="text-2xl font-black font-orbitron text-white">
              차원 도약 배송 레이더
            </h3>
          </div>
        </div>

        {shipments.length === 0 ? (
          <div className="p-8 rounded-2xl bg-black/50 border border-dashed border-white/10 text-center text-gray-400 space-y-2">
            <Rocket className="w-10 h-10 text-gray-600 mx-auto" />
            <p className="font-orbitron text-sm">진행 중인 차원 전송 주문이 없습니다.</p>
            <p className="text-xs font-mono text-gray-500">결제를 완료하면 실시간 웜홀 레이더가 가동됩니다.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {shipments.map((shipment) => (
              <div key={shipment.id} className="p-5 rounded-2xl bg-black/60 border border-white/15 space-y-4">
                <div className="flex justify-between items-center text-xs font-mono pb-3 border-b border-white/10">
                  <div>
                    <span className="text-gray-400">ORDER NO: </span>
                    <span className="text-cyber-cyan font-bold">{shipment.orderNumber}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-cyber-green/20 text-cyber-green font-bold">
                    {shipment.status}
                  </span>
                </div>

                {/* Radar Stage Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-300">현재 좌표: {shipment.currentSector}</span>
                    <span className="text-cyber-gold font-bold">{shipment.progressPercent}% WARP</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-900 rounded-full overflow-hidden border border-white/10">
                    <div
                      className="h-full bg-gradient-to-r from-cyber-cyan via-cyber-pink to-cyber-yellow transition-all duration-700 box-glow-cyan"
                      style={{ width: `${shipment.progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Milestones */}
                <div className="grid grid-cols-3 text-center text-[10px] font-mono text-gray-400 pt-2">
                  <div className={shipment.progressPercent >= 20 ? 'text-cyber-cyan font-bold' : ''}>
                    1. 웜홀 진입 완료
                  </div>
                  <div className={shipment.progressPercent >= 60 ? 'text-cyber-pink font-bold' : ''}>
                    2. 대기권 궤도 하강
                  </div>
                  <div className={shipment.progressPercent >= 100 ? 'text-cyber-green font-bold' : ''}>
                    3. 현실 좌표 도달
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
