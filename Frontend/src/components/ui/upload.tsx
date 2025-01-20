import React, { useState } from 'react';
import { Upload as UploadIcon } from 'lucide-react';
import { Button } from './button';

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(droppedFile);
    }
  };

  const handleUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await fetch('http://localhost:3000/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await response.text();
        alert(data);
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <div className="p-6 h-full">
      <h2 className="text-xl font-semibold mb-4">Upload Your File</h2>
      <div
        className="h-[calc(100%-8rem)] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {!preview ? (
          <>
            <UploadIcon className="h-12 w-12 text-gray-400 mb-4" />
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="text-sm text-gray-600">
                Drag and drop a file or click to upload
              </span>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*,.pdf"
              />
            </label>
          </>
        ) : (
          <div className="relative w-full h-full p-4">
            <img
              src={preview}
              alt="Document preview"
              className="max-h-full mx-auto object-contain"
            />
            <Button
              onClick={() => {
                setFile(null);
                setPreview('');
              }}
              variant="destructive"
              size="sm"
              className="mt-4 absolute bottom-4 left-1/2 -translate-x-1/2"
            >
              Remove file
            </Button>
          </div>
        )}
      </div>
      {file && !preview && (
        <div className="mt-4 text-sm text-gray-500">
          Selected file: {file.name}
        </div>
      )}
      {file && (
        <Button onClick={handleUpload} className="mt-4">
          Upload
        </Button>
      )}
    </div>
  );
}
