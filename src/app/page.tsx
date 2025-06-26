import Header from './components/Header';
import DocumentsSection from './components/DocumentsSection';
import BooksSection from './components/BooksSection';
import ChattingAppsSection from './components/chatting-apps/ChattingAppsSection';
import TabbedAISection from './components/ai-development/TabbedAISection';
import GoogleLabsSection from './components/labs/GoogleLabsSection';
import ResourcesSection from './components/ResourcesSection';
import Footer from './components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <Header />
      <ChattingAppsSection />
      <TabbedAISection />
      <GoogleLabsSection />
      <ResourcesSection />
      <BooksSection />
      <DocumentsSection />
      <Footer />
    </div>
  );
}
