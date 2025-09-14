import React from "react";

const AboutUsPage = () => {
  return (
    <div className="min-h-screen bg-white poppins-regular">
      {/* Hero Section */}
      <section className="py-16 px-4 md:px-8 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About Our Company
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            We are a passionate team dedicated to creating innovative solutions
            that make a difference in people's lives. Our mission is to deliver
            exceptional quality and service to our clients.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                To empower businesses and individuals through cutting-edge
                technology and user-centered design. We believe in creating
                products that are not only functional but also delightful to
                use.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-4">
                    <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Innovation</h3>
                    <p className="text-gray-600">
                      Constantly pushing boundaries
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-4">
                    <div className="w-6 h-6 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Quality</h3>
                    <p className="text-gray-600">
                      Excellence in everything we do
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-purple-100 p-2 rounded-full mr-4">
                    <div className="w-6 h-6 bg-purple-600 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Collaboration
                    </h3>
                    <p className="text-gray-600">
                      Working together for success
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img
                src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/66368ac9-b166-4166-959c-d3145e5af81d.png"
                alt="Team collaboration in a modern office space with diverse professionals working together around a table"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 md:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Meet Our Team
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-64 overflow-hidden">
                <img
                  src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/0f73272d-dc40-4fdb-8d58-7dfa27e176b7.png"
                  alt="Portrait of Sarah Johnson, CEO and founder with professional attire and confident smile in a modern office setting"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Sarah Johnson
                </h3>
                <p className="text-blue-600 mb-2">CEO & Founder</p>
                <p className="text-gray-600">
                  With over 15 years of experience in technology leadership,
                  Sarah drives our vision and strategic direction.
                </p>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-64 overflow-hidden">
                <img
                  src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/1d6065d2-fa5f-4463-971d-36bf8e21537a.png"
                  alt="Portrait of Michael Chen, Lead Developer wearing casual attire and glasses, working at a computer workstation"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Michael Chen
                </h3>
                <p className="text-blue-600 mb-2">Lead Developer</p>
                <p className="text-gray-600">
                  Michael brings technical expertise and innovative thinking to
                  our development projects and team mentorship.
                </p>
              </div>
            </div>

            {/* Team Member 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-64 overflow-hidden">
                <img
                  src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/b5025f16-f94e-462a-9150-52475d72c9bf.png"
                  alt="Portrait of Emily Rodriguez, Design Director with creative style and warm expression in a design studio environment"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Emily Rodriguez
                </h3>
                <p className="text-blue-600 mb-2">Design Director</p>
                <p className="text-gray-600">
                  Emily leads our design team with a focus on user experience
                  and beautiful, functional interfaces.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Get In Touch
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Interested in working with us or learning more about our services?
            We'd love to hear from you.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-blue-600 rounded-sm"></div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">hello@company.com</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-blue-600 rounded-sm"></div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
              <p className="text-gray-600">+1 (555) 123-4567</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-blue-600 rounded-sm"></div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
              <p className="text-gray-600">San Francisco, CA</p>
            </div>
          </div>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Contact Us
          </button>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;
