import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useContext,
} from "react";
import client, { setAuthToken } from "../api/client";
import { CartContext } from "./CartContext"; // ✅ import CartContext

export const AuthContext = createContext({
  user: null,
  token: null,
  loading: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  refresh: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // ✅ Access cart functions
  const { clear, setCart } = useContext(CartContext);

  const fetchMe = useCallback(async () => {
    if (!token) return null;
    try {
      const res = await client.get("/auth/me");
      if (res?.success) setUser(res.data.user);
      return res?.data?.user || null;
    } catch {
      return null;
    }
  }, [token]);

  useEffect(() => {
    setAuthToken(token || "");
    (async () => {
      if (token) await fetchMe();
      setLoading(false);
    })();
  }, [token, fetchMe]);

  const login = useCallback(async ({ email, password }) => {
    const res = await client.post("/auth/login", { email, password });
    if (res?.success) {
      const t = res.data.token;
      const rt = res.data.refreshToken;
      setToken(t);
      setAuthToken(t);
      if (rt) localStorage.setItem("refreshToken", rt);
      setUser(res.data.user);
    }
    return res;
  }, []);

  const register = useCallback(
    async ({ name, email, phone, password, confirmPassword }) => {
      const res = await client.post("/auth/register", {
        name,
        email,
        phone,
        password,
        confirmPassword,
      });
      if (res?.success) {
        const t = res.data.token;
        const rt = res.data.refreshToken;
        setToken(t);
        setAuthToken(t);
        if (rt) localStorage.setItem("refreshToken", rt);
        setUser(res.data.user);
      }
      return res;
    },
    []
  );

  const refresh = useCallback(async (refreshToken) => {
    try {
      const res = await client.post("/auth/refresh", { refreshToken });
      if (res?.success) {
        const t = res.data.token;
        setToken(t);
        setAuthToken(t);
      }
      return res;
    } catch (e) {
      return null;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await client.post("/auth/logout");
    } catch {}

    setUser(null);
    setToken(null);
    setAuthToken("");
    localStorage.removeItem("refreshToken");

    // ✅ Clear Cart on logout
    clear();
    setCart({
      items: [],
      totals: {
        subtotal: 0,
        discount: 0,
        total: 0,
        totalItems: 0,
        coupon: { discount: 0 },
      },
      itemCount: 0,
    });
  }, [clear, setCart]);

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout, refresh }),
    [user, token, loading, login, register, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
