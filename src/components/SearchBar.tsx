import { forwardRef } from 'react';
import { Search, Plus } from 'lucide-react';
import { Category } from '../types';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onAddClick: () => void;
}

const categories = ['All', 'Documentation', 'Tools', 'UI/UX', 'Backend', 'Frontend', 'Community', 'Learning', 'APIs'];

const sortOptions = [
  { value: 'dateDesc', label: 'Newest First' },
  { value: 'dateAsc', label: 'Oldest First' },
  { value: 'nameAsc', label: 'Name (A-Z)' },
  { value: 'nameDesc', label: 'Name (Z-A)' },
  { value: 'category', label: 'Category' }
];

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  onAddClick
}, ref) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 mb-6 shadow-xl">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            ref={ref}
            type="text"
            placeholder="Search resources... (Ctrl/⌘ + K)"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat} className="bg-slate-900">{cat}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value} className="bg-slate-900">
                {opt.label}
              </option>
            ))}
          </select>
          <button
            onClick={onAddClick}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap"
            title="Add Resource (Ctrl/⌘ + N)"
          >
            <Plus className="w-5 h-5" />
            Add Resource
          </button>
        </div>
      </div>
    </div>
  );
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;