import React from "react";

const Terms = () => {
  return (
    <div className="max-w-7xl mx-auto px-8 py-8 bg-gradient-to-b from-yellow-50 via-pink-50 to-white shadow-2xl rounded-2xl my-8 border border-yellow-100">
      <header className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 via-amber-700 to-amber-500">
          Terms & Conditions
        </h1>
        <p className="text-sm md:text-base text-gray-700">
          Avish Jewels — Transparency, Trust & Commitment
        </p>
      </header>

      <section className="mb-6">
        <p className="text-gray-800 leading-relaxed">
          Welcome to Avish Jewels! By accessing and using our website, you agree
          to the following Terms & Conditions. Please read them carefully before
          making any purchase.
        </p>
      </section>

      <hr className="my-6 border-dashed" />

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">1. Orders & Payments</h2>
        <ul className="list-disc list-inside text-gray-800">
          <li>
            All orders are processed only after full payment confirmation.
          </li>
          <li>
            Prices listed on our website are final and inclusive of applicable
            taxes (unless stated otherwise).
          </li>
          <li>
            Payments must be made through our secure payment gateways or
            approved methods.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">2. Shipping & Delivery</h2>
        <ul className="list-disc list-inside text-gray-800">
          <li>
            Domestic orders (India) are usually delivered within 2–7 business
            days after dispatch.
          </li>
          <li>
            International orders may take 6–15 business days, depending on the
            courier and customs clearance.
          </li>
          <li>
            Delivery timelines are estimates and delays due to courier/customs
            are beyond our control.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">
          3. Return, Replacement & Warranty
        </h2>
        <ul className="list-disc list-inside text-gray-800">
          <li>
            We <strong>do not accept returns or refunds</strong> once the order
            is shipped.
          </li>
          <li>
            In case of manufacturing defects or damage during delivery, we offer{" "}
            <strong>replacement or repair only</strong>.
          </li>
          <li>
            Customers must provide an unboxing video for reporting any issues
            within 24 hours of delivery.
          </li>
          <li>
            No warranty is provided against daily wear & tear, mishandling, or
            exposure to chemicals/water.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">4. Product Information</h2>
        <ul className="list-disc list-inside text-gray-800">
          <li>
            All jewelry pieces are handcrafted, so slight variations in design,
            size, or color may occur.
          </li>
          <li>
            Product images are for reference; actual items may differ slightly
            due to photography & lighting.
          </li>
          <li>Such variations do not qualify as defects.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">
          5. Intellectual Property
        </h2>
        <p className="text-gray-800 leading-relaxed">
          All designs, product descriptions, logos, and images on Avish Jewels
          are the intellectual property of our brand. Unauthorized use,
          reproduction, or distribution is strictly prohibited.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">
          6. Limitation of Liability
        </h2>
        <p className="text-gray-800 leading-relaxed">
          Avish Jewels is not responsible for delays, loss, or damages caused by
          courier partners, customs authorities, or circumstances beyond our
          control. Maximum liability is limited to the order value.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">7. Governing Law</h2>
        <p className="text-gray-800 leading-relaxed">
          These Terms & Conditions shall be governed by and interpreted in
          accordance with the laws of India. Any disputes will fall under the
          jurisdiction of Delhi courts.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">8. Contact Us</h2>
        <p className="text-gray-800 leading-relaxed">
          For questions or concerns regarding these Terms & Conditions:
          <br />
          📩 Email:{" "}
          <a
            href="mailto:info@avishjewels.com"
            className="text-blue-600 underline"
          >
            info@avishjewels.com
          </a>
          <br />
          📞 WhatsApp / Call:{" "}
          <a
            href="https://wa.me/918882825761"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 underline"
          >
            +91 8882825761
          </a>
        </p>
      </section>

      <footer className="text-center text-sm text-gray-600">
        <p>© {new Date().getFullYear()} Avish Jewels. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Terms;
