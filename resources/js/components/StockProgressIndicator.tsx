import React from 'react';
import { motion } from 'framer-motion';
interface StockProgressIndicatorProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}
export function StockProgressIndicator({
  percentage,
  size = 80,
  strokeWidth = 8
}: StockProgressIndicatorProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - percentage / 100 * circumference;
  // Determine color based on stock level
  let color = '#22c55e'; // Green
  if (percentage <= 20) color = '#ef4444'; // Red
  else if (percentage <= 50) color = '#eab308'; // Yellow
  return <div className="relative flex items-center justify-center" style={{
    width: size,
    height: size
  }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Circle */}
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255, 255, 255, 0.1)" strokeWidth={strokeWidth} fill="transparent" />
        {/* Progress Circle */}
        <motion.circle initial={{
        strokeDashoffset: circumference
      }} animate={{
        strokeDashoffset: offset
      }} transition={{
        duration: 1,
        ease: 'easeOut'
      }} cx={size / 2} cy={size / 2} r={radius} stroke={color} strokeWidth={strokeWidth} fill="transparent" strokeDasharray={circumference} strokeLinecap="round" />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-white">
        <span className="text-sm font-bold">{percentage}%</span>
      </div>
    </div>;
}