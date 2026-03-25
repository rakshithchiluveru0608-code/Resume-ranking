/**
 * Base URL for API calls.
 * - Locally: empty string → Vite proxy handles /api → localhost:5000
 * - Production: set VITE_API_URL=https://your-backend.onrender.com in Vercel env vars
 */
export const API_BASE = import.meta.env.VITE_API_URL ?? "";
