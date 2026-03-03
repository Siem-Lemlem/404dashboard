import { useState } from 'react';
import { Collection, COLLECTION_COLORS } from '../types';

interface CollectionModalProps {
  collection?: Collection; // If editing, pass existing collection
  onSave: (data: { name: string; description: string; color: string; icon: string }) => void;
  onClose: () => void;
}

const ICON_OPTIONS = ['📁', '🚀', '💼', '🎨', '⚙️', '📚', '🔨', '🎯', '💡', '🌟', '🔥', '⚡'];

export default function CollectionModal({ collection, onSave, onClose }: CollectionModalProps) {
  const [name, setName] = useState(collection?.name || '');
  const [description, setDescription] = useState(collection?.description || '');
  const [color, setColor] = useState(collection?.color || 'purple');
  const [icon, setIcon] = useState(collection?.icon || '📁');

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSave({ name, description, color, icon });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-800 rounded-lg p-6 max-w-md w-full shadow-2xl border border-purple-500/20">
        <h2 className="text-2xl font-bold text-white mb-4">
          {collection ? 'Edit Collection' : 'Create Collection'}
        </h2>
        
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-gray-300 text-sm mb-1">Collection Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="e.g., Frontend Dev Toolkit"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-300 text-sm mb-1">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={2}
              placeholder="What's this collection for?"
            />
          </div>

          {/* Icon picker */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">Icon</label>
            <div className="grid grid-cols-6 gap-2">
              {ICON_OPTIONS.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => setIcon(emoji)}
                  className={`p-3 text-2xl rounded-lg transition-all ${
                    icon === emoji
                      ? 'bg-purple-500 scale-110'
                      : 'bg-zinc-700/50 hover:bg-zinc-700'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Color picker */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">Color</label>
            <div className="grid grid-cols-4 gap-2">
              {COLLECTION_COLORS.map(c => (
                <button
                  key={c.value}
                  onClick={() => setColor(c.value)}
                  className={`px-4 py-2 rounded-lg text-white font-medium transition-all ${
                    c.class
                  } ${
                    color === c.value ? 'ring-2 ring-white scale-105' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!name.trim()}
              className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {collection ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}