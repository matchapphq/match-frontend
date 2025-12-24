import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  textColor?: string;
  iconBg?: string;
  iconColor?: string;
  onClick: () => void;
}

export function StatCard({ title, value, subtitle, icon: Icon, color, textColor = 'text-white', iconBg = 'bg-white/20', iconColor = 'text-white', onClick }: StatCardProps) {
  return (
    <button
      onClick={onClick}
      className={`${color} rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-8 border-2 border-gray-100 hover:border-[#9cff02] transition-all hover:scale-105 hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] text-left w-full backdrop-blur-sm`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`${textColor} opacity-80 mb-3 text-base`} style={{ fontWeight: '500' }}>{title}</p>
          <p className={`${textColor} mb-2 italic text-5xl`} style={{ fontWeight: '800' }}>{value}</p>
          <p className={`${textColor} opacity-60 text-sm`}>{subtitle}</p>
        </div>
        <div className={`${iconBg} p-4 rounded-2xl backdrop-blur-sm shadow-lg`}>
          <Icon className={`w-8 h-8 ${iconColor}`} />
        </div>
      </div>
    </button>
  );
}