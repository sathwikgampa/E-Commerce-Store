import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { MapPin, Phone, Mail, Clock, MessageSquare, Send } from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
  email: z.string().email({ message: 'Enter a valid email address' }),
  subject: z.string().min(4, { message: 'Subject must be at least 4 characters long' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters long' }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const ContactPage: React.FC = () => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (values: ContactFormValues) => {
    // Simulating message submission
    console.log('Contact Message:', values);
    toast.success('Your message has been sent!', {
      description: 'Sri Thirumala owners will reply to your email shortly.',
    });
    reset();
  };

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 bg-[#F8FAFC] text-left">
      
      {/* Title block */}
      <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
         <h1 className="text-3xl sm:text-4xl font-black text-primary tracking-tight text-[#0A3D91]">Contact Our Store</h1>
         <p className="text-xs sm:text-sm text-slate-500 font-semibold leading-relaxed">
           Have a question about textbook availability, school bags, or bulk guides? Send us a message or visit us on Station Road.
         </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        
        {/* Left Side: Store Info */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#0A3D91]"></div>
            
            <h2 className="text-lg font-black text-slate-900">Sri Thirumala Store Details</h2>
            
            <ul className="space-y-6">
              
              {/* Address */}
              <li className="flex items-start">
                <div className="bg-blue-50 p-2.5 rounded-lg text-[#0A3D91] mr-4 border border-blue-100">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Our Store Location</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed font-semibold">
                    Station Road, Near Railway Station Area,<br />
                    Kamareddy, Telangana - 503111
                  </p>
                </div>
              </li>
              
              {/* Phone & Whatsapp */}
              <li className="flex items-start">
                <div className="bg-amber-50 p-2.5 rounded-lg text-[#D4AF37] mr-4 border border-amber-100">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Phone Call &amp; WhatsApp</h3>
                  <p className="text-xs text-slate-500 mt-1 font-semibold">+91 99498 86640</p>
                  <a 
                    href="https://wa.me/918897766640" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-[#128C7E] hover:underline"
                  >
                    <MessageSquare className="w-3.5 h-3.5 fill-current" /> Chat on WhatsApp
                  </a>
                </div>
              </li>

              {/* Timing */}
              <li className="flex items-start">
                <div className="bg-slate-50 p-2.5 rounded-lg text-slate-700 mr-4 border border-slate-255">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Business Operations</h3>
                  <p className="text-xs text-slate-500 mt-1 font-semibold leading-relaxed">
                    Monday - Saturday: 9:00 AM - 9:00 PM<br />
                    Sunday: 10:00 AM - 6:00 PM
                  </p>
                </div>
              </li>

            </ul>
          </div>
          
          {/* Map Section */}
          <div className="h-64 sm:h-80 bg-slate-200 rounded-2xl border border-slate-200 overflow-hidden relative shadow-inner">
             <iframe 
               src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3788.924296683526!2d78.32431697523555!3d18.31885447471852!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcc79debd133bd5%3A0xc3f8e5b61e0bbd34!2sKamareddy%2C%20Telangana!5e0!3m2!1sen!2sin!4v1709400000000!5m2!1sen!2sin" 
               width="100%" 
               height="100%" 
               style={{ border: 0, position: 'absolute', top: 0, left: 0 }} 
               allowFullScreen={true} 
               loading="lazy" 
               referrerPolicy="no-referrer-when-downgrade"
               title="Sri Thirumala Store Map location"
            ></iframe>
          </div>
        </div>

        {/* Right Side: Message Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-center">
          <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3 mb-6">Send A Query Message</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Your Name</label>
              <input 
                {...register('name')}
                type="text"
                className={`w-full px-4 py-3 rounded-xl text-xs font-semibold bg-[#F8FAFC] border outline-none transition focus:bg-white focus:ring-1 focus:ring-primary ${
                  errors.name ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200 focus:ring-primary'
                }`}
                placeholder="What should we call you?" 
              />
              {errors.name && <span className="text-rose-500 text-[10px] font-bold mt-1.5 block">{errors.name.message}</span>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email Address</label>
              <input 
                {...register('email')}
                type="email"
                className={`w-full px-4 py-3 rounded-xl text-xs font-semibold bg-[#F8FAFC] border outline-none transition focus:bg-white focus:ring-1 focus:ring-primary ${
                  errors.email ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200 focus:ring-primary'
                }`}
                placeholder="you@domain.com" 
              />
              {errors.email && <span className="text-rose-500 text-[10px] font-bold mt-1.5 block">{errors.email.message}</span>}
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Subject</label>
              <input 
                {...register('subject')}
                type="text"
                className={`w-full px-4 py-3 rounded-xl text-xs font-semibold bg-[#F8FAFC] border outline-none transition focus:bg-white focus:ring-1 focus:ring-primary ${
                  errors.subject ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200 focus:ring-primary'
                }`}
                placeholder="Availability query, bulk order price, etc." 
              />
              {errors.subject && <span className="text-rose-500 text-[10px] font-bold mt-1.5 block">{errors.subject.message}</span>}
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Your Message</label>
              <textarea 
                {...register('message')}
                rows={4}
                className={`w-full px-4 py-3 rounded-xl text-xs font-semibold bg-[#F8FAFC] border outline-none transition focus:bg-white focus:ring-1 focus:ring-primary ${
                  errors.message ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200 focus:ring-primary'
                }`}
                placeholder="Specify the book titles, classes, and bulk numbers you are looking for..." 
              ></textarea>
              {errors.message && <span className="text-rose-500 text-[10px] font-bold mt-1.5 block">{errors.message.message}</span>}
            </div>

            {/* Submit */}
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center gap-2 px-6 py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-xs transition active:scale-95 text-xs uppercase tracking-wider disabled:bg-slate-200"
            >
              <Send className="w-4 h-4 text-accent text-[#D4AF37]" /> Send Message
            </button>

          </form>
        </div>

      </div>
    </div>
  );
};

export default ContactPage;
