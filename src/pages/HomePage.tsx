import HeroSection from '@components/home/HeroSection';
import BestsellersSection from '@components/home/BestsellersSection';
import NewReleasesSection from '@components/home/NewReleasesSection';
import GenderBasedSection from '@components/home/GenderBasedSection';
import CareerAdventuresSection from '@components/home/CareerAdventuresSection';
import FAQSection from '@components/home/FAQSection';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-white">
            <HeroSection />
            <BestsellersSection />
            <NewReleasesSection />
            <GenderBasedSection gender="girl" />
            <GenderBasedSection gender="boy" />
            <CareerAdventuresSection />
            <FAQSection />
            {/* Other sections will be added in subsequent tasks */}
        </div>
    );
}
