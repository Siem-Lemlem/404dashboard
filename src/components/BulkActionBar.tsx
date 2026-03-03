import { Trash2, FolderOpen, Tag, Download, X, CheckSquare } from 'lucide-react';
import { Category } from '../types';

interface BulkActionBarProps {
  selectedCount: number;
  onDelete: () => void;
  onChangeCategory: (category: Category) => void;
  onAddTags: () => void;
  onExport: () => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onCancel: () => void;
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

export default function BulkActionBar({
  selectedCount,
  onDelete,
  onChangeCategory,
  onAddTags,
  onExport,
  onSelectAll,
  onDeselectAll,
  onCancel
}: BulkActionBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-xl border-t border-purple-500/30 shadow-2xl z-40 animate-slide-up">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Selection info */}
          <div className="flex items-center gap-4">
            <div className="text-white font-semibold">
              {selectedCount} selected
            </div>
            <div className="flex gap-2">
              <button
                onClick={onSelectAll}
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                Select All
              </button>
              <span className="text-gray-600">|</span>
              <button
                onClick={onDeselectAll}
                className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
              >
                Deselect All
              </button>
            </div>
          </div>

          {/* Center: Actions */}
          <div className="flex items-center gap-2">
            {/* Delete */}
            <button
              onClick={onDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg border border-red-500/30 transition-colors"
              title="Delete selected"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Delete</span>
            </button>

            {/* Change Category Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2 bg-zinc-800/60 hover:bg-zinc-700/60 text-white rounded-lg border border-purple-500/20 transition-colors">
                <FolderOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Category</span>
              </button>
              <div className="hidden group-hover:block absolute bottom-full mb-2 right-0 w-48 bg-zinc-800/95 backdrop-blur-xl rounded-lg shadow-xl border border-purple-500/20 overflow-hidden">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => onChangeCategory(cat)}
                    className="w-full px-4 py-2 text-left text-white hover:bg-purple-500/10 transition-colors"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Export */}
            <button
              onClick={onExport}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800/60 hover:bg-zinc-700/60 text-white rounded-lg border border-purple-500/20 transition-colors"
              title="Export selected"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>

          {/* Right: Cancel */}
          <button
            onClick={onCancel}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800/60 hover:bg-zinc-700/60 text-gray-300 rounded-lg border border-zinc-700 transition-colors"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}