import HeroSection from '../components/layouts/views/home/HeroSection';
import HowItWorks from '../components/layouts/views/home/HowItWorks';
import SupervisorHighlights from '../components/layouts/views/home/SupervisorHighlights';
import CallToAction from '../components/layouts/views/home/CallToAction';
import StudentFeedback from '../components/layouts/views/home/StudentFeedback';
import AdditionalInfoSection from '../components/layouts/views/home/AdditionalInfoSection';

const Homepage = () => {
  return (
    <main>
      <HeroSection />
      <HowItWorks />
      <AdditionalInfoSection />
      <SupervisorHighlights />
      <CallToAction />
      <StudentFeedback />
    </main>
  );
};

export default Homepage;
