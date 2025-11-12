import React from 'react';
import { Link } from 'react-router-dom';
import { PhoneIcon, EnvelopeIcon, MapPinIcon, HeartIcon } from '@heroicons/react/24/outline';

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-primary"></div>
      </div>

      <div className="relative">
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="animate-slide-in-left">
              <div className="flex items-center mb-6">
                <img src="https://iili.io/KpvYQnI.md.jpg" alt="Travores Logo" className="h-10 w-10 rounded-full object-cover mr-3" />
                <span className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Travores
                </span>
              </div>
              <p className="text-secondary-300 mb-6 leading-relaxed">
                Your gateway to unforgettable adventures and breathtaking destinations around the world.
                We make dreams come true, one journey at a time.
              </p>
              <div className="flex space-x-4">
                <a href="https://instagram.com/travelwithtravores" target="_blank" rel="noopener noreferrer" className="bg-secondary-800 hover:bg-primary-600 p-3 rounded-full transition-all duration-300 hover:scale-110 group">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-5 w-5 text-secondary-300 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C8.396 0 7.996.014 6.8.067 5.609.12 4.694.265 3.923.51c-.8.248-1.48.576-2.156.95C.8 1.834.432 2.502.216 3.278c-.245.8-.372 1.714-.42 2.905C-.01 7.375 0 7.775 0 11.396s-.014 3.996-.067 5.192c-.053 1.196-.265 2.111-.51 2.882-.248.8-.576 1.48-.95 2.156-.374.676-1.042 1.044-1.818 1.26-.8.245-1.714.372-2.905.42C3.621 23.99 4.021 24 7.642 24s3.996-.014 5.192-.067c1.196-.053 2.111-.265 2.882-.51.8-.248 1.48-.576 2.156-.95.676-.374 1.044-1.042 1.26-1.818.245-.8.372-1.714.42-2.905.053-1.196.067-1.596.067-5.217s.014-3.996.067-5.192c.053-1.196.265-2.111.51-2.882.248-.8.576-1.48.95-2.156C22.166 1.2 22.834.832 23.61.616c.8-.245 1.714-.372 2.905-.42C20.379.01 19.979 0 16.358 0s-3.996.014-5.192.067c-1.196.053-2.111.265-2.882.51-.8.248-1.48.576-2.156.95C1.834.8.832 1.168.616 1.944c-.245.8-.372 1.714-.42 2.905C.01 4.621 0 5.021 0 8.642zM12.017 5.838a6.163 6.163 0 100 12.326 6.163 6.163 0 000-12.326zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998zm6.406-11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-xl font-bold mb-6 text-white">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/" className="text-secondary-300 hover:text-primary-400 transition-all duration-300 hover:translate-x-1 inline-block">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/packages" className="text-secondary-300 hover:text-primary-400 transition-all duration-300 hover:translate-x-1 inline-block">
                    Packages
                  </Link>
                </li>
                <li>
                  <Link to="/about-us" className="text-secondary-300 hover:text-primary-400 transition-all duration-300 hover:translate-x-1 inline-block">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-secondary-300 hover:text-primary-400 transition-all duration-300 hover:translate-x-1 inline-block">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-xl font-bold mb-6 text-white">Support</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-secondary-300 hover:text-primary-400 transition-all duration-300 hover:translate-x-1 inline-block">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-secondary-300 hover:text-primary-400 transition-all duration-300 hover:translate-x-1 inline-block">
                    Booking Guide
                  </a>
                </li>
                <li>
                  <a href="#" className="text-secondary-300 hover:text-primary-400 transition-all duration-300 hover:translate-x-1 inline-block">
                    Cancellation Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-secondary-300 hover:text-primary-400 transition-all duration-300 hover:translate-x-1 inline-block">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="animate-slide-in-right">
              <h3 className="text-xl font-bold mb-6 text-white">Contact Info</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPinIcon className="h-6 w-6 text-primary-400 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-secondary-300 leading-relaxed">
                    Cherukuru Parachoor Mandalam<br />
                    Prakasam District, Andhra Pradesh<br />
                    523169
                  </span>
                </div>
                <div className="flex items-center">
                  <PhoneIcon className="h-6 w-6 text-primary-400 mr-3 flex-shrink-0" />
                  <span className="text-secondary-300">+91 9014788475</span>
                </div>
                <div className="flex items-center">
                  <EnvelopeIcon className="h-6 w-6 text-primary-400 mr-3 flex-shrink-0" />
                  <span className="text-secondary-300">jagadeeshyedula@travores.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="bg-secondary-800 rounded-2xl p-8 mb-12 animate-fade-in">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">Stay Updated</h3>
              <p className="text-secondary-300 mb-6">
                Subscribe to our newsletter for exclusive deals, travel tips, and destination highlights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-secondary-700 border border-secondary-600 rounded-lg text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
                />
                <button className="btn-primary whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-secondary-700">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center text-secondary-400 text-sm mb-4 md:mb-0">
                <span>&copy; {new Date().getFullYear()} Travores. All rights reserved.</span>
                <HeartIcon className="h-4 w-4 text-red-500 mx-2 animate-pulse" />
                <span>Made with love for travelers</span>
              </div>
              <div className="flex space-x-6">
                <a href="#" className="text-secondary-400 hover:text-primary-400 text-sm transition-colors duration-300">
                  Privacy Policy
                </a>
                <a href="#" className="text-secondary-400 hover:text-primary-400 text-sm transition-colors duration-300">
                  Terms of Service
                </a>
                <a href="#" className="text-secondary-400 hover:text-primary-400 text-sm transition-colors duration-300">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
