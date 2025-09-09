import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { IconButton } from './IconButton';

// --- TYPE DEFINITIONS ---
type ActivePage = 'home' | 'about' | 'events' | 'opportunity' | 'showcase' | 'contact' | 'apply';

// --- STYLE CONSTANTS ---
const polkadotMagenta = '#E6007A';
const polkadotMagentaHover = '#c40068'; // A slightly darker magenta for hover

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
        <div className={`max-w-4xl mx-auto ${containerClassName}`}>
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

// --- PAGE CONTENT COMPONENTS ---

const HomepageContent: React.FC = () => (
    <>
        {/* Hero Section */}
        <div className="h-[90vh] min-h-[600px] flex items-center justify-center text-center p-6 bg-cover bg-center bg-gray-900">
            <div className="bg-black bg-opacity-60 p-8 rounded-lg max-w-3xl animate-modalFadeInScale">
                <h1 className="text-4xl md:text-6xl font-extrabold" style={{ color: polkadotMagenta }}>
                    Igniting Web3 Innovation in Africa.
                </h1>
                <p className="mt-4 text-lg md:text-xl text-gray-200">
                    The Polkadot Campus Lead Program empowers student leaders to build the future of decentralized technology across the continent.
                </p>
                <button className="mt-8 px-8 py-3 text-lg font-bold text-white rounded-lg transition-colors" style={{ backgroundColor: polkadotMagenta }} onMouseOver={e => e.currentTarget.style.backgroundColor = polkadotMagentaHover} onMouseOut={e => e.currentTarget.style.backgroundColor = polkadotMagenta}>
                    Apply to be a Campus Lead
                </button>
            </div>
        </div>

        <Section title="A Vision for a Decentralized Future">
            <p>
                A concise, powerful paragraph explaining our vision of building a <strong>grassroots network</strong> of technically skilled and community-minded individuals. We'll emphasize that we are not just teaching, but <strong>cultivating</strong> the next generation of developers, entrepreneurs, and leaders who will build on the Polkadot chain in the future.
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

        <Section title="Our Model: A Community-Driven Approach">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                <div className="p-6 bg-gray-800 rounded-lg"><strong>Campus Clubs:</strong> The grassroots engines of engagement.</div>
                <div className="text-2xl text-purple-400">→</div>
                <div className="p-6 bg-gray-800 rounded-lg"><strong>City Leads:</strong> Mentors and coordinators for local success.</div>
                <div className="text-2xl text-purple-400">→</div>
                <div className="p-6 bg-gray-800 rounded-lg"><strong>PCLP HQ:</strong> Provides resources and strategic guidance.</div>
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

        <Section title="Projects That Are Changing the World">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-white mb-2">Project Decentralized Identity</h3>
                <p className="text-gray-400 mb-4">A one-sentence description of this amazing project that gives users control over their data.</p>
                <a href="#" className="text-purple-400 hover:underline">View All Projects & Talent →</a>
            </div>
        </Section>

        <Section title="Ready to Lead?" className="bg-gray-800/50">
            <p className="mb-6">Join the Polkadot Campus Lead Program and become a pioneer in Africa’s decentralized future.</p>
            <button className="px-8 py-3 text-lg font-bold text-white rounded-lg transition-colors" style={{ backgroundColor: polkadotMagenta }} onMouseOver={e => e.currentTarget.style.backgroundColor = polkadotMagentaHover} onMouseOut={e => e.currentTarget.style.backgroundColor = polkadotMagenta}>
                Start Your Application
            </button>
        </Section>
    </>
);

const AboutUsContent: React.FC = () => (
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

            <div className="p-8 bg-gray-800 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold mb-4 text-purple-300">Meet Our Leaders</h2>
                <p>The PCLP is powered by a dedicated team of professionals with deep expertise in blockchain technology, community organizing, and educational program design. Our backgrounds range from senior engineering roles in Web3 to years of experience in youth development programs across Africa. While our individual stories vary, our collective purpose is the same: to champion the next generation of African innovators.</p>
            </div>
        </div>
    </div>
);

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

            {/* Roles Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Campus Lead Card */}
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
                        <div>
                            <h3 className="text-lg font-semibold text-purple-300 mb-2">What You'll Gain:</h3>
                            <p>A monthly stipend, direct mentorship, access to exclusive learning resources, and a direct line to the global Polkadot network.</p>
                        </div>
                    </div>
                </div>

                {/* City Lead Card */}
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
                        <div>
                            <h3 className="text-lg font-semibold text-purple-300 mb-2">What You'll Gain:</h3>
                            <p>A significant stipend, high-level leadership experience, and a close connection to the core PCLP team and its strategy.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Final CTA */}
            <div className="mt-16 p-8 bg-gray-800 rounded-lg shadow-2xl text-center">
                <h2 className="text-3xl font-bold text-white mb-4">Start Your Application</h2>
                <p className="text-gray-400 mb-6">Ready to join the movement? Click the button below to begin your application process.</p>
                <a
                    href="#" // Placeholder for Google Forms link
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-10 py-4 text-xl font-bold text-white rounded-lg transition-transform transform hover:scale-105"
                    style={{ backgroundColor: polkadotMagenta }}
                    onMouseOver={e => e.currentTarget.style.backgroundColor = polkadotMagentaHover}
                    onMouseOut={e => e.currentTarget.style.backgroundColor = polkadotMagenta}
                >
                    Apply Now
                </a>
            </div>
        </div>
    </div>
);

const sampleEvents = [
    { id: 1, title: 'Intro to Substrate Framework', date: '2024-08-15T14:00:00Z', location: 'University of Lagos', lead: 'Adaeze Okoro', description: 'A deep dive into Substrate, the framework for building custom blockchains.' },
    { id: 2, title: 'Polkadot Governance Workshop', date: '2024-08-22T11:00:00Z', location: 'University of Nairobi', lead: 'Jomo Kenyatta', description: 'Learn how to participate in Polkadot\'s on-chain governance.' },
    { id: 3, title: 'Web3 Career Fair & Networking', date: '2024-09-05T16:00:00Z', location: 'University of Cape Town', lead: 'Nia Botha', description: 'Connect with Polkadot ecosystem partners and explore career opportunities.' },
    { id: 4, title: 'Beginner\'s Guide to Rust for Blockchain', date: '2024-09-12T13:00:00Z', location: 'University of Ghana', lead: 'Kwame Nkrumah', description: 'A hands-on session covering the basics of Rust programming.' },
];

const sampleLeads = [
    { id: 1, name: 'Adaeze Okoro', campus: 'University of Lagos', photoUrl: 'https://i.pravatar.cc/150?u=adaeze', social: { linkedin: '#', twitter: '#' } },
    { id: 2, name: 'Jomo Kenyatta', campus: 'University of Nairobi', photoUrl: 'https://i.pravatar.cc/150?u=jomo', social: { linkedin: '#', twitter: '#' } },
    { id: 3, name: 'Nia Botha', campus: 'University of Cape Town', photoUrl: 'https://i.pravatar.cc/150?u=nia', social: { linkedin: '#', twitter: '#' } },
    { id: 4, name: 'Kwame Nkrumah', campus: 'University of Ghana', photoUrl: 'https://i.pravatar.cc/150?u=kwame', social: { linkedin: '#', twitter: '#' } },
    { id: 5, name: 'Fatima Al-Fassi', campus: 'University of Ibadan', photoUrl: 'https://i.pravatar.cc/150?u=fatima', social: { linkedin: '#', twitter: '#' } },
];


const EventsContent: React.FC = () => {
    const [locationFilter, setLocationFilter] = useState('all');
    const [dateSort, setDateSort] = useState('upcoming');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredAndSortedEvents = sampleEvents
        .filter(event => locationFilter === 'all' || event.location === locationFilter)
        .sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return dateSort === 'upcoming' ? dateA - dateB : dateB - dateA;
        });

    const filteredLeads = sampleLeads.filter(lead =>
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.campus.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const uniqueLocations = ['all', ...Array.from(new Set(sampleEvents.map(e => e.location)))];

    return (
        <div className="py-12 md:py-16 px-6 md:px-12 text-gray-300">
            <div className="max-w-6xl mx-auto space-y-16">

                {/* Upcoming Events Section */}
                <section>
                    <header className="text-center mb-10">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: polkadotMagenta }}>Upcoming Events</h1>
                        <p className="text-xl text-gray-400">Find and join official PCLP events happening across Africa.</p>
                    </header>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
                        <select
                            value={locationFilter}
                            onChange={e => setLocationFilter(e.target.value)}
                            className="bg-gray-700 text-white rounded-md p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            aria-label="Filter events by location"
                        >
                            {uniqueLocations.map(loc => (
                                <option key={loc} value={loc}>{loc === 'all' ? 'All Locations' : loc}</option>
                            ))}
                        </select>
                        <select
                            value={dateSort}
                            onChange={e => setDateSort(e.target.value)}
                            className="bg-gray-700 text-white rounded-md p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            aria-label="Sort events by date"
                        >
                            <option value="upcoming">Sort by Date (Upcoming)</option>
                            <option value="recent">Sort by Date (Most Recent)</option>
                        </select>
                    </div>

                    {/* Events Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredAndSortedEvents.map(event => (
                            <div key={event.id} className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 flex flex-col">
                                <h3 className="text-xl font-bold text-purple-300 mb-2">{event.title}</h3>
                                <p className="text-sm text-gray-400 mb-1"><i className="fas fa-calendar-alt mr-2"></i>{new Date(event.date).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</p>
                                <p className="text-sm text-gray-400 mb-1"><i className="fas fa-map-marker-alt mr-2"></i>{event.location}</p>
                                <p className="text-sm text-gray-400 mb-4"><i className="fas fa-user mr-2"></i>Lead: {event.lead}</p>
                                <p className="text-gray-300 text-base mb-6 flex-grow">{event.description}</p>
                                <a href="#" className="mt-auto text-center block w-full px-4 py-2 font-semibold text-white rounded-lg transition-colors" style={{ backgroundColor: polkadotMagenta }} onMouseOver={e => e.currentTarget.style.backgroundColor = polkadotMagentaHover} onMouseOut={e => e.currentTarget.style.backgroundColor = polkadotMagenta}>
                                    Learn More & Register
                                </a>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Meet Our Campus Leads Section */}
                <section>
                    <header className="text-center mb-10">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: polkadotMagenta }}>Meet Our Campus Leads</h1>
                        <p className="text-xl text-gray-400">Connect with the Polkadot champions in your area.</p>
                    </header>

                    {/* Search Bar */}
                    <div className="mb-8 max-w-lg mx-auto">
                        <input
                            type="text"
                            placeholder="Search by name or university..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            aria-label="Search for campus leads"
                        />
                    </div>

                    {/* Leads Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredLeads.map(lead => (
                            <div key={lead.id} className="bg-gray-800 p-6 rounded-lg shadow-lg text-center transform hover:-translate-y-2 transition-transform duration-300">
                                <img src={lead.photoUrl} alt={lead.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-purple-400 object-cover" />
                                <h3 className="text-lg font-bold text-white">{lead.name}</h3>
                                <p className="text-sm text-purple-300 mb-3">{lead.campus}</p>
                                <div className="flex justify-center space-x-4 text-xl text-gray-400">
                                    <a href={lead.social.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white" aria-label={`LinkedIn profile for ${lead.name}`}><i className="fab fa-linkedin"></i></a>
                                    <a href={lead.social.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-white" aria-label={`Twitter profile for ${lead.name}`}><i className="fab fa-twitter"></i></a>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

const sampleProjects = [
    { title: 'AfriChain', description: 'A decentralized supply chain solution for agricultural products in West Africa, built on Substrate.', skills: ['Rust', 'Substrate', 'Supply Chain'] },
    { title: 'EthioVote', description: 'A secure and transparent e-voting platform designed to ensure election integrity in Ethiopia.', skills: ['Smart Contracts', 'Cryptography', 'Governance'] },
    { title: 'Kente-Fi', description: 'A DeFi lending protocol inspired by traditional Ghanaian savings groups, providing micro-loans.', skills: ['DeFi', 'Solidity', 'Financial Inclusion'] },
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

const ShowcaseContent: React.FC = () => {
    const [selectedImg, setSelectedImg] = useState<{ src: string; caption: string } | null>(null);

    return (
        <div className="py-12 md:py-16 px-6 md:px-12 text-gray-300">
            <div className="max-w-6xl mx-auto space-y-16">

                {/* Innovators & Builders Section */}
                <section>
                    <header className="text-center mb-10">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: polkadotMagenta }}>Innovators & Builders</h1>
                        <p className="text-xl text-gray-400">Celebrating the impactful projects developed by our student leaders.</p>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Project Cards */}
                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {sampleProjects.map(project => (
                                <div key={project.title} className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 flex flex-col">
                                    <h3 className="text-2xl font-bold text-purple-300 mb-2">{project.title}</h3>
                                    <p className="text-gray-400 mb-4 flex-grow">{project.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {project.skills.map(skill => (
                                            <span key={skill} className="bg-gray-700 text-purple-300 text-xs font-semibold px-2.5 py-1 rounded-full">{skill}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 flex flex-col items-center justify-center text-center">
                                <h3 className="text-2xl font-bold text-purple-300 mb-2">Your Project Here?</h3>
                                <p className="text-gray-400 mb-4 flex-grow">Join the program and get the support to build the next big thing in Web3.</p>
                                <button className="mt-auto px-6 py-2 font-semibold text-white rounded-lg transition-colors" style={{ backgroundColor: polkadotMagenta }} onMouseOver={e => e.currentTarget.style.backgroundColor = polkadotMagentaHover} onMouseOut={e => e.currentTarget.style.backgroundColor = polkadotMagenta}>
                                    Apply Now
                                </button>
                            </div>
                        </div>

                        {/* Talent Pool Sidebar */}
                        <div className="lg:col-span-1 bg-gray-800 p-6 rounded-lg shadow-lg border border-purple-500/30">
                            <h3 className="text-2xl font-bold text-white mb-4">Connect with Our Talent</h3>
                            <p className="text-gray-400 mb-6">Our program cultivates top-tier talent ready to innovate. Connect with our skilled developers, project managers, and community builders.</p>
                            <ul className="space-y-2 text-gray-300">
                                <li className="flex items-center"><i className="fas fa-check-circle text-green-400 mr-2"></i>Rust & Substrate Developers</li>
                                <li className="flex items-center"><i className="fas fa-check-circle text-green-400 mr-2"></i>DeFi Protocol Designers</li>
                                <li className="flex items-center"><i className="fas fa-check-circle text-green-400 mr-2"></i>Smart Contract Engineers</li>
                                <li className="flex items-center"><i className="fas fa-check-circle text-green-400 mr-2"></i>Technical Community Managers</li>
                            </ul>
                            <button className="mt-6 w-full px-4 py-2 font-semibold text-white rounded-lg transition-colors" style={{ backgroundColor: polkadotMagenta }} onMouseOver={e => e.currentTarget.style.backgroundColor = polkadotMagentaHover} onMouseOut={e => e.currentTarget.style.backgroundColor = polkadotMagenta}>
                                Hire Our Talent
                            </button>
                        </div>
                    </div>
                </section>

                {/* Event Gallery Section */}
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
                <div className="fixed inset-0 z-[101] bg-black bg-opacity-90 flex items-center justify-center p-4 animate-modalFadeInScale" onClick={() => setSelectedImg(null)}>
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

const socialLinks = [
    { name: 'X (Twitter)', icon: 'fab fa-twitter', link: '#', description: 'Follow us for the latest news and announcements.' },
    { name: 'LinkedIn', icon: 'fab fa-linkedin', link: '#', description: 'Connect with our professional network.' },
    { name: 'Telegram', icon: 'fab fa-telegram-plane', link: '#', description: 'Join our community for live discussions.' },
    { name: 'Discord', icon: 'fab fa-discord', link: '#', description: 'Engage with developers and other leads.' },
    { name: 'WhatsApp', icon: 'fab fa-whatsapp', link: '#', description: 'Get in touch for direct support.' },
    { name: 'Email', icon: 'fas fa-envelope', link: 'mailto:#', description: 'For partnerships and official inquiries.' },
];

const ContactUsContent: React.FC = () => (
    <div className="py-12 md:py-16 px-6 md:px-12 text-gray-300">
        <div className="max-w-4xl mx-auto">
            <header className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: polkadotMagenta }}>
                    Get in Touch
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                    We'd love to hear from you! Whether you have questions, want to partner with us, or wish to support our mission, here’s how you can reach out.
                </p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {socialLinks.map(social => (
                    <a
                        key={social.name}
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 flex flex-col items-center text-center group transform hover:-translate-y-2 transition-transform duration-300"
                    >
                        <i className={`${social.icon} text-5xl mb-4 transition-colors duration-300`} style={{ color: polkadotMagenta }}></i>
                        <h3 className="text-2xl font-bold text-white mb-2">{social.name}</h3>
                        <p className="text-gray-400 mb-4 flex-grow">{social.description}</p>
                        <span
                            className="mt-auto inline-block px-6 py-2 text-md font-semibold text-white rounded-lg transition-colors duration-300 group-hover:text-white"
                            style={{ backgroundColor: polkadotMagenta, boxShadow: `0 0 15px ${polkadotMagenta}33` }}
                        >
                            Connect <i className="fas fa-arrow-right ml-1 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                        </span>
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
    const contentRef = useRef<HTMLDivElement>(null);

    const handleNavClick = (page: ActivePage) => {
        setActivePage(page);
        if (contentRef.current) {
            contentRef.current.scrollTop = 0;
        }
    };

    if (!isOpen) return null;
    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return null;

    const renderContent = () => {
        switch (activePage) {
            case 'home': return <HomepageContent />;
            case 'about': return <AboutUsContent />;
            case 'opportunity': return <OpportunityContent />;
            case 'events': return <EventsContent />;
            case 'showcase': return <ShowcaseContent />;
            case 'contact': return <ContactUsContent />;
            case 'apply': return <OpportunityContent />;
            default: return <HomepageContent />;
        }
    };

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm">
            <div className="bg-gray-900 text-white w-full h-full flex flex-col animate-modalFadeInScale">

                {/* Top Bar with Title and Close Button */}
                <div className="flex-shrink-0 bg-gray-900/80 backdrop-blur-sm p-3 md:p-4 flex justify-between items-center border-b border-gray-700">
                    <h2 className="text-lg md:text-xl font-bold text-purple-300">
                        Polkadot Campus Lead Program
                    </h2>
                    <IconButton
                        iconClass="fas fa-times text-xl md:text-2xl"
                        onClick={onClose}
                        className="text-gray-400 hover:text-white p-1"
                        aria-label="Close"
                    />
                </div>

                {/* Sticky Navigation */}
                <nav className="sticky top-0 bg-gray-800/90 backdrop-blur-sm z-10 flex-shrink-0 shadow-md">
                    <div className="px-2 md:px-4 overflow-x-auto custom-scrollbar">
                        <div className="flex items-center h-14 space-x-1 md:space-x-2">
                            {navItems.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => handleNavClick(item.id)}
                                    className={`px-3 md:px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${activePage === item.id ? 'bg-gray-900 text-white shadow-inner' : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'}`}
                                    aria-current={activePage === item.id ? 'page' : undefined}
                                >
                                    {item.label}
                                </button>
                            ))}
                            <div className="!ml-auto flex-shrink-0 pl-2">
                                <button
                                    onClick={() => handleNavClick('apply')}
                                    className="px-5 py-2 text-sm font-bold text-white rounded-full transition-colors whitespace-nowrap"
                                    style={{ backgroundColor: polkadotMagenta }}
                                    onMouseOver={e => e.currentTarget.style.backgroundColor = polkadotMagentaHover}
                                    onMouseOut={e => e.currentTarget.style.backgroundColor = polkadotMagenta}
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Scrollable Content */}
                <main ref={contentRef} className="flex-grow overflow-y-auto custom-scrollbar bg-gray-900">
                    {renderContent()}
                    {/* Footer */}
                    <footer className="py-8 px-6 text-center text-gray-500 bg-gray-800/50">
                        <p>&copy; {new Date().getFullYear()} Polkadot Campus Lead Program. All Rights Reserved.</p>
                    </footer>
                </main>
            </div>
        </div>,
        modalRoot
    );
};
