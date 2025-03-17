export interface Symbol {
  id: string;
  name: string;
  color: string;
  shape: 'circle' | 'square' | 'triangle' | 'custom';
  size: number;
  count: number;
  icon?: string;
}

export interface Annotation {
  id: string;
  symbolId: string;
  pageNumber: number;
  x: number;
  y: number;
}

export interface PageSymbolCount {
  page: number;
  count: number;
}

export interface AppState {
  pdfFile: File | null;
  symbols: Symbol[];
  annotations: Annotation[];
  activePage: number;
  totalPages: number;
  activeSymbol: Symbol | null;
  scale: number;
  
  setPdfFile: (file: File | null) => void;
  setTotalPages: (pages: number) => void;
  setActivePage: (page: number) => void;
  setScale: (scale: number) => void;
  
  addSymbol: (symbol: Omit<Symbol, 'id' | 'count'>) => void;
  removeSymbol: (id: string) => void;
  setActiveSymbol: (symbol: Symbol | null) => void;
  
  addAnnotation: (annotation: Omit<Annotation, 'id'>) => void;
  removeAnnotation: (id: string) => void;
  getAnnotationsForPage: (pageNumber: number) => Annotation[];
  getSymbolById: (id: string) => Symbol | undefined;
  getSymbolCount: (id: string) => number;
  
  // New functions for per-page counts
  getSymbolCountByPage: (id: string, pageNumber: number) => number;
  getSymbolPageCounts: (id: string) => PageSymbolCount[];
  getPagesWithSymbols: () => number[];
}