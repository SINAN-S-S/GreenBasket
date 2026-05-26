import React from 'react';
import { FiArrowRight, FiCalendar, FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import './BlogSection.css';

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
    <section id="blog" className="blog-section">
      <div className="blog-header">
        <h2 className="blog-title">Latest News</h2>
        <p className="blog-subtitle">Stay updated with our latest articles on healthy living, organic farming, and fresh recipes.</p>
      </div>

      <div className="blog-grid">
        {posts.map((post) => (
          <div key={post.id} className="blog-card group">
            <div className="blog-img-wrapper">
              <img 
                src={post.image} 
                alt={post.title} 
                className="blog-img"
              />
              <div className="blog-date-badge">
                <FiCalendar /> {post.date}
              </div>
            </div>
            <div className="blog-content">
              <div className="blog-author">
                <FiUser /> By {post.author}
              </div>
              <h3 className="blog-post-title">
                {post.title}
              </h3>
              <p className="blog-excerpt">
                {post.excerpt}
              </p>
              <Link to="#" className="blog-read-more">
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
