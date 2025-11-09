import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import bravoLogo from '../../assets/bravo-logo.png';

export const Footer = () => {
  return (
    <footer className="bg-black border-t border-amber-500/20">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center space-x-3 mb-4 group">
              <img
                src={bravoLogo}
                alt="BRAVOCARS Logo"
                className="h-10 w-auto transition-transform group-hover:scale-110"
              />
              <span className="text-2xl font-bold text-amber-500">BRAVOCARS</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              The premier destination for luxury and exotic car auctions. Buy and sell exceptional vehicles with confidence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-amber-500 font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/auctions" className="text-gray-400 hover:text-amber-500 transition-colors text-sm">
                  Live Auctions
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-400 hover:text-amber-500 transition-colors text-sm">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/sell" className="text-gray-400 hover:text-amber-500 transition-colors text-sm">
                  Sell Your Car
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-amber-500 font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-amber-500 transition-colors text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-amber-500 transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-amber-500 transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-amber-500 transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-amber-500 font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to get notifications about new auctions and exclusive deals.
            </p>
            <div className="flex space-x-3 mb-6">
              <a href="#" className="w-9 h-9 bg-amber-500/10 hover:bg-amber-500 rounded-lg flex items-center justify-center transition-all group">
                <Facebook className="w-4 h-4 text-amber-500 group-hover:text-black transition-colors" />
              </a>
              <a href="#" className="w-9 h-9 bg-amber-500/10 hover:bg-amber-500 rounded-lg flex items-center justify-center transition-all group">
                <Twitter className="w-4 h-4 text-amber-500 group-hover:text-black transition-colors" />
              </a>
              <a href="#" className="w-9 h-9 bg-amber-500/10 hover:bg-amber-500 rounded-lg flex items-center justify-center transition-all group">
                <Instagram className="w-4 h-4 text-amber-500 group-hover:text-black transition-colors" />
              </a>
              <a href="#" className="w-9 h-9 bg-amber-500/10 hover:bg-amber-500 rounded-lg flex items-center justify-center transition-all group">
                <Linkedin className="w-4 h-4 text-amber-500 group-hover:text-black transition-colors" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-amber-500/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm">
              © 2025 BRAVOCARS. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm">
              Trusted by collectors and enthusiasts worldwide
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
