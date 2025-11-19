import React from "react";
import Footer from "../components/layout/Footer"; 

const COLORS = {
  lightestBlue: "light-blue-200", 
  lightBlue: "light-blue-400", 
  mediumBlue: "dark-blue-700", 
  darkBlue: "dark-blue-600", 
  textDark: "gray-800", 
};

// --- Data Structure remains the same ---
interface BlogPost {
  id: number;
  category: string;
  title: string;
  imageUrl: string;
}

const initialBlogPosts: BlogPost[] = [
  { id: 1, category: "PHYSICAL THERAPY", title: "Neck & Back Pain from Remote Work", imageUrl: "/pexels-arina-krasnikova-6663372.webp" },
  { id: 2, category: "PHYSICAL THERAPY", title: "How Physical Therapy Can Transform Your Life", imageUrl: "/pexels-arina-krasnikova-6663372.webp" },
  { id: 3, category: "PHYSICAL THERAPY", title: "Effective Arm Exercises to Tone and Strengthen Your Upper Body", imageUrl: "/pexels-arina-krasnikova-6663372.webp" },
  { id: 4, category: "CARE", title: "A Muscle Imbalance Could Put You at Risk of Injury", imageUrl: "/pexels-arina-krasnikova-6663372.webp" },
  { id: 5, category: "PREGNANCY", title: "Is Chiropractic Care Safe During Pregnancy", imageUrl: "/pexels-arina-krasnikova-6663372.webp" },
  { id: 6, category: "MIGRAINES", title: "Chiropractors May Relieve Migraines", imageUrl: "/pexels-arina-krasnikova-6663372.webp" },
  { id: 7, category: "PHYSICAL THERAPY", title: "How Physical Therapy Speeds Up Injury Recovery", imageUrl: "/pexels-arina-krasnikova-6663372.webp" },
  { id: 8, category: "PHYSICAL THERAPY", title: "Chiropractic Care vs. Pain Medication: What's the Difference?", imageUrl: "/pexels-arina-krasnikova-6663372.webp" },
  { id: 9, category: "SPORTS & PERFORMANCE", title: "Why Athletes Rely on Chiropractic Care for Performance and Recovery", imageUrl: "/pexels-arina-krasnikova-6663372.webp" },
];

const BlogPostCard: React.FC<{ post: BlogPost }> = ({ post }) => (
  <article className="bg-white rounded-lg overflow-hidden text-left">
    <img
      src={post.imageUrl}
      alt={post.title}
      className="w-full h-auto object-cover"
    />
    <div className="pt-4 pb-2">
      <p className={`text-xs font-bold uppercase text-${COLORS.darkBlue} mb-1`}>
        {post.category}
      </p>
      <h2 className={`text-xl font-bold text-${COLORS.textDark} leading-tight`}>
        {post.title}
      </h2>
    </div>
  </article>
);

const BlogPage: React.FC = () => {
  return (
      // CHANGED: Removed max-w-7xl from here. Added w-full and flex-col to manage layout.
      <div className="bg-white w-full min-h-screen flex flex-col">
        
        {/* Content Wrapper: This restricts only the text/grid width */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow">
          
          <main className="text-center pt-32 pb-20"> 
            <h1 className={`text-5xl font-light text-${COLORS.textDark} mb-2`}>
              Blog
            </h1>
            <p className="text-lg text-gray-500 mb-16">
              Helpful Tips and Articles.
            </p>

            {/* --- Blog Post Grid --- */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-16">
              {initialBlogPosts.slice(0, 9).map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </section>

            <button
              className={`
                bg-${COLORS.lightestBlue} 
                text-${COLORS.darkBlue} 
                font-semibold 
                py-3 px-6 
                rounded-lg 
                border border-${COLORS.lightestBlue}
                transition duration-300 ease-in-out 
                hover:bg-${COLORS.lightBlue} 
                hover:text-white 
                shadow-md
              `}
            >
              Load More ↓
            </button>
          </main>
        </div>

        {/* CHANGED: Footer is now OUTSIDE the max-w-7xl div, so it stretches full width */}
        <Footer />
        
      </div>
  );
};

export default BlogPage;