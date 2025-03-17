import React, { useRef, useState } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import { useAppStore } from '../store';

const PDFUploader: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { pdfFile, setPdfFile } = useAppStore();
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type === 'application/pdf') {
        setPdfFile(file);
      } else {
        alert('Please upload a PDF file');
      }
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
    const files = event.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type === 'application/pdf') {
        setPdfFile(file);
      } else {
        alert('Please upload a PDF file');
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div 
      className={`w-full p-6 bg-white border rounded-lg mb-4 flex flex-col items-center justify-center transition-all duration-300 ${
        dragActive 
          ? 'border-blue-500 border-dashed bg-blue-50 pulse-animation' 
          : 'border-gray-200 shadow-sm hover:shadow-md'
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {!pdfFile ? (
        <>
          <div className="text-center">
            <div className="mb-2 p-4 bg-blue-50 rounded-full inline-flex items-center justify-center">
              <Upload className="h-12 w-12 text-blue-500" />
            </div>
            <h3 className="mt-2 text-lg font-semibold text-gray-900">Upload Your PDF Drawing</h3>
            <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">
              Drag and drop your PDF file here, or click to browse files.
              <br />Construction drawings, floor plans, and other technical documents work best.
            </p>
            <div className="mt-5">
              <button
                type="button"
                className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-all duration-200 transform hover:-translate-y-0.5"
                onClick={handleUploadClick}
              >
                <FileText className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Select PDF File
              </button>
            </div>
            
            <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
              <div className="w-5 h-5 flex items-center justify-center bg-blue-100 rounded-full text-blue-500 mr-1">
                <span>i</span>
              </div>
              Supported format: PDF
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />
        </>
      ) : (
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center">
            <div className="p-2 mr-3 bg-blue-100 rounded-md">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <p className="text-base font-medium text-gray-900">{pdfFile.name}</p>
              <p className="text-sm text-gray-500">
                {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              className="px-3 py-1.5 border border-red-200 text-red-600 rounded-md hover:bg-red-50 transition-all duration-200"
              onClick={() => setPdfFile(null)}
            >
              <span className="flex items-center">
                <X className="h-4 w-4 mr-1" />
                Remove
              </span>
            </button>
            <button
              className="px-3 py-1.5 border border-blue-200 text-blue-600 rounded-md hover:bg-blue-50 transition-all duration-200"
              onClick={handleUploadClick}
            >
              <span className="flex items-center">
                <Upload className="h-4 w-4 mr-1" />
                Change
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFUploader;