import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Clock, MapPin, MessageCircle, Navigation, Phone, Send } from 'lucide-react';
import { Field, Input, Textarea } from '../components/ui/Field';
import { Button, buttonClasses } from '../components/ui/Button';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { STORE } from '../components/landing/landingData';

const contactSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
  email: z.string().email({ message: 'Enter a valid email address' }),
  subject: z.string().min(4, { message: 'Subject must be at least 4 characters long' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters long' }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const ContactPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  // There is no inquiry API; the message is handed to WhatsApp, where the store replies.
  const onSubmit = (values: ContactFormValues) => {
    const text = `Hi Sri Thirumala Store,\n\n${values.subject}\n\n${values.message}\n\n— ${values.name} (${values.email})`;
    window.open(`https://wa.me/919949886640?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  };

  return (
    <div className="mx-auto max-w-store px-5 pb-16 pt-6 sm:px-8 lg:px-12">
      <Breadcrumb items={[{ label: 'Home', href: '/home' }, { label: 'Visit the store' }]} />

      <header className="mt-6 max-w-2xl">
        <h1 className="font-serif text-[34px] font-semibold tracking-tight text-store-charcoal sm:text-[44px]">Visit or contact us</h1>
        <p className="mt-3 text-[16px] leading-relaxed text-store-charcoal-light">
          Questions about textbook availability, school bags or bulk orders? Call, message, or drop by the store on Station Road.
        </p>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="space-y-6 lg:col-span-5">
          <ul className="divide-y divide-store-line rounded-2xl bg-white ring-1 ring-store-line">
            <li className="flex gap-4 p-5">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-store-primary" aria-hidden="true" />
              <div>
                <h2 className="font-sans text-[15px] font-semibold text-store-charcoal">Store address</h2>
                <p className="mt-1 text-[14px] leading-relaxed text-store-charcoal-light">
                  Station Road, near the railway station<br />Kamareddy, Telangana 503111
                </p>
                <a href={STORE.mapsHref} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-[14px] font-medium text-store-primary underline-offset-4 hover:underline">
                  <Navigation className="h-3.5 w-3.5" aria-hidden="true" /> Get directions
                </a>
              </div>
            </li>
            <li className="flex gap-4 p-5">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-store-primary" aria-hidden="true" />
              <div>
                <h2 className="font-sans text-[15px] font-semibold text-store-charcoal">Phone &amp; WhatsApp</h2>
                <a href={STORE.phoneHref} className="mt-1 block text-[14px] tabular text-store-charcoal-light hover:text-store-charcoal">{STORE.phoneDisplay}</a>
                <a href={STORE.whatsappHref} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-[14px] font-medium text-[#0F766E] underline-offset-4 hover:underline">
                  <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" /> Chat on WhatsApp
                </a>
              </div>
            </li>
            <li className="flex gap-4 p-5">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-store-primary" aria-hidden="true" />
              <div>
                <h2 className="font-sans text-[15px] font-semibold text-store-charcoal">Opening hours</h2>
                <dl className="mt-1 grid grid-cols-[auto_1fr] gap-x-4 gap-y-0.5 text-[14px] text-store-charcoal-light">
                  <dt>Mon – Sat</dt><dd className="tabular">9:00 AM – 9:00 PM</dd>
                  <dt>Sunday</dt><dd className="tabular">10:00 AM – 6:00 PM</dd>
                </dl>
              </div>
            </li>
          </ul>

          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-store-muted ring-1 ring-store-line">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3788.924296683526!2d78.32431697523555!3d18.31885447471852!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcc79debd133bd5%3A0xc3f8e5b61e0bbd34!2sKamareddy%2C%20Telangana!5e0!3m2!1sen!2sin!4v1709400000000!5m2!1sen!2sin"
              className="absolute inset-0 h-full w-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Map showing Sri Thirumala store in Kamareddy"
            />
          </div>
        </div>

        <section aria-labelledby="contact-form-title" className="lg:col-span-7">
          <div className="rounded-2xl bg-white p-6 ring-1 ring-store-line sm:p-8">
            <h2 id="contact-form-title" className="font-serif text-2xl font-semibold text-store-charcoal">Send us a message</h2>
            <p className="mt-1.5 text-[14px] text-store-charcoal-light">
              Your message opens in WhatsApp, ready to send to the store. We usually reply during opening hours.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field label="Your name" required error={errors.name?.message}>
                {(a) => <Input {...a} {...register('name')} autoComplete="name" />}
              </Field>
              <Field label="Email address" required error={errors.email?.message}>
                {(a) => <Input {...a} {...register('email')} type="email" autoComplete="email" placeholder="you@example.com" />}
              </Field>
              <Field label="Subject" required error={errors.subject?.message} className="sm:col-span-2">
                {(a) => <Input {...a} {...register('subject')} placeholder="Availability, bulk order pricing…" />}
              </Field>
              <Field label="Message" required error={errors.message?.message} className="sm:col-span-2">
                {(a) => <Textarea {...a} {...register('message')} rows={5} placeholder="Book titles, class or course, and quantities you need" />}
              </Field>
              <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
                <Button type="submit" size="lg">
                  <Send className="h-4 w-4" aria-hidden="true" /> Send via WhatsApp
                </Button>
                <a href={STORE.phoneHref} className={buttonClasses('ghost', 'lg')}>or call {STORE.phoneDisplay}</a>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContactPage;
