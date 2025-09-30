const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Get the base URL for static files
const getStaticBaseURL = () => {
  let baseUrl = API_BASE_URL;

  if (baseUrl.endsWith("/api") || baseUrl.endsWith("/api/")) {
    baseUrl = baseUrl.replace(/\/api\/?$/, "");
  }

  baseUrl = baseUrl.replace(/\/+$/, "");

  return baseUrl;
};

// Convert relative image URL to absolute URL
export const getImageURL = (imagePath) => {
  if (!imagePath) return "";

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  if (imagePath.startsWith("/")) {
    return `${getStaticBaseURL()}${imagePath}`;
  }

  return `${getStaticBaseURL()}/uploads/${imagePath}`;
};

const getAuthToken = () => {
  try {
    return localStorage.getItem("token") || "";
  } catch {
    return "";
  }
};

const buildHeaders = (isJson = true) => {
  const headers = {};
  if (isJson) headers["Content-Type"] = "application/json";
  const token = getAuthToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

const handleResponse = async (res) => {
  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json().catch(() => ({})) : await res.text();
  if (!res.ok) {
    const message =
      (data && (data.message || data.error)) ||
      `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data;
};

export const apiGet = async (path, params) => {
  const url = new URL(`${API_BASE_URL}${path}`);
  if (params)
    Object.entries(params).forEach(
      ([k, v]) => v !== undefined && url.searchParams.append(k, v)
    );
  const res = await fetch(url, { method: "GET", headers: buildHeaders(false) });
  return handleResponse(res);
};

const tryRefresh = async () => {
  try {
    const storedRefresh = localStorage.getItem("refreshToken");
    if (!storedRefresh) return false;
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: storedRefresh }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data?.success) return false;
    if (data?.data?.token) localStorage.setItem("token", data.data.token);
    if (data?.data?.refreshToken)
      localStorage.setItem("refreshToken", data.data.refreshToken);
    return true;
  } catch {
    return false;
  }
};

const withAutoRefresh = async (doFetch) => {
  let res = await doFetch();
  if (res.status === 401) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      res = await doFetch();
    }
  }
  return handleResponse(res);
};

export const apiPost = async (path, body) => {
  return withAutoRefresh(() =>
    fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: buildHeaders(!(body instanceof FormData)),
      body: body instanceof FormData ? body : JSON.stringify(body ?? {}),
    })
  );
};

export const apiPut = async (path, body) => {
  return withAutoRefresh(() =>
    fetch(`${API_BASE_URL}${path}`, {
      method: "PUT",
      headers: buildHeaders(true),
      body: JSON.stringify(body ?? {}),
    })
  );
};

export const apiPatch = async (path, body) => {
  return withAutoRefresh(() =>
    fetch(`${API_BASE_URL}${path}`, {
      method: "PATCH",
      headers: buildHeaders(true),
      body: JSON.stringify(body ?? {}),
    })
  );
};

export const apiDelete = async (path) => {
  return withAutoRefresh(() =>
    fetch(`${API_BASE_URL}${path}`, {
      method: "DELETE",
      headers: buildHeaders(false),
    })
  );
};

export const setAuthToken = (token) => {
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
};

// ✅ New helper for placing order and getting QR code
export const placeOrder = async (orderData) => {
  return apiPost("/orders", orderData);
};

// ✅ Fetch public coupons (for users)
export const getPublicCoupons = async (options = {}) => {
  return apiGet("/coupons", options);
};

export default {
  get: apiGet,
  post: apiPost,
  put: apiPut,
  patch: apiPatch,
  delete: apiDelete,
  setAuthToken,
  getImageURL,
  placeOrder,
  getPublicCoupons, // added
};
