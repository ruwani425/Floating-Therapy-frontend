import React from "react";
import { Flower, CalendarCheck, Star } from "lucide-react";

/**
 * Reusable Footer Component
 * Designed to be imported and used across multiple pages.
 * NOTE: Assumes Tailwind color classes are defined in the main component or globally.
 */
const Footer: React.FC = () => {
  return (
    <footer
      className="relative pt-20 pb-0 bg-cover bg-center text-white w-full bg-dark-blue-600"
    >
      {/* Curved top shape (matches the screenshot design) */}
      <div
        className="absolute top-0 left-0 right-0 h-10 bg-white"
        style={{
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
          transform: "translateY(-40px)",
        }}
      ></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section: Address, Hours, Logo, CTA */}
        <div className="text-center mb-16">
          <div className="flex justify-center text-sm font-semibold mb-10 text-gray-300 space-x-12">
            <div>
              <p className="uppercase tracking-widest mb-2">ADDRESS</p>
              <p>200 Sutter St Suite 602 San</p>
              <p>Francisco, CA 94108</p>
            </div>
            <div>
              <p className="uppercase tracking-widest mb-2">OFFICE HOURS</p>
              <p>Mon–Thu: 7:30 AM–7:30 PM</p>
              <p>Friday: 8:00 AM–4:30 PM</p>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-2 text-3xl font-serif font-bold text-white mb-8">
            <Flower className="w-8 h-8 text-white" />
            <span className="tracking-wider">Flexora</span>
          </div>

          <div className="flex flex-wrap justify-center items-center space-x-6">
            <button className="flex items-center px-6 py-3 bg-white text-dark-blue-600 font-semibold rounded-full shadow-xl hover:bg-gray-100 transition duration-300">
              (422) 820 820
            </button>
            <button className="flex items-center px-6 py-3 bg-white text-dark-blue-600 font-semibold rounded-full shadow-xl hover:bg-gray-100 transition duration-300">
              <CalendarCheck className="w-5 h-5 mr-2" />
              Book Appointment
            </button>
          </div>
        </div>

        {/* Bottom Section: Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-gray-600 pt-10 text-sm">
          {/* ABOUT */}
          <div className="space-y-4">
            <h4 className="font-semibold mb-2 text-light-blue-200 uppercase">
              ABOUT
            </h4>
            <ul className="space-y-2 text-gray-300">
              <li>Who we are</li>
              <li>Reviews</li>
              <li>Blog</li>
              <li>Contact us</li>
            </ul>
          </div>
          {/* SERVICES */}
          <div className="space-y-4">
            <h4 className="font-semibold mb-2 text-light-blue-200 uppercase">
              SERVICES
            </h4>
            <ul className="space-y-2 text-gray-300">
              <li>Chiropractic Care</li>
              <li>Medical Massage</li>
              <li>Chronic Pain</li>
              <li>Posture Correction</li>
              <li>Sport Injuries</li>
            </ul>
          </div>
          {/* CONDITIONS */}
          <div className="space-y-4">
            <h4 className="font-semibold mb-2 text-light-blue-200 uppercase">
              CONDITIONS
            </h4>
            <ul className="space-y-2 text-gray-300">
              <li>Back pain</li>
              <li>Neck pain</li>
              <li>Headaches/migraines</li>
              <li>Sciatica</li>
              <li>Shoulder Pain</li>
            </ul>
          </div>
          {/* PATIENTS */}
          <div className="space-y-4">
            <h4 className="font-semibold mb-2 text-light-blue-200 uppercase">
              PATIENTS
            </h4>
            <ul className="space-y-2 text-gray-300">
              <li>Patient Paperwork</li>
              <li>Book an appointment</li>
              <li>FAQ</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Strip */}
      <div className="mt-8 border-t border-gray-600 pt-4 pb-4 text-center text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <span>
            © {new Date().getFullYear()} VamTam. All rights reserved.
          </span>
          <div className="flex space-x-3">
            <span className="hover:text-white cursor-pointer">
              Terms of Service
            </span>
            <span className="hover:text-white cursor-pointer">
              Privacy Policy
            </span>
            {/* Social Icons Placeholder */}
            <Star className="w-4 h-4" />
            <Star className="w-4 h-4" />
            <Star className="w-4 h-4" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;