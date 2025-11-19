import React from "react";
import { Flower } from "lucide-react";

// --- Color Palette & Assets ---
const COLORS = {
  lightestBlue: "#94CCE7",
  lightBlue: "#2DA0CC",
  mediumBlue: "#0873A1",
  darkBlue: "#035C84",
  white: "#FFFFFF",
  bgLight: "#F0F8FF",
};

// --- Types & Data ---
interface ServiceItem {
  id: string;
  title: string;
  description: string;
  image: string;
  isHighlighted?: boolean;
}

interface ServiceSectionData {
  id: string;
  categoryTitle: string;
  subTitle?: string;
  description: string;
  services: ServiceItem[];
}

const servicesData: ServiceSectionData[] = [
  {
    id: "chiropractic",
    categoryTitle: "Chiropractic Care",
    subTitle: "OUR CORE FOCUS",
    description:
      "Spinal health is at the heart of everything we do. Our chiropractic services restore alignment, relieve pain, and improve mobility.",
    services: [
      {
        id: "c1",
        title: "Chiropractic Care",
        description: "Restores alignment, improves mobility, supports lasting health.",
        image: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
      {
        id: "c2",
        title: "Chronic Pain",
        description: "Reduces discomfort, restores movement, improves daily life.",
        image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
      {
        id: "c3",
        title: "Sport Injuries",
        description: "Speeds recovery, prevents setbacks, enhances performance.",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
      {
        id: "c4",
        title: "Posture Correction",
        description: "Relieves strain, improves alignment, supports balance.",
        image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        isHighlighted: true, // Example of the highlighted card in screenshots
      },
    ],
  },
  {
    id: "massage",
    categoryTitle: "Massage Therapy",
    subTitle: "COMPLEMENTARY",
    description:
      "To support your chiropractic care, we also offer massage therapies that relax muscles, release tension, and promote faster recovery.",
    services: [
      {
        id: "m1",
        title: "Swedish Massage",
        description: "Gentle relaxation to reduce stress and improve circulation.",
        image: "https://images.unsplash.com/photo-1519824145371-296894a0daa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
      {
        id: "m2",
        title: "Deep Tissue",
        description: "Targets deep muscle layers to release chronic tension.",
        image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
      {
        id: "m3",
        title: "Medical Massage",
        description: "Focused techniques to address specific medical conditions.",
        image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
      {
        id: "m4",
        title: "SPA Massage",
        description: "Luxurious treatments designed for pure relaxation.",
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    id: "physical",
    categoryTitle: "Physical Therapy",
    subTitle: "REHABILITATIVE",
    description:
      "For patients needing extra support, physical therapy works hand in hand with chiropractic adjustments to rebuild strength and restore mobility.",
    services: [
      {
        id: "p1",
        title: "Physical Therapy",
        description: "We help you move better, feel stronger, and get back to life.",
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
      {
        id: "p2",
        title: "Orthopedic Rehab",
        description: "Relief and recovery through personalized, holistic care.",
        image: "https://images.unsplash.com/photo-1591343395082-e120087004b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
      {
        id: "p3",
        title: "Occupational Therapy",
        description: "OT that restores function and independence — personalized.",
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
      {
        id: "p4",
        title: "Sports Injury Rehab",
        description: "Recover stronger with targeted, holistic rehab for athletes.",
        image: "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        isHighlighted: true, 
      },
    ],
  },
];

// --- Component: Service Card ---
const ServiceCard: React.FC<{ item: ServiceItem }> = ({ item }) => {
  return (
    <div
      className={`
        group relative flex flex-col rounded-2xl overflow-hidden 
        bg-white shadow-sm transition-all duration-300 hover:shadow-xl
        ${item.isHighlighted ? `ring-4 ring-[${COLORS.lightestBlue}]` : ""}
      `}
    >
      {/* Image Section */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Overlay Gradient (Optional) */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
      </div>

      {/* Card Content with "Curved Cutout" Effect */}
      <div className="relative px-6 pb-8 pt-10 text-center flex-grow flex flex-col items-center">
        
        {/* The Floating Icon - Positioned to overlap image and text */}
        <div 
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-full"
          style={{
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)", // Subtle shadow
          }}
        >
           {/* This creates the "cutout" look by matching bg color */}
           <div className="bg-white rounded-full p-3"> 
             <Flower 
                size={24} 
                color={COLORS.darkBlue} 
                className="fill-current opacity-80"
             />
           </div>
           {/* Decorative SVG curve filler (Optional visual polish to smooth edges) */}
           <svg className="absolute top-6 -left-4 w-4 h-4 text-white fill-current hidden" viewBox="0 0 10 10">
             <path d="M10,0 Q0,0 0,10 L10,10 Z" />
           </svg>
        </div>

        <h3 
          className="text-xl font-serif font-medium mb-3"
          style={{ color: COLORS.darkBlue }}
        >
          {item.title}
        </h3>
        
        <p className="text-gray-500 text-sm leading-relaxed">
          {item.description}
        </p>
      </div>
    </div>
  );
};

// --- Main Page Component ---
const ServicesPage: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-white flex flex-col">
      
      {/* --- Header Section --- */}
      <div className="w-full max-w-4xl mx-auto px-4 pt-32 pb-16 text-center">
        <h1 
          className="text-5xl md:text-6xl font-serif font-light mb-6"
          style={{ color: COLORS.darkBlue }}
        >
          Services
        </h1>
        <p className="text-lg uppercase tracking-widest mb-6 text-gray-400 font-semibold text-xs">
          Begin Your Journey to Better Health
        </p>
        <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
          At Theta Lounge, <strong style={{color: COLORS.darkBlue}}>chiropractic care</strong> is at the center of everything we do. 
          Our goal is to restore balance, relieve pain, and help your body function at its best. 
          To support lasting results, we also offer <strong style={{color: COLORS.darkBlue}}>massage therapy</strong> to ease muscle tension 
          and <strong style={{color: COLORS.darkBlue}}>physical therapy</strong> to rebuild strength and mobility.
        </p>
      </div>

      {/* --- Service Categories Loop --- */}
      {servicesData.map((section, index) => (
        <section 
          key={section.id} 
          className={`w-full py-20 ${index % 2 !== 0 ? 'bg-gray-50' : 'bg-white'}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Section Header */}
            <div className="text-center mb-16">
              {section.subTitle && (
                <p 
                   className="uppercase tracking-widest text-xs font-bold mb-3"
                   style={{ color: COLORS.lightBlue }} // Using the accent color
                >
                  {section.subTitle}
                </p>
              )}
              <h2 
                className="text-4xl font-serif mb-6"
                style={{ color: COLORS.darkBlue }}
              >
                {section.categoryTitle}
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto">
                {section.description}
              </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {section.services.map((item) => (
                <ServiceCard key={item.id} item={item} />
              ))}
            </div>

          </div>
        </section>
      ))}

      {/* Spacer for Footer connection */}
      <div className="h-20 bg-white"></div>
    </div>
  );
};

export default ServicesPage;