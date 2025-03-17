import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useAppStore } from '../store';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize, Minimize, Loader, Upload, FileText } from 'lucide-react';
import AnnotationLayer from './AnnotationLayer';

// Set up the worker for pdf.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const PDFViewer: React.FC = () => {
  const { 
    pdfFile, 
    setPdfFile,
    activePage, 
    totalPages,
    scale,
    setActivePage, 
    setTotalPages,
    setScale,
    activeSymbol,
    addAnnotation
  } = useAppStore();
  
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isFullWidth, setIsFullWidth] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setTotalPages(numPages);
    setIsLoading(false);
  };

  const goToPreviousPage = () => {
    if (activePage > 1) {
      setActivePage(activePage - 1);
      setIsLoading(true);
    }
  };

  const goToNextPage = () => {
    if (activePage < totalPages) {
      setActivePage(activePage + 1);
      setIsLoading(true);
    }
  };

  const zoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.1, 2.5));
  };

  const zoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.1, 0.5));
  };

  const toggleFullWidth = () => {
    setIsFullWidth(!isFullWidth);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') goToPreviousPage();
    if (e.key === 'ArrowRight') goToNextPage();
    if (e.key === '+' || e.key === '=') zoomIn();
    if (e.key === '-') zoomOut();
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activePage, totalPages]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!activeSymbol || !pdfFile) return;
    
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    
    // Calculate the click position relative to the PDF
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;
    
    addAnnotation({
      symbolId: activeSymbol.id,
      pageNumber: activePage,
      x,
      y
    });
  };

  const handlePageLoadSuccess = (page: any) => {
    setDimensions({
      width: page.originalWidth,
      height: page.originalHeight
    });
    setIsLoading(false);
  };

  // File upload handlers
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
    <div className={`w-full bg-gray-100 rounded-lg shadow-sm p-4 mb-4 transition-all duration-300 ${isFullWidth ? 'md:w-full' : ''}`}>
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <div className="flex space-x-2 items-center">
          <button
            className="px-3 py-1.5 bg-white rounded-md border border-gray-300 disabled:opacity-50 hover:bg-gray-50 transition-colors duration-200 shadow-sm"
            onClick={goToPreviousPage}
            disabled={!pdfFile || activePage <= 1}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="px-4 py-1.5 bg-white rounded-md border border-gray-300 shadow-sm">
            {pdfFile ? (
              <>Page <span className="font-medium">{activePage}</span> of <span className="font-medium">{totalPages}</span></>
            ) : (
              <>No PDF loaded</>
            )}
          </div>
          <button
            className="px-3 py-1.5 bg-white rounded-md border border-gray-300 disabled:opacity-50 hover:bg-gray-50 transition-colors duration-200 shadow-sm"
            onClick={goToNextPage}
            disabled={!pdfFile || activePage >= totalPages}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex space-x-2 items-center">
          <button
            className="px-3 py-1.5 bg-white rounded-md border border-gray-300 hover:bg-gray-50 transition-colors duration-200 shadow-sm tooltip disabled:opacity-50"
            onClick={toggleFullWidth}
            disabled={!pdfFile}
            data-tooltip={isFullWidth ? "Normal view" : "Full width view"}
          >
            {isFullWidth ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
          </button>
          <button
            className="px-3 py-1.5 bg-white rounded-md border border-gray-300 disabled:opacity-50 hover:bg-gray-50 transition-colors duration-200 shadow-sm"
            onClick={zoomOut}
            disabled={!pdfFile || scale <= 0.5}
          >
            <ZoomOut className="h-5 w-5" />
          </button>
          <div className="px-3 py-1.5 bg-white rounded-md border border-gray-300 shadow-sm font-medium">
            {pdfFile ? `${Math.round(scale * 100)}%` : '-'}
          </div>
          <button
            className="px-3 py-1.5 bg-white rounded-md border border-gray-300 hover:bg-gray-50 transition-colors duration-200 shadow-sm"
            onClick={zoomIn}
            disabled={!pdfFile || scale >= 2.5}
          >
            <ZoomIn className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div 
        className="flex justify-center bg-gray-800 rounded-lg overflow-auto shadow-inner relative" 
        style={{ minHeight: '70vh' }}
        onDrop={pdfFile ? undefined : handleDrop}
        onDragOver={pdfFile ? undefined : handleDragOver}
        onDragLeave={pdfFile ? undefined : handleDragLeave}
      >
        {isLoading && pdfFile && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70 z-20">
            <div className="text-center text-white">
              <Loader className="h-10 w-10 animate-spin mx-auto mb-2" />
              <p>Loading page...</p>
            </div>
          </div>
        )}
        
        {pdfFile ? (
          <div
            style={{ position: 'relative' }}
            onClick={handleClick}
            className={activeSymbol ? 'cursor-crosshair' : 'cursor-default'}
          >
            <Document
              file={pdfFile}
              onLoadSuccess={handleDocumentLoadSuccess}
              className="flex justify-center"
              loading={
                <div className="flex items-center justify-center h-64 w-64">
                  <Loader className="h-10 w-10 animate-spin text-white" />
                </div>
              }
            >
              <Page
                pageNumber={activePage}
                scale={scale}
                onLoadSuccess={handlePageLoadSuccess}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                loading=""
                className="transition-all duration-300"
              />
            </Document>
            
            <AnnotationLayer 
              pageNumber={activePage}
              scale={scale}
              width={dimensions.width}
              height={dimensions.height}
            />
          </div>
        ) : (
          <div 
            className={`flex flex-col items-center justify-center w-full h-full p-6 ${
              dragActive 
                ? 'border-blue-500 border-dashed bg-blue-50/20 pulse-animation' 
                : 'border-transparent'
            }`}
          >
            <div className="text-center">
              <div className="mb-4 p-4 bg-blue-50 rounded-full inline-flex items-center justify-center">
                <Upload className="h-12 w-12 text-blue-500" />
              </div>
              <h3 className="mt-2 text-xl font-semibold text-white mb-3">Upload Your PDF Document</h3>
              <p className="text-gray-300 max-w-md mx-auto mb-6">
                Drag and drop your PDF file here, or click to browse files.
                <br />Upload any PDF documents that you need to analyze or annotate.
              </p>
              <button
                type="button"
                className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-all duration-200 transform hover:-translate-y-0.5"
                onClick={handleUploadClick}
              >
                <FileText className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Select PDF File
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        )}
      </div>

      {pdfFile && activeSymbol && (
        <div className="mt-3 px-4 py-2 bg-blue-100 text-blue-800 rounded-md flex items-center">
          <div 
            className="mr-2 flex-shrink-0"
            style={{
              width: `${activeSymbol.size * 0.75}px`,
              height: `${activeSymbol.size * 0.75}px`,
              backgroundColor: activeSymbol.color,
              borderRadius: activeSymbol.shape === 'circle' ? '50%' : 
                         activeSymbol.shape === 'square' ? '0' : '0',
              clipPath: activeSymbol.shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none'
            }}
          />
          <span className="text-sm">
            Click on the PDF to place <strong>{activeSymbol.name}</strong> symbols
          </span>
        </div>
      )}

      {pdfFile && (
        <div className="mt-3 text-xs text-gray-500 text-center">
          Keyboard shortcuts: Arrow keys to navigate pages, +/- to zoom
        </div>
      )}
    </div>
  );
};

export default PDFViewer;