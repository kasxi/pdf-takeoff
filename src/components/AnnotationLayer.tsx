import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Annotation, Symbol } from '../types';
import Modal from './Modal';

interface AnnotationLayerProps {
  pageNumber: number;
  scale: number;
  width: number;
  height: number;
}

const AnnotationLayer: React.FC<AnnotationLayerProps> = ({ 
  pageNumber,
  scale,
  width,
  height
}) => {
  const { 
    getAnnotationsForPage,
    getSymbolById,
    removeAnnotation
  } = useAppStore();
  
  const [showModal, setShowModal] = useState(false);
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null);
  
  const annotations = getAnnotationsForPage(pageNumber);

  const handleRemoveClick = (annotationId: string) => {
    setSelectedAnnotation(annotationId);
    setShowModal(true);
  };

  const confirmRemoval = () => {
    if (selectedAnnotation) {
      removeAnnotation(selectedAnnotation);
    }
    setShowModal(false);
    setSelectedAnnotation(null);
  };

  const renderSymbol = (annotation: Annotation, symbol: Symbol) => {
    const { shape, color, size } = symbol;
    const symbolSize = size || 24; // Use symbol size or default to 24
    
    switch (shape) {
      case 'circle':
        return (
          <div 
            className="absolute cursor-pointer hover:opacity-80 flex items-center justify-center transform hover:scale-110 transition-transform duration-150"
            style={{
              left: `${annotation.x * scale - symbolSize/2}px`,
              top: `${annotation.y * scale - symbolSize/2}px`,
              width: `${symbolSize}px`,
              height: `${symbolSize}px`,
              backgroundColor: color,
              borderRadius: '50%',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              zIndex: 10,
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveClick(annotation.id);
            }}
            title={`${symbol.name} (Click to remove)`}
          />
        );
      case 'square':
        return (
          <div 
            className="absolute cursor-pointer hover:opacity-80 flex items-center justify-center transform hover:scale-110 transition-transform duration-150"
            style={{
              left: `${annotation.x * scale - symbolSize/2}px`,
              top: `${annotation.y * scale - symbolSize/2}px`,
              width: `${symbolSize}px`,
              height: `${symbolSize}px`,
              backgroundColor: color,
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              zIndex: 10,
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveClick(annotation.id);
            }}
            title={`${symbol.name} (Click to remove)`}
          />
        );
      case 'triangle':
        return (
          <div 
            className="absolute cursor-pointer hover:opacity-80 transform hover:scale-110 transition-transform duration-150"
            style={{
              left: `${annotation.x * scale - symbolSize/2}px`,
              top: `${annotation.y * scale - symbolSize/2}px`,
              width: 0,
              height: 0,
              borderLeft: `${symbolSize/2}px solid transparent`,
              borderRight: `${symbolSize/2}px solid transparent`,
              borderBottom: `${symbolSize}px solid ${color}`,
              filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.2))',
              zIndex: 10,
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveClick(annotation.id);
            }}
            title={`${symbol.name} (Click to remove)`}
          />
        );
      default:
        return (
          <div 
            className="absolute cursor-pointer hover:opacity-80 flex items-center justify-center text-white font-bold transform hover:scale-110 transition-transform duration-150"
            style={{
              left: `${annotation.x * scale - symbolSize/2}px`,
              top: `${annotation.y * scale - symbolSize/2}px`,
              width: `${symbolSize}px`,
              height: `${symbolSize}px`,
              backgroundColor: color,
              borderRadius: '50%',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              zIndex: 10,
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveClick(annotation.id);
            }}
            title={`${symbol.name} (Click to remove)`}
          >
            {symbol.name.charAt(0).toUpperCase()}
          </div>
        );
    }
  };

  return (
    <>
      <div 
        className="absolute top-0 left-0 pointer-events-none" 
        style={{ width: width * scale, height: height * scale }}
      >
        {annotations.map((annotation) => {
          const symbol = getSymbolById(annotation.symbolId);
          if (!symbol) return null;
          
          return (
            <div key={annotation.id} className="pointer-events-auto">
              {renderSymbol(annotation, symbol)}
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={showModal}
        title="Remove Annotation"
        message="Are you sure you want to remove this annotation?"
        confirmText="Remove"
        onConfirm={confirmRemoval}
        onCancel={() => setShowModal(false)}
        type="warning"
      />
    </>
  );
};

export default AnnotationLayer;