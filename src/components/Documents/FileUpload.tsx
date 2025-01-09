import React, { useRef } from 'react';
import { FileText } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (files: FileList) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      onFileUpload(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div
      className="mt-4 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50"
      onClick={() => fileInputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <p className="text-sm text-gray-600">Drop files or click to upload</p>
      <p className="text-xs text-gray-500 mt-1">PDF, TXT, DOCX, XLSX, MD</p>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        multiple
        accept=".pdf,.txt,.docx,.xlsx,.md"
        onChange={(e) => e.target.files && onFileUpload(e.target.files)}
      />
    </div>
  );
};