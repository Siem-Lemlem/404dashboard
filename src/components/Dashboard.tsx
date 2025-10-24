import { useState, useEffect, useRef } from 'react';
import { LogOut, Download, Upload } from 'lucide-react';
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
import { User, Resource, ResourceFormData, SampleResource } from '../types';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { exportAsJSON, exportAsCSV, parseImportFile, validateImportedData } from '../utils/exportImport';
import WelcomeModal from './WelcomeModal';
import SearchBar from './SearchBar';
import ResourceCard from './ResourceCard';
import ResourceModal from './ResourceModal';
import EmptyState from './EmptyState';

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

  // Ref for search input to focus it
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Ref for file input (hidden)
  const fileInputRef = useRef<HTMLInputElement>(null);

  // KEYBOARD SHORTCUTS
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

  // FIRESTORE REALTIME LISTENER
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

  // HANDLE TAKE TOUR
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
      toast.success('Welcome! 8 sample resources added to get you started');
    } catch (error) {
      console.error('Error adding sample resources:', error);
      toast.error('Failed to add sample resources. Please try again.');
    }
  };

  // HANDLE SKIP
  const handleSkip = async () => {
    try {
      const userProfileRef = doc(db, 'users', user.uid, 'profile', 'info');
      await updateDoc(userProfileRef, {
        hasCompletedOnboarding: true
      });

      setShowWelcome(false);
      toast.success('Welcome to 404Dashboard!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    }
  };

  // HANDLE EDIT CLICK
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

  // HANDLE SUBMIT (ADD OR EDIT)
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
        toast.success('Resource updated successfully!');
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
        toast.success('Resource added successfully!');
      }

      setFormData({ name: '', url: '', description: '', category: 'Documentation', tags: '' });
      setEditingResource(null);
      setShowAddModal(false);
    } catch (error) {
      console.error('Error saving resource:', error);
      toast.error('Failed to save resource. Please try again.');
    }
  };

  // HANDLE DELETE
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

  // HANDLE EXPORT
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

  // HANDLE IMPORT
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset file input so same file can be imported again
    e.target.value = '';

    try {
      const data = await parseImportFile(file);
      const validation = validateImportedData(data);

      if (!validation.valid) {
        toast.error(validation.error || 'Invalid file format');
        return;
      }

      // Add imported resources to Firestore
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

      toast.success(`Successfully imported ${successCount} resources!`);
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import file. Please check the format.');
    }
  };

  // SORTING LOGIC
  const sortResources = (resources: Resource[]): Resource[] => {
    const sorted = [...resources];

    switch (sortBy) {
      case 'nameAsc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'nameDesc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'dateAsc':
        return sorted.sort((a, b) => 
          (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0)
        );
      case 'dateDesc':
        return sorted.sort((a, b) => 
          (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
        );
      case 'category':
        return sorted.sort((a, b) => a.category.localeCompare(b.category));
      default:
        return sorted;
    }
  };

  // FILTERING LOGIC
  const filteredResources = resources.filter(resource => {
    const matchesSearch =
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // APPLY SORTING TO FILTERED RESOURCES
  const sortedAndFilteredResources = sortResources(filteredResources);

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
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">404Dashboard</h1>
            <p className="text-gray-300">Welcome back, {user.email}</p>
          </div>
          <div className="flex gap-2">
            {/* Export Dropdown */}
            <div className="relative group">
              <button
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <div className="hidden group-hover:block absolute right-0 mt-1 w-40 bg-slate-800 rounded-lg shadow-xl border border-white/20 overflow-hidden z-10">
                <button
                  onClick={() => handleExport('json')}
                  className="w-full px-4 py-2 text-left text-white hover:bg-white/10 transition-colors"
                >
                  Export as JSON
                </button>
                <button
                  onClick={() => handleExport('csv')}
                  className="w-full px-4 py-2 text-left text-white hover:bg-white/10 transition-colors"
                >
                  Export as CSV
                </button>
              </div>
            </div>

            {/* Import Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Import
            </button>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Search Bar with Sorting */}
        <SearchBar
          ref={searchInputRef}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onAddClick={() => setShowAddModal(true)}
        />

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedAndFilteredResources.map(resource => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onEdit={handleEditClick}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {/* Empty State */}
        {sortedAndFilteredResources.length === 0 && (
          <EmptyState hasResources={resources.length > 0} />
        )}

        {/* Welcome Modal */}
        {showWelcome && (
          <WelcomeModal
            user={user}
            onTakeTour={handleTakeTour}
            onSkip={handleSkip}
          />
        )}

        {/* Add/Edit Resource Modal */}
        {showAddModal && (
          <ResourceModal
            formData={formData}
            isEditing={!!editingResource}
            onSubmit={handleSubmit}
            onClose={handleCloseModal}
            onFormChange={setFormData}
          />
        )}
      </div>
    </div>
  );
}