import React, { useState } from "react";
import { Search, Calendar, User, ArrowRight, Tag } from "lucide-react";

// --- Data Structure ---
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

// --- Featured Post Component ---
const FeaturedPost: React.FC<{ post: BlogPost }> = ({ post }) => (
  <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-16 group cursor-pointer">
    <div className="relative h-[500px] md:h-[600px]">
      <img
        src={post.imageUrl}
        alt={post.title}
        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
    </div>

    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
      <span className="inline-block px-4 py-2 bg-theta-blue text-white text-sm font-display font-bold rounded-full mb-4">
        Featured
      </span>
      <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-display font-semibold rounded-full mb-4 ml-3">
        {post.category}
      </span>

      <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 leading-tight">
        {post.title}
      </h1>

      <p className="text-lg md:text-xl font-sans text-gray-200 mb-6 max-w-3xl">
        {post.excerpt}
      </p>

      <div className="flex items-center space-x-6 text-sm font-display font-medium mb-6">
        <div className="flex items-center">
          <User className="w-4 h-4 mr-2" />
          {post.author}
        </div>
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          {post.date}
        </div>
        <span>{post.readTime}</span>
      </div>

      <button className="inline-flex items-center px-6 py-3 bg-white text-theta-blue font-display font-bold rounded-full hover:bg-theta-blue hover:text-white transition-all duration-300 group/btn">
        Read Article
        <ArrowRight className="w-5 h-5 ml-2 transform group-hover/btn:translate-x-1 transition-transform duration-300" />
      </button>
    </div>
  </div>
);

// --- Blog Post Card Component ---
const BlogPostCard: React.FC<{ post: BlogPost }> = ({ post }) => (
  <article className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group">
    <div className="relative h-64 overflow-hidden">
      <img
        src={post.imageUrl}
        alt={post.title}
        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute top-4 left-4">
        <span className="inline-block px-3 py-1 bg-theta-blue text-white text-xs font-display font-bold rounded-full">
          {post.category}
        </span>
      </div>
    </div>

    <div className="p-6">
      <h3 className="text-xl md:text-2xl font-serif font-bold text-gray-900 mb-3 leading-tight group-hover:text-theta-blue transition-colors duration-300">
        {post.title}
      </h3>

      <p className="text-gray-600 font-sans text-sm md:text-base mb-4 leading-relaxed line-clamp-2">
        {post.excerpt}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 text-xs font-display text-gray-500">
          <div className="flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-1" />
            {post.date}
          </div>
          <span>•</span>
          <span>{post.readTime}</span>
        </div>

        <button className="text-theta-blue font-display font-semibold text-sm flex items-center hover:gap-2 gap-1 transition-all duration-300">
          Read
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  </article>
);

// --- Main Blog Page Component ---
const BlogPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const featuredPost = blogPosts.find((post) => post.featured);
  const regularPosts = blogPosts.filter((post) => !post.featured);

  const filteredPosts = regularPosts.filter((post) => {
    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-gradient-to-b from-white to-blue-50 w-full min-h-screen">
      {/* Hero Section */}
      <div className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
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

        <div className="relative z-10 max-w-4xl mx-auto text-white">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-6 leading-tight">
            Our Blog
          </h1>
          <p className="text-xl md:text-2xl font-display font-medium text-blue-100 mb-8">
            Expert insights, tips, and stories about physical therapy and
            wellness
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-white/30 bg-white/10 backdrop-blur-sm rounded-full focus:border-white focus:outline-none font-sans text-white placeholder-white/70 transition-all duration-300 shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Featured Post */}
        {featuredPost && <FeaturedPost post={featuredPost} />}

        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <Tag className="w-5 h-5 text-theta-blue mr-2" />
            <h2 className="text-2xl font-serif font-bold text-gray-900">
              Browse by Category
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2.5 rounded-full font-display font-semibold transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category
                    ? "bg-theta-blue text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-8">
            {selectedCategory === "All" ? "Latest Articles" : selectedCategory}
          </h2>

          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl font-display text-gray-500">
                No articles found. Try a different search or category.
              </p>
            </div>
          )}
        </div>

        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-theta-blue to-theta-blue-dark rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Stay Updated with Our Newsletter
          </h2>
          <p className="text-lg md:text-xl font-sans mb-8 text-blue-100">
            Get the latest health tips and wellness insights delivered to your
            inbox
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 rounded-full text-gray-800 font-sans focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="px-8 py-4 bg-white text-theta-blue font-display font-bold rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
