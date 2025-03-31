// src/app/privacy/page.jsx
import React from 'react';

export const metadata = {
  title: 'Privacy Policy | SoulDistribution',
  description: 'Privacy policy for SoulDistribution music distribution services.',
};

const PrivacyPage = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">Last updated: March 2025</p>

        <div className="prose max-w-none">
          <p className="lead">
            At SoulDistribution, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our music distribution services or visit our website.
          </p>

          <h2>1. Information We Collect</h2>
          <h3>Personal Information</h3>
          <p>We may collect personal information that you voluntarily provide to us when you:</p>
          <ul>
          
            <li>Create an account</li>
            <li>Submit music for distribution</li>
            <li>Request YouTube OAC services</li>
            <li>Contact us for support</li>
            <li>Subscribe to our newsletter</li>
            <li>Participate in promotions or surveys</li>
          </ul>
          <p>This information may include your:</p>
          <ul>
            <li>Name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Mailing address</li>
            <li>Payment information</li>
            <li>Artist/band information</li>
            <li>Social media profiles</li>
          </ul>

          <h3>Music Content</h3>
          <p>
            We collect the music content and associated media (cover art, metadata, etc.) that you submit for distribution.
          </p>

          <h3>Automatically Collected Information</h3>
          <p>When you visit our website, we may automatically collect certain information about your device, including:</p>
          <ul>
            <li>IP address</li>
            <li>Browser type</li>
            <li>Operating system</li>
            <li>Access times</li>
            <li>Pages viewed</li>
            <li>Referring website addresses</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We may use the information we collect for various purposes, including to:</p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Process and fulfill your distribution requests</li>
            <li>Manage your account and provide customer support</li>
            <li>Send you technical notices, updates, and administrative messages</li>
            <li>Communicate with you about products, services, offers, and events</li>
            <li>Monitor and analyze trends, usage, and activities</li>
            <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2>3. Sharing Your Information</h2>
          <p>We may share your information with:</p>
          <ul>
            <li><strong>Music Platforms:</strong> To distribute your music to streaming services, stores, and platforms</li>
            <li><strong>Payment Processors:</strong> To process payments and royalty distributions</li>
            <li><strong>Service Providers:</strong> Who help us operate our business and provide services</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
          </ul>

          <h2>4. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, so we cannot guarantee absolute security.
          </p>

          <h2>5. Your Rights</h2>
          <p>Depending on your location, you may have certain rights regarding your personal information, such as:</p>
          <ul>
            <li>Accessing your personal information</li>
            <li>Correcting inaccurate information</li>
            <li>Deleting your information</li>
            <li>Restricting or objecting to processing</li>
            <li>Data portability</li>
            <li>Withdrawing consent</li>
          </ul>
          <p>
            To exercise these rights, please contact us using the information provided at the end of this Privacy Policy.
          </p>

          <h2>6. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar tracking technologies to collect and track information about your browsing activities on our website. You can control cookies through your browser settings and other tools.
          </p>

          <h2>7. Third-Party Links</h2>
          <p>
            Our website may contain links to third-party websites and services. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies before providing any personal information.
          </p>

          <h2>8. Children's Privacy</h2>
          <p>
            Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we discover that we have collected personal information from a child, we will promptly delete it.
          </p>

          <h2>9. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. The updated version will be indicated by an updated "Last updated" date. We encourage you to review this Privacy Policy periodically.
          </p>

          <h2>10. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
          </p>
          <ul>
            <li>Email: privacy@souldistribution.com</li>
            <li>Phone: +91 9876543210</li>
            <li>Address: Mumbai, Maharashtra, India</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;