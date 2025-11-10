import React from 'react';
import { UserGroupIcon, AdjustmentsHorizontalIcon, ClockIcon, ShieldCheckIcon, GlobeAltIcon, StarIcon } from '@heroicons/react/24/outline';

const WhyChooseUs: React.FC = () => {
  const features = [
    {
      icon: UserGroupIcon,
      title: 'Expert Local Guides',
      description: 'Our experienced local guides provide authentic insights and ensure a safe, enriching travel experience with deep cultural knowledge.',
      color: 'text-primary-600',
      bgColor: 'bg-gradient-primary',
      stats: '500+ Guides',
    },
    {
      icon: AdjustmentsHorizontalIcon,
      title: 'Personalized Experiences',
      description: 'We craft custom itineraries tailored to your interests, preferences, and budget for truly unique adventures.',
      color: 'text-secondary-600',
      bgColor: 'bg-gradient-light',
      stats: 'Custom Trips',
    },
    {
      icon: ClockIcon,
      title: '24/7 Support',
      description: 'Round-the-clock assistance from our dedicated team, available whenever you need help during your journey.',
      color: 'text-accent-600',
      bgColor: 'bg-gradient-accent',
      stats: 'Always Available',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Safe & Secure',
      description: 'Your safety is our priority with comprehensive travel insurance, health protocols, and emergency support.',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      stats: '100% Safe',
    },
    {
      icon: GlobeAltIcon,
      title: 'Global Destinations',
      description: 'Access to over 500 destinations worldwide, from hidden gems to iconic landmarks across every continent.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      stats: '500+ Spots',
    },
    {
      icon: StarIcon,
      title: 'Award-Winning Service',
      description: 'Recognized for excellence with multiple travel industry awards and consistently high customer satisfaction.',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      stats: '4.9/5 Rating',
    },
  ];

  return (
    <section className="py-20 bg-gradient-light relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-20 left-10 animate-float">
          <GlobeAltIcon className="h-24 w-24 text-primary-300" />
        </div>
        <div className="absolute bottom-20 right-10 animate-float" style={{ animationDelay: '2s' }}>
          <StarIcon className="h-16 w-16 text-accent-300" />
        </div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="section-title animate-slide-up">
            Why Choose Travores?
          </h2>
          <p className="text-lg text-secondary-600 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Discover what makes us the preferred choice for travelers worldwide. We're committed to delivering
            exceptional experiences that exceed expectations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="card group hover:shadow-large transition-all duration-500 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-4 rounded-2xl ${feature.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-secondary-500">{feature.stats}</div>
                  </div>
                </div>

                <h3 className={`text-xl font-bold mb-4 ${feature.color} group-hover:scale-105 transition-transform duration-300`}>
                  {feature.title}
                </h3>
                <p className="text-secondary-600 leading-relaxed group-hover:text-secondary-700 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <div className="bg-white rounded-2xl shadow-large p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-secondary-900 mb-4">
              Ready to Start Your Adventure?
            </h3>
            <p className="text-secondary-600 mb-6">
              Join thousands of satisfied travelers who have discovered their perfect getaway with us.
            </p>
            <button className="btn-primary text-lg px-8 py-4">
              Plan Your Trip Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
