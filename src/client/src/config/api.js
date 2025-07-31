const API_BASE_URL = (() => {
  if (import.meta.env.DEV) {
    return '';
  }

  return import.meta.env.VITE_API_URL || 'http://localhost:3001';
})();

export default API_BASE_URL;
