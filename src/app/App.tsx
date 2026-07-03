import { BrowserRouter, Routes, Route, useLocation } from "react-router";
import { useEffect } from "react";
import { analytics } from "./utils/store";
import { useSEO } from "./hooks/useSEO";
import { CustomCursor } from "./components/CustomCursor";
import { ScrollProgress } from "./components/ScrollProgress";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { WhoIsItFor } from "./components/WhoIsItFor";
import { BoardroomJourney } from "./components/BoardroomJourney";
import { AssessmentHub } from "./components/AssessmentHub";
import { BoardVacancyHub } from "./components/BoardVacancyHub";
import { GovernanceEcosystem } from "./components/GovernanceEcosystem";
import { WhyGovernanceMatters } from "./components/WhyGovernanceMatters";
import { BoardTalentCommunity } from "./components/BoardTalentCommunity";
import { ForOrganizations } from "./components/ForOrganizations";
import { OurPartners } from "./components/OurPartners";
import { TrustImpact } from "./components/TrustImpact";
import { Testimonials } from "./components/Testimonials";
import { FinalCTA } from "./components/FinalCTA";
import { Footer } from "./components/Footer";
import { MmbEcosystem } from "./components/MmbEcosystem";
import { CookieBanner } from "./components/CookieBanner";
import { WhatsAppButton } from "./components/WhatsAppButton";
import { DirectorPage } from "./pages/DirectorPage";
import { CompanyPage } from "./pages/CompanyPage";
import { AdminApp } from "./pages/admin/AdminApp";
import { BoardUpdatesPage } from "./pages/BoardUpdatesPage";

function PersistentWhatsApp() {
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) return null;
  return <WhatsAppButton />;
}

function HomePage() {
  useEffect(() => {
    analytics.track('pageView');
  }, []);

  useSEO({
    title: "BoardOpp — India's Premier Board Governance Ecosystem | MentorMyBoard",
    description: "BoardOpp by MentorMyBoard connects qualified independent directors with organizations seeking board talent. Register as a director, post board requirements, and take governance assessments.",
    keywords: "board opportunities India, independent director India, corporate governance India, board seat India, board talent India, director readiness assessment, ESG governance India, MentorMyBoard",
    canonical: "https://boardopp.mentormyboard.com/",
  });

  return (
    <div style={{ background: '#08081C', minHeight: '100vh', overflowX: 'hidden' }}>
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      <main>
        <HeroSection />
        <WhoIsItFor />
        <BoardroomJourney />
        <AssessmentHub />
        <BoardVacancyHub />
        <GovernanceEcosystem />
        <WhyGovernanceMatters />
        <BoardTalentCommunity />
        <ForOrganizations />
        <OurPartners />
        <TrustImpact />
        <Testimonials />
        <FinalCTA />
      </main>
      <MmbEcosystem />
      <Footer />
      <CookieBanner />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <PersistentWhatsApp />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/join" element={<DirectorPage />} />
        <Route path="/post-requirement" element={<CompanyPage />} />
        <Route path="/board-updates" element={<BoardUpdatesPage />} />
        <Route path="/admin/*" element={<AdminApp />} />
      </Routes>
    </BrowserRouter>
  );
}
