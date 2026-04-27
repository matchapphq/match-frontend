interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
}

export function StatCard({ title, value, icon, trend, trendUp }: StatCardProps) {
  return (
    <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6">
      <div className="flex items-start justify-between mb-3">
        <p className="text-gray-600 dark:text-gray-400 text-sm">{title}</p>
        {icon && <div className="text-[#5a03cf]">{icon}</div>}
      </div>
      <p className="text-3xl mb-2" style={{ fontWeight: '700', color: '#5a03cf' }}>
        {value}
      </p>
      {trend && (
        <p className={`text-sm ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
          {trend}
        </p>
      )}
    </div>
  );
}
