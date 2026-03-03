import { useState } from "react";
import { FolderOpen, Plus, Edit, Trash2, ExternalLink, Eye, ChevronRight } from 'lucide-react';
import { Collection } from '../types';

interface CollectionsPanelProps {
  collections: Collection[];
  onCreateCollection: () => void;
  onEditCollection: (collection: Collection) => void;
  onDeleteCollection: (CollectionId: string) => void;
  onViewCollection: (CollectionId: string) => void;
  onOpenAllResources: (Collection: Collection) => void;
  selectedCollectionId?: string;
}

export default function CollectionsPanel({
  collections,
  onCreateCollection,
  onEditCollection,
  onDeleteCollection,
  onViewCollection,
  onOpenAllResources,
  selectedCollectionId
}: CollectionsPanelProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getColorClass = (color?: string) => {
    const colorMap: Record<string, string> = {
      purple: 'bg-purple-500',
      blue: 'bg-blue-500',
      orange: 'bg-orange-500',
      pink: 'bg-pink-500',
      teal: 'bg-teal-500',
      red: 'bg-red-500',
      yellow: 'bg-yellow-500',
      green: 'bg-green-500',
    };
    return colorMap[color || 'purple'] || 'bg-purple-500';
  };

  return (
    <div className="bg-zinc-800/40 backdrop-blur-xl rounded-lg p-4 m-4 shadow-xl border border-purple-500/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FolderOpen className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-bold text-white">Collections</h2>
        </div>
        <button
          onClick={onCreateCollection}
          className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          title="Create new collection"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {collections.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm mb-2">No collections yet</p>
          <button
            onClick={onCreateCollection}
            className="text-purple-400 hover:text-purple-300 text-sm"
          >
            Create your first collection
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {collections.map(collection => (
            <div
              key={collection.id}
              className={`rounded-lg border transition-all ${
                selectedCollectionId === collection.id
                  ? 'bg-purple-500/20 border-purple-500/50'
                  : 'bg-zinc-900/50 border-zinc-700/50 hover:border-purple-500/30'
              }`}
            >
              <div className="p-3 flex items-center gap-3">
                {/* Color indicator */}
                <div className={`w-3 h-3 rounded-full ${getColorClass(collection.color)}`} />
                
                {/* Collection info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-medium truncate">
                      {collection.icon && <span className="mr-1">{collection.icon}</span>}
                      {collection.name}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-400">
                    {collection.resourceIds.length} resource{collection.resourceIds.length !== 1 ? 's' : ''}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onViewCollection(collection.id)}
                    className="p-2 text-gray-400 hover:text-purple-400 transition-colors"
                    title="View collection"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onOpenAllResources(collection)}
                    disabled={collection.resourceIds.length === 0}
                    className={`p-2 transition-colors ${
                      collection.resourceIds.length === 0
                        ? 'text-gray-600 cursor-not-allowed'
                        : 'text-green-400 hover:text-green-300'
                    }`}
                    title="Open all resources"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setExpandedId(expandedId === collection.id ? null : collection.id)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <ChevronRight className={`w-4 h-4 transition-transform ${expandedId === collection.id ? 'rotate-90' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Expanded actions */}
              {expandedId === collection.id && (
                <div className="px-3 pb-3 border-t border-zinc-700/50 pt-3 flex gap-2">
                  <button
                    onClick={() => onEditCollection(collection)}
                    className="flex-1 px-3 py-2 bg-zinc-800/60 hover:bg-zinc-700/60 text-white rounded text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <Edit className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteCollection(collection.id)}
                    className="flex-1 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}