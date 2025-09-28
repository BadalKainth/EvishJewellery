import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useContext,
} from "react";
import client from "../api/client";
import { AuthContext } from "./AuthContext"; // ✅ import auth

export const CartContext = createContext({
  cart: {
    items: [],
    totals: { subtotal: 0, discount: 0, total: 0, totalItems: 0 },
    itemCount: 0,
  },
  loading: false,
  refreshCart: async () => {},
  addItem: async () => {},
  updateItem: async () => {},
  removeItem: async () => {},
  clear: async () => {},
  applyCoupon: async () => {},
  removeCoupon: async () => {},
});

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext); // ✅ get token

  const refreshCart = useCallback(async () => {
    setLoading(true);
    try {
      const res = await client.get("/cart");
      if (res?.success) {
        const newCart = res.data.cart;

        // ✅ if cart is empty → remove coupon
        if (!newCart.items || newCart.items.length === 0) {
          try {
            await client.delete("/cart/remove-coupon");
            newCart.totals.coupon = { discount: 0 }; // clean local too if your API doesn’t return
          } catch (err) {
            console.error("Failed to remove coupon:", err);
          }
        }

        setCart(newCart);
      } else {
        setCart({
          items: [],
          totals: { subtotal: 0, discount: 0, total: 0, totalItems: 0 },
          itemCount: 0,
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      // ✅ Logged in → fetch cart
      refreshCart();
    } else {
      // ✅ Logged out → clear cart instantly
      setCart({
        items: [],
        totals: { subtotal: 0, discount: 0, total: 0, totalItems: 0 },
        itemCount: 0,
      });
    }
  }, [token, refreshCart]);

  const addItem = useCallback(
    async (productId, quantity = 1) => {
      await client.post("/cart/add", { product: productId, quantity });
      await refreshCart();
    },
    [refreshCart]
  );

  const updateItem = useCallback(
    async (productId, quantity) => {
      await client.put(`/cart/update/${productId}`, { quantity });
      await refreshCart();
    },
    [refreshCart]
  );

  const removeItem = useCallback(
    async (productId) => {
      await client.delete(`/cart/remove/${productId}`);
      await refreshCart();
    },
    [refreshCart]
  );

  const clear = useCallback(async () => {
    setCart({
      items: [],
      totals: { subtotal: 0, discount: 0, total: 0, totalItems: 0 },
      itemCount: 0,
    });
    try {
      await client.delete("/cart/clear");
      await refreshCart();
    } catch (e) {
      console.error("Failed to clear cart:", e);
    }
  }, [refreshCart]);

  const applyCoupon = useCallback(
    async (couponCode) => {
      await client.post("/cart/apply-coupon", { couponCode });
      await refreshCart();
    },
    [refreshCart]
  );

  const removeCoupon = useCallback(async () => {
    await client.delete("/cart/remove-coupon");
    await refreshCart();
  }, [refreshCart]);

  const value = useMemo(
    () => ({
      cart: cart || {
        items: [],
        totals: { subtotal: 0, discount: 0, total: 0, totalItems: 0 },
        itemCount: 0,
      },
      loading,
      refreshCart,
      addItem,
      updateItem,
      removeItem,
      clear,
      applyCoupon,
      removeCoupon,
    }),
    [
      cart,
      loading,
      refreshCart,
      addItem,
      updateItem,
      removeItem,
      clear,
      applyCoupon,
      removeCoupon,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
