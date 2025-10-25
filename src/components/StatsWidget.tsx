
import { BarChart3, Tag, Folder, TrendingUp } from 'lucide-react';
import { Resource } from '../types';

interface StatsWidgetProps {
  resources: Resource[];
}

export default function StatsWidget({ resources }: StatsWidgetProps) {
  // Calculate stats
  const totalResources = resources.length;
  
  // Count by category
  const categoryCount = resources.reduce((acc, resource) => {
    acc[resource.category] = (acc[resource.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
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

  return (
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 mb-6 shadow-xl border border-white/20">
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
  
        {/* Top Categories */}
        {topCategories.length > 0 && (
          <div>
            <h3 className="text-white font-semibold mb-3">Top Categories</h3>
            <div className="space-y-2">
              {topCategories.map(([category, count]) => {
                const percentage = (count / maxCount) * 100;
                return (
                  <div key={category} className="flex items-center gap-3">
                    <div className="w-24 text-gray-300 text-sm">{category}</div>
                    <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="w-8 text-right text-gray-400 text-sm">{count}</div>
                  </div>
                );
              })}
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