'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Phone, MapPin, Mail, Clock, ArrowRight } from 'lucide-react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    enquiryType: '',
    message: '',
  });

  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, enquiryType: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Create Gmail compose URL with form data
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=shakibkumnali@gmail.com&su=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\nEnquiry Type: ${formData.enquiryType}\n\n${formData.message}`)}&bcc=someone.else@s.com`;
    
    // Open Gmail compose window in new tab
    window.open(gmailUrl, '_blank');
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      enquiryType: '',
      message: '',
    });
    
    // Show success message
    setSubmitStatus('success');
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Have questions about our services? Get in touch with our team for support and information.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="h-5 w-5 mr-2 text-purple-600" />
              Phone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>+91 8291121080</p>
            <p className="text-sm text-gray-500 mt-1">Available 24/7*</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="h-5 w-5 mr-2 text-purple-600" />
              Email
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>shakibkumnali@gmail.com</p>
            <p className="text-sm text-gray-500 mt-1">We aim to respond within 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-purple-600" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Thane, Maharashtra</p>
            <p className="text-sm text-gray-500 mt-1">India</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-bold mb-4">Send Us A Message</h2>
          
          <p className="text-gray-600 mb-6">
            Fill out the form below and our team will get back to you as soon as possible.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                placeholder="Enter your email"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input 
                id="subject" 
                name="subject" 
                value={formData.subject} 
                onChange={handleChange} 
                required 
                placeholder="Enter message subject"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="enquiryType">Enquiry Type</Label>
              <Select onValueChange={handleSelectChange} value={formData.enquiryType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select enquiry type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="distribution">Music Distribution</SelectItem>
                  <SelectItem value="youtube">YouTube OAC</SelectItem>
                  <SelectItem value="support">Technical Support</SelectItem>
                  <SelectItem value="payments">Payments & Royalties</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Your Message</Label>
              <Textarea 
                id="message" 
                name="message" 
                value={formData.message} 
                onChange={handleChange} 
                required 
                placeholder="Enter your message"
                rows={5}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Send Message
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            {submitStatus === 'success' && (
              <div className="p-3 bg-green-100 text-green-700 rounded-md">
                Your message has been sent successfully. We'll get back to you soon!
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div className="p-3 bg-red-100 text-red-700 rounded-md">
                There was an error sending your message. Please try again.
              </div>
            )}
          </form>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">How long does it take to distribute my music?</h3>
              <p className="text-gray-600">
                Once approved, your music will go live on all platforms within 2-3 business days. However, some stores might take up to 7 days.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">How do I get a YouTube OAC?</h3>
              <p className="text-gray-600">
                Purchase our YouTube OAC plan, and we'll handle the verification process for you. You'll need to have at least 1 releases on platforms.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">When will I receive my royalties?</h3>
              <p className="text-gray-600">
                Royalties are paid out monthly, typically with a 2-month delay from when the streaming platforms report the earnings.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Can I switch distributors if I already have music on platforms?</h3>
              <p className="text-gray-600">
                Yes, we can help you migrate your catalog from another distributor. Contact us for a smooth transition process.
              </p>
            </div>
          </div>
          
          <div className="mt-8 p-6 rounded-lg border border-purple-100">
            <div className="flex items-start">
              <Clock className="h-5 w-5 text-purple-600 mt-1 mr-3" />
              <div>
                <h3 className="font-semibold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">Response Times</h3>
                <p className="text-gray-600 text-sm">
                  We aim to respond to all inquiries within 24 hours during business days. For urgent matters, please mention "Urgent" in your subject line.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm; 