import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Portfolio from '@/components/Portfolio';
import Clients from '@/components/Clients';
import Testimonials from '@/components/Testimonials';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Services />
      <Portfolio />
      <Clients />
      <Testimonials />
      <ContactSection />
      <Footer />
    </>
  );
}
