import { Check } from 'lucide-react';
import { Collection, Resource } from '../types';

interface AddToCollectionModalProps {
  resource: Resource;
  collections: Collection[];
  onAddToCollection: (resourceId: string, collectionId: string) => void;
  onRemoveFromCollection: (resourceId: string, collectionId: string) => void;
  onClose: () => void;
}

export default function AddToCollectionModal({
  resource,
  collections,
  onAddToCollection,
  onRemoveFromCollection,
  onClose
}: AddToCollectionModalProps) {
  const isInCollection = (collectionId: string) => {
    return resource.collectionIds?.includes(collectionId) || false;
  };

  const handleToggle = (collectionId: string) => {
    console.log('Before toggle:', {
      collectionId,
      isIn: isInCollection(collectionId),
      resourceCollectionIds: resource.collectionIds
    });

    if (isInCollection(collectionId)) {
      onRemoveFromCollection(resource.id, collectionId);
    } else {
      onAddToCollection(resource.id, collectionId);
    }

    console.log('After toggle - should update');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-800 rounded-lg p-6 max-w-md w-full shadow-2xl border border-purple-500/20">
        <h2 className="text-2xl font-bold text-white mb-2">Add to Collection</h2>
        <p className="text-gray-400 text-sm mb-4">{resource.name}</p>
        
        {collections.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>No collections yet. Create one first!</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {collections.map(collection => {
              const inCollection = isInCollection(collection.id);
              return (
                <button
                  key={collection.id}
                  onClick={() => handleToggle(collection.id)}
                  className={`w-full p-3 rounded-lg border transition-all text-left flex items-center gap-3 ${
                    inCollection
                      ? 'bg-purple-500/20 border-purple-500/50'
                      : 'bg-zinc-900/50 border-zinc-700/50 hover:border-purple-500/30'
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
                    style={{ backgroundColor: `var(--${collection.color}-500, #a855f7)40` }}
                  >
                    {collection.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">{collection.name}</div>
                    <div className="text-xs text-gray-400">
                      {collection.resourceIds.length} resource{collection.resourceIds.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                  {inCollection && (
                    <Check className="w-5 h-5 text-purple-400" />
                  )}
                </button>
              );
            })}
          </div>
        )}
        
        <button
          onClick={onClose}
          className="w-full mt-4 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
}