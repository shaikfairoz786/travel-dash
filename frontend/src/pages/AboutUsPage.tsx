import React from 'react';

const AboutUsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-light">
      {/* Hero Section */}
      <section className="relative py-20 text-white" style={{ backgroundColor: '#006f06ff' }}>
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 animate-fade-in">About Travores</h1>
          <p className="text-xl max-w-3xl mx-auto opacity-90 animate-fade-in-delay">
            Your trusted partner in creating unforgettable travel experiences around the world
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-secondary-800 mb-8">Our Mission</h2>
            <p className="text-lg text-secondary-600 leading-relaxed mb-8">
              At Travores, we believe that travel is more than just visiting new places—it's about
              creating memories that last a lifetime. Our mission is to make travel accessible,
              affordable, and unforgettable for everyone, regardless of their budget or experience level.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="bg-white p-6 rounded-xl shadow-soft hover:shadow-medium transition-shadow duration-300">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-secondary-800 mb-2">Fast & Reliable</h3>
                <p className="text-secondary-600">Quick booking process with instant confirmations</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-soft hover:shadow-medium transition-shadow duration-300">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-secondary-800 mb-2">Secure & Safe</h3>
                <p className="text-secondary-600">Your safety and security are our top priorities</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-soft hover:shadow-medium transition-shadow duration-300">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-secondary-800 mb-2">Personalized</h3>
                <p className="text-secondary-600">Tailored experiences based on your preferences</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-secondary-800 mb-6">Our Story</h2>
                <p className="text-lg text-secondary-600 leading-relaxed mb-6">
                  Founded in 2020, Travores began as a small startup with a big dream: to revolutionize
                  the way people book and experience travel. What started as a simple idea has grown into
                  a comprehensive travel platform serving thousands of happy travelers worldwide.
                </p>
                <p className="text-lg text-secondary-600 leading-relaxed mb-6">
                  Our team of passionate travel enthusiasts and technology experts work tirelessly to
                  ensure that every journey you take with us is seamless, exciting, and memorable.
                  From the moment you start planning to the day you return home, we're here to make
                  your travel dreams come true.
                </p>
                <div className="flex items-center space-x-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600">50K+</div>
                    <div className="text-secondary-600">Happy Travelers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600">100+</div>
                    <div className="text-secondary-600">Destinations</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600">5</div>
                    <div className="text-secondary-600">Years Experience</div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-light rounded-2xl p-8 shadow-soft">
                  <img
                    src="/api/placeholder/500/400"
                    alt="Travores Team"
                    className="w-full h-80 object-cover rounded-xl shadow-medium"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-secondary-800 mb-4">Meet Our Team</h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              The passionate individuals behind Travores who make your travel dreams possible
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-soft hover:shadow-medium transition-shadow duration-300 text-center">
              <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">JY</span>
              </div>
              <h3 className="text-xl font-semibold text-secondary-800 mb-2">Jagadeesh Yadavula</h3>
              <p className="text-primary-600 font-medium mb-3">CEO & Founder</p>
              <p className="text-secondary-600 text-sm">
                Passionate traveler with 15+ years in the tourism industry
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-soft hover:shadow-medium transition-shadow duration-300 text-center">
              <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">JS</span>
              </div>
              <h3 className="text-xl font-semibold text-secondary-800 mb-2">Jane Smith</h3>
              <p className="text-primary-600 font-medium mb-3">Head of Operations</p>
              <p className="text-secondary-600 text-sm">
                Expert in logistics and customer experience management
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-soft hover:shadow-medium transition-shadow duration-300 text-center">
              <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">MJ</span>
              </div>
              <h3 className="text-xl font-semibold text-secondary-800 mb-2">Shaik Fairoz</h3>
              <p className="text-primary-600 font-medium mb-3">Tech Lead</p>
              <p className="text-secondary-600 text-sm">
                Technology enthusiast ensuring smooth digital experiences
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-secondary-800 mb-4">Our Values</h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              The principles that guide everything we do at Travores
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-secondary-800 mb-2">Integrity</h3>
              <p className="text-secondary-600 text-sm">Honest and transparent in all our dealings</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-secondary-800 mb-2">Passion</h3>
              <p className="text-secondary-600 text-sm">Love for travel and creating amazing experiences</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-secondary-800 mb-2">Community</h3>
              <p className="text-secondary-600 text-sm">Building connections and sharing experiences</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-secondary-800 mb-2">Innovation</h3>
              <p className="text-secondary-600 text-sm">Constantly improving and adapting to your needs</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;
