'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { uploadImage, deleteImage, compressImage } from '@/lib/uploadImage';

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (imageUrl: string | null) => void;
  folder: 'logos' | 'reviews';
  label: string;
}

export default function ImageUpload({
  currentImage,
  onImageChange,
  folder,
  label
}: ImageUploadProps) {
  // Check if currentImage is a valid URL (not an emoji)
  const isValidUrl = (str: string) => {
    if (!str) return false;
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  const [preview, setPreview] = useState<string | null>(
    currentImage && isValidUrl(currentImage) ? currentImage : null
  );
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    try {
      setUploading(true);

      // Compress image
      const compressedFile = await compressImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(compressedFile);

      // Upload to Supabase
      const imageUrl = await uploadImage(compressedFile, folder);

      if (imageUrl) {
        // Delete old image if exists and is a valid URL
        if (currentImage && isValidUrl(currentImage)) {
          await deleteImage(currentImage);
        }
        onImageChange(imageUrl);
      } else {
        alert('Failed to upload image');
        setPreview(currentImage && isValidUrl(currentImage) ? currentImage : null);
      }
    } catch (error) {
      console.error('Error handling file:', error);
      alert('Error uploading image');
      setPreview(currentImage && isValidUrl(currentImage) ? currentImage : null);
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleRemove = async () => {
    if (currentImage && isValidUrl(currentImage)) {
      const confirmed = confirm('Are you sure you want to remove this image?');
      if (confirmed) {
        await deleteImage(currentImage);
        setPreview(null);
        onImageChange(null);
      }
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
      >
        {uploading ? (
          <div className="py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Uploading...</p>
          </div>
        ) : preview ? (
          <div className="space-y-3">
            <div className="relative w-32 h-32 mx-auto">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-contain rounded"
              />
            </div>
            <div className="flex gap-2 justify-center">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Change
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="py-6">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-600">
              Drag & drop an image here, or click to select
            </p>
            <p className="mt-1 text-xs text-gray-500">
              PNG, JPG, GIF up to 5MB
            </p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
