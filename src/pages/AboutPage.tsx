import React from "react";
import {
  Award,
  Heart,
  Users,
  Target,
  Sparkles,
  CheckCircle,
  Quote,
  Star,
  TrendingUp,
  Shield,
  Clock,
  MapPin,
} from "lucide-react";

// --- Values/Benefits Data ---
const coreValues = [
  {
    icon: Heart,
    title: "Patient-Centered Care",
    description:
      "Your health and comfort are our top priorities. We listen, understand, and create personalized treatment plans.",
  },
  {
    icon: Award,
    title: "Expert Professionals",
    description:
      "Our team consists of licensed, certified therapists with years of experience in their specialties.",
  },
  {
    icon: Target,
    title: "Results-Driven",
    description:
      "We focus on lasting outcomes, not quick fixes. Your long-term wellness is our ultimate goal.",
  },
  {
    icon: Shield,
    title: "Safe & Trusted",
    description:
      "All therapists are fully insured and follow the highest standards of professional care and ethics.",
  },
];

// --- Stats Data ---
const stats = [
  { number: "15+", label: "Years Experience" },
  { number: "5000+", label: "Happy Patients" },
  { number: "98%", label: "Success Rate" },
  { number: "4.9", label: "Google Rating" },
];

// --- Team Members ---
const teamMembers = [
  {
    name: "Dr. Sarah Mitchell",
    role: "Lead Chiropractor",
    specialty: "Sports Injury & Rehabilitation",
    image: "/GettyImages-2222455931-683x1024.jpg",
    credentials: "DC, CCSP",
  },
  {
    name: "Dr. Mark Johnson",
    role: "Physical Therapist",
    specialty: "Chronic Pain Management",
    image: "/GettyImages-489204244-801x1024.jpg",
    credentials: "DPT, OCS",
  },
  {
    name: "Emily Rodriguez",
    role: "Massage Therapist",
    specialty: "Deep Tissue & Swedish",
    image: "/GettyImages-200112735-001-801x1024.jpg",
    credentials: "LMT, CMT",
  },
];

// --- Testimonials ---
const testimonials = [
  {
    quote:
      "After a sports injury, I was worried I'd never regain full mobility. The chiropractic care I received here not only helped me recover faster, but also strengthened areas I hadn't even realized were weak.",
    author: "Rebecca Lorenna",
    role: "Marathon Runner",
    rating: 5,
  },
  {
    quote:
      "I've struggled with back pain for years, and after just a few sessions here, I feel like a new person. The therapists are incredibly skilled, and I always leave feeling refreshed.",
    author: "Maya Sanchez",
    role: "Office Professional",
    rating: 5,
  },
  {
    quote:
      "This place is peaceful, clean, and the energy is amazing. I felt relaxed the moment I arrived. Highly recommend to anyone needing real stress relief.",
    author: "Marcus Leroy",
    role: "Business Owner",
    rating: 5,
  },
];

// --- Value Card Component ---
const ValueCard: React.FC<{
  icon: React.ElementType;
  title: string;
  description: string;
}> = ({ icon: Icon, title, description }) => (
  <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
    <div className="w-16 h-16 bg-gradient-to-br from-theta-blue to-theta-blue-dark rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
      <Icon className="w-8 h-8 text-white" />
    </div>
    <h3 className="text-xl font-serif font-bold text-gray-900 mb-3">
      {title}
    </h3>
    <p className="text-gray-600 font-sans leading-relaxed">{description}</p>
  </div>
);

// --- Team Member Card ---
const TeamMemberCard: React.FC<{
  member: typeof teamMembers[number];
}> = ({ member }) => (
  <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
    <div className="relative h-80 overflow-hidden">
      <img
        src={member.image}
        alt={member.name}
        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
      <div className="absolute bottom-4 left-4 text-white">
        <p className="text-sm font-display font-semibold mb-1">
          {member.credentials}
        </p>
      </div>
    </div>
    <div className="p-6">
      <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">
        {member.name}
      </h3>
      <p className="text-theta-blue font-display font-semibold mb-2">
        {member.role}
      </p>
      <p className="text-gray-600 font-sans text-sm">{member.specialty}</p>
    </div>
  </div>
);

// --- Testimonial Card ---
const TestimonialCard: React.FC<{
  testimonial: typeof testimonials[number];
}> = ({ testimonial }) => (
  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-100">
    <div className="flex mb-4">
      {[...Array(testimonial.rating)].map((_, i) => (
        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
      ))}
    </div>
    <Quote className="w-10 h-10 text-theta-blue mb-4 opacity-50" />
    <p className="text-gray-700 font-sans leading-relaxed mb-6 text-lg">
      "{testimonial.quote}"
    </p>
    <div>
      <p className="font-display font-bold text-gray-900 text-sm">
        {testimonial.author}
      </p>
      <p className="font-sans text-gray-500 text-sm">{testimonial.role}</p>
    </div>
  </div>
);

// --- Main About Page Component ---
const AboutPage: React.FC = () => {
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
              Trusted by Thousands
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 leading-tight">
            About Theta Lounge
          </h1>

          <p className="text-xl md:text-2xl font-sans text-blue-100 mb-8 max-w-3xl mx-auto">
            Empowering health through expert care, compassionate service, and
            proven results since 2009.
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300"
              >
                <p className="text-4xl md:text-5xl font-serif font-bold mb-2">
                  {stat.number}
                </p>
                <p className="text-sm md:text-base font-display text-blue-100">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-theta-blue-light rounded-full mb-6">
                <span className="text-sm font-display font-bold text-theta-blue uppercase tracking-wider">
                  Our Story
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6 leading-tight">
                Healing Through Alignment & Care
              </h2>

              <div className="space-y-4 text-gray-600 font-sans text-lg leading-relaxed">
                <p>
                  At Theta Lounge, we believe true health begins with proper
                  alignment. Our mission is simple: to help people move freely,
                  feel stronger, and live without unnecessary pain.
                </p>
                <p>
                  Founded in 2009 by Dr. Sarah Mitchell, our practice has grown
                  from a small clinic to a comprehensive wellness center. We
                  take time to listen and create care plans that go beyond
                  quick fixes.
                </p>
                <p>
                  Every adjustment is guided by intention, so you leave each
                  visit feeling balanced, energized, and more connected to your
                  body. That's why so many in our community trust us as their
                  long-term partners in wellness.
                </p>
              </div>

              <div className="mt-8 space-y-3">
                {[
                  "Personalized treatment plans",
                  "Evidence-based techniques",
                  "Holistic approach to wellness",
                  "Continuous care & support",
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-theta-blue mr-3 flex-shrink-0" />
                    <span className="font-sans text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/GettyImages-2222455931-683x1024.jpg"
                  alt="Therapy Session"
                  className="w-full h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-2xl">
                <p className="text-4xl font-serif font-bold text-theta-blue mb-1">
                  15+
                </p>
                <p className="text-sm font-display text-gray-600">
                  Years of Excellence
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-theta-blue-light rounded-full mb-6">
              <span className="text-sm font-display font-bold text-theta-blue uppercase tracking-wider">
                Our Values
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4 leading-tight">
              What Makes Us Different
            </h2>
            <p className="text-xl font-sans text-gray-600 max-w-3xl mx-auto">
              Our commitment to excellence goes beyond treatment—it's about
              building lasting relationships and transforming lives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => (
              <ValueCard key={index} {...value} />
            ))}
          </div>
        </div>
      </section>

      {/* Meet Our Team Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-theta-blue-light rounded-full mb-6">
              <span className="text-sm font-display font-bold text-theta-blue uppercase tracking-wider">
                Our Team
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4 leading-tight">
              Meet Our Expert Therapists
            </h2>
            <p className="text-xl font-sans text-gray-600 max-w-3xl mx-auto">
              Licensed professionals dedicated to your health and wellbeing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <TeamMemberCard key={index} member={member} />
            ))}
          </div>
        </div>
      </section>

      {/* Certifications & Training Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/GettyImages-489204244-801x1024.jpg"
                  alt="Professional Training"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                <div className="absolute bottom-6 left-6 bg-white rounded-xl p-4 shadow-xl">
                  <p className="text-sm font-display font-bold text-theta-blue">
                    Certified Excellence
                  </p>
                  <p className="text-xs font-sans text-gray-600 mt-1">
                    Board-Certified Professionals
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-theta-blue-light rounded-full mb-6">
                <span className="text-sm font-display font-bold text-theta-blue uppercase tracking-wider">
                  Credentials
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6 leading-tight">
                Expertise You Can Trust
              </h2>

              <p className="text-lg font-sans text-gray-600 mb-8 leading-relaxed">
                Our therapists hold advanced certifications and stay current
                with the latest evidence-based techniques through continuous
                education and training.
              </p>

              <div className="space-y-4">
                {[
                  {
                    title: "Certified Chiropractic Sports Physician (CCSP)",
                    icon: Award,
                  },
                  {
                    title:
                      "Diplomate of American Chiropractic Board (DACBSP)",
                    icon: Shield,
                  },
                  {
                    title: "Advanced Manual Therapy Certification",
                    icon: TrendingUp,
                  },
                  {
                    title: "Pediatric & Prenatal Care Specialist",
                    icon: Heart,
                  },
                  {
                    title: "Licensed Massage Therapy (LMT)",
                    icon: CheckCircle,
                  },
                ].map((cert, index) => (
                  <div
                    key={index}
                    className="flex items-start p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors duration-300"
                  >
                    <cert.icon className="w-6 h-6 text-theta-blue mr-4 flex-shrink-0 mt-1" />
                    <p className="font-sans text-gray-700">{cert.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-theta-blue-light rounded-full mb-6">
              <span className="text-sm font-display font-bold text-theta-blue uppercase tracking-wider">
                Testimonials
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4 leading-tight">
              What Our Patients Say
            </h2>
            <p className="text-xl font-sans text-gray-600 max-w-3xl mx-auto">
              Real stories from real people who've transformed their health with
              us
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-theta-blue-light rounded-full mb-6">
                <span className="text-sm font-display font-bold text-theta-blue uppercase tracking-wider">
                  Visit Us
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6 leading-tight">
                A Calming Space for Healing
              </h2>

              <p className="text-lg font-sans text-gray-600 mb-8 leading-relaxed">
                Our modern facility in San Francisco's financial district offers
                a peaceful retreat from the busy city, designed specifically for
                your comfort and recovery.
              </p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <MapPin className="w-6 h-6 text-theta-blue mr-4 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-display font-bold text-gray-900 mb-1">
                      Location
                    </p>
                    <p className="font-sans text-gray-600">
                      200 Sutter St Suite 602
                      <br />
                      San Francisco, CA 94108
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="w-6 h-6 text-theta-blue mr-4 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-display font-bold text-gray-900 mb-1">
                      Hours
                    </p>
                    <p className="font-sans text-gray-600">
                      Mon – Fri: 8:00 AM – 5:00 PM
                      <br />
                      Sat: 8:00 AM – 2:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 h-64 rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="/GettyImages-2222455863.webp"
                  alt="Facility"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="h-48 rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="/GettyImages-200112735-001-801x1024.jpg"
                  alt="Treatment Room"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="h-48 rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="/pexels-arina-krasnikova-6663372.webp"
                  alt="Waiting Area"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-theta-blue via-theta-blue-dark to-theta-blue">
        <div className="max-w-4xl mx-auto text-center text-white">
          <Users className="w-16 h-16 mx-auto mb-6 text-blue-100" />
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Ready to Start Your Wellness Journey?
          </h2>
          <p className="text-xl font-sans text-blue-100 mb-8">
            Join thousands of satisfied patients who've found relief and
            restored their quality of life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-theta-blue font-display font-bold rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl">
              Book Your First Visit
            </button>
            <button className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-display font-bold rounded-full hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
              Learn About Services
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
