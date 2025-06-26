interface LabCardProps {
  name: string;
  description: string;
  category: string;
  url: string;
  icon: React.ReactNode;
  gradient: string;
  hoverGradient: string;
  linkColor: string;
  actionText: string;
}

export default function LabCard({ 
  name, 
  description, 
  category, 
  url, 
  icon, 
  gradient, 
  hoverGradient, 
  linkColor, 
  actionText 
}: LabCardProps) {
  return (
    <div className={`group relative bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-200 dark:border-slate-700 overflow-hidden`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${hoverGradient} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
      <div className="relative">
        <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl mb-4 flex items-center justify-center shadow-lg`}>
          {icon}
        </div>
        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{name}</h4>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">{category}</span>
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`${linkColor} text-sm font-medium group-hover:underline`}
          >
            {actionText}
          </a>
        </div>
      </div>
    </div>
  );
} 