import { BarChart3, Tag, Folder, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Resource } from '../types';

interface StatsWidgetProps {
  resources: Resource[];
}

// Color mapping for categories (matching your theme)
const CATEGORY_COLORS: Record<string, string> = {
  'Documentation': '#3b82f6',
  'Tools': '#a855f7',
  'UI/UX': '#ec4899',
  'Backend': '#10b981',
  'Frontend': '#f97316',
  'Community': '#eab308',
  'Learning': '#6366f1',
  'APIs': '#ef4444'
};

export default function StatsWidget({ resources }: StatsWidgetProps) {
  // Calculate stats
  const totalResources = resources.length;
  
  // Count by category
  const categoryCount = resources.reduce((acc, resource) => {
    acc[resource.category] = (acc[resource.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Prepare data for pie chart
  const pieData = Object.entries(categoryCount).map(([name, value]) => ({
    name,
    value,
    color: CATEGORY_COLORS[name] || '#6b7280'
  }));
  
  // Sort categories by count
  const topCategories = Object.entries(categoryCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);
  
  // Count unique tags
  const allTags = resources.flatMap(r => r.tags);
  const uniqueTags = new Set(allTags);
  
  // Count resources added in last 7 days
  const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
  const recentResources = resources.filter(r => {
    const createdAt = r.createdAt?.seconds ? r.createdAt.seconds * 1000 : 0;
    return createdAt > sevenDaysAgo;
  }).length;

  // Get max count for progress bars
  const maxCount = Math.max(...Object.values(categoryCount), 1);

  // Custom label for pie chart
  const renderCustomLabel = ({ name, percent }: any) => {
    return `${name} ${(percent * 100).toFixed(0)}%`;
  };

  return (
    <div className="bg-zinc-800/40 backdrop-blur-xl rounded-lg p-6 mb-6 shadow-xl border border-purple-500/20">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-purple-400" />
        <h2 className="text-xl font-bold text-white">Your Collection</h2>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="text-3xl font-bold text-white mb-1">{totalResources}</div>
          <div className="text-gray-400 text-sm flex items-center gap-1">
            <Folder className="w-4 h-4" />
            Total Resources
          </div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="text-3xl font-bold text-white mb-1">{Object.keys(categoryCount).length}</div>
          <div className="text-gray-400 text-sm flex items-center gap-1">
            <Folder className="w-4 h-4" />
            Categories
          </div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="text-3xl font-bold text-white mb-1">{uniqueTags.size}</div>
          <div className="text-gray-400 text-sm flex items-center gap-1">
            <Tag className="w-4 h-4" />
            Unique Tags
          </div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="text-3xl font-bold text-purple-400 mb-1">{recentResources}</div>
          <div className="text-gray-400 text-sm flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            Added This Week
          </div>
        </div>
      </div>

      {/* Chart and Top Categories Grid */}
      {totalResources > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="flex flex-col">
            <h3 className="text-white font-semibold mb-3">Category Distribution</h3>
            <div className="w-full h-64 md:h-72">
              <ResponsiveContainer width="100%" aspect={2}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomLabel}
                    outerRadius="70%"
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#27272a', 
                      border: '1px solid rgba(168, 85, 247, 0.2)',
                      borderRadius: '0.5rem'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Categories List */}
          <div className="flex flex-col">
            <h3 className="text-white font-semibold mb-3 py-5">Top Categories</h3>
            <div className="space-y-3">
              {topCategories.map(([category, count]) => {
                const percentage = (count / maxCount) * 100;
                return (
                  <div key={category} className="flex items-center gap-3">
                    <div className="w-24 text-gray-300 text-sm">{category}</div>
                    <div className="flex-1 bg-zinc-700/30 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-full transition-all duration-500"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: CATEGORY_COLORS[category] || '#6b7280'
                        }}
                      />
                    </div>
                    <div className="w-8 text-right text-gray-400 text-sm">{count}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {totalResources === 0 && (
        <div className="text-center py-4 text-gray-400">
          No resources yet. Add some to see your stats!
        </div>
      )}
    </div>
  );
}