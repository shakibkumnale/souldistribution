import { Metadata } from 'next';
import Image from 'next/image';
import { MusicIcon, Award, Users, Headphones, TrendingUp, Instagram, Music, Mic, Video, BarChart4 } from 'lucide-react';

// Define viewport separately from metadata
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata = {
  title: 'About Us | Soul Distribution',
  description: 'Learn about Soul Distribution, our mission, and how we help artists distribute their music globally.',
};

const AboutPage = () => {
  const stats = [
    { icon: <MusicIcon className="h-6 w-6 text-purple-500" />, label: 'Tracks Distributed', value: '10,000+' },
    { icon: <Users className="h-6 w-6 text-purple-500" />, label: 'Artists Served', value: '500+' },
    { icon: <Headphones className="h-6 w-6 text-purple-500" />, label: 'Total Streams', value: '50M+' },
    { icon: <TrendingUp className="h-6 w-6 text-purple-500" />, label: 'Platforms', value: '150+' },
  ];

  const services = [
    { icon: <Music className="h-12 w-12 text-purple-500" />, title: 'Music Distribution', description: 'Get your music on all major streaming platforms globally with just a few clicks.' },
    { icon: <Mic className="h-12 w-12 text-purple-500" />, title: 'Mix-Mastering', description: 'Professional audio engineering services to make your tracks sound industry-standard.' },
    { icon: <Video className="h-12 w-12 text-purple-500" />, title: 'Video Production', description: 'High-quality music video production services from concept to final edit.' },
    { icon: <BarChart4 className="h-12 w-12 text-purple-500" />, title: 'Marketing', description: 'Strategic promotion to get your music in front of the right audience.' },
  ];

  const team = [
    {
      name: 'Shakib',
      role: 'Distribution Head',
      bio: 'Handles rapping, recording, distribution, and marketing. Set up a home studio to support the team.',
      image: '/images/group/shakib.jpg',
      instagram: 'https://www.instagram.com/',
    },
    {
      name: 'Shaikh',
      role: 'Head of Production',
      bio: 'Rapper, video editor, beat producer, music mixer-master, and video director.',
      image: '/images/group/shaikh1.jpg',
      instagram: 'https://www.instagram.com/x__shaikh__02/',
    },
    {
      name: 'JD Soul',
      role: 'Core Artist',
      bio: 'One of the most talented musicians in the group, a key part of Soul Distribution.',
      image: '/images/group/jd.jpg',
      instagram: 'https://www.instagram.com/jd_soul_02/',
    },
    {
      name: 'Aman Aiba',
      role: 'Artist',
      bio: 'An incredible artist who became a key part of the movement.',
      image: '/images/group/aman.png',
      instagram: 'https://www.instagram.com/_amaan.aiba_/',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden mb-24">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-blue-900/90 z-10"></div>
        <div className="absolute inset-0">
          <Image 
            src="/images/group/soullogo.jpg" 
            alt="Soul Distribution" 
            fill 
            style={{objectFit: 'cover'}}
            className="opacity-60"
          />
        </div>
        <div className="relative z-20 py-20 px-8 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-300">
            We Amplify Independent Voices
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-gray-100">
            Soul Distribution isn't just a service—it's a movement to empower artists like you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="/services" 
              className="bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-lg font-semibold transition-colors"
            >
              Our Services
            </a>
            <a 
              href="/contact" 
              className="bg-transparent hover:bg-white/10 border-2 border-white px-8 py-4 rounded-lg font-semibold transition-colors"
            >
              Join The Movement
            </a>
          </div>
        </div>
      </div>

      {/* Our Journey Section */}
      <div className="mb-24">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 inline-block bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
            Our Journey
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-purple-600 to-blue-500 mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              <span className="font-bold text-purple-600 text-xl">Soul Distribution</span> started as a passion project among school friends—<span className="font-semibold">Shakib, Shaikh, and JD Soul</span>—united by our love for rap music and inspired by artists like Emiway Bantai.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              On <span className="font-semibold">January 1, 2022</span>, we dropped our first track on the <span className="font-semibold italic">3 in 1 Soul Rap</span> YouTube channel—a moment that revealed we had something bigger than just a hobby. We had a vision.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              But as independent artists, we faced countless challenges: recording, production, distribution, marketing—all while trying to create authentic music. That's when we realized: <span className="italic">if we're struggling with this, other artists must be too.</span>
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              Soul Distribution was born from this realization—not just as a service, but as a platform where artists can focus purely on their music, while we handle everything else. <span className="font-semibold">We're artists serving artists.</span>
            </p>
          </div>
          <div className="order-1 lg:order-2 relative h-96 lg:h-[32rem] w-full rounded-xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
            <Image 
              src="/images/group/team.jpg" 
              alt="Soul Distribution Team" 
              fill 
              style={{objectFit: 'cover'}}
              className="rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Team Member Highlights */}
      <div className="mb-24 bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-900 dark:to-purple-900/20 rounded-3xl py-12 px-4 ">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 inline-block bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
            The Soul Behind Distribution
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-purple-600 to-blue-500 mx-auto"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mt-6">
            Each member brings unique talents that form the backbone of Soul Distribution
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:gap-4 gap-6 mt-12">
          {team.map((member, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md transform hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="relative h-72 w-full">
                <Image 
                  src={member.image} 
                  alt={member.name} 
                  fill 
                  style={{objectFit: 'cover'}}
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                <p className="text-purple-500 font-semibold mb-4">{member.role}</p>
                <p className="text-gray-600 dark:text-gray-300 mb-5">{member.bio}</p>
                {member.instagram && (
                  <a 
                    href={member.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-purple-500 hover:text-purple-700 font-medium"
                  >
                    <Instagram className="h-5 w-5 mr-2" />
                    Follow on Instagram
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What We Offer Section */}
      <div className="mb-24">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 inline-block bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
            What We Offer
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-purple-600 to-blue-500 mx-auto"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mt-6">
            Comprehensive services designed by artists, for artists
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md border-t-4 border-purple-500 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold mb-3">{service.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{service.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
            We started with music distribution as our core offering, but our vision extends much further. Soon, we'll be providing affordable services for mix-mastering, video shoots, and editing—all at affordable rates.
          </p>
          <div className="border-l-4 border-purple-500 pl-6 py-2">
            <p className="text-xl text-gray-700 dark:text-gray-200 font-medium italic">
              "3 in 1 Soul Rap is not just a YouTube channel. It's a platform for real artists who want to showcase their talent without worrying about production and marketing. Our goal is to help artists focus on what matters most—their music."
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mb-24 bg-gradient-to-r from-purple-600 to-blue-500 rounded-3xl p-12 text-white">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Our Impact So Far
          </h2>
          <div className="h-1 w-20 bg-white mx-auto"></div>
          <p className="text-xl max-w-3xl mx-auto mt-6 text-purple-100">
            And we're just getting started
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm p-8 rounded-xl text-center hover:bg-white/20 transition-colors duration-300">
              <div className="flex justify-center mb-4 text-white">
                {stat.icon}
              </div>
              <h3 className="text-4xl font-bold mb-2">{stat.value}</h3>
              <p className="text-purple-100">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mission & Values */}
      <div className="mb-24">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 inline-block bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
            Our Mission & Values
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-purple-600 to-blue-500 mx-auto"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mt-6">
            What drives us every day
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
            <Award className="h-14 w-14 text-purple-500 mb-6" />
            <h3 className="text-2xl font-bold mb-4">Artist-First Approach</h3>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              We believe artists should maintain ownership of their work and receive fair compensation. That's why we never take a cut of your royalties.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
            <Users className="h-14 w-14 text-purple-500 mb-6" />
            <h3 className="text-2xl font-bold mb-4">Community Building</h3>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              We're more than a distribution service. We're building a community of like-minded artists who support and elevate each other.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
            <TrendingUp className="h-14 w-14 text-purple-500 mb-6" />
            <h3 className="text-2xl font-bold mb-4">Transparency</h3>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              Clear pricing, straightforward terms, and detailed analytics. We believe in absolute transparency in all our dealings.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-purple-700 to-blue-600 text-white rounded-3xl p-12 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to amplify your music?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Join the Soul Distribution family and take your music career to the next level. Let's create something extraordinary together.
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <a 
            href="/services" 
            className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition-colors text-lg"
          >
            View Services
          </a>
          <a 
            href="/contact" 
            className="bg-transparent hover:bg-white/10 border-2 border-white px-8 py-4 rounded-lg font-semibold transition-colors text-lg"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;