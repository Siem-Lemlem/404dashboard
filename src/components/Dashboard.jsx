import React, { useState, useEffect } from 'react';
import { Plus, ExternalLink, Trash2, Search, BookmarkPlus, LogOut, Edit } from 'lucide-react';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../firebase';

export default function Dashboard({ user }) {
  // RESOURCES STATE
  const [resources, setResources] = useState([]);

  // UI STATE
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  // EDIT STATE
  const [editingResource, setEditingResource] = useState(null);

  // FORM STATE
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    description: '',
    category: 'Documentation',
    tags: ''
  });

  const categories = ['All', 'Documentation', 'Tools', 'UI/UX', 'Backend', 'Frontend', 'Community', 'Learning', 'APIs'];

  // FIRESTORE REALTIME LISTENER
  useEffect(() => {
    const resourcesRef = collection(db, 'users', user.uid, 'resources');

    const unsubscribe = onSnapshot(resourcesRef, (snapshot) => {
      const resourcesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setResources(resourcesData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching resources:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user.uid]);

  // HANDLE EDIT CLICK
  const handleEditClick = (resource) => {
    setFormData({
      name: resource.name,
      url: resource.url,
      description: resource.description,
      category: resource.category,
      tags: resource.tags.join(', ')
    });
    setEditingResource(resource);
    setShowAddModal(true);
  };

  // HANDLE SUBMIT (ADD OR EDIT)
  const handleSubmit = async () => {
    // Validation
    if (!formData.name || !formData.url || !formData.description) return;

    try {
      // Process tags
      const processedTags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean);

      if (editingResource) {
        // EDIT MODE
        const resourceDoc = doc(db, 'users', user.uid, 'resources', editingResource.id);
        await updateDoc(resourceDoc, {
          name: formData.name,
          url: formData.url,
          description: formData.description,
          category: formData.category,
          tags: processedTags,
          updatedAt: serverTimestamp()
        });
      } else {
        // ADD MODE
        const resourcesRef = collection(db, 'users', user.uid, 'resources');
        await addDoc(resourcesRef, {
          name: formData.name,
          url: formData.url,
          description: formData.description,
          category: formData.category,
          tags: processedTags,
          createdAt: serverTimestamp()
        });
      }

      // Reset everything
      setFormData({ name: '', url: '', description: '', category: 'Documentation', tags: '' });
      setEditingResource(null);
      setShowAddModal(false);

    } catch (error) {
      console.error('Error saving resource:', error);
      alert('Failed to save resource. Please try again.');
    }
  };

  // HANDLE DELETE
  const handleDelete = async (id) => {
    try {
      const resourceDoc = doc(db, 'users', user.uid, 'resources', id);
      await deleteDoc(resourceDoc);
    } catch (error) {
      console.error('Error deleting resource:', error);
      alert('Failed to delete resource. Please try again.');
    }
  };

  // HANDLE LOGOUT
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out', error);
    }
  };

  // HANDLE MODAL CLOSE
  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingResource(null);
    setFormData({ name: '', url: '', description: '', category: 'Documentation', tags: '' });
  };

  // FILTERING LOGIC
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // CATEGORY COLOR HELPER
  const getCategoryColor = (category) => {
    const colors = {
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

  // LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading your resources...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header with User Info */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">404Dashboard</h1>
            <p className="text-gray-300">Welcome back, {user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 mb-6 shadow-xl">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat} className="bg-slate-900">{cat}</option>
                ))}
              </select>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Resource
              </button>
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map(resource => (
            <div
              key={resource.id}
              className="bg-white/10 backdrop-blur-lg rounded-lg p-5 shadow-xl border border-white/20 hover:border-purple-500 transition-all hover:transform hover:scale-105"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-1">{resource.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(resource.category)}`}>
                    {resource.category}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(resource)}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(resource.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
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
          ))}
        </div>

        {/* Empty State */}
        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <BookmarkPlus className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No resources found</p>
            <p className="text-gray-500 text-sm">
              {resources.length === 0 
                ? "Click 'Add Resource' to get started!" 
                : "Try adjusting your search or filter"}
            </p>
          </div>
        )}

        {/* Add/Edit Resource Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-4">
                {editingResource ? 'Edit Resource' : 'Add New Resource'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., Firebase Docs"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-1">URL</label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({...formData, url: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows="2"
                    placeholder="Brief description..."
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {categories.slice(1).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="react, typescript, api"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
                  >
                    {editingResource ? 'Update Resource' : 'Add Resource'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}