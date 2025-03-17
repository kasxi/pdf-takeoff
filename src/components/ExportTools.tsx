import React, { useRef, useState } from 'react';
import { Download, FileText, Printer, Database, Share2, Layers, Table } from 'lucide-react';
import { useAppStore } from '../store';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import Modal from './Modal';
import Popover from './Popover';

const ExportTools: React.FC = () => {
  const { pdfFile, totalPages, symbols, getSymbolCount, getSymbolPageCounts, getPagesWithSymbols } = useAppStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportMessage, setExportMessage] = useState('');
  const [showPerPageCounts, setShowPerPageCounts] = useState(false);
  
  if (!pdfFile) {
    return (
      <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Export</h3>
        <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500">No PDF document loaded.</p>
          <p className="text-sm text-gray-400 mt-1">Upload a PDF document to enable export features</p>
        </div>
      </div>
    );
  }

  const handleExportSummary = async () => {
    if (!containerRef.current) return;
    
    try {
      const dataUrl = await toPng(containerRef.current);
      
      // Create a link and trigger download
      const link = document.createElement('a');
      link.download = `takeoff-summary-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error exporting summary:', error);
      setExportMessage('Error exporting summary. Please try again.');
      setShowExportModal(true);
    }
  };
  
  const handleExportWithAnnotations = async () => {
    setExportMessage('For a fully-featured solution, a commercial PDF library would be needed to properly merge annotations with the PDF. In a production environment, this feature would combine the PDF with annotations.');
    setShowExportModal(true);
  };

  const exportCSV = () => {
    if (showPerPageCounts) {
      // Export with page-by-page breakdown
      let csvContent = "Symbol,Color,Size,Page,Count\n";
      
      symbols.forEach(symbol => {
        const pageCounts = getSymbolPageCounts(symbol.id);
        if (pageCounts.length === 0) {
          csvContent += `"${symbol.name}","${symbol.color}","${symbol.size}","All",0\n`;
        } else {
          pageCounts.forEach(pc => {
            csvContent += `"${symbol.name}","${symbol.color}","${symbol.size}","${pc.page}","${pc.count}"\n`;
          });
        }
      });
      
      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `takeoff-data-by-page-${new Date().toISOString().slice(0, 10)}.csv`);
      link.click();
    } else {
      // Create CSV content with totals
      let csvContent = "Symbol,Color,Size,Count\n";
      
      symbols.forEach(symbol => {
        const count = getSymbolCount(symbol.id);
        csvContent += `"${symbol.name}","${symbol.color}","${symbol.size}","${count}"\n`;
      });
      
      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `takeoff-data-${new Date().toISOString().slice(0, 10)}.csv`);
      link.click();
    }
  };
  
  const exportPopoverContent = (
    <div className="p-2">
      <h4 className="text-sm font-semibold text-gray-800 mb-2 px-2">Export Options</h4>
      <div className="space-y-1">
        <button
          className="w-full flex items-center px-3 py-2 text-left text-sm hover:bg-blue-50 rounded-md transition-colors duration-200"
          onClick={handleExportSummary}
        >
          <Download className="h-4 w-4 mr-2 text-blue-600" />
          <span>Export Summary Image</span>
        </button>
        
        <button
          className="w-full flex items-center px-3 py-2 text-left text-sm hover:bg-green-50 rounded-md transition-colors duration-200"
          onClick={handleExportWithAnnotations}
        >
          <FileText className="h-4 w-4 mr-2 text-green-600" />
          <span>Export PDF with Annotations</span>
        </button>

        <button
          className="w-full flex items-center px-3 py-2 text-left text-sm hover:bg-purple-50 rounded-md transition-colors duration-200"
          onClick={exportCSV}
        >
          <Database className="h-4 w-4 mr-2 text-purple-600" />
          <span>Export Data as CSV</span>
        </button>
        
        <button
          className="w-full flex items-center px-3 py-2 text-left text-sm hover:bg-gray-50 rounded-md transition-colors duration-200"
          onClick={() => window.print()}
        >
          <Printer className="h-4 w-4 mr-2 text-gray-600" />
          <span>Print Report</span>
        </button>
      </div>
    </div>
  );

  // Get pages that contain symbols
  const pagesWithSymbols = getPagesWithSymbols();
  
  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Export</h3>
        <div className="flex space-x-2">
          <div className="flex items-center bg-gray-100 rounded-md p-1">
            <button
              className={`px-2.5 py-1 text-xs rounded-md transition-colors flex items-center ${!showPerPageCounts ? 'bg-white shadow-sm text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={() => setShowPerPageCounts(false)}
              aria-label="Show total counts"
              title="Show total counts across all pages"
            >
              <Layers className="h-3 w-3 mr-1" />
              <span>Total</span>
            </button>
            <button
              className={`px-2.5 py-1 text-xs rounded-md transition-colors flex items-center ${showPerPageCounts ? 'bg-white shadow-sm text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={() => setShowPerPageCounts(true)}
              aria-label="Show per-page counts"
              title="Show counts broken down by page"
            >
              <Table className="h-3 w-3 mr-1" />
              <span>By Page</span>
            </button>
          </div>
          <Popover 
            trigger={
              <button
                className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-sm"
              >
                <Share2 className="h-4 w-4 mr-1.5" />
                <span>Export</span>
              </button>
            }
            content={exportPopoverContent}
            position="bottom"
            width="240px"
          />
        </div>
      </div>
      
      <div
        ref={containerRef}
        className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm"
      >
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
          <h4 className="text-lg font-bold text-gray-800">Takeoff Summary</h4>
          <div className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded-md">
            Generated {new Date().toLocaleDateString()}
          </div>
        </div>
        
        {showPerPageCounts ? (
          // Display per-page breakdown
          <>
            <h5 className="text-base font-medium text-gray-800 mb-3">Count By Page</h5>
            
            {symbols.length > 0 && pagesWithSymbols.length > 0 ? (
              <div className="space-y-3 mb-2">
                {pagesWithSymbols.map((pageNumber) => (
                  <div key={pageNumber} className="border border-gray-200 rounded-md overflow-hidden">
                    <div className="bg-gray-50 px-3 py-2 border-b border-gray-200 font-medium text-gray-700">
                      Page {pageNumber}
                    </div>
                    <div className="p-2.5 space-y-2">
                      {symbols.map((symbol) => {
                        // Filter symbols that appear on this page
                        const pageCounts = getSymbolPageCounts(symbol.id);
                        const pageCount = pageCounts.find(pc => pc.page === pageNumber)?.count || 0;
                        
                        if (pageCount === 0) return null;
                        
                        return (
                          <div key={`${pageNumber}-${symbol.id}`} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                            <div className="flex items-center min-w-0">
                              <div
                                className="mr-3 flex-shrink-0"
                                style={{
                                  width: `${symbol.size * 0.75}px`,
                                  height: `${symbol.size * 0.75}px`,
                                  minWidth: `${symbol.size * 0.75}px`,
                                  backgroundColor: symbol.color,
                                  borderRadius: symbol.shape === 'circle' ? '50%' : 
                                              symbol.shape === 'square' ? '0' : '0',
                                  clipPath: symbol.shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none'
                                }}
                              />
                              <div className="min-w-0">
                                <span className="font-medium text-gray-800 block truncate">{symbol.name}</span>
                                <div className="text-xs text-gray-500">{symbol.shape}</div>
                              </div>
                            </div>
                            <div className="px-3 py-1 bg-gray-200 rounded-md font-bold text-gray-800 ml-2">
                              {pageCount}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
                
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex justify-between items-center text-gray-700">
                    <span className="font-medium">Total Items:</span>
                    <span className="font-bold">
                      {symbols.reduce((total, symbol) => total + getSymbolCount(symbol.id), 0)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500">No symbols have been added to any pages yet.</p>
                <p className="text-sm text-gray-400 mt-1">Add annotations to see counts by page</p>
              </div>
            )}
          </>
        ) : (
          // Display total counts
          <>
            <h5 className="text-base font-medium text-gray-800 mb-3">Count Legend</h5>
            
            {symbols.length > 0 ? (
              <div className="space-y-2 mb-2">
                {symbols.map((symbol) => {
                  const count = getSymbolCount(symbol.id);
                  
                  return (
                    <div key={symbol.id} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-md">
                      <div className="flex items-center min-w-0">
                        <div
                          className="mr-3 flex-shrink-0"
                          style={{
                            width: `${symbol.size * 0.75}px`,
                            height: `${symbol.size * 0.75}px`,
                            minWidth: `${symbol.size * 0.75}px`,
                            backgroundColor: symbol.color,
                            borderRadius: symbol.shape === 'circle' ? '50%' : 
                                        symbol.shape === 'square' ? '0' : '0',
                            clipPath: symbol.shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none'
                          }}
                        />
                        <div className="min-w-0">
                          <span className="font-medium text-gray-800 block truncate max-w-[160px]">{symbol.name}</span>
                          <div className="text-xs text-gray-500">{symbol.shape}, {symbol.size}px</div>
                        </div>
                      </div>
                      <div className="px-3 py-1 bg-gray-200 rounded-md font-bold text-gray-800 ml-2">
                        {count}
                      </div>
                    </div>
                  );
                })}
                
                <div className="pt-3 mt-1 border-t border-gray-200">
                  <div className="flex justify-between items-center text-gray-700 px-2">
                    <span className="font-medium">Total Items:</span>
                    <span className="font-bold text-lg">
                      {symbols.reduce((total, symbol) => total + getSymbolCount(symbol.id), 0)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500">No symbols have been added yet.</p>
                <p className="text-sm text-gray-400 mt-1">Create symbols and add annotations to generate a summary</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Information text about changing view modes */}
      {(symbols.length > 0) && (
        <div className="mt-3 text-xs text-gray-500 text-center">
          <span className="inline-block bg-gray-100 px-2 py-1 rounded-md">
            {showPerPageCounts 
              ? "Viewing counts broken down by page - switch to 'Total' for combined counts" 
              : "Viewing total counts - switch to 'By Page' for page-by-page breakdown"}
          </span>
        </div>
      )}

      <Modal
        isOpen={showExportModal}
        title="Export Information"
        message={exportMessage}
        confirmText="OK"
        onConfirm={() => setShowExportModal(false)}
        onCancel={() => setShowExportModal(false)}
        type="info"
      />
    </div>
  );
};

export default ExportTools;