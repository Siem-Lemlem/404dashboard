import { BookmarkPlus } from "lucide-react";

interface EmptyStateProps {
  hasResources: boolean;
}

export default function EmptyState({ hasResources }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <BookmarkPlus className="w-16 h-16 text-gray-500 mx-auto mb-4" />
      <p className="text-gray-400 text-lg">No resources found</p>
      <p className="text-gray-500 text-sm">
        {hasResources
          ? "Try adjusting your search or filter"
          : "Click 'Add Resource' to get started!"}
      </p>
    </div>
  );
}