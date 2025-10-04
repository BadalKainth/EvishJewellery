import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-7xl mx-auto px-8 py-8 bg-gradient-to-b from-pink-50 via-amber-50 to-white shadow-2xl rounded-2xl my-8 border border-pink-100">
      <header className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-600 via-amber-500 to-yellow-400">
          Privacy Policy
        </h1>
        <p className="text-sm md:text-base text-gray-700">
          Avish Jewels — Your Privacy, Our Promise
        </p>
      </header>

      <section className="mb-6">
        <p className="text-gray-800 leading-relaxed">
          At Avish Jewels, we are committed to protecting your privacy and
          ensuring your shopping experience is safe and enjoyable. This Privacy
          Policy explains how we collect, use, and safeguard your personal
          information. Please take a few minutes to read it carefully.
        </p>
      </section>

      <hr className="my-6 border-dashed" />

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">
          1. Information We Collect
        </h2>
        <ul className="list-disc list-inside text-gray-800">
          <li>Your name, email, phone number, shipping and billing address.</li>
          <li>
            Order details and payment information (such as order number and
            payment confirmation).
          </li>
          <li>
            Customer support messages and replacement/repair requests (we do not
            accept returns or refunds).
          </li>
          <li>
            Technical information such as IP address, browser type, device
            details, and cookies.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">
          2. How We Use Your Information
        </h2>
        <ul className="list-disc list-inside text-gray-800">
          <li>To process and deliver your orders securely.</li>
          <li>
            To provide customer support and resolve complaints (including
            replacement or repair in case of damaged/defective items). We do not
            provide returns or refunds.
          </li>
          <li>
            To send you updates, promotions, and newsletters if you have
            subscribed.
          </li>
          <li>
            To protect our website, prevent fraud, and improve your shopping
            experience.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">3. Cookies and Tracking</h2>
        <p className="text-gray-800 leading-relaxed mb-2">
          We use cookies and similar technologies to enhance your shopping
          experience. You may disable cookies in your browser settings, but some
          features (like cart and login) may not work properly.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">
          4. When We Share Information
        </h2>
        <ul className="list-disc list-inside text-gray-800">
          <li>
            With trusted couriers and payment providers to complete your order.
          </li>
          <li>If required by law or government authorities.</li>
          <li>
            In case of business transfers, such as mergers or acquisitions.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">
          5. Your Choices & Rights
        </h2>
        <p className="text-gray-800 leading-relaxed mb-2">
          You can request to access, correct, or delete your personal data at
          any time, subject to applicable laws. You can also unsubscribe from
          promotional emails using the link in the email or by contacting us.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">6. Data Security</h2>
        <p className="text-gray-800 leading-relaxed">
          We use industry-standard practices such as SSL encryption, secure
          servers, and restricted access to protect your data. However, please
          note that no method of online transmission is 100% secure.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">
          7. Third-Party Services & Links
        </h2>
        <p className="text-gray-800 leading-relaxed mb-2">
          Our website may include third-party services such as payment gateways,
          analytics, or social media links. These services have their own
          privacy policies, and we encourage you to review them separately.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">8. Policy Updates</h2>
        <p className="text-gray-800 leading-relaxed">
          We may update this Privacy Policy from time to time. Any major changes
          will be communicated through our website or via email. Please review
          this page periodically for updates.
        </p>
      </section>

      <hr className="my-6 border-dashed" />

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">9. Contact Us</h2>
        <p className="text-gray-800 mb-4">
          For questions, concerns, or data requests, feel free to reach us:
        </p>
        <p className="mb-2">
          📩 Email:{" "}
          <a
            href="mailto:info@avishjewels.com"
            className="text-blue-600 underline"
          >
            info@avishjewels.com
          </a>
        </p>
        <p>
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

export default PrivacyPolicy;
