import React, { useState, useRef } from 'react';
import { Plus, Trash2, Circle, Square, Triangle, Settings, Check, Info } from 'lucide-react';
import { useAppStore } from '../store';
import { Symbol } from '../types';
import clsx from 'clsx';
import Modal from './Modal';
import Popover from './Popover';

const COLORS = [
  '#FF5252', // Red
  '#FF4081', // Pink
  '#9C27B0', // Purple
  '#673AB7', // Deep Purple
  '#3F51B5', // Indigo
  '#2196F3', // Blue
  '#03A9F4', // Light Blue
  '#00BCD4', // Cyan
  '#009688', // Teal
  '#4CAF50', // Green
  '#8BC34A', // Light Green
  '#CDDC39', // Lime
  '#FFEB3B', // Yellow
  '#FFC107', // Amber
  '#FF9800', // Orange
  '#FF5722', // Deep Orange
  '#795548', // Brown
  '#607D8B', // Blue Grey
];

const SHAPES = [
  { id: 'circle', name: 'Circle', icon: Circle },
  { id: 'square', name: 'Square', icon: Square },
  { id: 'triangle', name: 'Triangle', icon: Triangle },
];

const SIZE_MIN = 12;
const SIZE_MAX = 48;

const SymbolPalette: React.FC = () => {
  const { 
    pdfFile,
    symbols, 
    activeSymbol, 
    addSymbol, 
    removeSymbol, 
    setActiveSymbol,
    getSymbolCount
  } = useAppStore();
  
  const [newSymbolForm, setNewSymbolForm] = useState({
    name: '',
    color: '#FF5252',
    shape: 'circle' as 'circle' | 'square' | 'triangle' | 'custom',
    size: 24,
  });
  
  const [isCreating, setIsCreating] = useState(false);
  const [editingSymbol, setEditingSymbol] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [symbolToDelete, setSymbolToDelete] = useState<Symbol | null>(null);
  const [showSizeTooltip, setShowSizeTooltip] = useState(false);
  
  const sizeTooltipRef = useRef<HTMLDivElement>(null);
  
  const handleAddSymbol = () => {
    if (!newSymbolForm.name.trim()) {
      alert('Please enter a name for the symbol');
      return;
    }
    
    addSymbol({
      name: newSymbolForm.name,
      color: newSymbolForm.color,
      shape: newSymbolForm.shape,
      size: newSymbolForm.size,
    });
    
    setNewSymbolForm({
      name: '',
      color: '#FF5252',
      shape: 'circle',
      size: 24,
    });
    
    setIsCreating(false);
  };
  
  const handleCancel = () => {
    setIsCreating(false);
    setNewSymbolForm({
      name: '',
      color: '#FF5252',
      shape: 'circle',
      size: 24,
    });
  };

  const toggleEditSymbol = (symbolId: string) => {
    if (editingSymbol === symbolId) {
      setEditingSymbol(null);
    } else {
      setEditingSymbol(symbolId);
    }
  };

  const handleDeleteClick = (symbol: Symbol, e: React.MouseEvent) => {
    e.stopPropagation();
    setSymbolToDelete(symbol);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (symbolToDelete) {
      removeSymbol(symbolToDelete.id);
    }
    setShowDeleteModal(false);
    setSymbolToDelete(null);
  };
  
  const getSizeLabel = (size: number) => {
    if (size <= 16) return 'Small';
    if (size <= 24) return 'Medium';
    if (size <= 32) return 'Large';
    return 'X-Large';
  };

  // Show a tooltip when hovering over a symbol name that might be truncated
  const renderSymbolTooltip = (name: string) => {
    if (name.length > 20) {
      return (
        <Popover
          trigger={
            <span className="inline-flex items-center">
              <span className="truncate max-w-[120px] inline-block">{name}</span>
              <Info className="h-3 w-3 ml-1 text-gray-400" />
            </span>
          }
          content={
            <div className="p-2 text-sm">{name}</div>
          }
          position="top"
          width="auto"
        />
      );
    }
    return <span className="truncate max-w-[140px] inline-block">{name}</span>;
  };
  
  if (!pdfFile) {
    return (
      <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm p-4 transition-all duration-300">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Symbols & Count</h3>
        <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <Circle className="mx-auto h-10 w-10 text-gray-400 mb-2" />
          <p className="text-gray-500">No PDF document loaded.</p>
          <p className="text-sm text-gray-400 mt-1">Upload a PDF document to add symbols and annotations</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm p-4 transition-all duration-300">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Symbols & Count</h3>
        {!isCreating && (
          <button
            className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-sm"
            onClick={() => setIsCreating(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Symbol
          </button>
        )}
      </div>
      
      {isCreating ? (
        <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-inner">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={newSymbolForm.name}
              onChange={(e) => setNewSymbolForm({ ...newSymbolForm, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              placeholder="Enter symbol name"
              maxLength={50}
            />
            <div className="text-xs text-gray-500 mt-1 flex justify-between">
              <span>Give your symbol a descriptive name</span>
              <span>{newSymbolForm.name.length}/50</span>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shape
            </label>
            <div className="flex space-x-2">
              {SHAPES.map((shape) => {
                const Icon = shape.icon;
                return (
                  <button
                    key={shape.id}
                    className={clsx(
                      "flex-1 p-3 border rounded-md transition-all duration-200 flex flex-col items-center justify-center",
                      newSymbolForm.shape === shape.id
                        ? "border-blue-500 bg-blue-50 shadow-sm"
                        : "border-gray-300 hover:border-blue-300 hover:bg-blue-50/50"
                    )}
                    onClick={() => setNewSymbolForm({ ...newSymbolForm, shape: shape.id as any })}
                  >
                    <Icon className="h-5 w-5 mb-1" />
                    <span className="text-xs">{shape.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Size
              </label>
              <div 
                className="text-xs font-medium bg-gray-100 rounded-full px-2 py-0.5 text-gray-700"
                onMouseEnter={() => setShowSizeTooltip(true)}
                onMouseLeave={() => setShowSizeTooltip(false)}
                ref={sizeTooltipRef}
              >
                {getSizeLabel(newSymbolForm.size)} ({newSymbolForm.size}px)
              </div>
              {showSizeTooltip && sizeTooltipRef.current && (
                <div className="absolute z-10 bg-gray-800 text-white text-xs rounded px-2 py-1 right-0 transform -translate-y-8">
                  Symbol display size
                </div>
              )}
            </div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-xs text-gray-500 whitespace-nowrap">Small</span>
              <input
                type="range"
                min={SIZE_MIN}
                max={SIZE_MAX}
                value={newSymbolForm.size}
                onChange={(e) => setNewSymbolForm({ ...newSymbolForm, size: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="text-xs text-gray-500 whitespace-nowrap">Large</span>
            </div>
            <div className="flex items-center justify-center bg-gray-100 p-3 rounded-md">
              <div 
                className="border border-gray-200 rounded bg-white flex items-center justify-center p-2"
              >
                <div 
                  style={{ 
                    width: `${newSymbolForm.size}px`, 
                    height: `${newSymbolForm.size}px`,
                    backgroundColor: newSymbolForm.color,
                    borderRadius: newSymbolForm.shape === 'circle' ? '50%' : 
                                 newSymbolForm.shape === 'square' ? '0' : '0',
                    clipPath: newSymbolForm.shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none'
                  }} 
                />
              </div>
              <span className="text-xs text-gray-500 ml-3">Preview</span>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <div className="grid grid-cols-6 gap-3">
              {COLORS.map((color) => (
                <button
                  key={color}
                  className={clsx(
                    "w-8 h-8 rounded-full transition-all duration-200 transform hover:scale-110",
                    newSymbolForm.color === color
                      ? "ring-2 ring-offset-2 ring-gray-400"
                      : ""
                  )}
                  style={{ 
                    backgroundColor: color,
                    boxShadow: newSymbolForm.color === color ? '0 0 0 2px white' : 'none'
                  }}
                  onClick={() => setNewSymbolForm({ ...newSymbolForm, color })}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors duration-200 text-gray-700"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className={clsx(
                "px-4 py-2 rounded-md text-white transition-colors duration-200 shadow-sm",
                newSymbolForm.name.trim() 
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-400 cursor-not-allowed"
              )}
              onClick={handleAddSymbol}
              disabled={!newSymbolForm.name.trim()}
            >
              Add Symbol
            </button>
          </div>
        </div>
      ) : null}
      
      {symbols.length === 0 && !isCreating ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <Circle className="mx-auto h-10 w-10 text-gray-400 mb-2" />
          <p className="text-gray-500 mb-3">No symbols created yet.</p>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-sm"
            onClick={() => setIsCreating(true)}
          >
            Create Your First Symbol
          </button>
        </div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
          {symbols.map((symbol) => {
            const count = getSymbolCount(symbol.id);
            const ShapeIcon = SHAPES.find(s => s.id === symbol.shape)?.icon || Circle;
            const isEditing = editingSymbol === symbol.id;
            const isActive = activeSymbol?.id === symbol.id;
            
            return (
              <div
                key={symbol.id}
                className={clsx(
                  "flex items-center justify-between p-2 rounded-md cursor-pointer transition-all duration-200",
                  isEditing 
                    ? "bg-gray-50 border border-gray-300 shadow-sm"
                    : isActive
                    ? "bg-blue-100 border border-blue-300 shadow-sm"
                    : "hover:bg-gray-100 border border-transparent"
                )}
                onClick={() => !isEditing && setActiveSymbol(symbol)}
              >
                <div className="flex items-center overflow-hidden">
                  <div 
                    className="flex-shrink-0 flex items-center justify-center mr-3 transition-transform duration-200"
                    style={{ 
                      width: `${symbol.size}px`, 
                      height: `${symbol.size}px`,
                      minWidth: `${symbol.size}px`,
                      backgroundColor: symbol.color,
                      borderRadius: symbol.shape === 'circle' ? '50%' : 
                                  symbol.shape === 'square' ? '0' : '0',
                      clipPath: symbol.shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none',
                      transform: isActive ? 'scale(1.1)' : 'scale(1)'
                    }}
                  >
                    {symbol.shape === 'custom' && <ShapeIcon className="h-4 w-4 text-white" />}
                  </div>
                  <div className="min-w-0">
                    {renderSymbolTooltip(symbol.name)}
                    <div className="text-xs text-gray-500 whitespace-nowrap">{getSizeLabel(symbol.size)}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-700 font-medium mr-2 bg-gray-100 px-2 py-1 rounded-md">
                    {count}
                  </span>
                  <div className="flex space-x-1">
                    <button
                      className={clsx(
                        "p-1.5 rounded-md transition-colors duration-200",
                        isEditing ? "bg-blue-100 text-blue-700" : "text-gray-500 hover:text-blue-500 hover:bg-blue-50"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleEditSymbol(symbol.id);
                      }}
                      title={isEditing ? "Save changes" : "Edit symbol"}
                    >
                      {isEditing ? <Check className="h-4 w-4" /> : <Settings className="h-4 w-4" />}
                    </button>
                    <button
                      className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors duration-200"
                      onClick={(e) => handleDeleteClick(symbol, e)}
                      title="Delete symbol"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeSymbol && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center">
          <div 
            className="flex-shrink-0 mr-3 transition-transform duration-200"
            style={{ 
              width: `${activeSymbol.size * 0.75}px`, 
              height: `${activeSymbol.size * 0.75}px`,
              backgroundColor: activeSymbol.color,
              borderRadius: activeSymbol.shape === 'circle' ? '50%' : 
                          activeSymbol.shape === 'square' ? '0' : '0',
              clipPath: activeSymbol.shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none'
            }}
          />
          <div>
            <p className="text-sm text-blue-800 font-medium">
              Active: {activeSymbol.name}
            </p>
            <p className="text-xs text-blue-600">
              Click on the PDF to place this symbol
            </p>
          </div>
        </div>
      )}

      <Modal
        isOpen={showDeleteModal}
        title="Delete Symbol"
        message={`Are you sure you want to delete the symbol "${symbolToDelete?.name}"? This will also remove all annotations using this symbol.`}
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
        type="danger"
      />
    </div>
  );
};

export default SymbolPalette;