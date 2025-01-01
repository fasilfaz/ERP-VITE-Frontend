const baseUrl = import.meta.env.VITE_BASE_URL;

// auth
const loginEndpoint = import.meta.env.VITE_LOGIN_URL;
const registerEndpoint = import.meta.env.VITE_REGISTER_URL;

// items
const getAllItemsEndpoint = import.meta.env.VITE_GET_ALL_ITEMS_URL;

// =============================================================================================================

// auth
export const LOGIN_API = baseUrl + loginEndpoint;
export const REGISTER_API = baseUrl + registerEndpoint;

// items
export const GET_ALL_ITEMS_API = baseUrl + getAllItemsEndpoint;