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
    <div className="relative p-[3px] rounded-3xl bg-gradient-to-r from-[#9cff02] to-[#5a03cf]">
      <button
        onClick={onClick}
        className="bg-white rounded-3xl p-8 hover:shadow-2xl text-left w-full shadow-xl transition-all hover:scale-105"
      >
        <div className="flex flex-col">
          <p className="text-gray-700 mb-4 text-base" style={{ fontWeight: '600' }}>{title}</p>
          <p className="mb-3 italic text-6xl bg-gradient-to-r from-[#9cff02] to-[#5a03cf] bg-clip-text text-transparent" style={{ fontWeight: '800' }}>{value}</p>
          <p className="text-gray-600 text-sm">{subtitle}</p>
        </div>
      </button>
    </div>
  );
}