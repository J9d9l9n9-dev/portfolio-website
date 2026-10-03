import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMediaAssets, uploadImage, deleteMediaAsset, resolveAssetUrl } from '../../api/client';
import { useToast } from '../ui/Toast';
import {
  X,
  Upload,
  Image as ImageIcon,
  Search,
  Check,
  Trash2,
  Loader2
} from 'lucide-react';
import type { MediaAsset } from '../../types';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string, asset?: MediaAsset) => void;
  title?: string;
}

export const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  title = 'Select Media'
}) => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const { data: mediaList = [], isLoading } = useQuery({
    queryKey: ['media-assets', searchQuery],
    queryFn: () => fetchMediaAssets(searchQuery),
    enabled: isOpen
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id, force }: { id: number; force?: boolean }) => deleteMediaAsset(id, force),
    onSuccess: () => {
      showToast('Media deleted successfully', 'success');
      queryClient.invalidateQueries({ queryKey: ['media-assets'] });
      if (selectedAsset) setSelectedAsset(null);
    },
    onError: (err: Error) => {
      showToast(err.message || 'Could not delete media asset', 'error');
    }
  });

  if (!isOpen) return null;

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadImage(file);
      showToast(`Uploaded ${res.filename || 'image'} successfully!`, 'success');
      queryClient.invalidateQueries({ queryKey: ['media-assets'] });
      onSelect(res.secure_url || res.url);
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const formatBytes = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-bg-card border border-border w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border bg-bg-card/50">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            <h3 className="font-display font-bold text-lg text-text-primary">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border px-4 pt-2 gap-4 bg-bg-card">
          <button
            type="button"
            onClick={() => setActiveTab('library')}
            className={`pb-2.5 px-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'library'
                ? 'border-primary text-primary'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Media Library</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`pb-2.5 px-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'upload'
                ? 'border-primary text-primary'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload New</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {activeTab === 'library' ? (
            <div className="space-y-4">
              {/* Search bar */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search media by filename or format..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-bg-input border border-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* Grid */}
              {isLoading ? (
                <div className="flex items-center justify-center py-16 text-text-muted gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Loading media assets...</span>
                </div>
              ) : mediaList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center text-text-muted border border-dashed border-border rounded-xl">
                  <ImageIcon className="w-10 h-10 mb-2 opacity-40" />
                  <p className="text-sm font-medium">No media assets found</p>
                  <p className="text-xs mt-1">Upload images from your device to see them here.</p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('upload')}
                    className="mt-3 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors"
                  >
                    Upload Image
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 max-h-[50vh] overflow-y-auto p-1">
                  {mediaList.map((asset) => {
                    const isSelected = selectedAsset?.id === asset.id;
                    const displayUrl = resolveAssetUrl(asset.secure_url || asset.url);
                    return (
                      <div
                        key={asset.id}
                        onClick={() => setSelectedAsset(asset)}
                        className={`group relative rounded-xl border overflow-hidden cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? 'border-primary ring-2 ring-primary/40 bg-primary/5 shadow-md'
                            : 'border-border bg-bg-card hover:border-border-hover'
                        }`}
                      >
                        <div className="aspect-video w-full bg-black/20 relative overflow-hidden flex items-center justify-center">
                          <img
                            src={displayUrl}
                            alt={asset.filename}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shadow-lg">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>
                        <div className="p-2.5">
                          <p className="text-xs font-medium text-text-primary truncate" title={asset.filename}>
                            {asset.filename}
                          </p>
                          <div className="flex items-center justify-between text-[10px] text-text-muted mt-1 font-mono">
                            <span>{asset.width && asset.height ? `${asset.width}x${asset.height}` : asset.format?.toUpperCase()}</span>
                            <span>{formatBytes(asset.size_bytes)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Upload Tab */
            <div className="space-y-4">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 flex flex-col items-center justify-center text-center transition-colors ${
                  dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-border-hover'
                }`}
              >
                {uploading ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <p className="text-sm font-semibold text-text-primary">Uploading and optimizing image...</p>
                    <p className="text-xs text-text-muted">Storing persistent media reference</p>
                  </div>
                ) : (
                  <>
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                      <Upload className="w-7 h-7" />
                    </div>
                    <h4 className="font-display font-bold text-base text-text-primary mb-1">
                      Choose a file or drag & drop it here
                    </h4>
                    <p className="text-xs text-text-muted max-w-sm mb-4">
                      Supports JPG, PNG, WEBP, and GIF up to 5MB. Files are verified for dimensions and integrity.
                    </p>
                    <label className="cursor-pointer px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover shadow-md transition-colors inline-flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      <span>Browse from Computer</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileUpload(e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-border bg-bg-card/50">
          <div className="text-xs text-text-muted">
            {selectedAsset ? (
              <span className="truncate max-w-xs inline-block font-mono text-text-secondary">
                Selected: {selectedAsset.filename}
              </span>
            ) : (
              <span>Select an asset to use in form</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {selectedAsset && (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Delete '${selectedAsset.filename}' from media library?`)) {
                    deleteMutation.mutate({ id: selectedAsset.id });
                  }
                }}
                disabled={deleteMutation.isPending}
                className="px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Delete Asset"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border text-text-secondary hover:bg-bg-hover text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!selectedAsset}
              onClick={() => {
                if (selectedAsset) {
                  onSelect(selectedAsset.secure_url || selectedAsset.url, selectedAsset);
                  onClose();
                }
              }}
              className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Use Selected Media</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
