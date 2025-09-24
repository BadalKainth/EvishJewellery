import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import client from "../api/client";

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

  const refreshCart = useCallback(async () => {
    setLoading(true);
    try {
      const res = await client.get("/cart");
      if (res?.success) {
        setCart(res.data.cart);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

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
    await client.delete("/cart/clear");
    await refreshCart();
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
