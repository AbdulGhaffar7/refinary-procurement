const env = import.meta.env;

export const BASE_URL_PROCUREMENT = env.VITE_BASE_URL_PROCUREMENT;
export const BASE_URL_CATALOG = env.VITE_BASE_URL_CATALOG;
export const REFETCH_INTERVAL = parseInt(env.VITE_REFERSH_INTERVAL) || 30000; // 30 seconds
