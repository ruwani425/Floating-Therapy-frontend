import React from "react";
// ADDED MapPin to imports
import { Award, Clock, DollarSign, Flower, HeartHandshake, Quote, MapPin } from "lucide-react";
import Footer from "../components/layout/Footer";

// --- Data Structures (Remains the same) ---
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
 * FIX: Increased padding to pt-40 to ensure content clears the fixed NavBar, 
 * based on the latest screenshot showing overlap.
 */
const AboutHero: React.FC = () => {
  return (
    <section className="pt-40 pb-20 bg-white w-full text-center">
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
 * Section 2 & 3: Our Story, Experience, and Philosophy (Remains the same)
 */
const StoryAndPhilosophy: React.FC = () => {
  const storyImageUrl = "/GettyImages-2222455931-683x1024.jpg";
  const trainingImageUrl = "/GettyImages-489204244-801x1024.jpg";

  return (
    // Applied bg-light-blue-50
    <section className="py-20 bg-light-blue-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-20">
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

          <div className="flex justify-end pt-10">
            <div className="relative w-full h-[550px] max-w-lg">
              <div
                className="w-full h-full bg-cover bg-center rounded-xl shadow-2xl"
                style={{
                  backgroundImage: `url(${storyImageUrl})`,
                  clipPath: "polygon(0 10%, 100% 0, 100% 90%, 0% 100%)",
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
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
                  {/* Applied text-dark-blue-600 */}
                  <Flower className="w-5 h-5 text-dark-blue-600 mr-3 mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col space-y-12">
            <div className="relative w-full h-72 rounded-xl shadow-xl overflow-hidden">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${trainingImageUrl})` }}
              ></div>
              <div className="absolute bottom-4 left-4 p-2 bg-white rounded-lg shadow-md">
                {/* Applied text-dark-blue-600 */}
                <p className="text-sm font-semibold text-dark-blue-600">
                  Dr. Kevin Morra
                </p>
                <p className="text-xs text-gray-500">Chiropractor / Founder</p>
              </div>
            </div>

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
 * Helper component to render a single benefit block with flower icon
 */
const BenefitBlock: React.FC<{ benefit: typeof coreBenefits[number]; alignment: 'left' | 'right' }> = ({ benefit, alignment }) => {
  const isLeft = alignment === 'left';
  return (
    <div className={`flex flex-col p-4 w-full max-w-[220px] ${isLeft ? 'items-end text-right ml-auto mr-0' : 'items-start text-left mr-0 ml-auto'}`}>
      {/* Applied text-dark-blue-600 */}
      <div className="flex items-center mb-2 text-dark-blue-600">
        {isLeft && <h3 className="text-xl font-semibold text-gray-900 mr-2">{benefit.title}</h3>}
        <Flower className="w-5 h-5" />
        {!isLeft && <h3 className="text-xl font-semibold text-gray-900 ml-2">{benefit.title}</h3>}
      </div>
      <p className="text-sm text-gray-600">
        {benefit.description}
      </p>
    </div>
  );
};

/**
 * Section 4: What Clients Can Expect? (Image and Text - UPDATED)
 */
const ClientExpectation: React.FC = () => {
  const expectImageUrl = "/GettyImages-489204244-801x1024.jpg";
  const benefitImageUrl = "/GettyImages-489204244-801x1024.jpg";

  const getBenefit = (position: string) => coreBenefits.find(b => b.position === position);

  return (
    <section className="py-20 bg-white w-full text-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-12 flex justify-center">
          <img
            src={expectImageUrl}
            alt="Expertise.com Badge"
            className="h-24 w-auto"
            style={{
              clipPath: "polygon(10% 0, 90% 0, 100% 100%, 0% 100%)",
            }}
            onError={(e) => {
               (e.target as HTMLImageElement).onerror = null;
               (e.target as HTMLImageElement).src =
                 "https://placehold.co/400x450/94CCE7/000?text=Expertise+Badge"; // Using Lightest Blue for placeholder BG
            }}
          />
        </div>

        {/* Applied text-dark-blue-600 */}
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

        <div className="relative flex justify-center mx-auto max-w-5xl px-4 md:px-0">

          <img
            src={benefitImageUrl}
            alt="Central physical therapy image"
            className="w-full max-w-md h-[450px] object-cover rounded-xl shadow-2xl z-10"
            style={{ borderRadius: '20px' }}
            onError={(e) => {
              (e.target as HTMLImageElement).onerror = null;
              // Using Lightest Blue for placeholder BG
              (e.target as HTMLImageElement).src =
                "https://placehold.co/400x450/94CCE7/000?text=Therapy+Image";
            }}
          />

          <div className="absolute inset-0 flex justify-between items-start pt-10 pb-10">
            <div className="flex flex-col justify-between h-full">
              <BenefitBlock benefit={getBenefit("left-top")!} alignment={'left'} />
              <BenefitBlock benefit={getBenefit("left-bottom")!} alignment={'left'} />
            </div>

            <div className="flex flex-col justify-between h-full">
              <BenefitBlock benefit={getBenefit("right-top")!} alignment={'right'} />
              <BenefitBlock benefit={getBenefit("right-bottom")!} alignment={'right'} />
            </div>
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
// ... (TheSpace content remains the same)
  const image1 = "/GettyImages-200112735-001-801x1024.jpg";
  const image2 = "/GettyImages-2222455863.webp";
  const image3 = "/pexels-arina-krasnikova-6663372.webp";

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

          <div className="h-[450px] rounded-xl shadow-xl overflow-hidden">
            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${image1})`, ...ClipStyle }}></div>
          </div>

          <div className="h-[450px] rounded-xl shadow-xl overflow-hidden">
            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${image2})` }}></div>
          </div>

          {/* Applied bg-light-blue-50, text-dark-blue-600 */}
          <div className="relative h-[450px] bg-light-blue-50 rounded-xl shadow-xl overflow-hidden flex flex-col justify-between">
            <div className="h-1/2 w-full bg-cover bg-center" style={{ backgroundImage: `url(${image3})`, ...ClipStyle }}></div>
            <div className="flex-1 flex flex-col justify-center items-center p-6 text-gray-800">

              <MapPin className="w-8 h-8 text-dark-blue-600 mb-4" />

              <div className="text-center">
                <span className="text-lg font-semibold font-serif">San Francisco</span>
                <p className="text-sm text-gray-600 mt-2">
                  200 Sutter St Suite 602
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
 * Section 7: Reviews/Testimonials (Adapted from HomePage)
 */
const Reviews: React.FC = () => {
// ... (Reviews content remains the same)
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
      author: "MARCUS LEROY",
      position: "bottom-right"
    },
  ];

  return (
    // Applied bg-light-blue-50
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
          <ReviewCard data={testimonials[0]} />

          <div className="lg:col-span-1 flex flex-col items-center justify-between space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-light-blue-200 w-full text-center">
              {/* Applied text-dark-blue-600 */}
              <p className="text-6xl font-bold font-serif text-dark-blue-600 mb-2">
                4.9
              </p>
              <div className="text-yellow-500 text-3xl mb-2">
                ★★★★★
              </div>
              <p className="text-sm text-gray-600">
                220+ Reviews on Google
              </p>
              {/* Applied bg-light-blue-200, text-dark-blue-800, hover:bg-light-blue-300 */}
              <button className="mt-4 px-4 py-2 bg-light-blue-200 text-dark-blue-800 rounded-full text-sm hover:bg-light-blue-300 transition duration-150">
                Read All Reviews
              </button>
            </div>

            <ReviewCard data={{
              quote: "I've been to many massage studios, but this one stands out. You're not just a name on a schedule—you're treated with respect and genuine care.",
              author: "MARCUS LEROY",
              position: "center-bottom"
            }} />
          </div>

          <ReviewCard data={testimonials[1]} />
        </div>

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
// ... (ReviewCard content remains the same)
  // Applied border border-light-blue-200
  <div className="bg-white p-8 rounded-2xl shadow-xl border border-light-blue-200">
    {/* Applied text-dark-blue-600 */}
    <Quote className="w-8 h-8 text-dark-blue-600 mb-4 transform -scale-x-100" />
    <p className="text-lg text-gray-700 leading-relaxed mb-6">
      {data.quote}
    </p>
    {/* Applied text-dark-blue-800 */}
    <p className="font-semibold text-dark-blue-800 uppercase text-sm tracking-wider">
      {data.author}
    </p>
  </div>
);

// --- Main About Page Component (Wrapper) ---

/**
 * Main wrapper for the Flexora About page.
 * NOTE: Assumes the necessary color classes (.dark-blue-600, .light-blue-50, etc.)
 * are defined globally or in the Layout component.
 */
const AboutPage: React.FC = () => {

  // Define custom styles *locally* for immediate use in this file,
  // matching the palette provided by the user image.
  const CustomStyle = `
    /* Palette from Image: #94CCE7, #2DA0CC, #0873A1, #035C84 */
    
    /* Darkest Blue: #035C84 (Was 600) */
    .text-dark-blue-600 { color: #035C84; }
    .bg-dark-blue-600 { background-color: #035C84; }
    .border-dark-blue-600 { border-color: #035C84; }
    
    /* Medium Dark Blue: #0873A1 (Was 700/800) - Used for strong hover/secondary text */
    .hover\\:bg-dark-blue-700:hover { background-color: #0873A1; }
    .text-dark-blue-800 { color: #0873A1; } 
    
    /* Medium Light Blue: #2DA0CC (Was 400) */
    .text-light-blue-400 { color: #2DA0CC; } 
    
    /* Lightest Blue: #94CCE7 (Was 200) - Used for light background/borders/buttons */
    .bg-light-blue-200 { background-color: #94CCE7; }
    .border-light-blue-200 { border-color: #94CCE7; }
    
    /* Slight variation for button hover/BG: Use the Medium Light Blue */
    .hover\\:bg-light-blue-300:hover { background-color: #2DA0CC; } 
    
    /* Very Light Background: #F0F8FF (Lightest Blue from original design for a near-white background) */
    .bg-light-blue-50 { background-color: #F0F8FF; } 
    .bg-light-blue-100 { background-color: #E6F3FF; } /* Kept as a near white alternative */
    
    /* Accent Color (Yellow for Stars) */
    .text-yellow-500 { color: #F59E0B; }
    
    /* Font */
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
        <TheSpace />
        <Reviews />
        <Footer />
      </main>
    </div>
  );
};

export default AboutPage;