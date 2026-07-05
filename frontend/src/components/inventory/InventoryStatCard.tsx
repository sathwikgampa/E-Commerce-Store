import React from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface InventoryStatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  trend?: { direction: 'up' | 'down' | 'neutral'; label: string };
  index?: number;
  onClick?: () => void;
  accent?: boolean;
}

const InventoryStatCard: React.FC<InventoryStatCardProps> = ({
  label,
  value,
  subValue,
  icon: Icon,
  iconBg,
  iconColor,
  trend,
  index = 0,
  onClick,
  accent = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: 'easeOut' }}
      onClick={onClick}
      className={`relative bg-white rounded-2xl border shadow-xs p-5 flex items-start justify-between group transition-all duration-200
        ${onClick ? 'cursor-pointer hover:shadow-md' : ''}
        ${accent ? 'border-[#0A3D91]/20 bg-gradient-to-br from-[#0A3D91]/5 to-white' : 'border-slate-200 hover:border-slate-300'}
      `}
    >
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
          {label}
        </p>
        <p className={`text-2xl font-black tracking-tight mt-1.5 ${accent ? 'text-[#0A3D91]' : 'text-slate-900'}`}>
          {value}
        </p>
        {subValue && (
          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{subValue}</p>
        )}
        {trend && (
          <div className={`flex items-center gap-1 mt-1.5 text-[10px] font-bold ${
            trend.direction === 'up'
              ? 'text-emerald-600'
              : trend.direction === 'down'
              ? 'text-rose-600'
              : 'text-slate-400'
          }`}>
            <span>{trend.direction === 'up' ? '▲' : trend.direction === 'down' ? '▼' : '—'}</span>
            <span>{trend.label}</span>
          </div>
        )}
      </div>

      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ml-3 group-hover:scale-105 transition-transform ${iconBg}`}
      >
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>

      {/* Subtle bottom accent line */}
      {accent && (
        <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-[#0A3D91] to-[#D4AF37] rounded-full opacity-30" />
      )}
    </motion.div>
  );
};

export default InventoryStatCard;
