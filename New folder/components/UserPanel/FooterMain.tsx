import React from 'react';
import Link from 'next/link';
const FooterMain = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Rachit</h3>
            <p className="text-sm">
              Making your life easier, one click at a time.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/restaurant" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-3">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-3">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white">
                Facebook
              </a>
              <a href="#" className="hover:text-white">
                Twitter
              </a>
              <a href="#" className="hover:text-white">
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-4 text-sm text-center">
          © {new Date().getFullYear()} MyApp. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default FooterMain;
