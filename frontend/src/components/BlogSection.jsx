import React from 'react';
import { FiArrowRight, FiCalendar, FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const BlogSection = () => {
  const posts = [
    {
      id: 1,
      title: 'Healthy Eating Habits for a Better Life',
      excerpt: 'Discover simple ways to incorporate more fresh fruits and vegetables into your daily meals.',
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      date: 'May 15, 2026',
      author: 'Jane Doe',
    },
    {
      id: 2,
      title: 'The Benefits of Organic Farming',
      excerpt: 'Why choosing organic products is not only better for your health but also for the environment.',
      image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      date: 'May 10, 2026',
      author: 'John Smith',
    },
    {
      id: 3,
      title: 'Summer Seasonal Fruits to Try',
      excerpt: 'Beat the heat with these refreshing and nutrient-packed fruits available this summer season.',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
      date: 'May 05, 2026',
      author: 'Emily Chen',
    }
  ];

  return (
    <section className="w-full px-4 md:px-8 lg:px-12 py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Latest News</h2>
        <p className="text-gray-500 max-w-2xl mx-auto">Stay updated with our latest articles on healthy living, organic farming, and fresh recipes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-shadow group">
            <div className="h-56 overflow-hidden relative">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-brand-green flex items-center gap-1">
                <FiCalendar /> {post.date}
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                <FiUser /> By {post.author}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 hover:text-brand-green transition-colors cursor-pointer line-clamp-2">
                {post.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {post.excerpt}
              </p>
              <Link to="#" className="inline-flex items-center gap-2 text-brand-green font-medium hover:text-brand-dark transition-colors">
                Read More <FiArrowRight />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BlogSection;
