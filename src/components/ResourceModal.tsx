import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { ResourceFormData, Category } from '../types';
import { fetchMetadata } from '../utils/fetchMetadata';

interface ResourceModalProps {
  formData: ResourceFormData;
  isEditing: boolean;
  onSubmit: () => void;
  onClose: () => void;
  onFormChange: (data: ResourceFormData) => void;
}

const categories: Category[] = [
  'Documentation',
  'Tools',
  'UI/UX',
  'Backend',
  'Frontend',
  'Community',
  'Learning',
  'APIs'
];

export default function ResourceModal({
  formData,
  isEditing,
  onSubmit,
  onClose,
  onFormChange
}: ResourceModalProps) {
  const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);
  const [urlDebounceTimer, setUrlDebounceTimer] = useState<NodeJS.Timeout | null>(null);
  
  // Auto-fetch metadata when URL changes
  const handleUrlChange = async (url: string) => {
    onFormChange({ ...formData, url });
  
    // Clear previous timer
    if (urlDebounceTimer) clearTimeout(urlDebounceTimer);
  
    // Only fetch if URL is valid and name/description are empty
    if (url && !formData.name && !formData.description) {
      try {
        new URL(url); // Validate URL
      
        // Wait 800ms before fetching
        const timer = setTimeout(async () => {
          setIsFetchingMetadata(true);
          const metadata = await fetchMetadata(url);
        
          if (metadata) {
            onFormChange({
              ...formData,
              url,
              name: metadata.title || formData.name,
              description: metadata.description || formData.description
            });
          }
          setIsFetchingMetadata(false);
        }, 800);
      
        setUrlDebounceTimer(timer);
      } catch (error) {
        // Invalid URL
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm backdrop-grayscale flex items-center justify-center p-4 z-50">
      <div className="bg-white/10 backdrop-blur-2xl  rounded-lg p-6 max-w-md w-full shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-4">
          {isEditing ? 'Edit Resource' : 'Add New Resource'}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm mb-1">URL</label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => handleUrlChange(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="https://example.com"
            />
            <p className="text-xs text-gray-500 mt-1">Paste a URL to auto-fill name & description</p>
          </div>
  
          <div>
            <label className="block text-gray-300 text-sm mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => onFormChange({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="e.g., Firebase Docs"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => onFormChange({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={2}
              placeholder="Brief description..."
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => onFormChange({ ...formData, category: e.target.value as Category })}
              className="w-full px-3 py-2 bg-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => onFormChange({ ...formData, tags: e.target.value })}
              className="w-full px-3 py-2 bg-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="react, typescript, api"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              {isEditing ? 'Update Resource' : 'Add Resource'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}