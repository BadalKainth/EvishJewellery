import React, { useContext, useState } from "react";
import { CartContext } from "../../context/CartContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { toast } from "react-toastify";
import { getImageURL } from "../../api/client";
import CartCoupons from "../CartCoupons";

const Cart = () => {
  const { cart, applyCoupon, updateItem, removeItem, clear, setCart } =
    useContext(CartContext);

  const [preview, setPreview] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  ///////////////////////////////////////////////////////////

  /// Guest cart logic ///

  ///////////////////////////////////////////////////

  // const GUEST_CART_KEY = "guestCart";

  // const loadGuestCart = () => {
  //   try {
  //     return (
  //       JSON.parse(localStorage.getItem(GUEST_CART_KEY)) || {
  //         items: [],
  //         totals: {},
  //       }
  //     );
  //   } catch {
  //     return { items: [], totals: {} };
  //   }
  // };

  // const saveGuestCart = (cart) => {
  //   localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
  // };

  // map items safely (cart may be null initially)
  const cartItems =
    cart?.items?.map((i) => ({
      name: i.product?.name,
      price: i.product?.originalPrice || 0,
      discountPrice: i.product?.price || 0,
      images:
        i.product?.images?.map((img) =>
          typeof img === "string" ? img : img.url
        ) || (i.product?.primaryImage ? [i.product.primaryImage] : []),
      videos:
        i.product?.videos?.map((v) => (typeof v === "string" ? v : v.url)) ||
        [],
      size: i.product?.size,
      description: i.product?.description,
      deliveryCharges: i.product?.deliveryCharges || 0,
      productId: i.product?._id,
      quantity: i.quantity,
    })) || [];

  // Derived totals
  const totalItems = cartItems.reduce(
    (acc, item) => acc + (item.quantity || 0),
    0
  );
  const originalTotal = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 0),
    0
  );
  const discountedTotal = cartItems.reduce(
    (acc, item) => acc + (item.discountPrice || 0) * (item.quantity || 0),
    0
  );
  const discountAmount = originalTotal - discountedTotal;
  const deliveryCharge = cartItems.reduce(
    (acc, item) => acc + (item.deliveryCharges || 0) * (item.quantity || 0),
    0
  );

  // Server totals fallback
  const subtotal = cart?.totals?.subtotal ?? discountedTotal;
  const serverCouponDiscount = cart?.totals?.coupon?.discount ?? 0;
  const totalFromServer =
    (cart?.totals?.total ?? subtotal) - (serverCouponDiscount || 0);

  // Apply coupon
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }
    try {
      const res = await applyCoupon(couponCode.trim());
      if (res?.success) {
        toast.success(res.message || "Coupon applied");
        setCouponCode("");
      } else {
        toast.error(res?.message || "Coupon invalid");
      }
    } catch (err) {
      console.error(err);
      toast.error("Coupon validation failed");
    }
  };

  const handleRemoveProduct = (index) => {
    const item = cartItems[index];
    if (item?.productId) removeItem(item.productId);
  };

  // Fallback box for broken media
  const fallbackBox = (text) => (
    <div className="w-full h-48 sm:h-56 md:h-72 flex items-center justify-center bg-gray-100 rounded-t-xl">
      <span className="text-gray-400 font-semibold text-center px-2">
        {text}
      </span>
    </div>
  );

  // Render media
  const renderMedia = (product) => {
    const totalMedia =
      (product.images?.length || 0) + (product.videos?.length || 0);

    if (product.images?.length === 1 && !product.videos?.length) {
      const src = product.images[0];
      return (
        <img
          src={getImageURL(src)}
          alt={product.name}
          className="w-full max-w-full h-auto max-h-48 sm:max-h-56 md:max-h-72 object-cover rounded-t-xl cursor-pointer"
          onClick={() => setPreview({ type: "image", src: getImageURL(src) })}
          onError={(e) => e.target.replaceWith(fallbackBox(product.name))}
        />
      );
    }

    if (product.videos?.length === 1 && !product.images?.length) {
      const src = product.videos[0];
      return (
        <video
          src={getImageURL(src)}
          className="w-full max-w-full h-auto max-h-48 sm:max-h-56 md:max-h-72 object-contain rounded-t-xl cursor-pointer"
          onClick={() => setPreview({ type: "video", src: getImageURL(src) })}
          controls
          muted
          loop
          onError={(e) => e.target.replaceWith(fallbackBox(product.name))}
        />
      );
    }

    if (totalMedia > 1) {
      return (
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          className="w-full max-w-full rounded-t-xl"
        >
          {product.images?.map((img, i) => (
            <SwiperSlide
              key={`img-${i}`}
              className="flex justify-center items-center"
            >
              <img
                src={getImageURL(img)}
                alt={`${product.name}-${i}`}
                className="w-full max-w-full h-auto max-h-48 sm:max-h-56 md:max-h-72 object-cover cursor-pointer rounded"
                onClick={() =>
                  setPreview({ type: "image", src: getImageURL(img) })
                }
                onError={(e) => e.target.replaceWith(fallbackBox(product.name))}
              />
            </SwiperSlide>
          ))}
          {product.videos?.map((vid, i) => (
            <SwiperSlide
              key={`vid-${i}`}
              className="flex justify-center items-center"
            >
              <video
                src={getImageURL(vid)}
                className="w-full max-w-full h-auto max-h-48 sm:max-h-56 md:max-h-72 object-contain cursor-pointer rounded"
                onClick={() =>
                  setPreview({ type: "video", src: getImageURL(vid) })
                }
                controls
                muted
                loop
                onError={(e) => e.target.replaceWith(fallbackBox(product.name))}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      );
    }

    return fallbackBox("No preview");
  };

  return (
    <div className="p-4 md:p-8 w-full bg-gray-50 min-h-screen">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row gap-8">
        {/* Left: Cart Items */}
        <div className="w-full md:flex-1 min-w-0">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
            Your Cart
          </h1>
          {cartItems.length === 0 ? (
            <p className="text-gray-600 text-lg">No items in cart.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6">
              {cartItems.map((product, index) => {
                const itemDiscount =
                  (product.price || 0) - (product.discountPrice || 0);
                const itemDiscountPercent = Math.round(
                  (itemDiscount / Math.max(product.price || 1, 1)) * 100
                );

                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 flex flex-col max-w-full w-full min-w-0 overflow-hidden"
                  >
                    <div className="w-full overflow-hidden">
                      {renderMedia(product)}
                    </div>
                    <div className="p-4 flex flex-col justify-between flex-1 min-w-0">
                      <div className="min-w-0">
                        <h2 className="uppercase text-lg md:text-xl font-semibold text-gray-900 mb-2 line-clamp-1 break-words">
                          {product.name}
                          {product.size && (
                            <span className="pl-2 text-green-600 font-medium text-sm">
                              (Size: {product.size})
                            </span>
                          )}
                        </h2>
                        <p className="text-sm text-gray-800 line-clamp-2 break-words">
                          {product.description}
                        </p>
                        {/* <span className="text-sm text-gray-500 block mt-2">
                          Delivery: ₹
                          {(
                            (product.deliveryCharges || 0) *
                            (product.quantity || 0)
                          ).toLocaleString("en-IN")}
                        </span> */}
                      </div>
                      <div className="flex justify-between items-center mt-3 gap-4">
                        <div className="flex flex-col text-lg min-w-0">
                          <span className="line-through decoration-2 text-amber-600 font-bold decoration-amber-700 text-2xl">
                            Price: ₹
                            {(product.price || 0).toLocaleString("en-IN")}
                          </span>
                          <span className="font-bold text-green-600 text-lg">
                            Discount Price: ₹
                            {(product.discountPrice || 0).toLocaleString(
                              "en-IN"
                            )}
                          </span>
                          <span className="text-sm text-gray-600 font-bold">
                            🎉 You saved ₹
                            {(
                              (itemDiscount || 0) * (product.quantity || 0)
                            ).toLocaleString("en-IN")}{" "}
                            ({itemDiscountPercent}% Off)
                          </span>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <input
                            type="number"
                            min={1}
                            max={99}
                            value={product.quantity}
                            onChange={(e) =>
                              updateItem(
                                product.productId,
                                Number(e.target.value)
                              )
                            }
                            className="w-20 border rounded px-2 py-1 text-center"
                          />
                          <button
                            onClick={() => handleRemoveProduct(index)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Summary */}
        <aside className="w-full lg:w-96 bg-white p-6 rounded-xl shadow-md h-fit lg:sticky lg:top-20 min-w-0">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Summary</h2>
          <div className="flex justify-between mb-2">
            <span className="text-gray-700">Total Items:</span>
            <span className="font-semibold">{totalItems}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-700">Original Total:</span>
            <span className="font-semibold">
              ₹{originalTotal.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-700">Discounted Total:</span>
            <span className="font-semibold text-amber-600">
              ₹{discountedTotal.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-700">Total Discount:</span>
            <span className="font-semibold text-green-600">
              -₹{discountAmount.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="text-gray-700">Delivery Charges:</span>
            <span className="font-semibold text-red-600">
              ₹{deliveryCharge.toLocaleString("en-IN")}
            </span>
          </div>

          {/* Coupon */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter coupon code"
              className="border px-3 py-2 rounded-lg flex-1"
            />
            <button
              onClick={handleApplyCoupon}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Apply
            </button>
          </div>
          <CartCoupons />
          {/* server totals box (will show coupon and final total returned by backend) */}
          <div className="p-4 border rounded-lg shadow mb-4">
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>₹{(subtotal ?? 0).toLocaleString("en-IN")}</span>
            </div>

            {serverCouponDiscount > 0 && (
              <div className="flex justify-between mb-2 text-green-600 font-semibold">
                <span>Coupon Discount:</span>
                <span>-₹{serverCouponDiscount.toLocaleString("en-IN")}</span>
              </div>
            )}

            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>₹{(totalFromServer ?? 0).toLocaleString("en-IN")}</span>
            </div>
          </div>

          {cartItems.length > 0 && (
            <div className="space-y-2">
              <button
                className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg font-semibold transition"
                onClick={() => (window.location.href = "/checkout")}
              >
                Proceed to Checkout
              </button>
              <button
                className="w-full border py-3 rounded-lg"
                onClick={() => {
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
                }}
              >
                Clear Cart
              </button>
            </div>
          )}
        </aside>
      </div>

      {/* Preview Modal */}
      {preview && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-3 overflow-auto"
          onClick={() => setPreview(null)}
        >
          <div
            className="relative max-w-full max-h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreview(null)}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md z-50"
            >
              Close
            </button>
            {preview.type === "image" ? (
              <img
                src={preview.src}
                alt="Preview"
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
              />
            ) : (
              <video
                src={preview.src}
                controls
                autoPlay
                muted
                loop
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
