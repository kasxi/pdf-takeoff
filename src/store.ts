import { create } from 'zustand';
import { AppState, Annotation, Symbol, PageSymbolCount } from './types';

export const useAppStore = create<AppState>((set, get) => ({
  pdfFile: null,
  symbols: [],
  annotations: [],
  activePage: 1,
  totalPages: 0,
  activeSymbol: null,
  scale: 1.0,
  
  setPdfFile: (file) => set({ pdfFile: file }),
  setTotalPages: (pages) => set({ totalPages: pages }),
  setActivePage: (page) => set({ activePage: page }),
  setScale: (scale) => set({ scale: scale }),
  
  addSymbol: (symbolData) => {
    const id = `symbol-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newSymbol: Symbol = { 
      ...symbolData, 
      id, 
      count: 0,
      size: symbolData.size || 24 // Default size if not provided
    };
    set((state) => ({ 
      symbols: [...state.symbols, newSymbol],
      activeSymbol: newSymbol
    }));
  },
  
  removeSymbol: (id) => {
    set((state) => {
      // Remove all annotations that use this symbol
      const filteredAnnotations = state.annotations.filter(
        (annotation) => annotation.symbolId !== id
      );
      
      return {
        symbols: state.symbols.filter((s) => s.id !== id),
        annotations: filteredAnnotations,
        activeSymbol: state.activeSymbol?.id === id ? null : state.activeSymbol,
      };
    });
  },
  
  setActiveSymbol: (symbol) => set({ activeSymbol: symbol }),
  
  addAnnotation: (annotationData) => {
    const id = `annotation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    set((state) => {
      return { annotations: [...state.annotations, { ...annotationData, id }] };
    });
  },
  
  removeAnnotation: (id) => {
    set((state) => ({
      annotations: state.annotations.filter((a) => a.id !== id),
    }));
  },
  
  getAnnotationsForPage: (pageNumber) => {
    return get().annotations.filter((a) => a.pageNumber === pageNumber);
  },
  
  getSymbolById: (id) => {
    return get().symbols.find((s) => s.id === id);
  },
  
  getSymbolCount: (id) => {
    return get().annotations.filter((a) => a.symbolId === id).length;
  },

  // New functions for per-page counts
  getSymbolCountByPage: (id, pageNumber) => {
    return get().annotations.filter(
      (a) => a.symbolId === id && a.pageNumber === pageNumber
    ).length;
  },

  getSymbolPageCounts: (id) => {
    const { annotations, totalPages } = get();
    const pageCounts: PageSymbolCount[] = [];
    
    // Initialize counts for all pages
    for (let page = 1; page <= totalPages; page++) {
      const count = annotations.filter(
        (a) => a.symbolId === id && a.pageNumber === page
      ).length;
      
      if (count > 0) {
        pageCounts.push({ page, count });
      }
    }
    
    return pageCounts;
  },

  getPagesWithSymbols: () => {
    const { annotations, totalPages } = get();
    const pagesWithSymbols = new Set<number>();
    
    annotations.forEach(a => pagesWithSymbols.add(a.pageNumber));
    
    return Array.from(pagesWithSymbols).sort((a, b) => a - b);
  },
}));