import { ExternalLink, Trash2, Edit, FolderOpen, Star } from "lucide-react";
import { Resource, Category, Collection } from "../types";
import { motion } from "framer-motion";

interface ResourceCardProps {
  resource: Resource;
  onEdit: (resource: Resource) => void;
  onDelete: (id: string) => void;
  onAddToCollection?: (resource: Resource) => void;
  collections?: Collection[];
  selectionMode?: boolean;
  isSelected?: boolean;
  onToggleSelection?: (id: string) => void;
  onTogglePin?: (resource: Resource) => void;
  onRemoveFromCollection?: (resourceId: string, collectionId: string) => void;
  onAccessResource?: (resourceId: string) => void;
  index?: number;
}

const getCategoryColor = (category: Category): string => {
  const colors: Record<Category, string> = {
    Documentation: "bg-blue-500/10 text-blue-400",
    Tools: "bg-purple-500/10 text-purple-400",
    "UI/UX": "bg-pink-500/10 text-pink-400",
    Backend: "bg-green-500/10 text-green-400",
    Frontend: "bg-orange-500/10 text-orange-400",
    Community: "bg-yellow-500/10 text-yellow-400",
    Learning: "bg-indigo-500/10 text-indigo-400",
    APIs: "bg-red-500/10 text-red-400",
  };
  return colors[category] || "bg-gray-100 text-gray-700";
};

export default function ResourceCard({
  resource,
  onEdit,
  onDelete,
  onAddToCollection,
  collections,
  selectionMode = false,
  isSelected = false,
  onToggleSelection,
  onTogglePin,
  onRemoveFromCollection,
  onAccessResource,
  index = 0,
}: ResourceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 1, delay: (index ?? 0) * 0.2, type: "spring", stiffness: 300, damping: 20 }}
      className="h-full"
    >
          <div
            className={`flex flex-col h-full bg-zinc-800/70 hover:bg-zinc-800 backdrop-blur-md rounded-lg p-4 shadow-md hover:shadow-lg border border-zinc-700/60 transition-all ${
              isSelected
                ? "border-purple-500 ring-2 ring-purple-500/50"
                : "border-purple-500/20"
            }`}
            onClick={() => selectionMode && onToggleSelection?.(resource.id)}
            style={{ cursor: selectionMode ? "pointer" : "default" }}
          >
            <div className="flex justify-between items-start mb-3">
              {selectionMode && (
                <div className="mr-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelection?.(resource.id)}
                    className="w-5 h-5 rounded border-purple-500/50 bg-zinc-700 text-purple-500 focus:ring-2 focus:ring-purple-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}

              <div className="flex-1">
                <h3 className="text-lg font-medium text-white mb-2 tracking-tight">
                  {resource.name}
                </h3>
                <span
                  className={`px-2 py-1 rounded-full bg-opacity-20 text-opacity-90 font-medium tracking-wide ${getCategoryColor(
                    resource.category
                  )}`}
                >
                  {resource.category}
                </span>
              </div>

              {!selectionMode && (
                <div className="flex gap-2">
                  {onTogglePin && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onTogglePin(resource);
                      }}
                      className={`transition-colors ${
                        resource.pinned
                          ? "text-yellow-400 hover:text-yellow-300"
                          : "text-gray-400 hover:text-yellow-400"
                      }`}
                      aria-label={resource.pinned ? "unpin" : "Pin to top"}
                      title={resource.pinned ? "Unpin from top" : "Pin to top"}
                    >
                      <Star
                        className={`w-4 h-4 ${
                          resource.pinned ? "fill-current" : ""
                        }`}
                      />
                    </button>
                  )}
                  {onAddToCollection && (
                    <button
                      onClick={() => onAddToCollection(resource)}
                      className="text-gray-400 hover:text-purple-400 transition-colors"
                      aria-label="Add to collection"
                      title="Add to collection"
                    >
                      <FolderOpen className="w-4 h-4" />
                    </button>
                  )}

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
              )}
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-3 line-clamp-2">
              {resource.description}
            </p>

            <div className="flex flex-wrap gap-1 mb-3">
              {resource.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2 py-1 bg-white/10 text-gray-300 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {resource.collectionIds && resource.collectionIds.length > 0 && collections && (
              <div className="flex flex-wrap gap-1 mb-3">
                {resource.collectionIds.map((collectionId) => {
                  const collection = collections.find((c) => c.id === collectionId);
                  if (!collection) return null;
                  return (
                    <span
                      key={collectionId}
                      className="text-xs px-2 py-1 rounded-full border flex items-center gap-1 group relative"
                      style={{
                        backgroundColor: `${collection.color}20`,
                        borderColor: `${collection.color}40`,
                        color: collection.color,
                      }}
                    >
                      {collection.icon && <span>{collection.icon}</span>}
                      {collection.name}

                      {!selectionMode && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveFromCollection?.(resource.id, collectionId);
                          }}
                          className="ml-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400"
                        >
                          ×
                        </button>
                      )}
                    </span>
                  );
                })}
              </div>
            )}

            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
              onClick={(e) => {
                if (selectionMode) {
                  e.preventDefault();
                } else {
                  onAccessResource?.(resource.id);
                }
              }}
            >
              <ExternalLink className="w-4 h-4" />
              <span className="text-sm truncate">{resource.url}</span>
            </a>
          </div>
    </motion.div>
  );
}
