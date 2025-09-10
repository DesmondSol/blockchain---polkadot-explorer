import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { IconButton } from './IconButton';

// --- TYPE DEFINITIONS ---
type ActivePage = 'home' | 'about' | 'events' | 'opportunity' | 'showcase' | 'contact';

interface Lead {
  id: number;
  name: string;
  campus: string;
  photoUrl: string;
  social: {
    linkedin: string;
    twitter: string;
  };
}

interface Event {
    id: number;
    title: string;
    date: string; // ISO format string
    location: string;
    leadId: number;
    description: string;
    registrationLink?: string;
}

interface Project {
    title: string;
    description: string;
    skills: string[];
    leadId: number;
    appLink: string;
}


// --- MOCK DATA ---
const leads: Lead[] = [
  { id: 1, name: 'Tapiwa Nyamakope', campus: 'University of Zimbabwe', photoUrl: 'https://api.dicebear.com/8.x/pixel-art/svg?seed=TapiwaNyamakope', social: { linkedin: '#', twitter: '#' } },
  { id: 2, name: 'Adanna Adebayo', campus: 'University of Lagos', photoUrl: 'https://api.dicebear.com/8.x/pixel-art/svg?seed=AdannaAdebayo', social: { linkedin: '#', twitter: '#' } },
  { id: 3, name: 'Kwesi Mensah', campus: 'University of Ghana', photoUrl: 'https://api.dicebear.com/8.x/pixel-art/svg?seed=KwesiMensah', social: { linkedin: '#', twitter: '#' } },
  { id: 4, name: 'Fatou Sow', campus: 'Cheikh Anta Diop University', photoUrl: 'https://api.dicebear.com/8.x/pixel-art/svg?seed=FatouSow', social: { linkedin: '#', twitter: '#' } },
  { id: 5, name: 'Solomon Tigabu', campus: 'Addis Ababa University', photoUrl: 'https://api.dicebear.com/8.x/pixel-art/svg?seed=SolomonTigabu', social: { linkedin: 'https://www.linkedin.com/in/sol-tig/', twitter: 'https://x.com/solomon_t0' } },
];

const events: Event[] = [
  { id: 1, title: 'Intro to Substrate', date: '2024-09-15T14:00:00Z', location: 'Online', leadId: 1, description: 'A beginner-friendly workshop on the Substrate framework for building custom blockchains.' },
  { id: 2, title: 'Polkadot Governance 101', date: '2024-08-20T10:00:00Z', location: 'Lagos, Nigeria', leadId: 2, description: 'Learn how to participate in Polkadot\'s on-chain governance.' },
  { id: 3, title: 'Hackathon Kick-off', date: '2024-09-01T09:00:00Z', location: 'Accra, Ghana', leadId: 3, description: 'Join us to kick off a month-long hackathon focused on building with Polkadot.' },
  { id: 4, title: 'Building your first Parachain', date: '2024-07-25T11:00:00Z', location: 'Online', leadId: 1, description: 'A hands-on session guiding you through the steps of launching a parachain on a testnet.' },
  { id: 5, title: 'Web3 Career Fair', date: '2025-08-05T13:00:00Z', location: 'Dakar, Senegal', leadId: 4, description: 'Connect with companies building in the Polkadot ecosystem and explore career opportunities.' },
  { id: 6, title: 'DeFi on Polkadot', date: '2024-06-30T16:00:00Z', location: 'Online', leadId: 2, description: 'An overview of the DeFi landscape on Polkadot, featuring projects like Acala and Bifrost.' },
  { 
      id: 7, 
      title: 'Addis Ababa Polkadot Hackathon', 
      date: '2025-10-04T09:00:00Z', 
      location: 'Addis Ababa, Ethiopia', 
      leadId: 5, 
      description: 'Kick-off for our month-long hackathon. Build innovative projects on Polkadot and compete for prizes. Open to all skill levels.', 
      registrationLink: 'https://forms.gle/NQ19kDZWUpkjM7To8' 
  },
  { 
      id: 8, 
      title: 'In-Person Workshop: Polkadot Fundamentals', 
      date: '2025-10-12T10:00:00Z', 
      location: 'Addis Ababa, Ethiopia', 
      leadId: 5, 
      description: 'Join us for a hands-on workshop covering the basics of the Polkadot ecosystem, parachains, and governance.', 
      registrationLink: 'https://forms.gle/NQ19kDZWUpkjM7To8' 
  },
  { 
      id: 9, 
      title: 'In-Person Workshop: Substrate Deep Dive', 
      date: '2025-10-26T10:00:00Z', 
      location: 'Addis Ababa, Ethiopia', 
      leadId: 5, 
      description: 'A technical deep dive into the Substrate framework. Pre-requisites: Basic blockchain knowledge.', 
      registrationLink: 'https://forms.gle/NQ19kDZWUpkjM7To8' 
  },
];

const sampleProjects: Project[] = [
    { title: 'Dirsha', description: 'An innovative marketplace for agriculture, leveraging blockchain technology for transparent smart contracts and bonds. It enables buyers to secure future produce with upfront payments, while farmers gain financial stability and guaranteed prices.', skills: ['Blockchain', 'Smart Contracts', 'Agriculture', 'Marketplace'], leadId: 5, appLink: 'https://www.dirshaa.vercel.app' },
    { title: 'AfriChain', description: 'A decentralized supply chain solution for agricultural products in West Africa, built on Substrate.', skills: ['Rust', 'Substrate', 'Supply Chain'], leadId: 2, appLink: '#' },
    { title: 'EthioVote', description: 'A secure and transparent e-voting platform designed to ensure election integrity in Ethiopia.', skills: ['Smart Contracts', 'Cryptography', 'Governance'], leadId: 5, appLink: '#' },
    { title: 'Kente-Fi', description: 'A DeFi lending protocol inspired by traditional Ghanaian savings groups, providing micro-loans.', skills: ['DeFi', 'Financial Inclusion'], leadId: 3, appLink: '#' },
];

const sampleGalleryImages = [
    { src: 'https://images.unsplash.com/photo-1573497491208-6b1acb260507?q=80&w=2070&auto=format&fit=crop', caption: 'Addis Ababa Hackathon' },
    { src: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2232&auto=format&fit=crop', caption: 'Nairobi Substrate Workshop' },
    { src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop', caption: 'Cape Town Polkadot 101 Meetup' },
    { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop', caption: 'Lagos Blockchain Conference' },
    { src: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop', caption: 'Accra DeFi Seminar' },
    { src: 'https://images.unsplash.com/photo-1600880292210-85938a069596?q=80&w=2070&auto=format&fit=crop', caption: 'Johannesburg Web3 Pitch Day' },
    { src: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop', caption: 'Kigali Tech Meetup' },
    { src: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=2070&auto=format&fit=crop', caption: 'Campus Leads Annual Summit' },
];

const socialLinks = [
    { name: 'X (Twitter)', icon: 'fab fa-twitter', link: 'https://x.com/solomon_t0', description: 'Follow us for the latest news and announcements.' },
    { name: 'LinkedIn', icon: 'fab fa-linkedin', link: 'https://www.linkedin.com/in/sol-tig/', description: 'Connect with our professional network.' },
    { name: 'Telegram', icon: 'fab fa-telegram-plane', link: 'https://t.me/polkadot_et', description: 'Join our community for live discussions.' },
    { name: 'Discord', icon: 'fab fa-discord', link: 'https://discord.gg/hK8XwBGdYA', description: 'Engage with developers and other leads.' },
    { name: 'WhatsApp', icon: 'fab fa-whatsapp', link: 'https://wa.me/message/7KBK6RQSDNJ5I1', description: 'Get in touch for direct support.' },
    { name: 'Email', icon: 'fas fa-envelope', link: 'mailto:soltig66@gmail.com', description: 'For partnerships and official inquiries.' },
];


// --- STYLE CONSTANTS ---
const polkadotMagenta = '#E6007A';
const polkadotMagentaHover = '#c40068';
const applicationLink = 'https://forms.gle/oda83MGFVG1hH7Wj9';

// --- NAVIGATION ---
const navItems: { id: ActivePage; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About Us' },
  { id: 'events', label: 'Events' },
  { id: 'opportunity', label: 'Opportunity' },
  { id: 'showcase', label: 'Showcase' },
  { id: 'contact', label: 'Contact Us' },
];

// --- REUSABLE UI COMPONENTS ---

const Section: React.FC<{ title: string; children: React.ReactNode; className?: string, titleClassName?: string, containerClassName?: string }> = ({ title, children, className = '', titleClassName = '', containerClassName = '' }) => (
  <section className={`py-12 md:py-16 px-6 md:px-12 text-center ${className}`}>
    <div className={`max-w-6xl mx-auto ${containerClassName}`}>
      <h2 className={`text-3xl md:text-4xl font-bold mb-8 ${titleClassName}`} style={{ color: polkadotMagenta }}>{title}</h2>
      <div className="text-lg text-gray-300 text-left md:text-center">
        {children}
      </div>
    </div>
  </section>
);

const StatCard: React.FC<{ icon: string; value: string; label: string }> = ({ icon, value, label }) => (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center transform hover:scale-105 transition-transform duration-300">
        <div className="text-4xl mb-2" style={{ color: polkadotMagenta }}>{icon}</div>
        <div className="text-5xl font-bold text-white mb-2">{value}</div>
        <p className="text-gray-400">{label}</p>
    </div>
);

const BenefitCard: React.FC<{ icon: string; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-left h-full">
        <div className="flex items-start space-x-4">
            <div className="text-3xl mt-1" style={{ color: polkadotMagenta }}>
                <i className={icon}></i>
            </div>
            <div>
                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                <p className="text-gray-400">{children}</p>
            </div>
        </div>
    </div>
);


// --- LEAD DETAIL POPUP COMPONENT ---
const LeadDetailPopup: React.FC<{ lead: Lead; allEvents: Event[]; onClose: () => void }> = ({ lead, allEvents, onClose }) => {
    const pastEvents = allEvents
        .filter(event => event.leadId === lead.id && new Date(event.date) < new Date())
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-800 text-white w-full max-w-md m-4 rounded-xl shadow-2xl flex flex-col animate-modalFadeInScale relative" onClick={e => e.stopPropagation()}>
                <IconButton iconClass="fas fa-times" onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white p-2 z-10" />
                <div className="p-6 text-center border-b border-gray-700">
                    <img src={lead.photoUrl} alt={lead.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-purple-500 bg-gray-700" />
                    <h3 className="text-2xl font-bold text-white">{lead.name}</h3>
                    <p className="text-purple-300">{lead.campus}</p>
                    <div className="flex justify-center space-x-4 mt-4">
                        <a href={lead.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400"><i className="fab fa-linkedin text-2xl"></i></a>
                        <a href={lead.social.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400"><i className="fab fa-twitter text-2xl"></i></a>
                    </div>
                </div>
                <div className="p-6 flex-grow overflow-y-auto custom-scrollbar" style={{maxHeight: '40vh'}}>
                    <h4 className="text-lg font-semibold text-purple-300 mb-3 text-center">Past Events Hosted</h4>
                    {pastEvents.length > 0 ? (
                        <ul className="space-y-3">
                            {pastEvents.map(event => (
                                <li key={event.id} className="bg-gray-700 p-3 rounded-lg">
                                    <p className="font-semibold text-white">{event.title}</p>
                                    <p className="text-xs text-gray-400">{new Date(event.date).toLocaleDateString()}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-500 italic">No past events found.</p>
                    )}
                </div>
            </div>
        </div>,
        modalRoot
    );
};

// --- PAGE CONTENT COMPONENTS ---

const HomepageContent: React.FC = () => (
    <>
        <div className="h-[90vh] min-h-[600px] flex items-center justify-center text-center p-6 bg-cover bg-center bg-gray-900">
            <div className="bg-black bg-opacity-60 p-8 rounded-lg max-w-3xl animate-modalFadeInScale">
                <h1 className="text-4xl md:text-6xl font-extrabold" style={{ color: polkadotMagenta }}>
                    Igniting Web3 Innovation in Africa.
                </h1>
                <p className="mt-4 text-lg md:text-xl text-gray-200">
                    The Polkadot Campus Lead Program empowers student leaders to build the future of decentralized technology across the continent.
                </p>
                <a href={applicationLink} target="_blank" rel="noopener noreferrer" className="mt-8 inline-block px-8 py-3 text-lg font-bold text-white rounded-lg transition-colors" style={{ backgroundColor: polkadotMagenta }} onMouseOver={e => e.currentTarget.style.backgroundColor = polkadotMagentaHover} onMouseOut={e => e.currentTarget.style.backgroundColor = polkadotMagenta}>
                    Apply to be a Campus Lead
                </a>
            </div>
        </div>

        <Section title="A Vision for a Decentralized Future">
            <p>
                Our vision is to build a <strong>grassroots network</strong> of technically skilled and community-minded individuals. We are not just teaching; we are <strong>cultivating</strong> the next generation of developers, entrepreneurs, and leaders who will build on the Polkadot chain.
            </p>
        </Section>

        <Section title="Our Goals of Impact" className="bg-gray-800/50">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                <StatCard icon="🎓" value="10,000+" label="Students Reached" />
                <StatCard icon="🏫" value="50+" label="Campuses with Clubs" />
                <StatCard icon="🗓️" value="200+" label="Workshops & Hackathons" />
                <StatCard icon="💡" value="30+" label="Projects Incubated" />
            </div>
        </Section>
        
        <Section title="Unlock Your Potential" className="bg-gray-800/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <BenefitCard icon="fas fa-code" title="Skill Development">Learn Rust, Substrate, and blockchain fundamentals.</BenefitCard>
                <BenefitCard icon="fas fa-users" title="Community & Network">Connect with peers and global Polkadot experts.</BenefitCard>
                <BenefitCard icon="fas fa-briefcase" title="Real-World Experience">Gain hands-on experience in project management and leadership.</BenefitCard>
                <BenefitCard icon="fas fa-road" title="Career Pathways">Find internships and build a career in Web3.</BenefitCard>
            </div>
        </Section>

        <Section title="Ready to Lead?" className="bg-gray-900">
            <p className="mb-6">Join the Polkadot Campus Lead Program and become a pioneer in Africa’s decentralized future.</p>
            <a href={applicationLink} target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-3 text-lg font-bold text-white rounded-lg transition-colors" style={{ backgroundColor: polkadotMagenta }} onMouseOver={e => e.currentTarget.style.backgroundColor = polkadotMagentaHover} onMouseOut={e => e.currentTarget.style.backgroundColor = polkadotMagenta}>
                Start Your Application
            </a>
        </Section>
    </>
);

const AboutContent: React.FC = () => (
    <div className="py-12 md:py-16 px-6 md:px-12 text-gray-300">
        <div className="max-w-4xl mx-auto space-y-12">
            <header className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: polkadotMagenta }}>About Us</h1>
                <p className="text-xl text-gray-400">Our journey began with a simple belief: that the future of decentralized technology is being built by the diverse and dynamic talent of Africa.</p>
            </header>

            <div className="p-8 bg-gray-800 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold mb-4 text-purple-300">Our Vision and Mission</h2>
                <p className="mb-4">Our vision is to build a thriving, self-sustaining Web3 ecosystem in Africa, where innovation flourishes and every talented individual has a clear pathway to contribute to the global decentralized landscape.</p>
                <p>Our mission is to serve as the foundational pillar for this growth. Through the Polkadot Campus Lead Program (PCLP), we empower university students to become pioneers in their communities by providing the resources, mentorship, and skills needed to transform local passion into global impact.</p>
            </div>

            <div className="p-8 bg-gray-800 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold mb-4 text-purple-300">Our Guiding Principles</h2>
                <ul className="space-y-4 list-disc list-inside">
                    <li><strong>Community First:</strong> We believe that true innovation happens in a collaborative, supportive environment.</li>
                    <li><strong>Empowerment Through Education:</strong> We don't just teach; we equip. Our goal is to provide students with practical knowledge and leadership skills.</li>
                    <li><strong>Innovation & Impact:</strong> We are driven by the pursuit of creative solutions to real-world problems.</li>
                    <li><strong>Passion & Persistence:</strong> We are committed to showing up for our community every day with passion and unwavering support.</li>
                </ul>
            </div>
        </div>
    </div>
);


const EventsContent: React.FC<{ leads: Lead[], events: Event[], onSelectLead: (lead: Lead) => void }> = ({ leads, events, onSelectLead }) => {
    const [timeFilter, setTimeFilter] = useState<'upcoming' | 'past'>('upcoming');
    const [locationFilter, setLocationFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const uniqueLocations = ['all', ...Array.from(new Set(events.map(e => e.location)))];
    const now = new Date().getTime();

    const filteredAndSortedEvents = events
        .filter(event => { // Filter by time (upcoming/past)
            const eventDate = new Date(event.date).getTime();
            return timeFilter === 'upcoming' ? eventDate >= now : eventDate < now;
        })
        .filter(event => { // Filter by location
            return locationFilter === 'all' || event.location === locationFilter;
        })
        .filter(event => { // Filter by search query
            const lead = leads.find(l => l.id === event.leadId);
            const searchTerm = searchQuery.toLowerCase();
            return (
                event.title.toLowerCase().includes(searchTerm) ||
                event.description.toLowerCase().includes(searchTerm) ||
                (lead && lead.name.toLowerCase().includes(searchTerm))
            );
        })
        .sort((a, b) => { // Sort by date
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return timeFilter === 'upcoming' ? dateA - dateB : dateB - dateA;
        });

    return (
        <Section title="Our Events" containerClassName="max-w-6xl">
            <p className="text-lg text-gray-400 -mt-4 mb-10 max-w-3xl mx-auto">
              Find and join official Polkadot events happening across Africa.
            </p>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center items-center p-4 bg-gray-800/50 rounded-lg sticky top-0 z-10 backdrop-blur-sm">
                <div className="flex-shrink-0">
                    <button onClick={() => setTimeFilter('upcoming')} className={`px-4 py-2 rounded-l-full font-semibold transition-colors text-sm ${timeFilter === 'upcoming' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>Upcoming</button>
                    <button onClick={() => setTimeFilter('past')} className={`px-4 py-2 rounded-r-full font-semibold transition-colors text-sm ${timeFilter === 'past' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>Past</button>
                </div>
                <select
                    value={locationFilter}
                    onChange={e => setLocationFilter(e.target.value)}
                    className="bg-gray-700 text-white rounded-md p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none w-full md:w-auto"
                    aria-label="Filter events by location"
                >
                    {uniqueLocations.map(loc => (
                        <option key={loc} value={loc}>{loc === 'all' ? 'All Locations' : loc}</option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full md:w-64 p-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    aria-label="Search for events"
                />
            </div>
            
            {filteredAndSortedEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                    {filteredAndSortedEvents.map(event => {
                        const lead = leads.find(l => l.id === event.leadId);
                        return (
                            <div key={event.id} className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col">
                                <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                                <p className="text-purple-300 font-semibold mb-2">{new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                <p className="text-gray-400 flex-grow mb-4 text-sm">{event.description}</p>
                                
                                {event.registrationLink && timeFilter === 'upcoming' && (
                                    <a 
                                        href={event.registrationLink} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="block text-center w-full mt-auto mb-4 px-4 py-2 font-semibold text-white rounded-lg transition-colors" 
                                        style={{ backgroundColor: polkadotMagenta }} onMouseOver={e => e.currentTarget.style.backgroundColor = polkadotMagentaHover} onMouseOut={e => e.currentTarget.style.backgroundColor = polkadotMagenta}>
                                        Register Now
                                    </a>
                                )}

                                <div className="mt-auto pt-4 border-t border-gray-700 flex items-center justify-between">
                                    {lead && (
                                        <button onClick={() => onSelectLead(lead)} className="flex items-center space-x-2 group text-left focus:outline-none">
                                            <img src={lead.photoUrl} alt={lead.name} className="w-8 h-8 rounded-full border-2 border-gray-600 group-hover:border-purple-400 transition-colors bg-gray-700" />
                                            <span className="text-sm text-gray-300 group-hover:text-purple-300 transition-colors">{lead.name}</span>
                                        </button>
                                    )}
                                    <span className="text-xs text-gray-500 font-mono bg-gray-700 px-2 py-1 rounded">{event.location}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className="text-center text-gray-500 italic mt-8">No events match your current filters.</p>
            )}
        </Section>
    );
};


const OpportunityContent: React.FC = () => (
    <div className="py-12 md:py-16 px-6 md:px-12 text-gray-300">
        <div className="max-w-5xl mx-auto space-y-12">
            <header className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: polkadotMagenta }}>
                    Your Opportunity to Shape Africa's Web3 Future
                </h1>
                <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                    We're looking for passionate individuals to lead the charge, offering not just a role, but a chance to build a legacy.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700 flex flex-col">
                    <div className="text-center mb-6">
                        <i className="fas fa-university text-5xl mb-3" style={{ color: polkadotMagenta }}></i>
                        <h2 className="text-3xl font-bold" style={{ color: polkadotMagenta }}>The Campus Lead</h2>
                    </div>
                    <div className="space-y-4 text-gray-400">
                        <p><strong>Your Mission:</strong> To build and nurture a vibrant student community, making Polkadot a household name on campus. You'll be the face of the program, a bridge between students and the global ecosystem.</p>
                        <div>
                            <h3 className="text-lg font-semibold text-purple-300 mb-2">Key Responsibilities:</h3>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Establish and register an official Polkadot student club.</li>
                                <li>Organize and host a minimum of two workshops and one hackathon per semester.</li>
                                <li>Manage club members and community engagement.</li>
                                <li>Report on club activities and progress to your City Lead.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700 flex flex-col">
                    <div className="text-center mb-6">
                        <i className="fas fa-city text-5xl mb-3" style={{ color: polkadotMagenta }}></i>
                        <h2 className="text-3xl font-bold" style={{ color: polkadotMagenta }}>The City Lead</h2>
                    </div>
                    <div className="space-y-4 text-gray-400">
                        <p><strong>Your Mission:</strong> To be a regional champion, mentoring and guiding multiple Campus Leads within your city. You'll ensure the quality and consistency of events and community growth.</p>
                        <div>
                            <h3 className="text-lg font-semibold text-purple-300 mb-2">Key Responsibilities:</h3>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Oversee and mentor a cluster of 3-5 Campus Leads.</li>
                                <li>Ensure events are high-quality and on-brand.</li>
                                <li>Provide support and resolve challenges faced by Campus Leads.</li>
                                <li>Consolidate and submit regional reports to PCLP HQ.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-16 p-8 bg-gray-800 rounded-lg shadow-2xl text-center">
                <h2 className="text-3xl font-bold text-white mb-4">Start Your Application</h2>
                <p className="text-gray-400 mb-6">Ready to join the movement? Click the button below to begin your application process for both Campus and City Lead roles.</p>
                <a href={applicationLink} target="_blank" rel="noopener noreferrer" className="inline-block px-10 py-4 text-xl font-bold text-white rounded-lg transition-transform transform hover:scale-105" style={{ backgroundColor: polkadotMagenta }} onMouseOver={e => e.currentTarget.style.backgroundColor = polkadotMagentaHover} onMouseOut={e => e.currentTarget.style.backgroundColor = polkadotMagenta}>
                    Apply Now
                </a>
            </div>
        </div>
    </div>
);

const ShowcaseContent: React.FC<{ leads: Lead[]; onSelectLead: (lead: Lead) => void; onNavigate: (page: ActivePage) => void }> = ({ leads, onSelectLead, onNavigate }) => {
    const [selectedImg, setSelectedImg] = useState<{ src: string; caption: string } | null>(null);

    return (
        <div className="py-12 md:py-16 px-6 md:px-12 text-gray-300">
            <div className="max-w-6xl mx-auto space-y-16">

                 <section>
                    <header className="text-center mb-10">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: polkadotMagenta }}>Innovators & Builders</h1>
                        <p className="text-xl text-gray-400">Celebrating the impactful projects developed by our student leaders.</p>
                    </header>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sampleProjects.map(project => {
                             const builder = leads.find(l => l.id === project.leadId);
                             return(
                                <div key={project.title} className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 flex flex-col text-left">
                                    <h3 className="text-2xl font-bold text-purple-300 mb-2">{project.title}</h3>
                                    <p className="text-gray-400 mb-4 flex-grow">{project.description}</p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {project.skills.map(skill => (
                                            <span key={skill} className="bg-gray-700 text-purple-300 text-xs font-semibold px-2.5 py-1 rounded-full">{skill}</span>
                                        ))}
                                    </div>
                                    <div className="mt-auto pt-4 border-t border-gray-700 flex items-center justify-between">
                                        {builder && (
                                            <button onClick={() => onSelectLead(builder)} className="flex items-center space-x-2 group focus:outline-none">
                                                <img src={builder.photoUrl} alt={builder.name} className="w-8 h-8 rounded-full border-2 border-gray-600 group-hover:border-purple-400 transition-colors bg-gray-700" />
                                                <div className="text-sm">
                                                    <span className="text-gray-500">Built by</span>
                                                    <p className="text-gray-300 group-hover:text-purple-300 transition-colors">{builder.name}</p>
                                                </div>
                                            </button>
                                        )}
                                        <a href={project.appLink} target="_blank" rel="noopener noreferrer" className="px-3 py-1 text-sm font-semibold text-white rounded-md transition-colors" style={{ backgroundColor: polkadotMagenta }} onMouseOver={e => e.currentTarget.style.backgroundColor = polkadotMagentaHover} onMouseOut={e => e.currentTarget.style.backgroundColor = polkadotMagenta}>
                                           Open App <i className="fas fa-external-link-alt ml-1"></i>
                                        </a>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-12 p-8 bg-gray-800 rounded-lg shadow-2xl text-center border border-purple-500/50">
                        <h3 className="text-3xl font-bold text-white mb-4">Have a Project to Share?</h3>
                        <p className="text-gray-400 mb-6 max-w-xl mx-auto">
                            If you're a part of our program and have built something amazing with Polkadot, we want to feature you! Submit your project for a chance to be showcased to the entire community.
                        </p>
                        <a 
                            href={applicationLink}
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-block px-8 py-3 text-lg font-bold text-white rounded-lg transition-transform transform hover:scale-105"
                            style={{ backgroundColor: polkadotMagenta }} onMouseOver={e => e.currentTarget.style.backgroundColor = polkadotMagentaHover} onMouseOut={e => e.currentTarget.style.backgroundColor = polkadotMagenta}
                        >
                            Submit Your Project
                        </a>
                    </div>
                </section>

                <section>
                    <header className="text-center mb-10">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: polkadotMagenta }}>Find Top Web3 Talent</h1>
                        <p className="text-xl text-gray-400">Our program cultivates the next generation of Web3 builders in Africa.</p>
                    </header>
                    <div className="p-8 bg-gray-800 rounded-lg shadow-2xl text-center border border-purple-500/50">
                        <h3 className="text-3xl font-bold text-white mb-4">Connect with Our Innovators</h3>
                        <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                            Looking to hire skilled developers, project managers, or community leaders with hands-on blockchain experience? Our talent pool is ready to build the future. Get in touch to discuss partnership opportunities.
                        </p>
                        <button
                            onClick={() => onNavigate('contact')}
                            className="inline-block px-8 py-3 text-lg font-bold text-white rounded-lg transition-transform transform hover:scale-105"
                            style={{ backgroundColor: polkadotMagenta }} onMouseOver={e => e.currentTarget.style.backgroundColor = polkadotMagentaHover} onMouseOut={e => e.currentTarget.style.backgroundColor = polkadotMagenta}
                        >
                            Contact Us
                        </button>
                    </div>
                </section>

                <section>
                    <header className="text-center mb-10">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: polkadotMagenta }}>Meet Our Campus Leads</h1>
                        <p className="text-xl text-gray-400">The faces of Web3 innovation on campuses across Africa.</p>
                    </header>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {leads.map(lead => (
                            <button key={lead.id} onClick={() => onSelectLead(lead)} className="bg-gray-800 p-6 rounded-lg shadow-lg text-center transform hover:scale-105 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400">
                                <img src={lead.photoUrl} alt={lead.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-purple-500 bg-gray-700" />
                                <h3 className="text-xl font-bold text-white">{lead.name}</h3>
                                <p className="text-purple-300">{lead.campus}</p>
                            </button>
                        ))}
                    </div>
                </section>

                <section>
                    <header className="text-center mb-10">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: polkadotMagenta }}>Our Journey in Pictures</h1>
                        <p className="text-xl text-gray-400">Capturing the energy, focus, and collaboration of our community.</p>
                    </header>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {sampleGalleryImages.map((image, index) => (
                            <button key={index} onClick={() => setSelectedImg(image)} className="relative aspect-square rounded-lg overflow-hidden group focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-gray-900">
                                <img src={image.src} alt={image.caption} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-end p-2">
                                    <p className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">{image.caption}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </section>
            </div>
            {selectedImg && (
                <div className="fixed inset-0 z-[151] bg-black bg-opacity-90 flex items-center justify-center p-4 animate-modalFadeInScale" onClick={() => setSelectedImg(null)}>
                    <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
                        <img src={selectedImg.src} alt={selectedImg.caption} className="max-w-full max-h-full object-contain rounded-lg" />
                        <p className="mt-4 text-white text-lg">{selectedImg.caption}</p>
                        <IconButton
                            iconClass="fas fa-times text-2xl"
                            onClick={() => setSelectedImg(null)}
                            className="absolute -top-4 -right-4 text-white bg-gray-800 rounded-full p-2 hover:bg-gray-700"
                            aria-label="Close image viewer"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

const ContactContent: React.FC = () => (
    <div className="py-12 md:py-16 px-6 md:px-12 text-gray-300">
        <div className="max-w-4xl mx-auto">
            <header className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: polkadotMagenta }}>Get in Touch</h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                    We'd love to hear from you! Whether you have questions, want to partner with us, or wish to support our mission, here’s how you can reach out.
                </p>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {socialLinks.map(social => (
                    <a key={social.name} href={social.link} target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 flex flex-col items-center text-center group transform hover:-translate-y-2 transition-transform duration-300">
                        <i className={`${social.icon} text-5xl mb-4 transition-colors duration-300`} style={{ color: polkadotMagenta }}></i>
                        <h3 className="text-2xl font-bold text-white mb-2">{social.name}</h3>
                        <p className="text-gray-400 mb-4 flex-grow">{social.description}</p>
                    </a>
                ))}
            </div>
        </div>
    </div>
);


// --- MAIN MODAL COMPONENT ---
interface CampusLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CampusLeadModal: React.FC<CampusLeadModalProps> = ({ isOpen, onClose }) => {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;

  const handleNavClick = (page: ActivePage) => {
    setActivePage(page);
    contentRef.current?.scrollTo(0, 0); // Scroll to top on page change
  };
  
  const handleSelectLead = (lead: Lead) => setSelectedLead(lead);
  const handleClosePopup = () => setSelectedLead(null);


  const renderContent = () => {
    switch (activePage) {
      case 'home': return <HomepageContent />;
      case 'about': return <AboutContent />;
      case 'events': return <EventsContent leads={leads} events={events} onSelectLead={handleSelectLead} />;
      case 'opportunity': return <OpportunityContent />;
      case 'showcase': return <ShowcaseContent leads={leads} onSelectLead={handleSelectLead} onNavigate={handleNavClick} />;
      case 'contact': return <ContactContent />;
      default: return <HomepageContent />;
    }
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm">
      <div className="bg-gray-900 text-white w-full h-full flex flex-col animate-modalFadeInScale">
        
        <header className="flex-shrink-0 bg-gray-900/80 backdrop-blur-sm p-3 md:p-4 flex justify-between items-center border-b border-gray-700">
          <h2 className="text-lg md:text-xl font-bold" style={{ color: polkadotMagenta }}>
            Campus Lead Program
          </h2>
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`font-semibold transition-colors ${activePage === item.id ? 'text-purple-400' : 'text-gray-300 hover:text-purple-300'}`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <IconButton
            iconClass="fas fa-times text-xl md:text-2xl"
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1"
          />
        </header>
        
        <main ref={contentRef} className="flex-grow overflow-y-auto custom-scrollbar">
          {renderContent()}
           <footer className="py-8 px-6 text-center text-gray-500 bg-gray-800/50">
              <p>&copy; {new Date().getFullYear()} Polkadot Campus Lead Program. All Rights Reserved.</p>
          </footer>
        </main>

        <footer className="md:hidden flex-shrink-0 bg-gray-800/90 backdrop-blur-sm shadow-top p-2 flex justify-around items-center">
            {navItems.map(item => (
                 <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`text-xs p-1 rounded-md ${activePage === item.id ? 'text-purple-400' : 'text-gray-400'}`}
                 >
                     {item.label}
                 </button>
            ))}
        </footer>

        {selectedLead && (
            <LeadDetailPopup lead={selectedLead} allEvents={events} onClose={handleClosePopup} />
        )}
      </div>
    </div>,
    modalRoot
  );
};