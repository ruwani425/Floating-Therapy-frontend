import React, { useState } from "react";
import {
  Phone,
  Mail,
  Clock,
  MapPin,
  Send,
  MessageSquare,
  CheckCircle,
  Users,
  Sparkles,
  ArrowRight,
} from "lucide-react";

// --- Contact Info Cards Component ---
interface ContactInfoProps {
  icon: React.ElementType;
  title: string;
  details: React.ReactNode;
  link?: string;
}

const ContactInfoCard: React.FC<ContactInfoProps> = ({
  icon: Icon,
  title,
  details,
  link,
}) => (
  <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
    <div className="flex flex-col items-center text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-theta-blue to-theta-blue-dark rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">
        {title}
      </h3>
      <div className="text-gray-600 font-sans text-base mb-4">{details}</div>
      {link && (
        <a
          href={link}
          className="inline-flex items-center text-theta-blue font-display font-semibold text-sm hover:gap-2 gap-1 transition-all duration-300"
        >
          Get in touch
          <ArrowRight className="w-4 h-4" />
        </a>
      )}
    </div>
  </div>
);

// --- FAQ Item Component ---
interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left focus:outline-none group"
      >
        <h3 className="text-lg md:text-xl font-serif font-bold text-gray-900 group-hover:text-theta-blue transition-colors duration-300">
          {question}
        </h3>
        <div
          className={`transform transition-transform duration-300 ${
            isOpen ? "rotate-45" : ""
          }`}
        >
          <div className="w-6 h-6 flex items-center justify-center text-theta-blue font-bold text-2xl">
            +
          </div>
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 mt-4" : "max-h-0"
        }`}
      >
        <p className="text-gray-600 font-sans leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

// --- Main Contact Page Component ---
const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const faqs = [
    {
      question: "Do I need a referral to schedule an appointment?",
      answer:
        "No referral is needed! You can book directly with us online or by phone. We accept walk-ins based on availability, but appointments are recommended.",
    },
    {
      question: "What should I bring to my first appointment?",
      answer:
        "Please bring a valid ID, insurance card (if applicable), any relevant medical records, and a list of current medications. Wear comfortable clothing.",
    },
    {
      question: "Do you accept insurance?",
      answer:
        "Yes, we work with most major insurance providers. Contact us with your insurance details, and we'll verify your coverage before your visit.",
    },
    {
      question: "How long is a typical session?",
      answer:
        "Initial consultations typically last 60-90 minutes, while follow-up sessions are usually 30-45 minutes depending on the treatment type.",
    },
  ];

  return (
    <div className="bg-white w-full min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Video Background */}
        <video
          src="https://videos.pexels.com/video-files/9694443/9694443-hd_1920_1080_25fps.mp4"
          loop
          preload="none"
          muted
          playsInline
          autoPlay
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Blue Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-theta-blue/90 via-theta-blue-dark/85 to-theta-blue/90"></div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-6xl mx-auto text-center text-white">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            <span className="text-sm font-display font-semibold">
              We're Here to Help
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 leading-tight">
            Get in Touch
          </h1>

          <p className="text-xl md:text-2xl font-sans text-blue-100 mb-8 max-w-3xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and
            we'll respond as soon as possible.
          </p>

          {/* Quick Contact Info */}
          <div className="flex flex-wrap justify-center gap-6 mt-12">
            <a
              href="tel:4228208200"
              className="flex items-center space-x-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300"
            >
              <Phone className="w-5 h-5" />
              <span className="font-display font-semibold">
                (422) 820 820
              </span>
            </a>
            <a
              href="mailto:info@thetalounge.com"
              className="flex items-center space-x-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300"
            >
              <Mail className="w-5 h-5" />
              <span className="font-display font-semibold">
                info@thetalounge.com
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
              <div className="flex items-center mb-6">
                <MessageSquare className="w-6 h-6 text-theta-blue mr-3" />
                <h2 className="text-3xl font-serif font-bold text-gray-900">
                  Send us a Message
                </h2>
              </div>

              <p className="text-gray-600 font-sans mb-8">
                Fill out the form below and our team will get back to you within
                24 hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-display font-semibold text-gray-700 mb-2"
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Smith"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-theta-blue focus:outline-none font-sans transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-display font-semibold text-gray-700 mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-theta-blue focus:outline-none font-sans transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-display font-semibold text-gray-700 mb-2"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(555) 123-4567"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-theta-blue focus:outline-none font-sans transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="service"
                      className="block text-sm font-display font-semibold text-gray-700 mb-2"
                    >
                      Service Interested In
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-theta-blue focus:outline-none font-sans transition-all duration-300 appearance-none bg-white"
                    >
                      <option value="">Select a service</option>
                      <option value="chiropractic">Chiropractic Care</option>
                      <option value="massage">Medical Massage</option>
                      <option value="pain">Chronic Pain Treatment</option>
                      <option value="posture">Posture Correction</option>
                      <option value="sports">Sports Injury</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-display font-semibold text-gray-700 mb-2"
                  >
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Tell us about your needs or any questions you have..."
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-theta-blue focus:outline-none font-sans transition-all duration-300 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitted}
                  className={`w-full flex items-center justify-center px-6 py-4 rounded-xl font-display font-bold text-white transition-all duration-300 transform ${
                    isSubmitted
                      ? "bg-green-500"
                      : "bg-gradient-to-r from-theta-blue to-theta-blue-dark hover:shadow-2xl hover:scale-105"
                  }`}
                >
                  {isSubmitted ? (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Message Sent!
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Information & Image */}
            <div className="space-y-8">
              {/* Image */}
              <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/pexels-arina-krasnikova-6663372-1.jpg"
                  alt="Theta Lounge Facility"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-sm font-display font-semibold mb-1">
                    Visit Our Facility
                  </p>
                  <h3 className="text-2xl font-serif font-bold">
                    Experience Healing in Person
                  </h3>
                </div>
              </div>

              {/* Why Choose Us */}
              <div className="bg-gradient-to-br from-theta-blue-light to-blue-100 rounded-3xl p-8">
                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-6">
                  Why Choose Theta Lounge?
                </h3>
                <div className="space-y-4">
                  {[
                    "Licensed & experienced therapists",
                    "Same-day appointments available",
                    "Insurance accepted",
                    "Modern, clean facilities",
                    "Personalized treatment plans",
                  ].map((item, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-theta-blue mr-3 flex-shrink-0 mt-0.5" />
                      <span className="font-sans text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
              Visit Us Today
            </h2>
            <p className="text-xl font-sans text-gray-600">
              Multiple ways to connect with our team
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ContactInfoCard
              icon={MapPin}
              title="Location"
              details={
                <>
                  200 Sutter St Suite 602
                  <br />
                  San Francisco, CA 94108
                </>
              }
              link="https://maps.google.com"
            />
            <ContactInfoCard
              icon={Clock}
              title="Hours"
              details={
                <>
                  Mon – Fri: 8:00 AM – 5:00 PM
                  <br />
                  Sat: 8:00 AM – 2:00 PM
                  <br />
                  Sunday: Closed
                </>
              }
            />
            <ContactInfoCard
              icon={Phone}
              title="Phone"
              details="(422) 820 820"
              link="tel:4228208200"
            />
            <ContactInfoCard
              icon={Mail}
              title="Email"
              details="info@thetalounge.com"
              link="mailto:info@thetalounge.com"
            />
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <iframe
              title="Google Map Location"
              width="100%"
              height="500"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.210452331828!2d-122.40424568468165!3d37.79093837975877!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858062080f5555%3A0x6b772b786c67318!2s200%20Sutter%20St%20%23602%2C%20San%20Francisco%2C%20CA%2094108%2C%20USA!5e0!3m2!1sen!2slk!4v1636977600000!5m2!1sen!2slk"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl font-sans text-gray-600">
              Quick answers to common questions
            </p>
          </div>

          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-theta-blue via-theta-blue-dark to-theta-blue">
        <div className="max-w-4xl mx-auto text-center text-white">
          <Users className="w-16 h-16 mx-auto mb-6 text-blue-100" />
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl font-sans text-blue-100 mb-8">
            Book your first appointment today and experience the difference
            personalized care can make.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-theta-blue font-display font-bold rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl">
              Book Appointment
            </button>
            <a
              href="tel:4228208200"
              className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-display font-bold rounded-full hover:bg-white/30 transition-all duration-300 transform hover:scale-105"
            >
              Call Us Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
