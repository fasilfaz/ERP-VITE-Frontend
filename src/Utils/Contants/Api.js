const baseUrl = import.meta.env.VITE_BASE_URL;
const loginEndpoint = import.meta.env.VITE_LOGIN_URL;
const registerEndpoint = import.meta.env.VITE_REGISTER_URL;

export const LOGIN_API = baseUrl + loginEndpoint;
export const REGISTER_API = baseUrl + registerEndpoint;