// src/app/privacy/page.jsx
import React from 'react';

export const metadata = {
  title: 'Privacy Policy | SoulDistribution',
  description: 'Privacy policy for SoulDistribution music distribution services.',
};

const PrivacyPage = () => {
  return (
    <div className="w-full px-4 py-16 bg-gradient-to-b from-gray-900 to-black text-gray-200">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-purple-400">Privacy Policy</h1>
        <div className="w-20 h-1 bg-purple-500 mb-6"></div>
        <p className="text-gray-400 mb-10 italic">Last updated: March 2025</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <h2 className="text-2xl font-semibold text-purple-400 mb-4 pb-2 border-b border-gray-700">1. Information We Collect</h2>
            
            <h3 className="text-xl font-medium text-gray-300 mt-6 mb-3">Personal Information</h3>
            <p className="text-gray-300">
              We may collect personal information that you voluntarily provide to us when you:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>Create an account</li>
              <li>Submit music for distribution</li>
              <li>Request YouTube OAC services</li>
              <li>Contact us for support</li>
              <li>Subscribe to our newsletter</li>
              <li>Participate in promotions or surveys</li>
            </ul>
            <p className="mt-4 text-gray-300">This information may include your:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>Name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Mailing address</li>
              <li>Payment information</li>
              <li>Artist/band information</li>
              <li>Social media profiles</li>
              <li>Tax information for royalty payments</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-300 mt-6 mb-3">Music Content</h3>
            <p className="text-gray-300">
              We collect the music content and associated media (cover art, metadata, lyrics, etc.) that you submit for distribution. This includes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>Audio files</li>
              <li>Cover artwork</li>
              <li>Song titles and descriptions</li>
              <li>Collaborator information</li>
              <li>Release date preferences</li>
              <li>Genre and mood classifications</li>
              <li>Lyrics and translations</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-300 mt-6 mb-3">Streaming Analytics</h3>
            <p className="text-gray-300">
              We collect data about your music's performance across various platforms, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>Stream counts and listener statistics</li>
              <li>Geographic distribution of listeners</li>
              <li>Revenue generated per platform</li>
              <li>Playlist inclusions</li>
              <li>Fan engagement metrics</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-300 mt-6 mb-3">Automatically Collected Information</h3>
            <p className="text-gray-300">When you visit our website, we may automatically collect certain information about your device, including:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>IP address</li>
              <li>Browser type</li>
              <li>Operating system</li>
              <li>Access times</li>
              <li>Pages viewed</li>
              <li>Referring website addresses</li>
            </ul>
          </section>

          <section className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <h2 className="text-2xl font-semibold text-purple-400 mb-4 pb-2 border-b border-gray-700">2. How We Use Your Information</h2>
            <p className="text-gray-300">We may use the information we collect for various purposes, including to:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>Provide, maintain, and improve our music distribution services</li>
              <li>Process and fulfill your distribution requests to 150+ stores and platforms</li>
              <li>Set up and manage your YouTube Official Artist Channel (OAC)</li>
              <li>Track and distribute royalties according to your chosen plan</li>
              <li>Manage your account and provide customer support</li>
              <li>Send you technical notices, updates, and administrative messages</li>
              <li>Communicate with you about products, services, offers, and events</li>
              <li>Monitor and analyze trends, usage, and activities in your music performance</li>
              <li>Detect, investigate, and prevent fraudulent transactions and copyright violations</li>
              <li>Comply with legal obligations and tax requirements</li>
              <li>Provide analytics and insights about your music's performance</li>
            </ul>
          </section>

          <section className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <h2 className="text-2xl font-semibold text-purple-400 mb-4 pb-2 border-b border-gray-700">3. Third-Party Services & Social Media Integration</h2>
            <p className="text-gray-300">
              As part of our distribution services, we connect with numerous third-party platforms. Here's how your information is shared:
            </p>
            
            <h3 className="text-xl font-medium text-gray-300 mt-6 mb-3">Music Distribution Partners</h3>
            <p className="text-gray-300">
              We share your music content and relevant metadata with streaming platforms and digital stores (including but not limited to Spotify, Apple Music, Amazon Music, JioSaavn, Wynk, YouTube Music, etc.) to fulfill our distribution services.
            </p>
            
            <h3 className="text-xl font-medium text-gray-300 mt-6 mb-3">Social Media Integration</h3>
            <p className="text-gray-300">
              When you use our Instagram audio linking, YouTube promotion, or other social media features:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>We may share necessary data with these platforms to enable features like Instagram Music, Facebook Sound Collection, TikTok sounds, and YouTube Content ID</li>
              <li>We may collect information about how users interact with your music on these platforms</li>
              <li>These third-party services have their own privacy policies that govern how they use your information</li>
              <li>We recommend reviewing their privacy policies before connecting your accounts</li>
            </ul>
            
            <h3 className="text-xl font-medium text-gray-300 mt-6 mb-3">LANDR Partnership</h3>
            <p className="text-gray-300">
              As Soul Distribution uses LANDR for certain distribution services, your information may be shared with LANDR according to their privacy policy. By using Soul Distribution, you acknowledge this data sharing arrangement.
            </p>
            
            <h3 className="text-xl font-medium text-gray-300 mt-6 mb-3">Other Third Parties</h3>
            <p className="text-gray-300">We may also share your information with:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li><strong className="text-purple-300">Payment Processors:</strong> To process subscription fees and royalty distributions</li>
              <li><strong className="text-purple-300">Service Providers:</strong> Who help us operate our business and provide services</li>
              <li><strong className="text-purple-300">Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong className="text-purple-300">Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            </ul>
          </section>

          <section className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <h2 className="text-2xl font-semibold text-purple-400 mb-4 pb-2 border-b border-gray-700">4. Data Security</h2>
            <p className="text-gray-300">
              We implement appropriate security measures to protect your personal information and music content. However, no method of transmission over the Internet or electronic storage is 100% secure, so we cannot guarantee absolute security.
            </p>
            <p className="mt-4 text-gray-300">
              Our security measures include:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>Encryption of sensitive data</li>
              <li>Secure storage of your music files</li>
              <li>Regular security assessments</li>
              <li>Limited access to personal information by staff</li>
              <li>Contractual obligations with our third-party service providers</li>
            </ul>
          </section>

          <section className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <h2 className="text-2xl font-semibold text-purple-400 mb-4 pb-2 border-b border-gray-700">5. Your Rights & Choices</h2>
            <p className="text-gray-300">Depending on your location, you may have certain rights regarding your personal information, such as:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>Accessing your personal information</li>
              <li>Correcting inaccurate information</li>
              <li>Deleting your information (subject to our contractual obligations)</li>
              <li>Restricting or objecting to processing</li>
              <li>Data portability</li>
              <li>Withdrawing consent</li>
            </ul>
            <p className="mt-4 text-gray-300">
              To exercise these rights, please contact us using the information provided at the end of this Privacy Policy.
            </p>

            <h3 className="text-xl font-medium text-gray-300 mt-6 mb-3">Content Removal</h3>
            <p className="text-gray-300">
              You can request the removal of your music from distribution platforms at any time through your dashboard. Please note that:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>Removal may take up to 14 days depending on the platform</li>
              <li>Some platforms may retain your content in user playlists even after removal</li>
              <li>We cannot control content that has been downloaded by users</li>
              <li>Analytics data may be retained for reporting purposes</li>
            </ul>
          </section>

          <section className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <h2 className="text-2xl font-semibold text-purple-400 mb-4 pb-2 border-b border-gray-700">6. Cookies & Tracking Technologies</h2>
            <p className="text-gray-300">
              We use cookies and similar tracking technologies to collect and track information about your browsing activities on our website. You can control cookies through your browser settings and other tools.
            </p>
            <p className="mt-4 text-gray-300">
              We use these technologies for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>Remembering your preferences and settings</li>
              <li>Understanding how you use our services</li>
              <li>Providing personalized experiences</li>
              <li>Improving our website and services</li>
              <li>Analyzing traffic patterns</li>
            </ul>
          </section>

          <section className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <h2 className="text-2xl font-semibold text-purple-400 mb-4 pb-2 border-b border-gray-700">7. International Data Transfers</h2>
            <p className="text-gray-300">
              As a global music distribution service, we may transfer your information to countries other than your country of residence. When we do so, we take appropriate measures to protect your information and comply with applicable laws.
            </p>
            <p className="mt-4 text-gray-300">
              By using our services, you consent to the transfer of your information to countries that may have different data protection laws than your country.
            </p>
          </section>

          <section className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <h2 className="text-2xl font-semibold text-purple-400 mb-4 pb-2 border-b border-gray-700">8. Children's Privacy</h2>
            <p className="text-gray-300">
              Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we discover that we have collected personal information from a child, we will promptly delete it.
            </p>
          </section>

          <section className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <h2 className="text-2xl font-semibold text-purple-400 mb-4 pb-2 border-b border-gray-700">9. Changes to This Privacy Policy</h2>
            <p className="text-gray-300">
              We may update this Privacy Policy from time to time. The updated version will be indicated by an updated "Last updated" date. We will notify you of any significant changes by email or through a notice on our website.
            </p>
          </section>

          <section className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <h2 className="text-2xl font-semibold text-purple-400 mb-4 pb-2 border-b border-gray-700">10. Contact Us</h2>
            <p className="text-gray-300">
              If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>Email: privacy@souldistribution.com</li>
              <li>Phone: +91 9876543210</li>
              <li>Address: Mumbai, Maharashtra, India</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;