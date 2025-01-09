import React, { useEffect, useRef } from 'react';

interface AudioWaveformProps {
  isRecording: boolean;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({ isRecording }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isRecording || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Animation logic for sound wave would go here
    // This is a placeholder for the actual audio visualization
    
  }, [isRecording]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-12"
      style={{ display: isRecording ? 'block' : 'none' }}
    />
  );
};