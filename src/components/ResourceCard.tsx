import { ExternalLink, Trash2, Edit } from "lucide-react";
import { Resource, Category } from '../types';

interface ResourceCardProps {
  resource: Resource;
  onEdit: (resource: Resource) => void;
  onDelete: (id: string) => void;
}

const getCategoryColor = (category: Category): string => {
  const colors: Record<Category, string> = {
    'Documentation': 'bg-blue-100 text-blue-700',
    'Tools': 'bg-purple-100 text-purple-700',
    'UI/UX': 'bg-pink-100 text-pink-700',
    'Backend': 'bg-green-100 text-green-700',
    'Frontend': 'bg-orange-100 text-orange-700',
    'Community': 'bg-yellow-100 text-yellow-700',
    'Learning': 'bg-indigo-100 text-indigo-700',
    'APIs': 'bg-red-100 text-red-700'
  };
  return colors[category] || 'bg-gray-100 text-gray-700';
};

export default function ResourceCard({ resource, onEdit, onDelete }: ResourceCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-5 shadow-xl border border-white/20 hover:border-purple-500 transition-all hover:transform hover:scale-105">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-1">{resource.name}</h3>
          <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(resource.category)}`}>
            {resource.category}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(resource)}
            className="text-blue-400 hover:text-blue-300 transition-colors"
            aria-label="Edit resource"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(resource.id)}
            className="text-red-400 hover:text-red-300 transition-colors"
            aria-label="Delete resource"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <p className="text-gray-300 text-sm mb-3">{resource.description}</p>
      
      <div className="flex flex-wrap gap-1 mb-3">
        {resource.tags.map((tag, idx) => (
          <span key={idx} className="text-xs px-2 py-1 bg-white/10 text-gray-300 rounded">
            #{tag}
          </span>
        ))}
      </div>
      
      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
      >
        <ExternalLink className="w-4 h-4" />
        <span className="text-sm truncate">{resource.url}</span>
      </a>
    </div>
  );
}
