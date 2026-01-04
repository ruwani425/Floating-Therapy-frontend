import React, { useState } from "react";
import { Search, Calendar, User, ArrowRight, Tag } from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

interface BlogPost {
  id: number;
  category: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  author: string;
  date: string;
  readTime: string;
  featured?: boolean;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    category: "Physical Therapy",
    title: "Neck & Back Pain from Remote Work: A Growing Concern",
    excerpt:
      "Learn how prolonged sitting and poor posture affect your spine and what you can do to prevent chronic pain.",
    imageUrl: "/pexels-arina-krasnikova-6663372.webp",
    author: "Dr. Sarah Mitchell",
    date: "Nov 15, 2024",
    readTime: "5 min read",
    featured: true,
  },
  {
    id: 2,
    category: "Physical Therapy",
    title: "How Physical Therapy Can Transform Your Life",
    excerpt:
      "Discover the life-changing benefits of consistent physical therapy and how it can improve your daily activities.",
    imageUrl: "/GettyImages-1324943018-2-1024x600.jpg",
    author: "Dr. Mark Johnson",
    date: "Nov 12, 2024",
    readTime: "4 min read",
  },
  {
    id: 3,
    category: "Exercise",
    title: "Effective Arm Exercises to Tone and Strengthen",
    excerpt:
      "Simple yet powerful exercises to build upper body strength and improve posture from home.",
    imageUrl: "/GettyImages-sb10064081j-002-1024x600.jpg",
    author: "Emily Rodriguez",
    date: "Nov 10, 2024",
    readTime: "6 min read",
  },
  {
    id: 4,
    category: "Care",
    title: "Muscle Imbalances Could Put You at Risk",
    excerpt:
      "Understanding how muscle imbalances develop and the steps to correct them before injury occurs.",
    imageUrl: "/pexels-arina-krasnikova-6663372.webp",
    author: "Dr. Sarah Mitchell",
    date: "Nov 8, 2024",
    readTime: "5 min read",
  },
  {
    id: 5,
    category: "Pregnancy",
    title: "Is Chiropractic Care Safe During Pregnancy?",
    excerpt:
      "Everything expectant mothers need to know about safe chiropractic adjustments during pregnancy.",
    imageUrl: "/GettyImages-1357320863-1-801x1024.jpg",
    author: "Dr. Lisa Chen",
    date: "Nov 5, 2024",
    readTime: "4 min read",
  },
  {
    id: 6,
    category: "Migraines",
    title: "How Chiropractors May Relieve Migraines",
    excerpt:
      "Explore natural, drug-free approaches to reducing migraine frequency and intensity through chiropractic care.",
    imageUrl: "/GettyImages-200112735-001-801x1024.jpg",
    author: "Dr. Mark Johnson",
    date: "Nov 3, 2024",
    readTime: "5 min read",
  },
  {
    id: 7,
    category: "Physical Therapy",
    title: "How Physical Therapy Speeds Up Injury Recovery",
    excerpt:
      "Learn the science behind physical therapy's role in faster, more complete recovery from injuries.",
    imageUrl: "/pexels-arina-krasnikova-6663372.webp",
    author: "Emily Rodriguez",
    date: "Oct 30, 2024",
    readTime: "6 min read",
  },
  {
    id: 8,
    category: "Pain Management",
    title: "Chiropractic Care vs. Pain Medication: What's Better?",
    excerpt:
      "A comprehensive comparison of natural pain relief methods versus pharmaceutical approaches.",
    imageUrl: "/GettyImages-489204244-801x1024.jpg",
    author: "Dr. Sarah Mitchell",
    date: "Oct 28, 2024",
    readTime: "7 min read",
  },
  {
    id: 9,
    category: "Sports",
    title: "Why Athletes Rely on Chiropractic Care",
    excerpt:
      "Discover how professional athletes use chiropractic adjustments to enhance performance and prevent injuries.",
    imageUrl: "/pexels-arina-krasnikova-6663372.webp",
    author: "Dr. Mark Johnson",
    date: "Oct 25, 2024",
    readTime: "5 min read",
  },
];

const categories = [
  "All",
  "Physical Therapy",
  "Exercise",
  "Care",
  "Pregnancy",
  "Migraines",
  "Pain Management",
  "Sports",
];

const FeaturedPost: React.FC<{ post: BlogPost }> = ({ post }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8 }}
    className="relative rounded-3xl overflow-hidden shadow-2xl mb-16 group cursor-pointer"
  >
    <div className="relative h-[500px] md:h-[600px]">
      <img
        src={post.imageUrl}
        alt={post.title}
        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
    </div>

    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <span className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-full mb-4 shadow-lg">
          Featured
        </span>
        <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-md text-white text-sm font-semibold rounded-full mb-4 ml-3">
          {post.category}
        </span>
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 leading-tight"
      >
        {post.title}
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-lg md:text-xl font-sans text-gray-200 mb-6 max-w-3xl"
      >
        {post.excerpt}
      </motion.p>

      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-flex items-center px-8 py-4 bg-white text-blue-900 font-bold rounded-full transition-all group/btn shadow-xl"
      >
        Read Article
        <ArrowRight className="w-5 h-5 ml-2 transform group-hover/btn:translate-x-1 transition-transform" />
      </motion.button>
    </div>
  </motion.div>
);

// --- Blog Post Card Component ---
const BlogPostCard: React.FC<{ post: BlogPost }> = ({ post }) => (
  <motion.article 
    layout
    variants={fadeInUp}
    initial="hidden"
    animate="visible"
    exit={{ opacity: 0, scale: 0.9 }}
    whileHover={{ y: -8 }}
    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group flex flex-col h-full"
  >
    <div className="relative h-64 overflow-hidden">
      <img
        src={post.imageUrl}
        alt={post.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute top-4 left-4">
        <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full shadow-md">
          {post.category}
        </span>
      </div>
    </div>

    <div className="p-6 flex flex-col flex-grow">
      <h3 className="text-xl md:text-2xl font-serif font-bold text-gray-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors">
        {post.title}
      </h3>

      <p className="text-gray-600 font-sans text-sm md:text-base mb-4 leading-relaxed line-clamp-2 flex-grow">
        {post.excerpt}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
        <div className="flex items-center space-x-3 text-xs text-gray-500">
          <div className="flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-1" />
            {post.date}
          </div>
          <span>{post.readTime}</span>
        </div>
        <ArrowRight className="w-5 h-5 text-blue-600 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
      </div>
    </div>
  </motion.article>
);

// --- Main Blog Page Component ---
const BlogPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const featuredPost = blogPosts.find((post) => post.featured);
  const regularPosts = blogPosts.filter((post) => !post.featured);

  const filteredPosts = regularPosts.filter((post) => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-slate-50 w-full min-h-screen overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 text-center overflow-hidden">
        <video
          src="https://videos.pexels.com/video-files/9694443/9694443-hd_1920_1080_25fps.mp4"
          loop preload="none" muted playsInline autoPlay
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#3a7ca5]/95 to-[#1B4965]/95"></div>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 max-w-4xl mx-auto text-white"
        >
          <motion.h1 variants={fadeInUp} className="text-6xl md:text-8xl font-serif font-bold mb-6">
            Our Blog
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Expert insights and wellness tips for a pain-free life.
          </motion.p>

          <motion.div variants={fadeInUp} className="relative max-w-2xl mx-auto">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full focus:bg-white/20 focus:outline-none text-white placeholder-white/60 transition-all shadow-2xl"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {featuredPost && <FeaturedPost post={featuredPost} />}

        {/* Category Filter */}
        <div className="mb-16">
          <div className="flex items-center mb-8">
            <Tag className="w-5 h-5 text-blue-600 mr-2" />
            <h2 className="text-2xl font-serif font-bold text-gray-900">Browse by Category</h2>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-3"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`relative px-6 py-3 rounded-full font-bold transition-all z-10 overflow-hidden ${
                  selectedCategory === category ? "text-white" : "bg-white text-gray-600 hover:bg-gray-100 shadow-sm"
                }`}
              >
                {category}
                {selectedCategory === category && (
                  <motion.div 
                    layoutId="activeCategory"
                    className="absolute inset-0 bg-blue-600 z-[-1]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Blog Posts Grid */}
        <motion.div layout className="mb-20">
          <motion.h2 layout className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-10">
            {selectedCategory === "All" ? "Latest Articles" : selectedCategory}
          </motion.h2>

          <AnimatePresence mode="popLayout">
            {filteredPosts.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
              >
                {filteredPosts.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-center py-20"
              >
                <p className="text-xl text-gray-500">No articles match your search.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Newsletter Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#1B4965] rounded-[3rem] p-10 md:p-16 text-center text-white shadow-2xl"
        >
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">Stay Informed</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Get monthly wellness insights and expert health tips delivered to your inbox.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Email address"
              className="flex-1 px-8 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-400"
            />
            <motion.button 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 bg-blue-500 text-white font-bold rounded-full shadow-lg"
            >
              Subscribe
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
export default BlogPage;
