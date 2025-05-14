
// This file now simply re-exports from our modular context system
// for backward compatibility

export { useAppContext, AppProvider } from './contexts/app-context';
export type { AppContextType } from './contexts/app-context-types';
export { useRealTimeSync } from './hooks/useRealTimeSync';
