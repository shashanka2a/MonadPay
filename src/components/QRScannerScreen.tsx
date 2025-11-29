'use client';

import { useState } from 'react';
import { ArrowLeft, ScanLine, Upload } from 'lucide-react';
import { motion } from 'motion/react';
import { checkHandleAvailability } from '../utils/mockData';

interface QRScannerScreenProps {
  onNavigate: (screen: string, data?: any) => void;
}

export function QRScannerScreen({ onNavigate }: QRScannerScreenProps) {
  const [isScanning, setIsScanning] = useState(true);

  // Simulate scanning
  const handleMockScan = () => {
    setIsScanning(false);
    setTimeout(() => {
      // Simulate finding Alice's payment request
      const result = checkHandleAvailability('@alice');
      if (result.user) {
        onNavigate('send', { prefilledUser: result.user, prefilledAmount: '25.00' });
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-6 flex items-center gap-4 z-20">
        <button 
          onClick={() => onNavigate('home')}
          className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-2xl">Scan QR Code</h1>
      </div>

      {/* Scanner View */}
      <div className="relative h-screen flex items-center justify-center">
        {/* Camera Mock Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#1a1a2e] to-[#050505] opacity-50" />

        {/* Scanning Frame */}
        <div className="relative z-10">
          <motion.div
            className="w-72 h-72 relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {/* Corner Borders */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-[#4FFFFF] rounded-tl-3xl" />
            <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-[#4FFFFF] rounded-tr-3xl" />
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-[#4FFFFF] rounded-bl-3xl" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-[#4FFFFF] rounded-br-3xl" />

            {/* Scanning Line */}
            {isScanning && (
              <motion.div
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#4FFFFF] to-transparent shadow-lg shadow-[#4FFFFF]"
                animate={{
                  top: ['0%', '100%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            )}

            {/* Center Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <ScanLine className="w-24 h-24 text-[#4FFFFF]/30" />
            </div>
          </motion.div>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-32 left-0 right-0 text-center px-6 z-10">
          <p className="text-white text-lg mb-2">Position QR code within frame</p>
          <p className="text-[#94A3B8]">The QR code will be scanned automatically</p>
        </div>

        {/* Upload Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={handleMockScan}
          className="absolute bottom-28 left-1/2 -translate-x-1/2 px-8 py-4 rounded-full border-2 border-white/20 backdrop-blur-sm text-white hover:bg-white/10 transition-colors flex items-center gap-2 z-10 shadow-lg"
        >
          <Upload className="w-5 h-5" />
          Upload from Gallery
        </motion.button>
      </div>

      {/* Scanning Overlay Effect */}
      {!isScanning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-[#10B981]/20 backdrop-blur-sm flex items-center justify-center z-30"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-center"
          >
            <div className="w-20 h-20 rounded-full bg-[#10B981] flex items-center justify-center mx-auto mb-4">
              <ScanLine className="w-10 h-10 text-white" />
            </div>
            <p className="text-white text-xl">QR Code Detected!</p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
