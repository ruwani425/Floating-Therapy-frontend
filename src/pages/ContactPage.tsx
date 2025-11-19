import React from "react";
// ADDED icons needed for this page
import { Phone, Mail, Clock, MapPin, Flower, Quote, CalendarCheck, Star } from "lucide-react";
import Footer from "../components/layout/Footer";

// 💡 IMPORT REUSABLE FOOTER COMPONENT
// --- Contact Card Component (Helper) ---

/**
 * Helper component for the four main contact info cards.
 */
interface ContactCardProps {
  icon: React.ElementType;
  title: string;
  details: React.ReactNode;
  buttonText?: string;
}

const ContactCard: React.FC<ContactCardProps> = ({ icon: Icon, title, details, buttonText }) => (
  <div className="bg-white p-6 md:p-8 rounded-xl shadow-xl border border-light-blue-200 text-center flex flex-col items-center">
    <Icon className="w-8 h-8 text-dark-blue-600 mb-4" />
    <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">{title}</h3>
    <div className="text-gray-600 text-sm mb-4">{details}</div>
    {buttonText && (
      <button className="mt-auto px-4 py-2 text-dark-blue-600 border border-dark-blue-600 text-sm font-semibold rounded-full hover:bg-light-blue-50 transition duration-300">
        {buttonText}
      </button>
    )}
  </div>
);

// --- Section 1: Page Header (Title/Subtitle) ---

/**
 * Section 1: Top Heading
 * Contains the page title and subtitle.
 */
const ContactHeader: React.FC = () => {
  return (
    <section className="pt-32 pb-20 bg-light-blue-50 w-full text-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-6xl font-serif font-bold text-gray-900 mb-4">
          Contact us
        </h1>
        <p className="text-xl text-gray-600">
          We are here for your healing.
        </p>
      </div>
    </section>
  );
};

// --- Section 2: Contact Form ---

const ContactForm: React.FC = () => {
    // This URL should be replaced with an actual image of the therapy room
    const treatmentRoomUrl =
        "/creative-thinking-w800.png"; // Placeholder path

    return (
        <section className="py-20 bg-white w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Left Column: Form (unchanged) */}
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-gray-700 font-medium">Your name</label>
                                <input id="name" type="text" placeholder="e.g. John Smith" className="w-full p-4 border border-gray-300 rounded-lg focus:ring-dark-blue-600 focus:border-dark-blue-600 outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-gray-700 font-medium">Email address</label>
                                <input id="email" type="email" placeholder="e.g. john@email.com" className="w-full p-4 border border-gray-300 rounded-lg focus:ring-dark-blue-600 focus:border-dark-blue-600 outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="phone" className="text-gray-700 font-medium">Phone number</label>
                                <input id="phone" type="tel" placeholder="e.g. +01 200 40 3052" className="w-full p-4 border border-gray-300 rounded-lg focus:ring-dark-blue-600 focus:border-dark-blue-600 outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="service" className="text-gray-700 font-medium">Service</label>
                                <select id="service" className="w-full p-4 border border-gray-300 rounded-lg focus:ring-dark-blue-600 focus:border-dark-blue-600 outline-none appearance-none bg-white">
                                    <option>Select</option>
                                    <option>Chiropractic Care</option>
                                    <option>Medical Massage</option>
                                    <option>Chronic Pain</option>
                                    <option>Posture Correction</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <label htmlFor="notes" className="text-gray-700 font-medium">Notes to doctor</label>
                            <textarea id="notes" rows={6} placeholder="Reason for visit or any pain/discomfort" className="w-full p-4 border border-gray-300 rounded-lg focus:ring-dark-blue-600 focus:border-dark-blue-600 outline-none"></textarea>
                        </div>

                        <button 
                            type="submit" 
                            className="w-full px-6 py-4 bg-dark-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-dark-blue-700 transition duration-300"
                        >
                            Submit
                        </button>
                    </div>

                    {/* Right Column: Image */}
                    <div className="hidden lg:flex justify-center">
                        <div 
                            className="w-full max-w-md h-[550px] bg-cover bg-center rounded-xl shadow-2xl"
                            style={{ backgroundImage: `url(${treatmentRoomUrl})` }}
                        >
                        {/* 📸 Image Opportunity: Treatment room interior next to contact form */}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// --- Section 3: Contact Cards Section (Unchanged) ---

/**
 * Section 3: Contains the Location, Hours, Phone, Email cards.
 */
const ContactCardsSection: React.FC = () => {
    return (
        <section className="py-20 bg-light-blue-50 w-full text-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <ContactCard
                        icon={MapPin}
                        title="Location"
                        details={
                            <>
                                200 Sutter St Suite 602 San<br />
                                Francisco, CA 94108
                            </>
                        }
                        buttonText="Get directions"
                    />
                    <ContactCard
                        icon={Clock}
                        title="Hours"
                        details={
                            <>
                                Mon – Fri: 8:00 AM – 5:00 PM<br />
                                Sat: 8:00 AM – 2:00 PM<br />
                                Weekends: Closed
                            </>
                        }
                    />
                    <ContactCard
                        icon={Phone}
                        title="Phone"
                        details="(422) 820 820"
                        buttonText="Call us"
                    />
                    <ContactCard
                        icon={Mail}
                        title="Email"
                        details="info@thetalounge.com"
                        buttonText="Write us"
                    />
                </div>
            </div>
        </section>
    );
};

// --- Section 4: Map Section ---

const MapSection: React.FC = () => {
    // You must replace this generic URL with the actual Google Maps embed URL 
    // from Google Maps -> Share -> Embed a map.
    const googleMapsEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.210452331828!2d-122.40424568468165!3d37.79093837975877!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858062080f5555%3A0x6b772b786c67318!2s200%20Sutter%20St%20%23602%2C%20San%20Francisco%2C%20CA%2094108%2C%20USA!5e0!3m2!1sen!2slk!4v1636977600000!5m2!1sen!2slk";

    return (
        <section className="py-20 bg-white w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* --- Map Section --- */}
                <div className="bg-gray-100 p-4 rounded-xl shadow-inner overflow-hidden">
                    
                    {/* Replaced static image with an interactive iframe for Google Maps */}
                    <iframe
                        title="Google Map Location of 200 Sutter St"
                        width="100%"
                        height="400"
                        src={googleMapsEmbedUrl}
                        style={{ border: 0, borderRadius: '8px' }}
                        allowFullScreen={false}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />

                    {/* Floating Address Box (Simulated from Screenshot) */}
                    <div className="relative -mt-8 mx-auto w-3/4 max-w-sm bg-white p-4 rounded-lg shadow-lg border border-gray-200 hidden md:block">
                        <p className="font-semibold text-dark-blue-600">200 Sutter St #602</p>
                        <p className="text-xs text-gray-600">200 Sutter St #602, San Francisco, CA 94108, USA</p>
                        <button className="mt-2 text-xs text-light-blue-400 hover:underline">
                            View larger map
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

// --- Section 5: Testimonials Section ---
// --- Section 5: Testimonials Section ---

const TestimonialsSection: React.FC = () => {
    // Replicating the Trustpilot and Google Reviews layout from the screenshots
    const trustpilotReviews = [
        { name: "Rebecca Lorenna", role: "Massage Therapy", quote: "After a sports injury, I was worried I'd never regain full mobility. The chiropractic care I received here not only helped me recover faster, but also strengthened areas I hadn't even realized were weak." },
        { name: "Luis Dias", role: "Chronic Pain", quote: "The team is incredibly welcoming and knowledgeable. They took the time to listen and created a plan that truly works for me. I always leave feeling better—both physically and mentally." }
    ];

    const ReviewCard: React.FC<{ data: (typeof trustpilotReviews)[number] }> = ({
        data,
    }) => (
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-light-blue-200 h-full flex flex-col justify-between">
            <Quote className="w-8 h-8 text-dark-blue-600 mb-4 transform -scale-x-100" />
            <p className="text-lg text-gray-700 leading-relaxed mb-6">{data.quote}</p>
            <div>
                <p className="font-semibold text-gray-900 uppercase text-sm tracking-wider">
                    {data.name}
                </p>
                <p className="text-xs text-gray-500">{data.role}</p>
            </div>
        </div>
    );

    return (
        <section className="py-20 bg-white w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* --- Testimonials Header --- */}
                <div className="text-center mb-16">
                    <p className="text-sm tracking-widest uppercase text-gray-500 font-semibold mb-2">
                        TESTIMONIALS
                    </p>
                    <h2 className="text-5xl font-serif font-bold text-gray-900">
                        Real People, Real Results
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                    {/* Column 1: Rating Box */}
                    <div className="flex flex-col items-center justify-center p-8 bg-light-blue-50 rounded-2xl shadow-xl border border-light-blue-200 text-center">
                        <p className="text-7xl font-bold font-serif text-dark-blue-600 mb-4">
                            4.9
                        </p>
                        <div className="text-yellow-500 text-4xl mb-4">★★★★★</div>
                        <p className="text-sm text-gray-600">80+ reviews on Trustpilot</p>
                        
                        {/* 🌟 FIX APPLIED HERE: Added negative margin (-ml-2) to the inner images 
                            and a border to the avatars to create the stacking effect. */}
                        <div className="flex justify-center mt-4">
                            {/* NOTE: Adjusting z-index on individual items may be required for perfect stacking order */}
                            {/* Avatar 1 (First in line) */}
                            <img src="/image.png" alt="Client Avatar 1" className="w-10 h-10 rounded-full border-2 border-white object-cover" /> 
                            {/* Avatar 2 (Overlaps 1) */}
                            <img src="/image.png" alt="Client Avatar 2" className="w-10 h-10 rounded-full border-2 border-white object-cover -ml-3" /> 
                            {/* Avatar 3 (Overlaps 2) */}
                            <img src="/image.png" alt="Client Avatar 3" className="w-10 h-10 rounded-full border-2 border-white object-cover -ml-3" />
                        </div>
                        
                        <div className="flex space-x-4 mt-6">
                            <button className="p-2 border border-gray-300 rounded-full text-gray-500 hover:border-dark-blue-600">
                                ←
                            </button>
                            <button className="p-2 border border-gray-300 rounded-full text-gray-500 hover:border-dark-blue-600">
                                →
                            </button>
                        </div>
                    </div>

                    {/* Review Cards */}
                    <ReviewCard data={trustpilotReviews[0]} />
                    <ReviewCard data={trustpilotReviews[1]} />
                </div>
            </div>
        </section>
    );
};
// --- Section 6: Footer (REMOVED AND REPLACED WITH IMPORTED FOOTER) ---


// --- Main Contact Page Component (Wrapper) ---

const ContactPage: React.FC = () => {
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
      <style dangerouslySetInnerHTML={{ __html: CustomStyle }} />
      <main>
        {/* FINAL ORDER: 1. Header, 2. Form, 3. Cards, 4. Map, 5. Testimonials */}
        <ContactHeader />
        <ContactForm />
        <ContactCardsSection />
        <MapSection />
        <TestimonialsSection />
      </main>
      <Footer /> 
    </div>
  );
};

export default ContactPage;