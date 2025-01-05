const baseUrl = import.meta.env.VITE_BASE_URL;

// auth
const loginEndpoint = import.meta.env.VITE_LOGIN_URL;
const registerEndpoint = import.meta.env.VITE_REGISTER_URL;

// items
const getAllItemsEndpoint = import.meta.env.VITE_GET_ALL_ITEMS_URL;
const deleteItemsEndpoint = import.meta.env.VITE_DELETE_ITEMS_URL;
const updateItemsEndpoint = import.meta.env.VITE_UPDATE_ITEMS_URL;
const addItemsEndpoint = import.meta.env.VITE_ADD_ITEMS_URL;

// bills
const getAllBillsEndpoint = import.meta.env.VITE_GET_BILL_URL;
const addBillsEndpoint = import.meta.env.VITE_ADD_BILL_URL;
// =============================================================================================================

// auth
export const LOGIN_API = baseUrl + loginEndpoint;
export const REGISTER_API = baseUrl + registerEndpoint;

// items
export const GET_ALL_ITEMS_API = baseUrl + getAllItemsEndpoint;
export const DELETE_ITEMS_API = baseUrl + deleteItemsEndpoint;
export const ADD_ITEMS_API = baseUrl + addItemsEndpoint;
export const UPDATE_ITEMS_API = baseUrl + updateItemsEndpoint;

// bills
export const GET_ALL_BILLS_API = baseUrl + getAllBillsEndpoint;
export const ADD_BILLS_API = baseUrl + addBillsEndpoint;