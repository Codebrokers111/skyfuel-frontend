// import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 pt-10 pb-15 px-15">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-6 gap-8">

        {/* Brand (bigger span) */}
        <div className="md:col-span-2">
          <h3 className="text-white text-lg font-semibold mb-3">Skyfuel</h3>
          <p className="text-sm mb-4">
             Pigeon nutrition, performance, and health.
          </p>
          <p className="text-sm">© Skyfuel 2025</p>
          <p className="text-sm">Made in India</p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-white">Home</a></li>
            <li><a href="/products" className="hover:text-white">Products</a></li>
            <li><a href="/gallery" className="hover:text-white">Gallery</a></li>
            <li><a href="/cart" className="hover:text-white">Cart</a></li>
          </ul>
        </div>

        {/* Sections */}
        <div>
          <h4 className="text-white font-semibold mb-3">Sections</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/login" className="hover:text-white">Login</a></li>
            <li><a href="/signup" className="hover:text-white">Signup</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-white font-semibold mb-3">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/help" className="hover:text-white">Help Center</a></li>
            <li><a href="/contact" className="hover:text-white">Contact Us</a></li>
            <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
            <li><a href="/faq" className="hover:text-white">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Follow Us</h4>
          <div className="flex space-x-4 text-lg">
            <a href="#" className="hover:text-white"><i className="bi bi-twitter"></i>T</a>
            <a href="#" className="hover:text-white"><i className="bi bi-facebook"></i>F</a>
            <a href="#" className="hover:text-white"><i className="bi bi-github"></i>G</a>
            <a href="#" className="hover:text-white"><i className="bi bi-linkedin"></i>L</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

