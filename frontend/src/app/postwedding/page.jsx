'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Camera, Image as ImageIcon, X, Loader2, ChevronLeft, ChevronRight, 
  Heart, Upload, Search, Tag, Plus, Trash2, Sparkles
} from 'lucide-react';
import { BotanicalHeader, BotanicalFooter } from '@/components/botanical/Layout';

// Common tags for quick selection
const COMMON_TAGS = [
  'bride', 'groom', 'couple', 'family', 'friends', 'guests',
  'mehendi', 'sangeet', 'wedding', 'reception', 'ceremony',
  'decorations', 'food', 'cake', 'dance', 'group', 'candid',
  'portraits', 'kids', 'elders', 'venue'
];

export default function PostWeddingPage() {
  const { toast } = useToast();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8001';
  const fileInputRef = useRef(null);

  // State
  const [weddings, setWeddings] = useState([]);
  const [selectedWeddingId, setSelectedWeddingId] = useState('');
  const [wedding, setWedding] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [filteredPhotos, setFilteredPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Lightbox state
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Tag editor state
  const [editingPhotoId, setEditingPhotoId] = useState(null);
  const [editingTags, setEditingTags] = useState([]);
  const [newTag, setNewTag] = useState('');

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);

  // Fetch weddings on mount
  useEffect(() => { fetchWeddings(); }, []);

  // Fetch photos when wedding changes
  useEffect(() => { 
    if (selectedWeddingId) fetchWeddingAndPhotos(selectedWeddingId); 
  }, [selectedWeddingId]);

  // Filter photos when filters change
  useEffect(() => {
    if (activeFilters.length === 0) {
      setFilteredPhotos(photos);
    } else {
      const filtered = photos.filter(photo => 
        activeFilters.some(filter => 
          photo.tags?.some(tag => tag.toLowerCase().includes(filter.toLowerCase()))
        )
      );
      setFilteredPhotos(filtered);
    }
  }, [photos, activeFilters]);

  const fetchWeddings = async () => {
    setIsLoading(true);
    try {
      const storedAuth = localStorage.getItem('vowly_auth');
      const authToken = storedAuth ? JSON.parse(storedAuth).token : null;
      const headers = authToken ? { 'Authorization': `Bearer ${authToken}` } : {};
      const response = await fetch(`${backendUrl}/api/weddings`, { headers });
      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      setWeddings(data);
      if (data.length > 0) setSelectedWeddingId(data[0].id);
    } catch (err) { 
      toast({ title: 'Error', description: 'Failed to load weddings.', variant: 'destructive' }); 
    } finally { 
      setIsLoading(false); 
    }
  };

  const fetchWeddingAndPhotos = async (weddingId) => {
    setIsLoading(true);
    try {
      const [weddingRes, photosRes] = await Promise.all([
        fetch(`${backendUrl}/api/wedding/${weddingId}`),
        fetch(`${backendUrl}/api/wedding/${weddingId}/photos`),
      ]);
      if (weddingRes.ok) setWedding(await weddingRes.json());
      if (photosRes.ok) {
        const photosData = await photosRes.json();
        setPhotos(photosData);
        setFilteredPhotos(photosData);
      } else {
        setPhotos([]);
        setFilteredPhotos([]);
      }
    } catch (err) { 
      toast({ title: 'Error', description: 'Failed to load photos.', variant: 'destructive' }); 
      setPhotos([]); 
      setFilteredPhotos([]);
    } finally { 
      setIsLoading(false); 
    }
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0 || !selectedWeddingId) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('weddingId', selectedWeddingId);
      files.forEach(file => formData.append('files', file));

      const response = await fetch(`${backendUrl}/api/photos/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Upload failed');
      }

      const uploaded = await response.json();
      toast({ 
        title: 'Photos Uploaded!', 
        description: `Successfully uploaded ${uploaded.length} photo(s).` 
      });

      // Refresh photos
      fetchWeddingAndPhotos(selectedWeddingId);
    } catch (err) {
      toast({ title: 'Upload Failed', description: err.message, variant: 'destructive' });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAISearch = async () => {
    if (!searchQuery.trim()) {
      setActiveFilters([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`${backendUrl}/api/ai/photo-search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!response.ok) throw new Error('Search failed');

      const data = await response.json();
      const extractedTags = data.extractedTags || [];
      
      if (extractedTags.length === 0) {
        toast({ title: 'No Tags Found', description: 'Try a different search query.' });
        setActiveFilters([]);
      } else {
        setActiveFilters(extractedTags);
        toast({ 
          title: 'Search Complete', 
          description: `Filtering by: ${extractedTags.join(', ')}` 
        });
      }
    } catch (err) {
      toast({ title: 'Search Error', description: err.message, variant: 'destructive' });
    } finally {
      setIsSearching(false);
    }
  };

  const clearFilters = () => {
    setActiveFilters([]);
    setSearchQuery('');
  };

  const openTagEditor = (photo) => {
    setEditingPhotoId(photo.id);
    setEditingTags([...(photo.tags || [])]);
    setNewTag('');
  };

  const closeTagEditor = () => {
    setEditingPhotoId(null);
    setEditingTags([]);
    setNewTag('');
  };

  const addTag = () => {
    const tag = newTag.trim().toLowerCase();
    if (tag && !editingTags.includes(tag)) {
      setEditingTags([...editingTags, tag]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setEditingTags(editingTags.filter(t => t !== tagToRemove));
  };

  const saveTags = async () => {
    if (!editingPhotoId) return;

    try {
      const response = await fetch(`${backendUrl}/api/photos/tag`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photoId: editingPhotoId, tags: editingTags }),
      });

      if (!response.ok) throw new Error('Failed to save tags');

      toast({ title: 'Tags Saved!', description: 'Photo tags updated successfully.' });
      
      // Update local state
      setPhotos(photos.map(p => 
        p.id === editingPhotoId ? { ...p, tags: editingTags } : p
      ));
      closeTagEditor();
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const deletePhoto = async (photoId) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;

    try {
      const response = await fetch(`${backendUrl}/api/photos/${photoId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete');

      toast({ title: 'Photo Deleted', description: 'Photo removed from gallery.' });
      setPhotos(photos.filter(p => p.id !== photoId));
      if (isLightboxOpen) closeLightbox();
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const openLightbox = (index) => { 
    setSelectedPhotoIndex(index); 
    setIsLightboxOpen(true); 
  };
  
  const closeLightbox = () => { 
    setIsLightboxOpen(false); 
    setSelectedPhotoIndex(null); 
  };
  
  const navigatePhoto = (direction) => { 
    if (selectedPhotoIndex === null) return; 
    const photoList = filteredPhotos;
    const newIndex = direction === 'next' 
      ? (selectedPhotoIndex + 1) % photoList.length 
      : selectedPhotoIndex === 0 ? photoList.length - 1 : selectedPhotoIndex - 1; 
    setSelectedPhotoIndex(newIndex); 
  };

  const getPhotoUrl = (photo) => {
    return `${backendUrl}${photo.url}`;
  };

  // Loading state
  if (isLoading && weddings.length === 0) {
    return (
      <div className="page-shell">
        <BotanicalHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <BotanicalFooter />
      </div>
    );
  }

  // No weddings state
  if (weddings.length === 0) {
    return (
      <div className="page-shell">
        <BotanicalHeader />
        <main className="pt-24 pb-20 text-center max-w-xl mx-auto px-6">
          <Camera className="w-16 h-16 mx-auto text-muted-foreground/30 mb-6" />
          <h1 className="text-3xl font-serif mb-4">No Weddings Found</h1>
          <p className="text-muted-foreground">Create a wedding to start your photo gallery.</p>
        </main>
        <BotanicalFooter />
      </div>
    );
  }

  return (
    <div className="page-shell">
      <BotanicalHeader />

      <main className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <motion.div 
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
          >
            <div>
              <p className="label-botanical mb-2">Photo Gallery</p>
              <h1 className="text-3xl md:text-4xl font-serif flex items-center gap-3">
                <Camera className="w-8 h-8 text-primary" />
                Wedding Memories
              </h1>
            </div>
            <Select value={selectedWeddingId} onValueChange={setSelectedWeddingId}>
              <SelectTrigger className="input-botanical w-full md:w-64">
                <SelectValue placeholder="Select Wedding" />
              </SelectTrigger>
              <SelectContent>
                {weddings.map((w) => (
                  <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>

          {/* Wedding Info */}
          {wedding && (
            <motion.div 
              className="card-botanical mb-6" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-2xl font-serif font-medium mb-2">{wedding.name}</h2>
              <p className="text-muted-foreground">{wedding.location} • {wedding.startDate}</p>
            </motion.div>
          )}

          {/* Upload Section */}
          <motion.div 
            className="card-botanical mb-6" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                <h3 className="font-serif text-lg">Upload Photos</h3>
              </div>
              <span className="text-sm text-muted-foreground">{photos.length} photos</span>
            </div>
            
            <div 
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                isUploading ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              }`}
            >
              {isUploading ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <p className="text-muted-foreground">Uploading photos...</p>
                </div>
              ) : (
                <>
                  <Camera className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Drag and drop photos here, or click to select files
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="btn-botanical cursor-pointer">
                    <Upload className="w-4 h-4" /> Select Photos
                  </label>
                </>
              )}
            </div>
          </motion.div>

          {/* AI Search Section */}
          <motion.div 
            className="card-botanical mb-6" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="font-serif text-lg">AI-Powered Search</h3>
            </div>
            
            <div className="flex gap-3">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAISearch()}
                placeholder="Search photos... (e.g., 'bride with family during mehendi')"
                className="input-botanical flex-1"
              />
              <button 
                onClick={handleAISearch} 
                disabled={isSearching || !searchQuery.trim()}
                className="btn-botanical"
              >
                {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                Search
              </button>
            </div>

            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">Filtering by:</span>
                {activeFilters.map((filter, idx) => (
                  <span 
                    key={idx} 
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                  >
                    <Tag className="w-3 h-3" />
                    {filter}
                  </span>
                ))}
                <button 
                  onClick={clearFilters} 
                  className="text-sm text-muted-foreground hover:text-destructive transition-colors"
                >
                  Clear all
                </button>
              </div>
            )}
          </motion.div>

          {/* Photo Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredPhotos.length === 0 ? (
            <motion.div 
              className="card-botanical text-center py-16" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.4 }}
            >
              <ImageIcon className="w-16 h-16 mx-auto text-muted-foreground/30 mb-6" />
              <h3 className="text-xl font-serif mb-2">
                {photos.length === 0 ? 'No Photos Yet' : 'No Matching Photos'}
              </h3>
              <p className="text-muted-foreground">
                {photos.length === 0 
                  ? 'Upload photos to start building your wedding gallery.' 
                  : 'Try a different search query or clear filters.'}
              </p>
              {activeFilters.length > 0 && (
                <button onClick={clearFilters} className="btn-botanical-outline mt-4">
                  Clear Filters
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" 
              initial="hidden" 
              animate="visible" 
              variants={{ 
                hidden: { opacity: 0 }, 
                visible: { opacity: 1, transition: { staggerChildren: 0.05 } } 
              }}
            >
              {filteredPhotos.map((photo, index) => (
                <motion.div 
                  key={photo.id} 
                  variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }} 
                  className="aspect-square relative group cursor-pointer overflow-hidden rounded-2xl border border-border"
                  onClick={() => openLightbox(index)}
                >
                  <img 
                    src={getPhotoUrl(photo)} 
                    alt={photo.caption || `Photo ${index + 1}`} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* Overlay with actions - pointer-events-none by default, enabled on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto">
                    <button 
                      onClick={(e) => { e.stopPropagation(); openLightbox(index); }}
                      className="p-2 rounded-full bg-white/90 hover:bg-white text-foreground transition-colors pointer-events-auto"
                    >
                      <Heart className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); openTagEditor(photo); }}
                      className="p-2 rounded-full bg-white/90 hover:bg-white text-foreground transition-colors pointer-events-auto"
                    >
                      <Tag className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Tags indicator */}
                  {photo.tags && photo.tags.length > 0 && (
                    <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1 pointer-events-none">
                      {photo.tags.slice(0, 2).map((tag, i) => (
                        <span key={i} className="text-xs bg-black/60 text-white px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                      {photo.tags.length > 2 && (
                        <span className="text-xs bg-black/60 text-white px-2 py-0.5 rounded-full">
                          +{photo.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>

      {/* Lightbox */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-5xl p-0 bg-black/95 border-0">
          <button 
            onClick={closeLightbox} 
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          {filteredPhotos.length > 1 && (
            <>
              <button 
                onClick={() => navigatePhoto('prev')} 
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={() => navigatePhoto('next')} 
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
          
          {selectedPhotoIndex !== null && filteredPhotos[selectedPhotoIndex] && (
            <div className="p-8">
              <div className="flex items-center justify-center min-h-[60vh]">
                <img 
                  src={getPhotoUrl(filteredPhotos[selectedPhotoIndex])} 
                  alt={filteredPhotos[selectedPhotoIndex].caption || ''} 
                  className="max-w-full max-h-[60vh] object-contain rounded-lg" 
                />
              </div>
              
              {/* Photo actions in lightbox */}
              <div className="mt-4 flex items-center justify-center gap-4">
                <button 
                  onClick={() => openTagEditor(filteredPhotos[selectedPhotoIndex])}
                  className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm flex items-center gap-2 transition-colors"
                >
                  <Tag className="w-4 h-4" /> Edit Tags
                </button>
                <button 
                  onClick={() => deletePhoto(filteredPhotos[selectedPhotoIndex].id)}
                  className="px-4 py-2 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-300 text-sm flex items-center gap-2 transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
              
              {/* Tags display */}
              {filteredPhotos[selectedPhotoIndex].tags?.length > 0 && (
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {filteredPhotos[selectedPhotoIndex].tags.map((tag, i) => (
                    <span key={i} className="text-sm bg-white/10 text-white px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Tag Editor Modal */}
      <Dialog open={!!editingPhotoId} onOpenChange={(open) => !open && closeTagEditor()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif">Edit Photo Tags</DialogTitle>
            <DialogDescription>
              Add tags to help organize and search your photos.
            </DialogDescription>
          </DialogHeader>

          {/* Current tags */}
          <div className="flex flex-wrap gap-2 min-h-[40px] p-3 bg-secondary/50 rounded-xl border border-border">
            {editingTags.length === 0 ? (
              <span className="text-sm text-muted-foreground">No tags yet</span>
            ) : (
              editingTags.map((tag, i) => (
                <span 
                  key={i} 
                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                >
                  {tag}
                  <button 
                    onClick={() => removeTag(tag)} 
                    className="hover:text-destructive transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))
            )}
          </div>

          {/* Add new tag */}
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTag()}
              placeholder="Type a tag..."
              className="input-botanical flex-1"
            />
            <button onClick={addTag} disabled={!newTag.trim()} className="btn-botanical">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>

          {/* Common tags */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">Quick add:</p>
            <div className="flex flex-wrap gap-2">
              {COMMON_TAGS.filter(t => !editingTags.includes(t)).slice(0, 12).map((tag, i) => (
                <button
                  key={i}
                  onClick={() => setEditingTags([...editingTags, tag])}
                  className="px-3 py-1 text-sm border border-border rounded-full hover:border-primary hover:text-primary transition-colors"
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>

          <DialogFooter>
            <button onClick={closeTagEditor} className="btn-botanical-outline">
              Cancel
            </button>
            <button onClick={saveTags} className="btn-botanical">
              Save Tags
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BotanicalFooter />
    </div>
  );
}
