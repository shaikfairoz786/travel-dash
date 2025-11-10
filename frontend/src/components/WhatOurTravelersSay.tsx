import React from 'react';
import { StarIcon, ChatBubbleLeftRightIcon as QuoteIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const WhatOurTravelersSay: React.FC = () => {
  const testimonials = [
    {
      quote: "Travores made our honeymoon in Bali absolutely magical! From the moment we landed, everything was perfectly arranged. The local guide knew all the hidden gems, and the villa was beyond our expectations. Truly unforgettable!",
      author: "Sarah & Michael Chen",
      location: "Bali, Indonesia",
      rating: 5,
      tripType: "Honeymoon",
      image: "/testimonial-1.jpg",
      verified: true,
    },
    {
      quote: "As a solo traveler, I was nervous about exploring Tokyo alone. Travores took care of everything - from airport pickup to restaurant reservations. The team was available 24/7, and I felt completely safe throughout my journey.",
      author: "Emma Rodriguez",
      location: "Tokyo, Japan",
      rating: 5,
      tripType: "Solo Adventure",
      image: "/testimonial-2.jpg",
      verified: true,
    },
    {
      quote: "Our family trip to Europe was perfectly orchestrated. The itinerary was customized for our kids' ages, and every detail was considered. The guides were patient and engaging. We've already booked our next trip with them!",
      author: "David & Lisa Thompson",
      location: "Paris, France",
      rating: 5,
      tripType: "Family Vacation",
      image: "/testimonial-3.jpg",
      verified: true,
    },
    {
      quote: "The photography tour in Iceland exceeded all expectations. The guides were professional photographers themselves, and the locations were breathtaking. The accommodation was luxurious, and the food was incredible.",
      author: "Marcus Johnson",
      location: "Reykjavik, Iceland",
      rating: 5,
      tripType: "Photography Tour",
      image: "/testimonial-4.jpg",
      verified: true,
    },
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 animate-float">
          <QuoteIcon className="h-20 w-20 text-primary-300" />
        </div>
        <div className="absolute bottom-10 right-10 animate-float" style={{ animationDelay: '3s' }}>
          <StarIcon className="h-16 w-16 text-accent-300" />
        </div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="section-title animate-slide-up">
            What Our Travelers Say
          </h2>
          <p className="text-lg text-secondary-600 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Don't just take our word for it. Hear from real travelers who have experienced the Travores difference
            and discovered their perfect adventure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.author}
              className="bg-white rounded-2xl shadow-large p-8 hover:shadow-glow transition-all duration-500 animate-slide-up group"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Quote Icon */}
              <div className="flex justify-between items-start mb-6">
                <QuoteIcon className="h-10 w-10 text-primary-300 flex-shrink-0" />
                {testimonial.verified && (
                  <div className="flex items-center text-sm text-green-600 font-medium">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    Verified Review
                  </div>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarIconSolid key={i} className="h-5 w-5 text-yellow-400" />
                ))}
                <span className="ml-2 text-sm text-secondary-500 font-medium">
                  {testimonial.rating}.0
                </span>
              </div>

              {/* Quote */}
              <blockquote className="text-secondary-700 text-lg leading-relaxed mb-6 italic group-hover:text-secondary-800 transition-colors duration-300">
                "{testimonial.quote}"
              </blockquote>

              {/* Author Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-lg">
                      {testimonial.author.split(' ')[0].charAt(0)}
                      {testimonial.author.split(' ')[1]?.charAt(0) || ''}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors duration-300">
                      {testimonial.author}
                    </p>
                    <div className="flex items-center text-sm text-secondary-500">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      {testimonial.location}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                    {testimonial.tripType}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-primary rounded-2xl p-8 text-white text-center animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="animate-slide-up">
              <div className="text-3xl font-bold mb-2">50,000+</div>
              <div className="text-primary-100">Happy Travelers</div>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-primary-100">Destinations</div>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="text-3xl font-bold mb-2">4.9/5</div>
              <div className="text-primary-100">Average Rating</div>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-primary-100">Customer Support</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <p className="text-secondary-600 mb-6">
            Ready to create your own unforgettable story?
          </p>
          <button className="btn-secondary text-lg px-8 py-4">
            Start Planning Your Trip
          </button>
        </div>
      </div>
    </section>
  );
};

export default WhatOurTravelersSay;
