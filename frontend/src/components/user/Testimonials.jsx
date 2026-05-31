import React from 'react';
import { FaStar } from 'react-icons/fa';
import './Testimonials.css';

const testimonialsData = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "Regular Customer",
    image: "https://i.pravatar.cc/150?img=1",
    review: "GreenBasket is a lifesaver! The organic produce is always fresh, and the same-day delivery makes grocery shopping so convenient.",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Health Enthusiast",
    image: "https://i.pravatar.cc/150?img=11",
    review: "I love the variety of organic grains and nuts available. The quality is top-notch and prices are very reasonable compared to local stores.",
    rating: 5,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Mother of two",
    image: "https://i.pravatar.cc/150?img=5",
    review: "Finding chemical-free fruits for my kids used to be hard. With GreenBasket, I can trust what I'm buying. Highly recommend!",
    rating: 5,
  }
];

const Testimonials = () => {
  return (
    <section className="testimonials-section">
      <div className="testimonials-header">
        <h2 className="testimonials-title">What Our Customers Say</h2>
        <p className="testimonials-subtitle">Trusted by thousands of happy shoppers.</p>
      </div>
      <div className="testimonials-grid">
        {testimonialsData.map((testimonial) => (
          <div key={testimonial.id} className="testimonial-card">
            <div className="testimonial-rating">
              {[...Array(testimonial.rating)].map((_, i) => (
                <FaStar key={i} className="star-icon" />
              ))}
            </div>
            <p className="testimonial-text">"{testimonial.review}"</p>
            <div className="testimonial-author">
              <img src={testimonial.image} alt={testimonial.name} className="author-image" />
              <div className="author-info">
                <h4>{testimonial.name}</h4>
                <span>{testimonial.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
