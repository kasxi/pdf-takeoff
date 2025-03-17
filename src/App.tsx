import React from 'react';
import PDFViewer from './components/PDFViewer';
import SymbolPalette from './components/SymbolPalette';
import ExportTools from './components/ExportTools';
import { ZoomIn } from 'lucide-react';
import { useAppStore } from './store';

function App() {
  const { pdfFile } = useAppStore();

  return (
    <div className="min-h-screen bg-gray-50 max-w-screen overflow-x-hidden">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-full mx-auto px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-blue-600 text-white p-2 rounded-md mr-3">
                <ZoomIn className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">PDF Takeoff App</h1>
            </div>
            <div className="text-sm text-gray-500 flex items-center">
              PDF Analysis & Annotation Tool
            </div>
          </div>
        </div>
      </header>
      
      <main className="w-full mx-auto px-2 py-2 sm:px-4 md:px-6 lg:px-8">
        <div className="flex flex-col xl:flex-row gap-2 xl:gap-4">
          <div className="w-full xl:w-4/5">
            <PDFViewer />
          </div>
          <div className="w-full xl:w-1/5 space-y-4">
            <SymbolPalette />
            <ExportTools />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;