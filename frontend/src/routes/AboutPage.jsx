import React from "react";
import { Helmet } from "react-helmet-async";
import { ShieldCheck, Lock, Globe, Search, TrendingUp } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-12">
      {/* SEO Metadata */}
      <Helmet>
        <title>About Us | Cyber Updates</title>
        <meta
          name="description"
          content="Learn about Cyber Updates, your trusted source for the latest news, tips, and insights in the world of cybersecurity."
        />
        <meta name="keywords" content="Cybersecurity, Data Protection, Online Security, Cyber Incidents" />
      </Helmet>

      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-blue-800">
          About <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-800 to-blue-600">Cyber Updates</span>
        </h1>
        <p className="text-xl text-gray-700 leading-relaxed">
          Your trusted source for insights and updates to navigate the digital world securely.
        </p>
      </div>

      {/* Mission Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Our Mission</h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          At Cyber Updates, our mission is simple: to empower you with knowledge and tools to stay ahead in the ever-evolving world of cybersecurity. We aim to provide the most accurate and actionable insights for both individuals and organizations.
        </p>
      </section>

      {/* Topics We Cover */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-800" />
          Topics We Cover
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <li className="flex items-center gap-4 bg-blue-50 p-4 rounded-lg shadow-md">
            <ShieldCheck className="w-8 h-8 text-blue-800" />
            <span className="text-lg font-medium text-gray-700">
              Cybersecurity News and Threat Updates
            </span>
          </li>
          <li className="flex items-center gap-4 bg-blue-50 p-4 rounded-lg shadow-md">
            <Lock className="w-8 h-8 text-blue-800" />
            <span className="text-lg font-medium text-gray-700">
              Privacy and Data Protection
            </span>
          </li>
          <li className="flex items-center gap-4 bg-blue-50 p-4 rounded-lg shadow-md">
            <Globe className="w-8 h-8 text-blue-800" />
            <span className="text-lg font-medium text-gray-700">
              Emerging Cybersecurity Trends
            </span>
          </li>
          <li className="flex items-center gap-4 bg-blue-50 p-4 rounded-lg shadow-md">
            <Search className="w-8 h-8 text-blue-800" />
            <span className="text-lg font-medium text-gray-700">
              In-depth Analysis of Cyber Incidents
            </span>
          </li>
          <li className="flex items-center gap-4 bg-blue-50 p-4 rounded-lg shadow-md">
            <ShieldCheck className="w-8 h-8 text-blue-800" />
            <span className="text-lg font-medium text-gray-700">
              Best Practices for Online Security
            </span>
          </li>
        </ul>
      </section>

      {/* Team Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Meet Our Team</h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          Our dedicated team consists of cybersecurity professionals, researchers, and writers who are passionate about helping you stay secure online. Together, we strive to deliver valuable content that keeps you informed and prepared.
        </p>
      </section>

      {/* Closing Statement */}
      <section className="text-center">
        <p className="text-lg text-gray-700 font-medium">
          Thank you for trusting Cyber Updates as your go-to resource for cybersecurity knowledge. Stay safe, stay informed, and explore more with us!
        </p>
      </section>
    </div>
  );
};

export default AboutPage;
