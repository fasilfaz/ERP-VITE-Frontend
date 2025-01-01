import { toast } from "react-toastify";

class TokenExpiryManager {
  static instance;
  isAlertShown = false;

  constructor() {
    if (TokenExpiryManager.instance) {
      return TokenExpiryManager.instance;
    }
    TokenExpiryManager.instance = this;
  }

  static getInstance() {
    if (!TokenExpiryManager.instance) {
      TokenExpiryManager.instance = new TokenExpiryManager();
    }
    return TokenExpiryManager.instance;
  }

  handleTokenExpiry() {
    if (this.isAlertShown) return;
    this.isAlertShown = true;
    const timer = 5000;
    toast.error("Session expired. Redirecting to login page...", {
      position: "top-center",
      autoClose: timer,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
    });

    setTimeout(() => {
      localStorage.removeItem("token");
      window.location.href = "/login";
      this.isAlertShown = false;
    }, timer);
  }
}

const tokenExpiryManager = TokenExpiryManager.getInstance();

const apiRequest = async (method, url, data) => {
  let token = localStorage.getItem("token");
  const timer = 5000;
  if (!token) {
    toast.error("Session expired. Redirecting to login page...", {
      position: "top-center",
      autoClose: timer,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
    });

    setTimeout(() => {
      window.location.href = "/login";
    }, timer);

    return {
      success: false,
      data: null,
      message: "Not authenticated",
    };
  }

  try {
    const response = await fetch(`${url}`, {
      method,
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Something went wrong");
    }

    const responseData = await response.json();

    return {
      success: true,
      data: responseData,
      message: response.statusText,
    };
  } catch (error) {
    if (error.message === "jwt expired") {
      tokenExpiryManager.handleTokenExpiry();
    }
    return {
      success: false,
      data: null,
      message: error.message || "An error occurred",
    };
  }
};

// HTTP method exports
export const get = async (url) => {
  return apiRequest("GET", url, undefined);
};

export const post = async (url, data) => {
  return apiRequest("POST", url, data);
};

export const put = async (url, data) => {
  return apiRequest("PUT", url, data);
};

export const patch = async (url, data) => {
  return apiRequest("PATCH", url, data);
};

export const del = async (url) => {
  return apiRequest("DELETE", url, undefined);
};
