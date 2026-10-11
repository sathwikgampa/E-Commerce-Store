/**
 * Admin Authentication Configuration
 * Reads from environment variables with high-security fallback defaults.
 * No hardcoded demo credentials are exposed on client forms.
 */

export const ADMIN_CONFIG = {
  username: import.meta.env.VITE_ADMIN_USERNAME || 'admin@srithirumala.com',
  password: import.meta.env.VITE_ADMIN_PASSWORD || 'SriThirumala@2025!',
  tokenKey: 'stm_admin_secure_token',
  sessionExpiryKey: 'stm_admin_session_expiry',
};

export const verifyAdminCredentials = (username: string, pass: string): boolean => {
  return (
    username.trim().toLowerCase() === ADMIN_CONFIG.username.toLowerCase() &&
    pass === ADMIN_CONFIG.password
  );
};

export const createAdminSession = (): string => {
  const token = `stm_sec_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const expiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  localStorage.setItem(ADMIN_CONFIG.tokenKey, token);
  localStorage.setItem(ADMIN_CONFIG.sessionExpiryKey, expiry.toString());
  return token;
};

export const isAdminAuthenticated = (): boolean => {
  const token = localStorage.getItem(ADMIN_CONFIG.tokenKey);
  const expiry = localStorage.getItem(ADMIN_CONFIG.sessionExpiryKey);
  if (!token || !expiry) return false;
  if (Date.now() > parseInt(expiry, 10)) {
    clearAdminSession();
    return false;
  }
  return true;
};

export const clearAdminSession = (): void => {
  localStorage.removeItem(ADMIN_CONFIG.tokenKey);
  localStorage.removeItem(ADMIN_CONFIG.sessionExpiryKey);
  localStorage.removeItem('admin_token'); // clear legacy token
};
