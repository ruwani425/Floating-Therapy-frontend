import React from "react";
import {
  Flower,
  Award,
  DollarSign,
  Clock,
  HeartHandshake,
  Quote,
} from "lucide-react";

// --- Data Structures (Reused/Adapted) ---

// Data for the 4 core benefits (from WhyChooseUs section)
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

// --- Sub Components ---

/**
 * Section 1: Hero/Banner
 */
const AboutHero: React.FC = () => {
  return (
    <section className="pt-32 pb-20 bg-white w-full text-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-6xl font-serif font-bold text-gray-900 mb-4">
          About
        </h1>
        <p className="text-xl text-gray-600">
          Empowering health through expert care.
        </p>
      </div>
    </section>
  );
};

/**
 * Section 2 & 3: Our Story, Experience, and Philosophy
 */
const StoryAndPhilosophy: React.FC = () => {
  // Image paths corresponding to the screenshots
  const storyImageUrl = "/Screenshot 2025-11-18 121118.jpg";
  const trainingImageUrl = "/Screenshot 2025-11-18 121139.jpg";

  return (
    <section className="py-20 bg-light-blue-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* --- ROW 1: Our Story (Left Text) & Image (Right) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-20">
          {/* Left Column: Story Text */}
          <div className="lg:pr-10 space-y-6">
            <p className="text-xs tracking-widest uppercase text-gray-500 font-semibold">
              BEHIND THE PRACTICE
            </p>
            <h2 className="text-5xl font-serif font-bold text-gray-900">
              Our Story
            </h2>
            <p className="text-lg text-gray-600 space-y-4">
              <p>
                At Flexora, we believe true health begins with proper alignment. Our mission is simple:
                to help people move freely, feel stronger, and live without unnecessary pain.
              </p>
              <p>
                We take time to listen and create care plans that go beyond quick fixes. Every
                adjustment is guided by intention, so you leave each visit feeling balanced, energized,
                and more connected to your body. That's why so many in our community trust us as
                their long-term partners in wellness. And as your goals evolve, we're here to support
                you every step of the way.
              </p>
            </p>
          </div>

          {/* Right Column: Image */}
          <div className="flex justify-end pt-10">
            <div className="relative w-full h-[550px] max-w-lg">
              <div
                className="w-full h-full bg-cover bg-center rounded-xl shadow-2xl"
                style={{
                  backgroundImage: `url(${storyImageUrl})`,
                  clipPath: "polygon(0 10%, 100% 0, 100% 90%, 0% 100%)", // Stylized clip path
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* --- ROW 2: Experience (Left Bullets) & Philosophy (Right Text/Image Card) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: Experience & Training Bullets */}
          <div className="lg:pr-10 space-y-6">
            <h2 className="text-3xl font-serif font-bold text-gray-900">
              Our Experience & Training
            </h2>
            <p className="text-gray-600">
              Our chiropractors are licensed professionals with years of clinical experience. With
              specialized training in spinal health, posture correction, and rehabilitative techniques,
              we provide safe, effective care for patients of all ages.
            </p>
            <p className="text-gray-600 mb-6">
              We stay up to date with modern methods and combine them with proven chiropractic
              principles to achieve lasting results.
            </p>
            <ul className="space-y-3 text-gray-800">
              {[
                "Certified Chiropractic Sports Physician (CCSP)",
                "Diplomate of the American Chiropractic Board of Sports Physicians (DACBSP)",
                "Diplomate of the American Chiropractic Board of Radiology (DACBR)",
                "Chiropractic Pediatrics Certification",
                "Doctor of Chiropractic (D.C.) by the Council on Chiropractic Education (CCE)",
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <Flower className="w-5 h-5 text-dark-blue-600 mr-3 mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: Philosophy and Image Card */}
          <div className="flex flex-col space-y-12">
            {/* Image Card for Dr. Kevin Morra */}
            <div className="relative w-full h-72 rounded-xl shadow-xl overflow-hidden">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${trainingImageUrl})` }}
              ></div>
              <div className="absolute bottom-4 left-4 p-2 bg-white rounded-lg shadow-md">
                <p className="text-sm font-semibold text-dark-blue-600">
                  Dr. Kevin Morra
                </p>
                <p className="text-xs text-gray-500">Chiropractor / Founder</p>
              </div>
            </div>

            {/* Philosophy Text */}
            <div className="space-y-4">
              <h2 className="text-3xl font-serif font-bold text-gray-900">
                Our Philosophy
              </h2>
              <p className="text-gray-600">
                We believe the body has an incredible ability to heal itself when the spine
                and nervous system are properly aligned. That's why our approach is
                centered on precision, gentle techniques, and individualized treatment
                plans. Our goal is not just quick relief, but long-term wellness.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * Section 4: What Clients Can Expect? (Image and Text)
 */
const ClientExpectation: React.FC = () => {
  const expectImageUrl = "/Screenshot 2025-11-18 121152.png"; // Placeholder/Example Image

  return (
    <section className="py-20 bg-white w-full text-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Expertise.com badge from screenshot */}
        <div className="mb-12 flex justify-center">
          <img
            src={expectImageUrl} // Replace with actual badge image if available
            alt="Expertise.com Badge"
            className="h-24 w-auto"
            style={{
              clipPath: "polygon(10% 0, 90% 0, 100% 100%, 0% 100%)", // Example clip path for badge shape
            }}
          />
        </div>

        <p className="text-xs tracking-widest uppercase text-dark-blue-600 font-semibold mb-2">
          YOUR EXPERIENCE
        </p>
        <h2 className="text-5xl font-serif font-bold text-gray-900 mb-8">
          What Clients Can Expect?
        </h2>
        <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
          From your first visit, we focus on making you feel welcome and at ease. Every session begins with a
          short consultation to understand your needs and ends with practical guidance for lasting results.
          Our goal is not just relief today, but long-term wellness.
        </p>
        
        {/* Image/Visual placeholder (following the screenshot aesthetic) */}
        <div className="flex justify-center">
          <div className="relative w-full h-[500px] max-w-md bg-light-blue-100 rounded-xl shadow-xl overflow-hidden">
             {/* Replace with an actual image if possible. Using placeholder style for now. */}
            <div className="p-10 text-gray-700">
               {/* This space would typically contain an image or a visual representation of the clinic process. */}
              <p className="text-3xl font-serif">A Personalized Plan</p>
              <p className="mt-4">Consultation, Treatment, and Follow-up Care.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


/**
 * Section 5: Why Choose Us? (Reused from HomePage structure)
 */
const WhyChooseUs: React.FC = () => {
  // 💡 Central Image from screenshot
  const centerImageUrl = "/Screenshot 2025-11-18 121212.jpg";

  return (
    <section id="why-choose-us" className="py-20 bg-light-blue-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm tracking-widest uppercase text-dark-blue-600 font-semibold mb-4">
          WHY CHOOSE US?
        </p>
        <h2 className="text-5xl font-serif font-bold text-gray-900 mb-12">
          Care That Goes Beyond the Massage
        </h2>

        {/* Central Arch Layout (Simplified for responsiveness/maintainability) */}
        <div className="relative flex justify-center py-10">
          
          {/* Central Image with rounded clip-path */}
          <img
            src={centerImageUrl}
            alt="Central massage image"
            className="w-full max-w-lg h-[500px] object-cover rounded-xl shadow-2xl z-10"
            // Simple rounded-corners clip-path for easier implementation
            style={{ clipPath: "polygon(0 5%, 100% 0, 100% 95%, 0% 100%)", transform: "translateY(-20px)" }}
            onError={(e) => {
              (e.target as HTMLImageElement).onerror = null;
              (e.target as HTMLImageElement).src =
                "https://placehold.co/500x700/F0F8FF/000?text=Why+Choose+Us";
            }}
          />

          {/* Benefit Blocks positioned around the image, adjusted for two-column structure */}
          <div className="absolute inset-0 max-w-lg mx-auto grid grid-cols-2 gap-x-20 gap-y-10 lg:gap-x-32 p-4 pt-12">
            {coreBenefits.map((benefit, index) => (
              <div
                key={index}
                className={`p-2 z-20 ${
                  benefit.position.includes("right") ? "text-left ml-auto" : "text-left mr-auto"
                }`}
              >
                <div
                  className={`flex items-center mb-2 ${
                    benefit.position.includes("right")
                      ? "justify-start"
                      : "justify-start" // Both start left on mobile/small view
                  } text-dark-blue-600`}
                >
                  <Flower className="w-5 h-5 mr-2" /> 
                  <h3 className="text-xl font-semibold text-gray-900">
                    {benefit.title}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 text-left">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * Section 6: The Space - Calming Retreat
 */
const TheSpace: React.FC = () => {
    // Image paths corresponding to the screenshots
    const image1 = "/Screenshot 2025-11-18 121222_1.jpg"; // Person on scale/mat
    const image2 = "/Screenshot 2025-11-18 121222_2.jpg"; // Treatment room
    const image3 = "/Screenshot 2025-11-18 121222_3.jpg"; // Massage table detail

    const ClipStyle = {
        clipPath: "polygon(0 10%, 100% 0, 100% 100%, 0% 90%)",
    };

    return (
        <section className="py-20 bg-white w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-xs tracking-widest uppercase text-gray-500 font-semibold mb-2">
                    THE SPACE
                </p>
                <h2 className="text-5xl font-serif font-bold text-gray-900 mb-12">
                    A Calming Retreat Designed for Your Comfort
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* Image 1 */}
                    <div className="h-[450px] rounded-xl shadow-xl overflow-hidden">
                        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${image1})`, ...ClipStyle }}></div>
                    </div>

                    {/* Image 2 */}
                    <div className="h-[450px] rounded-xl shadow-xl overflow-hidden">
                        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${image2})` }}></div>
                    </div>

                    {/* Image 3 + Address */}
                    <div className="relative h-[450px] bg-light-blue-50 rounded-xl shadow-xl overflow-hidden flex flex-col justify-between">
                        <div className="h-1/2 w-full bg-cover bg-center" style={{ backgroundImage: `url(${image3})`, ...ClipStyle }}></div>
                        <div className="flex-1 flex flex-col justify-center items-center p-6 text-gray-800">
                            <Flower className="w-8 h-8 text-dark-blue-600 mb-4" />
                            <div className="flex items-center space-x-2 text-center">
                                <span className="text-lg font-semibold font-serif">San Francisco</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">
                                200 Sutter St Suite 602
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

/**
 * Section 7: Reviews/Testimonials (Adapted from HomePage)
 */
const Reviews: React.FC = () => {
    // Mock data for the reviews section based on screenshots
    const testimonials = [
        {
            quote: "After a sports injury, I was worried I'd never regain full mobility. The chiropractic care I received here not only helped me recover faster, but also strengthened areas I hadn't even realized were weak.",
            author: "REBECCA LORENNA",
            position: "left"
        },
        {
            quote: "I've struggled with back pain for years, and after just a few sessions here, I feel like a new person. The space is calming, the therapists are incredibly skilled, and I always leave feeling refreshed and pain-free.",
            author: "MAYA SANCHES",
            position: "right"
        },
        {
            quote: "This place is peaceful, clean, and the energy is amazing. I felt relaxed the moment I arrived. Highly recommend to anyone needing real stress relief.",
            author: "MARCUS LEROY",
            position: "bottom-left"
        },
        {
            quote: "I look forward to my massage every week—it’s the only time I truly disconnect and reset. The therapists are intuitive and professional. This place is magic.",
            author: "MARCUS LEROY", // Placeholder name based on screenshot sequence
            position: "bottom-right"
        },
        // The one in the middle of the second screenshot (Marcus Leroy) is handled differently
    ];

    return (
        <section id="reviews" className="py-20 bg-light-blue-50 w-full"> 
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <p className="text-sm tracking-widest uppercase text-gray-500 font-semibold mb-2">
                        REVIEWS
                    </p>
                    <h2 className="text-5xl font-serif font-bold text-gray-900">
                        What Our Clients Say About Us
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Column 1: Review 1 */}
                    <ReviewCard data={testimonials[0]} />

                    {/* Column 2: Rating Box & Review 3 */}
                    <div className="lg:col-span-1 flex flex-col items-center justify-between space-y-8">
                        {/* Rating Box */}
                        <div className="bg-white p-8 rounded-2xl shadow-xl border border-light-blue-200 w-full text-center">
                            <p className="text-6xl font-bold font-serif text-dark-blue-600 mb-2">
                                4.9
                            </p>
                            <div className="text-yellow-500 text-3xl mb-2">
                                ★★★★★
                            </div>
                            <p className="text-sm text-gray-600">
                                220+ Reviews on Google
                            </p>
                            <button className="mt-4 px-4 py-2 bg-light-blue-200 text-dark-blue-800 rounded-full text-sm hover:bg-light-blue-300 transition duration-150">
                                Read All Reviews
                            </button>
                        </div>
                        
                        {/* Review 3: (Used the second screenshot text for this position) */}
                        <ReviewCard data={{
                            quote: "I've been to many massage studios, but this one stands out. You're not just a name on a schedule—you're treated with respect and genuine care.",
                            author: "MARCUS LEROY",
                            position: "center-bottom"
                        }} />
                    </div>

                    {/* Column 3: Review 2 (Right) */}
                    <ReviewCard data={testimonials[1]} />
                </div>
                
                {/* Second Row of Reviews (from the second screenshot) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                     <ReviewCard data={testimonials[2]} />
                     <ReviewCard data={testimonials[3]} />
                </div>
            </div>
        </section>
    );
};

/**
 * Review Card Helper Component
 */
const ReviewCard: React.FC<{ data: { quote: string, author: string, position: string } }> = ({ data }) => (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-light-blue-200">
        <Quote className="w-8 h-8 text-dark-blue-600 mb-4 transform -scale-x-100" />
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
            {data.quote}
        </p>
        <p className="font-semibold text-dark-blue-800 uppercase text-sm tracking-wider">
            {data.author}
        </p>
    </div>
);


/**
 * Section 8: Appointment Booking and Footer Section (Adapted for About Page Style)
 */
const AboutFooter: React.FC = () => {
    // NOTE: This footer uses a custom color/shape from the screenshot, overriding the 
    // default dark blue one from the HomePage for the sake of replication.
    const darkTeal = "#38706B"; // Approximated color from the screenshot

    return (
        <footer
            className="relative pt-20 pb-10 bg-cover bg-center text-white w-full"
            style={{ backgroundColor: darkTeal }}
        >
            {/* Curved top shape (Simplified using a border) */}
            <div className="absolute top-0 left-0 right-0 h-10 bg-white" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)", transform: "translateY(-40px)" }}></div>

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
                            <Flower className="w-5 h-5 mr-2" />
                            Book Appointment
                        </button>
                    </div>
                </div>

                {/* Bottom Section: Footer Links */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-gray-600 pt-10 text-sm">
                    {/* ABOUT */}
                    <div className="space-y-4">
                        <h4 className="font-semibold mb-2 text-light-blue-200 uppercase">ABOUT</h4>
                        <ul className="space-y-2 text-gray-300">
                            <li>Who we are</li>
                            <li>Reviews</li>
                            <li>Blog</li>
                            <li>Contact us</li>
                        </ul>
                    </div>
                    {/* SERVICES */}
                    <div className="space-y-4">
                        <h4 className="font-semibold mb-2 text-light-blue-200 uppercase">SERVICES</h4>
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
                        <h4 className="font-semibold mb-2 text-light-blue-200 uppercase">CONDITIONS</h4>
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
                        <h4 className="font-semibold mb-2 text-light-blue-200 uppercase">PATIENTS</h4>
                        <ul className="space-y-2 text-gray-300">
                            <li>Patient Paperwork</li>
                            <li>Book an appointment</li>
                            <li>FAQ</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* A small strip at the very bottom (not visible in the screenshot but good practice) */}
            <div className="text-center text-xs text-gray-400 mt-10">
                &copy; {new Date().getFullYear()} Flexora. All rights reserved.
            </div>
        </footer>
    );
};


// --- Main About Page Component (Wrapper) ---

/**
 * Main wrapper for the Flexora About page.
 * NOTE: Assumes the necessary color classes (.dark-blue-600, .light-blue-50, etc.)
 * are defined globally or in the Layout component.
 */
const AboutPage: React.FC = () => {

  // Define custom styles *locally* for immediate use in this file,
  // matching the palette provided previously for consistency.
  const CustomStyle = `
    .text-dark-blue-600 { color: #035C84; }
    .bg-dark-blue-600 { background-color: #035C84; }
    .hover\\:bg-dark-blue-700:hover { background-color: #0873A1; } 
    .text-dark-blue-800 { color: #003F5C; } 
    .border-dark-blue-600 { border-color: #035C84; } 
    .text-light-blue-400 { color: #2DA0CC; } 
    .bg-light-blue-50 { background-color: #F0F8FF; }
    .bg-light-blue-100 { background-color: #E6F3FF; } 
    .bg-light-blue-200 { background-color: #94CCE7; } 
    .hover\\:bg-light-blue-300:hover { background-color: #79BDE1; } 
    .border-light-blue-200 { border-color: #94CCE7; }
    .text-yellow-500 { color: #F59E0B; } 
    .font-serif { font-family: 'Georgia', serif; }
  `;

  return (
    <div className="min-h-screen bg-white w-full">
      {/* Inject custom styles for local rendering if not global */}
      <style dangerouslySetInnerHTML={{ __html: CustomStyle }} />
      <main>
        <AboutHero />
        <StoryAndPhilosophy />
        <ClientExpectation />
        <WhyChooseUs />
        <TheSpace />
        <Reviews />
      </main>
      <AboutFooter />
    </div>
  );
};

export default AboutPage;