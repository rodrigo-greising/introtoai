import Header from './components/Header';
import HeroSection from './components/HeroSection';
import YouTubeSection from './components/YouTubeSection';
import DocumentsSection from './components/DocumentsSection';
import BooksSection from './components/BooksSection';
import ChattingAppsSection from './components/chatting-apps/ChattingAppsSection';
import AIDevelopmentSection from './components/ai-development/AIDevelopmentSection';
import GoogleLabsSection from './components/labs/GoogleLabsSection';
import ResourcesSection from './components/ResourcesSection';
import Footer from './components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <Header />
      <ChattingAppsSection />
      <YouTubeSection />
      <DocumentsSection />
      <AIDevelopmentSection />
      <GoogleLabsSection />
      <ResourcesSection />
      <BooksSection />

      <Footer />
    </div>
  );
}
