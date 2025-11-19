import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Flower,
  Star,
  CalendarCheck,
  ChevronDown,
  ChevronUp,
  Award,
  DollarSign,
  Clock,
  HeartHandshake,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Quote, // New icon for Testimonials
} from "lucide-react";
import Footer from "../components/layout/Footer";

// --- Data Structures (Same as before) ---

// Mock data for the services section
const servicesData = [
  {
    title: "Swedish Massage",
    description:
      "Gentle, full-body massage that relaxes muscles and reduces stress.",
    image: "/GettyImages-2222455931-683x1024.jpg",
  },
  {
    title: "Deep Tissue",
    description:
      "Focused pressure to release deep tension and chronic muscle pain.",
    image: "/GettyImages-2222455863.webp",
  },
  {
    title: "Medical Massage",
    description:
      "Targeted therapy to support recovery from injuries or conditions.",
    image: "/GettyImages-2210243626.webp",
  },
  {
    title: "SPA Massage",
    description:
      "A soothing, sensory massage for total relaxation and self-care.",
    image: "/pexels-arina-krasnikova-6663372.webp",
  },
];

// Mock data for the massage benefits/FAQ section
const benefitsData = [
  {
    id: 1,
    title: "Relieves Muscle Tension",
    content: "Helps release tight muscles and restore natural mobility.",
    isDefaultOpen: true,
  },
  {
    id: 2,
    title: "Boosts Circulation",
    content:
      "Improves blood flow, aiding in recovery and delivering vital nutrients.",
  },
  {
    id: 3,
    title: "Reduces Stress & Anxiety",
    content:
      "Calms the nervous system, promoting a sense of peace and well-being.",
  },
  {
    id: 4,
    title: "Eases Chronic Pain",
    content:
      "Provides natural pain relief by addressing underlying muscular and joint issues.",
  },
  {
    id: 5,
    title: "Improves Sleep Quality",
    content:
      "Relaxation techniques help regulate sleep cycles, leading to deeper rest.",
  },
];

// Mock data for the blog section
const blogData = [
  {
    category: "SPA",
    title: "A Healthy and Balanced Spa Experience for your Whole Body",
    image: "/GettyImages-489204244-801x1024.jpg",
  },
  {
    category: "MASSAGE THERAPY",
    title: "The Healing Power of Pregnancy Massage",
    image: "/GettyImages-200112735-001-801x1024.jpg",
  },
  {
    category: "MASSAGE",
    title: "Different Strokes for Different Folks: Customize Your Massage",
    image: "/GettyImages-1357320863-1-801x1024.jpg",
  },
];

// --- Sub Components ---

/**
 * Accordion item component for the Benefits section
 */
const BenefitAccordion: React.FC<{
  title: string;
  content: string;
  isOpen: boolean;
  setOpen: (id: number) => void;
  id: number;
}> = ({ title, content, isOpen, setOpen, id }) => (
  <div className="border-b border-light-blue-200">
    <button
      className="flex justify-between items-center w-full py-4 text-left font-semibold text-xl text-gray-800 hover:text-dark-blue-600 transition duration-150"
      onClick={() => setOpen(id)}
    >
      <span>{title}</span>
      {isOpen ? (
        <ChevronUp className="h-5 w-5 text-dark-blue-600" />
      ) : (
        <ChevronDown className="h-5 w-5 text-gray-400" />
      )}
    </button>
    {isOpen && (
      <div className="pb-4 text-gray-600">
        <p>{content}</p>
      </div>
    )}
  </div>
);


/**
 * Hero Section
 */
const Hero: React.FC = () => {
  const heroVideoUrl =
    "/pexels.com_video_woman-doing-a-back-massage-6628400.webm";
  const isPlaceholder = heroVideoUrl.includes("YOUR_");

  return (
    <section
      id="home"
      className="min-h-screen relative w-full overflow-hidden flex justify-center items-center" 
    >
      {/* Background Media Container (full width) */}
      <div className="absolute z-0 w-full h-full inset-0">
        {!isPlaceholder && (
          <video
            autoPlay
            loop
            muted
            className="w-full h-full object-cover"
            // Fallback source is included for browser compatibility
          >
            <source src={heroVideoUrl} type="video/mp4" />
          </video>
        )}

        {/* Background Image Fallback or Placeholder */}
        <div
          className={`w-full h-full object-cover ${
            isPlaceholder ? "bg-cover bg-center" : ""
          }`}
          style={{
            backgroundImage: isPlaceholder
              ? `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2)), url('YOUR_HERO_STATIC_IMAGE_URL')`
              : "none",
          }}
        ></div>
      </div>

      {/* Dark Overlay for better text readability */}
      <div className="absolute z-10 inset-0 bg-black opacity-30"></div>

      {/* Content Container (max-w-7xl mx-auto for centering/fixed width) */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-20 flex flex-col justify-center h-full">
        {/* === START OF REVERTED CONTENT === */}
        <div className="max-w-xl p-6">
          <h1 className="text-6xl font-serif font-bold text-white leading-tight mb-4">
            Massage for Your Body & Mind
          </h1>
          <p className="text-lg text-gray-200 mb-8">
            Make it a weekly ritual – relax, recharge, recover.
          </p>
          <button className="flex items-center px-6 py-3 bg-white text-dark-blue-600 font-semibold rounded-full shadow-xl hover:bg-gray-100 transition duration-300 transform hover:scale-105">
            <CalendarCheck className="w-5 h-5 mr-2" />
            Book Appointment
          </button>
          <div className="mt-8">
            <p className="text-sm text-gray-200">
              <span className="text-yellow-500 text-xl">★★★★★</span> TRUSTED BY
              1000+ PATIENTS
            </p>
          </div>
        </div>

        {/* Footer/Strapline section visible in the screenshot, ensuring alignment */}
        <div className="absolute bottom-0 left-0 right-0 py-4 px-4 sm:px-6 lg:px-8 bg-black bg-opacity-30 text-white backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm font-medium">
              <p>Reduced Pain</p>
              <p>Improved Circulation</p>
              <p>Reduced Stress</p>
              <p>Enhances Overall Well-being</p>
            </div>
          </div>
        </div>
        {/* === END OF REVERTED CONTENT === */}
      </div>
    </section>
  );
};

/**
 * About Us Section with Image and Text Split
 */
const AboutUs: React.FC = () => {
  const centerImageUrl = "/GettyImages-1322320699-1.jpg";

  const backgroundPattern = "/pattern_bg.jpg";
  const hasPattern = backgroundPattern.includes("YOUR_") === false;

  return (
    <section
      className="py-20 relative bg-light-blue-50 w-full" // Use lightest background
      style={{
        // Apply background pattern if available
        backgroundImage: hasPattern ? `url(${backgroundPattern})` : "none",
        backgroundSize: "cover",
      }}
    >
      {/* Container is max-w-7xl mx-auto to contain the content width */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Text Column */}
          <div className="lg:col-span-1 space-y-8 py-8">
            <div className="space-y-4">
              <div className="flex items-center">
                <Flower className="w-5 h-5 text-dark-blue-600 mr-2" />
                <span className="text-sm tracking-widest uppercase text-dark-blue-600 font-semibold">
                  16+ Years of Experience
                </span>
              </div>
              <div className="border-l-4 border-dark-blue-600 pl-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  Skilled, Caring Therapists
                </h3>
                <p className="text-gray-600">
                  Our licensed professionals bring years of experience and a
                  deep understanding of bodywork and wellness.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <Flower className="w-5 h-5 text-dark-blue-600 mr-2" />
                <span className="text-sm tracking-widest uppercase text-dark-blue-600 font-semibold">
                  Evening & Weekend Availability
                </span>
              </div>
              <div className="border-l-4 border-dark-blue-600 pl-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  Inspired by Nature
                </h3>
                <p className="text-gray-600">
                  We use gentle techniques, natural oils, and calming touch to
                  help you feel restored and balanced.
                </p>
              </div>
            </div>
          </div>

          {/* Center Image Column - Complex rounded shape */}
          <div className="lg:col-span-1 flex justify-center relative">
            <div className="relative w-full max-w-sm h-[600px] sm:max-w-md lg:max-w-none lg:w-[400px] mx-auto">
              {/* Background Arch/Shape Container */}
              <div
                className="absolute inset-0 z-0 rounded-t-[50%] rounded-b-xl transform -translate-y-4 shadow-2xl overflow-hidden"
                style={{ backgroundColor: "#E6F3FF" /* Light blue fallback */ }}
              >
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${centerImageUrl})` }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).onerror = null;
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/500x750/F0F8FF/000?text=Care";
                  }}
                ></div>
              </div>

              {/* Text Overlay for the Center Image */}
              <div className="absolute inset-0 z-10 flex flex-col items-center pt-20 pb-8 px-8 text-center text-white">
                <p className="text-sm tracking-widest uppercase mb-4">
                  WHO WE ARE
                </p>
                <h2 className="text-4xl font-serif font-bold leading-tight mb-6">
                  Professional Care, Inspired by Nature
                </h2>
                {/* Space holder that was previously the image */}
                <div className="w-full h-full"></div>
              </div>
            </div>
          </div>

          {/* Right Text Column */}
          <div className="lg:col-span-1 space-y-8 py-8">
            <div className="space-y-4">
              <div className="flex items-center justify-end">
                <span className="text-sm tracking-widest uppercase text-dark-blue-600 font-semibold">
                  A Trusted Local Studio
                </span>
                <Flower className="w-5 h-5 text-dark-blue-600 ml-2" />
              </div>
              <div className="border-r-4 border-dark-blue-600 pr-4 text-right">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  A Trusted Local Studio
                </h3>
                <p className="text-gray-600">
                  We've helped thousands of clients reduce stress, manage pain,
                  and feel better with care that truly makes a difference.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-end">
                <span className="text-sm tracking-widest uppercase text-dark-blue-600 font-semibold">
                  More Than Massage
                </span>
                <Flower className="w-5 h-5 text-dark-blue-600 ml-2" />
              </div>
              <div className="border-r-4 border-dark-blue-600 pr-4 text-right">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  More Than Massage
                </h3>
                <p className="text-gray-600">
                  Our peaceful space is designed for calm, comfort, and care –
                  offering a quiet moment of relief in your busy, demanding day.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * Services Section
 */
const Services: React.FC = () => {
  return (
    <section id="services" className="py-20 bg-light-blue-50 w-full">
      {" "}
      {/* Added w-full */}
      {/* Container is max-w-7xl mx-auto to contain the content width */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="text-sm tracking-widest uppercase text-dark-blue-600 font-semibold mb-2">
              Services
            </p>
            <h2 className="text-5xl font-serif font-bold text-gray-900">
              Begin Your Journey to Better Health
            </h2>
          </div>
          {/* Button uses light-blue-200 for background and dark-blue-800 for text */}
          <button className="px-6 py-2 bg-light-blue-200 text-dark-blue-800 rounded-full hover:bg-light-blue-300 transition duration-150">
            View All
          </button>
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {servicesData.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden transition duration-300 hover:shadow-2xl"
            >
              {/* Image with rounded bottom corners to match screenshot aesthetic */}
              <div
                className="relative h-64 bg-cover bg-center rounded-t-xl"
                style={{ backgroundImage: `url(${service.image})` }}
                onError={(e) => {
                  (e.target as HTMLImageElement).onerror = null;
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/400x500/F0F8FF/000?text=Flexora+Service";
                }}
              >
                {/* Plus icon overlay - simple stylized element */}
                <div className="absolute bottom-4 left-4 p-2 bg-white rounded-full shadow-md">
                  <Flower className="w-4 h-4 text-dark-blue-600" />
                </div>
              </div>

              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold font-serif text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-600">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/**
 * Reviews/Testimonials Section (No background image needed)
 */
const Reviews: React.FC = () => {
  return (
    <section id="reviews" className="py-20 bg-light-blue-50 w-full">
      {" "}
      {/* Use lightest background */}
      {/* Container is max-w-7xl mx-auto to contain the content width */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm tracking-widest uppercase text-dark-blue-600 font-semibold mb-2">
            Reviews
          </p>
          <h2 className="text-5xl font-serif font-bold text-gray-900">
            What Our Clients Say About Us
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Review Card 1 (Left) */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-light-blue-200">
            <Quote className="w-8 h-8 text-dark-blue-600 mb-4 transform -scale-x-100" />
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              After a sports injury, I was worried I'd never regain full
              mobility. The chiropractic care I received here not only helped me
              recover faster, but also strengthened areas I hadn't even realized
              were weak.
            </p>
            <p className="font-semibold text-dark-blue-800 uppercase text-sm tracking-wider">
              Elena Donovan
            </p>
          </div>

          {/* Center Column: Rating and Second Review */}
          <div className="lg:col-span-1 flex flex-col items-center justify-between space-y-8">
            {/* Rating Box */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-light-blue-200 w-full text-center">
              <p className="text-6xl font-bold font-serif text-dark-blue-600 mb-2">
                4.9
              </p>
              <div className="text-yellow-500 text-3xl mb-2">
                ★★★★★
              </div>
              <p className="text-sm text-gray-600">220+ Reviews on Google</p>
              <button className="mt-4 px-4 py-2 bg-light-blue-200 text-dark-blue-800 rounded-full text-sm hover:bg-light-blue-300 transition duration-150">
                Read All Reviews
              </button>
            </div>

            {/* Review 2 (Middle Top) */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-light-blue-200 w-full">
              <Quote className="w-8 h-8 text-dark-blue-600 mb-4 transform -scale-x-100" />
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                I've been to many massage studios, but this one stands out.
                You're not just a name on a schedule—you're treated with respect
                and genuine care.
              </p>
              <p className="font-semibold text-dark-blue-800 uppercase text-sm tracking-wider">
                Marcus Leroy
              </p>
            </div>
          </div>

          {/* Main Review Card 3 (Right) */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-light-blue-200">
            <Quote className="w-8 h-8 text-dark-blue-600 mb-4 transform -scale-x-100" />
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              I've struggled with back pain for years, and after just a few
              sessions here, I feel like a new person. The space is calming, the
              therapists are incredibly skilled, and I always leave feeling
              refreshed and pain-free.
            </p>
            <p className="font-semibold text-dark-blue-800 uppercase text-sm tracking-wider">
              Sophie Daniele
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * Benefits/FAQ Section with Image Split
 */
const BenefitsFAQ: React.FC = () => {
  const [openBenefitId, setOpenBenefitId] = useState(1);

  const toggleBenefit = (id: number) => {
    setOpenBenefitId(openBenefitId === id ? 0 : id);
  };

  const benefitImageUrl = "/GettyImages-1208634923.jpg";

  const benefitBackgroundUrl = "/pattern_bg.jpg";
  const hasBackground = benefitBackgroundUrl.includes("YOUR_") === false;

  return (
    <section className="py-20 bg-white w-full">
      {" "}
      {/* Use white background */}
      {/* Container is max-w-7xl mx-auto to contain the content width */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Image Column (Left on Desktop) */}
          <div className="lg:order-1 relative">
            {/* Background texture/pattern box */}
            <div
              className="absolute inset-0 rounded-xl"
              style={{
                backgroundColor: hasBackground ? "transparent" : "#E6F3FF", // Fallback color
                backgroundImage: hasBackground
                  ? `url('${benefitBackgroundUrl}')`
                  : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>

            <div className="relative p-6">
              <img
                src={benefitImageUrl}
                alt="Therapy benefits visualization"
                className="w-full h-auto object-cover rounded-xl shadow-2xl"
                style={{ clipPath: "polygon(0 0, 100% 0, 100% 90%, 0% 100%)" }}
                onError={(e) => {
                  (e.target as HTMLImageElement).onerror = null;
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/600x800/F0F8FF/000?text=Therapy+Benefit";
                }}
              />
            </div>
          </div>

          {/* Text & Accordion Column (Right on Desktop) */}
          <div className="lg:order-2 space-y-12 pt-10">
            <div>
              <p className="text-sm tracking-widest uppercase text-dark-blue-600 font-semibold mb-2">
                MASSAGE AND YOUR BODY
              </p>
              <h2 className="text-5xl font-serif font-bold text-gray-900">
                How Massage Therapy Transforms Your Body
              </h2>
            </div>

            {/* Accordion */}
            <div className="space-y-4">
              {benefitsData.map((benefit) => (
                <BenefitAccordion
                  key={benefit.id}
                  id={benefit.id}
                  title={benefit.title}
                  content={benefit.content}
                  isOpen={openBenefitId === benefit.id}
                  setOpen={toggleBenefit}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * Why Choose Us Section
 */
const WhyChooseUs: React.FC = () => {
  const centerImageUrl = "/pexels-arina-krasnikova-6663372-1.jpg";

  // Data for the 4 core benefits
  const coreBenefits = [
    {
      title: "Flat Fee",
      description:
        "Simple, transparent pricing. Our therapists appreciate tips, reviews, and referrals.",
      icon: DollarSign,
      position: "left-top",
    },
    {
      title: "Licensed & Trusted",
      description:
        "All therapists are licensed, insured, and highly experienced.",
      icon: Award,
      position: "right-top",
    },
    {
      title: "Easy Online Booking",
      description:
        "Same-day appointments often available. Book your massage in minutes.",
      icon: Clock,
      position: "left-bottom",
    },
    {
      title: "Eco-Friendly",
      description:
        "As a small, sustainable business, we offer personalized care with a lighter footprint.",
      icon: HeartHandshake,
      position: "right-bottom",
    },
  ];

  return (
    <section id="why-choose-us" className="py-20 bg-light-blue-50 w-full">
      {" "}
      {/* Container is max-w-7xl mx-auto to contain the content width */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm tracking-widest uppercase text-dark-blue-600 font-semibold mb-4">
          WHY CHOOSE US?
        </p>
        <h2 className="text-5xl font-serif font-bold text-gray-900 mb-12">
          Care That Goes Beyond the Massage
        </h2>

        {/* Central Arch Layout */}
        <div className="relative flex justify-center py-10">
          {/* Decorative Arch (Mimicking the semi-circle effect) */}
          <div className="absolute top-0 w-full max-w-4xl h-96 border-t-2 border-x-2 border-light-blue-200 rounded-t-full"></div>

          {/* Central Image with rounded clip-path */}
          <img
            src={centerImageUrl}
            alt="Central massage image"
            className="w-96 h-[500px] object-cover rounded-full shadow-2xl z-10"
            style={{
              clipPath: "polygon(0% 20%, 50% 0%, 100% 20%, 100% 100%, 0% 100%)",
              transform: "translateY(-20px)",
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).onerror = null;
              (e.target as HTMLImageElement).src =
                "https://placehold.co/500x700/F0F8FF/000?text=Why+Choose+Us";
            }}
          />

          {/* Benefit Blocks positioned around the image */}
          {coreBenefits.map((benefit, index) => (
            <div
              key={index}
              className={`absolute w-64 text-left p-4 z-20 ${
                benefit.position === "left-top"
                  ? "top-10 left-0 lg:left-10"
                  : benefit.position === "right-top"
                  ? "top-10 right-0 lg:right-10 text-right"
                  : benefit.position === "left-bottom"
                  ? "bottom-10 left-0 lg:left-10"
                  : "bottom-10 right-0 lg:right-10 text-right"
              } hidden sm:block`}
            >
              <div
                className={`flex items-center mb-2 ${
                  benefit.position.includes("right")
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {benefit.position.includes("left") && (
                  <benefit.icon className="w-5 h-5 text-dark-blue-600 mr-2" />
                )}
                <h3 className="text-xl font-semibold text-gray-900">
                  {benefit.title}
                </h3>
                {benefit.position.includes("right") && (
                  <benefit.icon className="w-5 h-5 text-dark-blue-600 ml-2" />
                )}
              </div>
              <p className="text-sm text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/**
 * Meet Our Therapist Section
 */
const MeetOurTherapist: React.FC = () => {
  const therapists = [
    {
      name: "Hana Gregson",
      title: "FOUNDER / MASSAGE THERAPIST",
      image: "/GettyImages-1324943018-2-1024x600.jpg",
    },
    {
      name: "Lisa Simonelli",
      title: "MASSAGE THERAPIST",
      image: "/GettyImages-sb10064081j-002-1024x600.jpg",
    },
  ];

  return (
    <section id="therapist" className="py-20 bg-light-blue-50 w-full">
      {" "}
      {/* Container is max-w-7xl mx-auto to contain the content width */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Introduction Column */}
          <div className="lg:col-span-1 space-y-6">
            <p className="text-sm tracking-widest uppercase text-dark-blue-600 font-semibold">
              Our Therapist
            </p>
            <h2 className="text-5xl font-serif font-bold text-gray-900">
              Meet Our Therapist
            </h2>
            <p className="text-lg text-gray-600">
              Every therapist is carefully vetted and background-checked to
              ensure your safety, comfort, and expert care.
            </p>
            <button className="px-6 py-3 border border-dark-blue-600 text-dark-blue-800 rounded-full hover:bg-white transition duration-150 font-medium">
              Meet the Team
            </button>
          </div>

          {/* Therapist Cards Grid */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {therapists.map((therapist, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-xl overflow-hidden"
              >
                <div
                  className="h-80 w-full bg-cover bg-center"
                  // 💡 Image source here
                  style={{ backgroundImage: `url(${therapist.image})` }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).onerror = null;
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/400x550/F0F8FF/000?text=Therapist";
                  }}
                ></div>
                <div className="p-6 text-center">
                  <h3 className="text-2xl font-semibold font-serif text-gray-900">
                    {therapist.name}
                  </h3>
                  <p className="text-sm tracking-wider uppercase text-dark-blue-600 mt-1">
                    {therapist.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * Blog Section
 */
const Blog: React.FC = () => {
  return (
    <section id="blog" className="py-20 bg-white w-full">
      {" "}
      {/* Container is max-w-7xl mx-auto to contain the content width */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-5xl font-serif font-bold text-gray-900">
            Therapist Tips & Wellness Wisdom
          </h2>
          <button className="px-6 py-2 bg-light-blue-200 text-dark-blue-800 rounded-full hover:bg-light-blue-300 transition duration-150">
            Read All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogData.map((post, index) => (
            <div key={index} className="space-y-4">
              <div
                className="h-64 bg-cover bg-center rounded-xl shadow-lg"
                style={{ backgroundImage: `url(${post.image})` }}
                onError={(e) => {
                  (e.target as HTMLImageElement).onerror = null;
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/400x300/F0F8FF/000?text=Blog+Post";
                }}
              ></div>
              <p className="text-xs tracking-widest uppercase text-dark-blue-600 font-semibold pt-2">
                {post.category}
              </p>
              <h3 className="text-xl font-semibold font-serif text-gray-900 hover:text-dark-blue-600 transition duration-150 cursor-pointer">
                {post.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/**
 * Call to Action Section (Why Wait to Feel Better?)
 */ const CtaWhyWait: React.FC = () => {
  const ctaVideoUrl =
    "/pexels.com_video_woman-doing-a-back-massage-6628400.webm";

  return (
    <section
      id="cta-wait"
      className="py-20 relative overflow-hidden flex justify-center items-center w-full" // Added w-full
      style={{ minHeight: "400px" }}
    >
      <div className="absolute z-0 w-full h-full inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline 
          className="w-full h-full object-cover"
        >
          <source src={ctaVideoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div
        className="absolute z-10 w-full h-full inset-0"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark overlay
        }}
      ></div>

      {/* Content Container (max-w-7xl mx-auto for centering/fixed width) - z-20 */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 text-center py-10">
        <h2 className="text-5xl font-serif font-bold text-white mb-4">
          Why Wait to Feel Better?
        </h2>
        <p className="text-xl text-gray-200 mb-8">
          Start your journey to relaxation and wellness today.
        </p>

        {/* ... buttons remain the same ... */}
        <div className="flex flex-wrap justify-center items-center space-x-4">
          {/* Call button */}
          <button className="flex items-center px-6 py-3 bg-white text-dark-blue-600 font-semibold rounded-full shadow-xl hover:bg-gray-100 transition duration-300 transform hover:scale-105">
            {/* <Phone className="w-5 h-5 mr-2" /> */}
            (422) 820 820
          </button>
          <span className="text-white text-lg">or</span>
          {/* Appointment button */}
          <button className="flex items-center px-6 py-3 bg-dark-blue-600 text-white font-semibold rounded-full shadow-xl hover:bg-dark-blue-700 transition duration-300 transform hover:scale-105">
            {/* <CalendarCheck className="w-5 h-5 mr-2" /> */}
            Book Appointment
          </button>
        </div>
      </div>
    </section>
  );
};

/**
 * Main wrapper for the Theta Lounge homepage.
 */
const HomePage: React.FC = () => {
  const CustomStyle = `
    /* ** CRITICAL FIX: RESET BODY/HTML MARGINS ** */
    html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        overflow-x: hidden; 
    }

    /* CUSTOM COLOR PALETTE MAPPING */
    /* Based on #035C84 (Darkest Blue) and #94CCE7 (Lightest Blue) */
    .text-dark-blue-600 { color: #035C84; } /* Primary/Main Dark Blue */
    .bg-dark-blue-600 { background-color: #035C84; }
    .hover\\:bg-dark-blue-700:hover { background-color: #0873A1; } /* Medium Blue (Hover/Accent) */
    .text-dark-blue-800 { color: #003F5C; } /* Used for highest contrast text, based on #035C84 shade */
    .border-dark-blue-600 { border-color: #035C84; } /* Added for border-l-4 in AboutUs */
    .border-dark-blue-700 { border-color: #0873A1; } /* Border color matching medium blue */
    
    .text-light-blue-400 { color: #2DA0CC; } /* Lighter Blue (Link/Icon color) */
    .hover\\:text-dark-blue-600:hover { color: #035C84; } /* Primary blue for hover */

    /* Light Blue Backgrounds */
    .bg-light-blue-50 { background-color: #F0F8FF; } /* Very light/Off-white background - based on #94CCE7 light tint */
    .bg-light-blue-100 { background-color: #E6F3FF; } /* Pale blue (used for hover on light items) */
    .bg-light-blue-200 { background-color: #94CCE7; } /* Pale Blue (Button Background/Border) */
    .hover\\:bg-light-blue-300:hover { background-color: #79BDE1; } /* Slightly darker light blue for hover */
    .border-light-blue-200 { border-color: #94CCE7; } /* Border for review cards */
    
    /* Star Ratings */
    .text-yellow-500 { color: #F59E0B; } 
    
    .font-serif { font-family: 'Georgia', serif; }
  `;

  return (
    <div className="min-h-screen bg-white w-full">
      <style dangerouslySetInnerHTML={{ __html: CustomStyle }} />
      <main>
        <Hero /> 
        <AboutUs /> 
        <Services />
        <WhyChooseUs /> 
        <BenefitsFAQ />
        <MeetOurTherapist /> 
        <CtaWhyWait />
        <Reviews />
        <Blog />
        <Footer />
      </main>
    </div>
  );
};

export default HomePage;