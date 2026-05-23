import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Portfolio from '@/components/Portfolio';
import Clients from '@/components/Clients';
import Testimonials from '@/components/Testimonials';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import { getLandingContent } from '@/lib/content';

export default async function Home() {
  const content = await getLandingContent();

  return (
    <>
      <Header />
      <Hero />
      <Services services={content.services} />
      <Portfolio portfolioItems={content.portfolioItems} />
      <Clients clients={content.clients} />
      <Testimonials testimonials={content.testimonials} />
      <ContactSection contactInfo={content.contactInfo} />
      <Footer />
    </>
  );
}
