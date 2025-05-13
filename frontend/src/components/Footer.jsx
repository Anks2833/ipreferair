import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  MapPin,
  Mail,
  Phone,
  ChevronRight,
  Heart,
} from "lucide-react";

const Footer = () => {
  // Get current year for copyright
  const currentYear = new Date().getFullYear();

  // Social media links data
  const socialLinks = [
    { icon: <Facebook size={18} />, href: "#", label: "Facebook" },
    { icon: <Twitter size={18} />, href: "#", label: "Twitter" },
    { icon: <Instagram size={18} />, href: "#", label: "Instagram" },
    { icon: <Linkedin size={18} />, href: "#", label: "LinkedIn" },
    { icon: <Youtube size={18} />, href: "#", label: "YouTube" },
  ];

  // Footer link categories with their links
  const footerCategories = [
    {
      title: "Company",
      links: [
        { text: "About", href: "#" },
        { text: "Jobs", href: "#" },
        { text: "List your property", href: "#" },
        { text: "Partnerships", href: "#" },
        { text: "Newsroom", href: "#" },
        { text: "Investor Relations", href: "#" },
        { text: "Advertising", href: "#" },
        { text: "Affiliate Marketing", href: "#" },
        { text: "Feedback", href: "#" },
      ],
    },
    {
      title: "Explore",
      links: [
        { text: "United States of America travel guide", href: "#" },
        { text: "Hotels in United States of America", href: "#" },
        { text: "Vacation rentals in United States of America", href: "#" },
        { text: "Vacation packages in United States of America", href: "#" },
        { text: "Domestic flights", href: "#" },
        { text: "Car rentals in United States of America", href: "#" },
        { text: "All accommodation types", href: "#" },
      ],
    },
    {
      title: "Policies",
      links: [
        { text: "Privacy", href: "#" },
        { text: "Cookies", href: "#" },
        { text: "Terms of use", href: "#" },
        { text: "Accessibility", href: "#" },
        { text: "Your privacy choices", href: "#" },
        { text: "Content guidelines and reporting", href: "#" },
      ],
    },
    {
      title: "Help",
      links: [
        { text: "Support", href: "#" },
        { text: "Cancel your hotel or vacation rental booking", href: "#" },
        { text: "Cancel your flight", href: "#" },
        { text: "Refund timelines, policies & processes", href: "#" },
        { text: "Use an ipreferstay coupon", href: "#" },
        { text: "International travel documents", href: "#" },
      ],
    },
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-800 to-gray-900 text-gray-300">
      {/* Top Section with Contact Info */}
      <div className="bg-blue-600 py-6">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-white">
              <h2 className="text-xl font-semibold mb-1">
                Subscribe to our newsletter
              </h2>
              <p className="text-blue-100 text-sm">
                Get the latest deals, travel tips and more
              </p>
            </div>

            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-2.5 rounded-l-lg w-full md:w-64 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 border-0"
              />
              <button className="bg-blue-800 hover:bg-blue-900 text-white px-5 py-2.5 rounded-r-lg transition-colors duration-200 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Logo and Company Information */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
                ipreferstay
              </h1>
            </Link>

            <p className="text-gray-400 text-sm mb-6">
              Your trusted travel companion for hotels, flights, cars, and
              vacation packages worldwide.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <MapPin
                  size={18}
                  className="text-blue-400 flex-shrink-0 mt-0.5"
                />
                <span>
                  1234 Travel Lane, Suite 500
                  <br />
                  Vacation City, VC 98765
                </span>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <Phone size={18} className="text-blue-400 flex-shrink-0" />
                <span>+1 (800) 555-1234</span>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <Mail size={18} className="text-blue-400 flex-shrink-0" />
                <span>support@ipreferstay.com</span>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="flex items-center gap-3 mt-6">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-700 hover:bg-blue-600 text-gray-300 hover:text-white transition-colors duration-200"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Footer Link Categories */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {footerCategories.map((category, index) => (
              <div key={index} className="space-y-4">
                <h3 className="text-white font-semibold text-lg after:content-[''] after:block after:w-12 after:h-1 after:bg-blue-500 after:mt-2">
                  {category.title}
                </h3>

                <ul className="space-y-2.5">
                  {category.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        to={link.href}
                        className="text-sm text-gray-400 hover:text-blue-400 transition-colors duration-200 flex items-center group"
                      >
                        <ChevronRight
                          size={14}
                          className="mr-1.5 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200"
                        />
                        {link.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section with Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {currentYear} ipreferstay, Inc. All rights reserved. ipreferstay
            and the ipreferstay Logo are trademarks or registered trademarks of
            ipreferstay, Inc.
          </p>

          <div className="flex items-center text-sm text-gray-500">
            <span>Made with</span>
            <Heart size={14} className="mx-1 text-red-500 animate-pulse" />
            <span>for travelers worldwide</span>
          </div>
        </div>
      </div>

      {/* App Badges */}
      {/* <div className="bg-gray-900 py-6">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="text-center sm:text-left">
              <p className="text-white font-medium mb-1">Download our app</p>
              <p className="text-gray-400 text-sm">
                Get exclusive mobile-only deals
              </p>
            </div>

            <div className="flex gap-4">
              <a href="#" className="h-12 transition-transform hover:scale-105">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/1280px-Download_on_the_App_Store_Badge.svg.png"
                  alt="App Store"
                  className="h-full"
                />
              </a>

              <a href="#" className="h-12 transition-transform hover:scale-105">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/1280px-Google_Play_Store_badge_EN.svg.png"
                  alt="Play Store"
                  className="h-full"
                />
              </a>
            </div>
          </div>
        </div>
      </div> */}
    </footer>
  );
};

export default Footer;
