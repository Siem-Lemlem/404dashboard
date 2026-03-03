/*
 * Copyright (c) 2025 Siem Lemlem
 * This file is part of 404Dashboard.
 * Licensed under the GNU Affero General Public License v3.0 or later.
 * See the LICENSE file for more details.
 */


import { useState, useEffect, useRef } from 'react';
import { LogOut, Download, Upload, Plus, CheckSquare2 } from 'lucide-react';
import toast from 'react-hot-toast';
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
import { User, Resource, ResourceFormData, SampleResource, Collection } from '../types';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { exportAsJSON, exportAsCSV, parseImportFile, validateImportedData } from '../utils/exportImport';
import WelcomeModal from './WelcomeModal';
import SearchBar from './SearchBar';
import ResourceCard from './ResourceCard';
import ResourceModal from './ResourceModal';
import EmptyState from './EmptyState';
import StatsWidget from './StatsWidget';
import BulkActionBar from './BulkActionBar';
import CollectionsPanel from './CollectionsPanel';
import CollectionModal from './CollectionModal';
import AddToCollectionModal from './AddToCollectionModal';
import ColorBends from '../hooks/ColorBends';
import Logo from '../hooks/Logo';
// import { Color } from 'ogl';

interface DashboardProps {
  user: User;
  showWelcome: boolean;
  setShowWelcome: (show: boolean) => void;
}

const sampleResources: SampleResource[] = [
  {
    name: 'MDN Web Docs',
    url: 'https://developer.mozilla.org',
    description: 'Comprehensive web development documentation',
    category: 'Documentation',
    tags: ['html', 'css', 'javascript']
  },
  {
    name: 'Stack Overflow',
    url: 'https://stackoverflow.com',
    description: 'Q&A community for developers',
    category: 'Community',
    tags: ['help', 'community', 'qa']
  },
  {
    name: 'GitHub',
    url: 'https://github.com',
    description: 'Code hosting and version control',
    category: 'Tools',
    tags: ['git', 'version-control', 'collaboration']
  },
  {
    name: 'Tailwind CSS',
    url: 'https://tailwindcss.com',
    description: 'Utility-first CSS framework',
    category: 'UI/UX',
    tags: ['css', 'design', 'framework']
  },
  {
    name: 'Firebase Docs',
    url: 'https://firebase.google.com/docs',
    description: 'Backend-as-a-Service documentation',
    category: 'Backend',
    tags: ['database', 'auth', 'hosting']
  },
  {
    name: 'React Documentation',
    url: 'https://react.dev',
    description: 'Official React documentation',
    category: 'Frontend',
    tags: ['react', 'javascript', 'ui']
  },
  {
    name: 'freeCodeCamp',
    url: 'https://www.freecodecamp.org',
    description: 'Learn to code for free',
    category: 'Learning',
    tags: ['tutorial', 'courses', 'free']
  },
  {
    name: 'JSONPlaceholder',
    url: 'https://jsonplaceholder.typicode.com',
    description: 'Free fake API for testing',
    category: 'APIs',
    tags: ['api', 'testing', 'json']
  }
];

export default function Dashboard({ user, showWelcome, setShowWelcome }: DashboardProps) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('dateDesc');
  const [loading, setLoading] = useState(true);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [formData, setFormData] = useState<ResourceFormData>({
    name: '',
    url: '',
    description: '',
    category: 'Documentation',
    tags: ''
  });
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedResourceIds, setSelectedResourceIds] = useState<string[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [showAddToCollectionModal, setShowAddToCollectionModal] = useState(false);
  const [resourceToAddToCollection, setResourceToAddToCollection] = useState<Resource | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useKeyboardShortcuts([
    {
      key: 'k',
      ctrlKey: true,
      callback: () => {
        searchInputRef.current?.focus();
        toast.success('Search focused! Start typing...', { duration: 1500 });
      }
    },
    {
      key: 'n',
      ctrlKey: true,
      callback: () => {
        if (!showAddModal) {
          setShowAddModal(true);
          toast.success('New resource', { duration: 1500 });
        }
      }
    },
    {
      key: 'Escape',
      callback: () => {
        if (showAddModal) {
          handleCloseModal();
        }
      }
    }
  ]);

  useEffect(() => {
    const resourcesRef = collection(db, 'users', user.uid, 'resources');
    const unsubscribe = onSnapshot(
      resourcesRef,
      (snapshot) => {
        const resourcesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Resource[];
        setResources(resourcesData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching resources:', error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [user.uid]);

  useEffect(() => {
    const collectionRef = collection(db, 'users', user.uid, 'collections');
    const unsubscribe = onSnapshot(
      collectionRef,
      (snapshot) => {
        const collectionsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Collection[];
        setCollections(collectionsData);
      },
      (error) => {
        console.error('Error fetching collections:', error);
      }
    );
    return () => unsubscribe();
  }, [user.uid]);

  const handleCreateCollection = async (data: { name: string; description: string; color: string; icon: string }) => {
    try {
      const collectionsRef = collection(db, 'users', user.uid, 'collections');
      await addDoc(collectionsRef, {
        name: data.name,
        description: data.description,
        color: data.color,
        icon: data.icon,
        resourceIds: [],
        createdAt: serverTimestamp()
      });
      toast.success(`Collection "${data.name}" created! 📁`);
      setShowCollectionModal(false);
    } catch (error) {
      console.error('Error creating collection:', error);
      toast.error('Failed to create collection');
    }
  };

  const handleUpdateCollection = async (data: { name: string; description: string; color: string; icon: string }) => {
    if (!editingCollection) return;
    try {
      const collectionDoc = doc(db, 'users', user.uid, 'collections', editingCollection.id);
      await updateDoc(collectionDoc, {
        name: data.name,
        description: data.description,
        color: data.color,
        icon: data.icon,
        updatedAt: serverTimestamp()
      });
      toast.success('Collection updated!');
      setShowCollectionModal(false);
      setEditingCollection(null);
    } catch (error) {
      console.error('Error updating collection:', error);
      toast.error('Failed to update collection');
    }
  };

  const handleDeleteCollection = async (collectionId: string) => {
    const collectionToDelete = collections.find(c => c.id === collectionId);
    if (!collectionToDelete) return;
    
    const confirmDelete = window.confirm(
      `Delete "${collectionToDelete.name}"? Resources won't be deleted, just removed from this collection.`
    );
    if (!confirmDelete) return;
    
    try {
      const collectionDoc = doc(db, 'users', user.uid, 'collections', collectionId);
      await deleteDoc(collectionDoc);
      
      const resourcesToUpdate = resources.filter(r => r.collectionIds?.includes(collectionId));
      await Promise.all(
        resourcesToUpdate.map(resource => {
          const resourceDoc = doc(db, 'users', user.uid, 'resources', resource.id);
          const updatedCollectionIds = resource.collectionIds?.filter(id => id !== collectionId) || [];
          return updateDoc(resourceDoc, { collectionIds: updatedCollectionIds });
        })
      );
      
      toast.success('Collection deleted');
      if (selectedCollectionId === collectionId) {
        setSelectedCollectionId(null);
      }
    } catch (error) {
      console.error('Error deleting collection:', error);
      toast.error('Failed to delete collection');
    }
  };

  const handleAddResourceToCollection = async (resourceId: string, collectionId: string) => {
    try {
      const collectionToUpdate = collections.find(c => c.id === collectionId);
      if (!collectionToUpdate) return;
      
      const collectionDoc = doc(db, 'users', user.uid, 'collections', collectionId);
      const updatedResourceIds = [...collectionToUpdate.resourceIds, resourceId];
      await updateDoc(collectionDoc, {
        resourceIds: updatedResourceIds,
        updatedAt: serverTimestamp()
      });
      
      const resource = resources.find(r => r.id === resourceId);
      if (resource) {
        const resourceDoc = doc(db, 'users', user.uid, 'resources', resourceId);
        const updatedCollectionIds = [...(resource.collectionIds || []), collectionId];
        await updateDoc(resourceDoc, { collectionIds: updatedCollectionIds });
      }
      
      toast.success(`Added to "${collectionToUpdate.name}"`);
    } catch (error) {
      console.error('Error adding to collection:', error);
      toast.error('Failed to add to collection');
    }
  };

  const handleRemoveResourceFromCollection = async (resourceId: string, collectionId: string) => {
    try {
      const collectionToUpdate = collections.find(c => c.id === collectionId);
      if (!collectionToUpdate) return;
      
      const collectionDoc = doc(db, 'users', user.uid, 'collections', collectionId);
      const updatedResourceIds = collectionToUpdate.resourceIds.filter(id => id !== resourceId);
      await updateDoc(collectionDoc, {
        resourceIds: updatedResourceIds,
        updatedAt: serverTimestamp()
      });
      
      const resource = resources.find(r => r.id === resourceId);
      if (resource) {
        const resourceDoc = doc(db, 'users', user.uid, 'resources', resourceId);
        const updatedCollectionIds = (resource.collectionIds || []).filter(id => id !== collectionId);
        await updateDoc(resourceDoc, { collectionIds: updatedCollectionIds });
      }
      
      toast.success(`Removed from "${collectionToUpdate.name}"`);
    } catch (error) {
      console.error('Error removing from collection:', error);
      toast.error('Failed to remove from collection');
    }
  };
  
  const handleOpenAllResources = (collection: Collection) => {
    if (collection.resourceIds.length === 0) {
      toast.error('This collection is empty');
      return;
    }
    
    const resourcesToOpen = resources.filter(r => collection.resourceIds.includes(r.id));
    
    if (resourcesToOpen.length === 0) {
      toast.error('No resources found in this collection');
      return;
    }
    
    if (resourcesToOpen.length > 10) {
      const confirmOpen = window.confirm(
        `This will open ${resourcesToOpen.length} tabs. Your browser might block some. Continue?`
      );
      if (!confirmOpen) return;
    }

    toast('Opening tabs... Allow popups if prompted', { duration: 3000 });
    
    resourcesToOpen.forEach((resource, index) => {
      setTimeout(() => {
        window.open(resource.url, '_blank', 'noopener,noreferrer');
      }, index * 150);
    });
    
    toast.success(`Opening ${resourcesToOpen.length} resources! 🚀`, { duration: 3000 });
  };

  const handleViewCollection = (collectionId: string) => {
    if (selectedCollectionId === collectionId) {
      setSelectedCollectionId(null);
    } else {
      setSelectedCollectionId(collectionId);
    }
  };

  const handleTakeTour = async () => {
    try {
      const resourcesRef = collection(db, 'users', user.uid, 'resources');
      await Promise.all(
        sampleResources.map(resource =>
          addDoc(resourcesRef, {
            ...resource,
            createdAt: serverTimestamp()
          })
        )
      );
      const userProfileRef = doc(db, 'users', user.uid, 'profile', 'info');
      await updateDoc(userProfileRef, {
        hasCompletedOnboarding: true
      });
      setShowWelcome(false);
      toast.success('Welcome! 8 sample resources added to get you started 🎉');
    } catch (error) {
      console.error('Error adding sample resources:', error);
      toast.error('Failed to add sample resources. Please try again.');
    }
  };

  const handleSkip = async () => {
    try {
      const userProfileRef = doc(db, 'users', user.uid, 'profile', 'info');
      await updateDoc(userProfileRef, {
        hasCompletedOnboarding: true
      });
      setShowWelcome(false);
      toast.success('Welcome to 404Dashboard! 👋');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    }
  };

  const handleEditClick = (resource: Resource) => {
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

  const handleSubmit = async () => {
    if (!formData.name || !formData.url || !formData.description) return;
    try {
      const processedTags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean);

      if (editingResource) {
        const resourceDoc = doc(db, 'users', user.uid, 'resources', editingResource.id);
        await updateDoc(resourceDoc, {
          name: formData.name,
          url: formData.url,
          description: formData.description,
          category: formData.category,
          tags: processedTags,
          updatedAt: serverTimestamp()
        });
        toast.success('Resource updated successfully! ✨');
      } else {
        const resourcesRef = collection(db, 'users', user.uid, 'resources');
        await addDoc(resourcesRef, {
          name: formData.name,
          url: formData.url,
          description: formData.description,
          category: formData.category,
          tags: processedTags,
          createdAt: serverTimestamp()
        });
        toast.success('Resource added successfully! 🎉');
      }

      setFormData({ name: '', url: '', description: '', category: 'Documentation', tags: '' });
      setEditingResource(null);
      setShowAddModal(false);
    } catch (error) {
      console.error('Error saving resource:', error);
      toast.error('Failed to save resource. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const resourceDoc = doc(db, 'users', user.uid, 'resources', id);
      await deleteDoc(resourceDoc);
      toast.success('Resource deleted');
    } catch (error) {
      console.error('Error deleting resource:', error);
      toast.error('Failed to delete resource. Please try again.');
    }
  };

  const handleToggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    setSelectedResourceIds([]);
  };

  const handleToggleResourceSelection = (id: string) => {
    setSelectedResourceIds(prev => 
      prev.includes(id) 
        ? prev.filter(resourceId => resourceId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedResourceIds(sortedAndFilteredResources.map(r => r.id));
  };

  const handleDeselectAll = () => {
    setSelectedResourceIds([]);
  };

  const handleBulkDelete = async () => {
    if (selectedResourceIds.length === 0) return;
    const confirmDelete = window.confirm(
      `Delete ${selectedResourceIds.length} resource${selectedResourceIds.length > 1 ? 's' : ''}? This cannot be undone.`
    );
    if (!confirmDelete) return;
    try {
      await Promise.all(
        selectedResourceIds.map(id => {
          const resourceDoc = doc(db, 'users', user.uid, 'resources', id);
          return deleteDoc(resourceDoc);
        })
      );
      toast.success(`Deleted ${selectedResourceIds.length} resources`);
      setSelectedResourceIds([]);
      setSelectionMode(false);
    } catch (error) {
      console.error('Bulk delete error:', error);
      toast.error('Failed to delete some resources');
    }
  };

  const handleBulkChangeCategory = async (newCategory: string) => {
    if (selectedResourceIds.length === 0) return;
    try {
      await Promise.all(
        selectedResourceIds.map(id => {
          const resourceDoc = doc(db, 'users', user.uid, 'resources', id);
          return updateDoc(resourceDoc, { 
            category: newCategory,
            updatedAt: serverTimestamp()
          });
        })
      );
      toast.success(`Updated ${selectedResourceIds.length} resources to ${newCategory}`);
      setSelectedResourceIds([]);
      setSelectionMode(false);
    } catch (error) {
      console.error('Bulk category change error:', error);
      toast.error('Failed to update some resources');
    }
  };

  const handleBulkAddTags = async (tagsToAdd: string[]) => {
    if (selectedResourceIds.length === 0 || tagsToAdd.length === 0) return;
    try {
      const resourcesToUpdate = resources.filter(r => selectedResourceIds.includes(r.id));
      await Promise.all(
        resourcesToUpdate.map(resource => {
          const resourceDoc = doc(db, 'users', user.uid, 'resources', resource.id);
          const mergedTags = Array.from(new Set([...resource.tags, ...tagsToAdd]));
          return updateDoc(resourceDoc, { 
            tags: mergedTags,
            updatedAt: serverTimestamp()
          });
        })
      );
      toast.success(`Added tags to ${selectedResourceIds.length} resources`);
      setSelectedResourceIds([]);
      setSelectionMode(false);
    } catch (error) {
      console.error('Bulk add tags error:', error);
      toast.error('Failed to add tags to some resources');
    }
  };

  const handleBulkExportSelected = () => {
    if (selectedResourceIds.length === 0) return;
    const selectedResources = resources.filter(r => selectedResourceIds.includes(r.id));
    exportAsJSON(selectedResources, `404dashboard-selected-${selectedResourceIds.length}.json`);
    toast.success(`Exported ${selectedResourceIds.length} resources`);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out', error);
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingResource(null);
    setFormData({ name: '', url: '', description: '', category: 'Documentation', tags: '' });
  };

  const handleExport = (format: 'json' | 'csv') => {
    if (resources.length === 0) {
      toast.error('No resources to export');
      return;
    }
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `404dashboard-${timestamp}`;
    if (format === 'json') {
      exportAsJSON(resources, `${filename}.json`);
      toast.success(`Exported ${resources.length} resources as JSON`);
    } else {
      exportAsCSV(resources, `${filename}.csv`);
      toast.success(`Exported ${resources.length} resources as CSV`);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    try {
      const data = await parseImportFile(file);
      const validation = validateImportedData(data);
      if (!validation.valid) {
        toast.error(validation.error || 'Invalid file format');
        return;
      }
      const resourcesRef = collection(db, 'users', user.uid, 'resources');
      let successCount = 0;
      await Promise.all(
        data.map(async (resource: any) => {
          try {
            await addDoc(resourcesRef, {
              name: resource.name,
              url: resource.url,
              description: resource.description,
              category: resource.category,
              tags: resource.tags,
              createdAt: serverTimestamp()
            });
            successCount++;
          } catch (error) {
            console.error('Error importing resource:', error);
          }
        })
      );
      toast.success(`Successfully imported ${successCount} resources! 🎉`);
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import file. Please check the format.');
    }
  };

  const handleTogglePin = async (resource: Resource) => {
    try {
      const resourceDoc = doc(db, 'users', user.uid, 'resources', resource.id);
      const newPinnedState = !resource.pinned;
      await updateDoc(resourceDoc, {
        pinned: newPinnedState,
        updatedAt: serverTimestamp()
      });
      toast.success(
        newPinnedState ? '⭐ Pinned to top!' : 'Unpinned',
        { duration: 2000 }
      );
    } catch (error) {
      console.error('Error toggling pin:', error);
      toast.error('Failed to update pin status');
    }
  };

  const handleAccessResource = async (resourceId: string) => {
    try {
      const resourceDoc = doc(db, 'users', user.uid, 'resources', resourceId);
      await updateDoc(resourceDoc, {
        lastAccessedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error tracking access:', error);
    }
  };

  const sortResources = (resources: Resource[]): Resource[] => {
    const sorted = [...resources];
    const pinned = sorted.filter(r => r.pinned);
    const unpinned = sorted.filter(r => !r.pinned);

    const sortFn = (a: Resource, b: Resource) => {
      switch (sortBy) {
        case 'nameAsc':
          return a.name.localeCompare(b.name);
        case 'nameDesc':
          return b.name.localeCompare(a.name);
        case 'dateAsc':
          return (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0);
        case 'dateDesc':
          return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
        case 'recentlyAccessed':
          return (b.lastAccessedAt?.seconds || 0) - (a.lastAccessedAt?.seconds || 0);
        default:
          return 0;
      }
    };

    return [...pinned.sort(sortFn), ...unpinned.sort(sortFn)];
  };

  const filteredResources = resources.filter(resource => {
    if (selectedCollectionId) {
      const selectedCollection = collections.find(c => c.id === selectedCollectionId);
      if (selectedCollection && !selectedCollection.resourceIds.includes(resource.id)) {
        return false;
      }
    }
    const matchesSearch =
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory;
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => resource.tags.includes(tag));
    return matchesSearch && matchesCategory && matchesTags;
  });

  const sortedAndFilteredResources = sortResources(filteredResources);
  const allTags = Array.from(new Set(resources.flatMap(r => r.tags))).sort();

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading your resources...</div>
      </div>
    );
  }

  const getBentoSize = (resource: Resource) => {
    if (resource.pinned) {
      return "col-span-1 md:col-span-2 lg:col-span-3 row-span-2";
    }
    const lastAccessed = resource.lastAccessedAt?.seconds
      ? Date.now() / 1000 - resource.lastAccessedAt.seconds
      : Infinity;
    if (lastAccessed < 60 * 60 * 24 * 2) {
      return "col-span-1 md:col-span-2 row-span-2";
    }
    return "col-span-1 md:col-span-2 row-span-1";
  };

  return (
    <div className="min-h-screen bg-zinc-900 relative overflow-hidden">
      <div className="fixed inset-0" style={{ zIndex: -1 }}>
        <ColorBends 
          colors={["#ff0000", "#0000ff"]}
          rotation={45}
          speed={0.3}
          scale={1.5}
          frequency={1.2}
          warpStrength={0.8}
          mouseInfluence={0.5}
          parallax={0.3}
          noise={0}
          transparent
          autoRotate={5}
        />
      </div>
      <div className="max-w-7xl mx-auto p-6 relative z-10">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 border-2 border-purple-500/40 flex items-center justify-center">
              <span className="text-xl font-bold text-purple-300">
                {user.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Welcome back, {user.email?.split('@')[0].charAt(0).toUpperCase() + user.email?.split('@')[0].slice(1)}!
              </h1>
              <p className="text-sm text-gray-400">{user.email}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Logo />
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap"
              title="Add resource (Ctrl/⌘ + N)"
            >
              <Plus className="w-5 h-5" />
              Add Resource
            </button>

            <button
              onClick={handleToggleSelectionMode}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap ${
                selectionMode
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-zinc-800/40 hover:bg-zinc-800/60 text-white border border-purple-500/20'
              }`}
            >
              <CheckSquare2 className="w-5 h-5" />
              {selectionMode ? 'Done' : 'Select'}
            </button>
          </div>
          
          <div className="flex gap-2">
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2 bg-zinc-800/40 backdrop-blur-sm hover:bg-zinc-800/60 text-white rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all">
                <Download className="w-4 h-4" />
                Export
              </button>
              <div className="hidden group-hover:block absolute right-0 top-full h-2 w-40" />
              <div className="hidden group-hover:block absolute right-0 top-full mt-2 w-40 bg-zinc-800/90 backdrop-blur-xl rounded-lg shadow-xl border border-purple-500/20 overflow-hidden z-10">
                <button
                  onClick={() => handleExport('json')}
                  className="w-full px-4 py-2 text-left text-white hover:bg-purple-500/10 transition-colors"
                >
                  Export as JSON
                </button>
                <button
                  onClick={() => handleExport('csv')}
                  className="w-full px-4 py-2 text-left text-white hover:bg-purple-500/10 transition-colors"
                >
                  Export as CSV
                </button>
              </div>
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800/40 backdrop-blur-sm hover:bg-zinc-800/60 text-white rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all"
            >
              <Upload className="w-4 h-4" />
              Import
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800/40 backdrop-blur-sm hover:bg-zinc-800/60 text-white rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        <StatsWidget resources={resources} />
        
        <p className="text-xs text-gray-400 mb-4">
          ⚠️ Your browser may block multiple tabs. Click "Allow" in the address bar.
        </p>

        <CollectionsPanel
          collections={collections}
          onCreateCollection={() => setShowCollectionModal(true)}
          onEditCollection={(collection) => {
            setEditingCollection(collection);
            setShowCollectionModal(true);
          }}
          onDeleteCollection={handleDeleteCollection}
          onViewCollection={handleViewCollection}
          onOpenAllResources={handleOpenAllResources}
          selectedCollectionId={selectedCollectionId}
        />

        <SearchBar
          ref={searchInputRef}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
          allTags={allTags}
          onAddClick={() => setShowAddModal(true)}
        />

        {/* BENTO GRID RESOURCES */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 auto-rows-[200px] gap-4">
          {sortedAndFilteredResources.map((resource) => (
            <div 
              key={resource.id} 
              className={`${getBentoSize(resource)} h-full`}
            >
              <ResourceCard
                resource={resource}
                onEdit={handleEditClick}
                onDelete={handleDelete}
                onTogglePin={handleTogglePin}
                onAddToCollection={(resource) => {
                  setResourceToAddToCollection(resource);
                  setShowAddToCollectionModal(true);
                }}
                collections={collections}
                selectionMode={selectionMode}
                isSelected={selectedResourceIds.includes(resource.id)}
                onToggleSelection={handleToggleResourceSelection}
                onRemoveFromCollection={handleRemoveResourceFromCollection}
                onAccessResource={handleAccessResource}
              />
            </div>
          ))}
        </div>

        {sortedAndFilteredResources.length === 0 && (
          <EmptyState hasResources={resources.length > 0} />
        )}

        {selectionMode && selectedResourceIds.length > 0 && (
          <BulkActionBar
            selectedCount={selectedResourceIds.length}
            onDelete={handleBulkDelete}
            onChangeCategory={handleBulkChangeCategory}
            onAddTags={handleBulkAddTags}
            onExport={handleBulkExportSelected}
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
            onCancel={() => {
              setSelectionMode(false);
              setSelectedResourceIds([]);
            }}
          />
        )}

        {showWelcome && (
          <WelcomeModal
            user={user}
            onTakeTour={handleTakeTour}
            onSkip={handleSkip}
          />
        )}

        {showAddModal && (
          <ResourceModal
            formData={formData}
            isEditing={!!editingResource}
            onSubmit={handleSubmit}
            onClose={handleCloseModal}
            onFormChange={setFormData}
          />
        )}

        {showCollectionModal && (
          <CollectionModal
            collection={editingCollection}
            onSave={editingCollection ? handleUpdateCollection : handleCreateCollection}
            onClose={() => {
              setShowCollectionModal(false);
              setEditingCollection(null);
            }}
          />
        )}

        {showAddToCollectionModal && resourceToAddToCollection && (
          <AddToCollectionModal
            resource={resourceToAddToCollection}
            collections={collections}
            onAddToCollection={handleAddResourceToCollection}
            onRemoveFromCollection={handleRemoveResourceFromCollection}
            onClose={() => {
              setShowAddToCollectionModal(false);
              setResourceToAddToCollection(null);
            }}
          />
        )}
      </div>
    </div>
  );
}