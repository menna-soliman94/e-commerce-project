import React from "react";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-5 gap-10">
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-black text-white w-10 h-10 flex justify-center items-center rounded-lg font-bold">
              S
            </div>

            <span className="text-2xl font-semibold">ShopMart</span>
          </div>

          <p className="text-gray-600 leading-6">
            Your one-stop destination for the latest technology, fashion, and
            lifestyle products. Quality guaranteed with fast shipping and
            excellent customer service.
          </p>

          <div className="space-y-3 text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin size={18} />
              <span>123 Shop Street, October City, DC 12345</span>
            </div>

            <div className="flex items-center gap-2">
              <Phone size={18} />
              <span>(+20) 01093333333</span>
            </div>

            <div className="flex items-center gap-2">
              <Mail size={18} />
              <span>support@shopmart.com</span>
            </div>
          </div>
        </div>

        {/* Shop */}
        <div>
          <h3 className="font-semibold text-lg mb-5">SHOP</h3>

          <ul className="space-y-3 text-gray-600">
            <li>Electronics</li>
            <li>Fashion</li>
            <li>Home & Garden</li>
            <li>Sports</li>
            <li>Deals</li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="font-semibold text-lg mb-5">CUSTOMER SERVICE</h3>

          <ul className="space-y-3 text-gray-600">
            <li>Contact Us</li>
            <li>Help Center</li>
            <li>Track Your Order</li>
            <li>Returns & Exchanges</li>
            <li>Size Guide</li>
          </ul>
        </div>

        {/* About */}
        <div>
          <h3 className="font-semibold text-lg mb-5">ABOUT</h3>

          <ul className="space-y-3 text-gray-600">
            <li>About ShopMart</li>
            <li>Careers</li>
            <li>Press</li>
            <li>Investor Relations</li>
            <li>Sustainability</li>
          </ul>
        </div>

        {/* Policies */}
        <div>
          <h3 className="font-semibold text-lg mb-5">POLICIES</h3>

          <ul className="space-y-3 text-gray-600">
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
            <li>Cookie Policy</li>
            <li>Shipping Policy</li>
            <li>Refund Policy</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
