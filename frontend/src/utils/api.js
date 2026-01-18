/**
 * BASE_URL configuration
 * Consistently set to port 5000 to match our Vite proxy settings.
 */
const BASE_URL = "http://localhost:5000";

// Named export: allows import { BASE_URL } from './config'
export { BASE_URL };

// Default export: allows import BASE_URL from './config'
export default BASE_URL;