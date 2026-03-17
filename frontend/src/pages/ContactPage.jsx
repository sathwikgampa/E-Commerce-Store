import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-20">
      <div className="text-center max-w-3xl mx-auto mb-16">
         <h1 className="text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight mb-6">Contact Us</h1>
         <p className="text-lg text-stone-600">We're here to help! Whether you have a question about a product, need materials, or just want to say hello, our team is ready to assist you.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        <div className="space-y-8">
           <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-200 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-2 h-full bg-rose-500"></div>
              <h2 className="text-2xl font-bold text-stone-900 mb-6">Store Information</h2>
              
              <ul className="space-y-6">
                <li className="flex items-start">
                  <div className="bg-rose-100 p-3 rounded-xl text-rose-600 mr-4 group-hover:bg-rose-600 group-hover:text-white transition-colors duration-300">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-900 text-lg">Our Address</h3>
                    <p className="text-stone-600 mt-1">E-Commerce Store,<br />Main Road, near Old Bus Stand,<br />Local City. 503111</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className="bg-rose-100 p-3 rounded-xl text-rose-600 mr-4 group-hover:bg-rose-600 group-hover:text-white transition-colors duration-300">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-900 text-lg">Phone & WhatsApp</h3>
                    <p className="text-stone-600 mt-1">+91 88977 66640</p>
                    <a href="https://wa.me/918897766640" target="_blank" rel="noreferrer" className="inline-block mt-2 text-rose-600 font-medium hover:text-rose-700 hover:underline">Chat on WhatsApp</a>
                  </div>
                </li>

                <li className="flex items-start">
                  <div className="bg-rose-100 p-3 rounded-xl text-rose-600 mr-4 group-hover:bg-rose-600 group-hover:text-white transition-colors duration-300">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-900 text-lg">Business Hours</h3>
                    <p className="text-stone-600 mt-1">Monday - Saturday: 9:00 AM - 9:00 PM<br />Sunday: 10:00 AM - 6:00 PM</p>
                  </div>
                </li>
              </ul>
           </div>
        </div>

        <div className="h-full min-h-[400px] bg-stone-200 rounded-3xl border border-stone-300 overflow-hidden relative shadow-inner">
           {/* Placeholder for Google Maps Embed */}
           <iframe 
             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3788.924296683526!2d78.32431697523555!3d18.31885447471852!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcc79debd133bd5%3A0xc3f8e5b61e0bbd34!2sKamareddy%2C%20Telangana!5e0!3m2!1sen!2sin!4v1709400000000!5m2!1sen!2sin" 
             width="100%" 
             height="100%" 
             style={{ border: 0, position: 'absolute', top: 0, left: 0 }} 
             allowFullScreen="" 
             loading="lazy" 
             referrerPolicy="no-referrer-when-downgrade"
             title="E-Commerce Store Map"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
