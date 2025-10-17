const logotext = 'Legha-gha Kang';
const meta = {
  title: 'Legha-gha Kang',
  description:
    'I’m Legha-gha Kang a Full stack devloper, currently working in Yaounde',
};

const introdata = {
  title: 'Web Developer',
  animated: {
    first: 'I love coding',
    second: 'I code cool websites',
    third: 'I develop web apps',
  },
  description:
    'I am a highly motivated Full Stack Web Developer with a degree in Software Engineering (2022). My experience spans both backend and frontend development, equipping me with a comprehensive skill set to create dynamic, responsive, and efficient web applications.',
  your_img_url: 'https://images.unsplash.com/photo-1514790193030-c89d266d5a9d',
};

const dataabout = {
  title: 'About Me',
  aboutme:
    'I am a highly motivated Full Stack Web Developer with a degree in Software Engineering (2022). My experience spans both backend and frontend development, equipping me with a comprehensive skill set to create dynamic, responsive, and efficient web applications. With a strong background in teaching web development and programming, coupled with hands-on experience in building production-level applications, I am passionate about delivering seamless user experiences and designing scalable architectures. I am eager to leverage my full stack skills in a challenging development role that allows me to contribute effectively to innovative projects.',
};
const worktimeline = [
  {
    jobtitle: 'Backend Developer',
    where: 'KitsAfriq Sarl',
    date: '2021 - 2023',
  },
  {
    jobtitle: 'Frontend Developer',
    where: 'Vmedia Yaounde',
    date: '2023 - 2024',
  },
  {
    jobtitle: 'Senior Frontend Developer',
    where: 'Trust Consulting',
    date: '2024 - present',
  },
];

const skills = [
  {
    name: 'React',
    value: 90,
  },
  {
    name: 'Node.js',
    value: 85,
  },
  {
    name: 'Express',
    value: 80,
  },
  {
    name: 'Next.js',
    value: 80,
  },
  {
    name: 'MongoDB',
    value: 85,
  },
  {
    name: 'Typescript',
    value: 90,
  },
  {
    name: 'Javascript',
    value: 90,
  },
  {
    name: 'Reactflow',
    value: 70,
  },
  {
    name: 'GSAP',
    value: 90,
  },
  {
    name: 'Git',
    value: 90,
  },
  {
    name: 'Docker',
    value: 70,
  },
  {
    name: 'Django',
    value: 85,
  },
  {
    name: 'Python',
    value: 85,
  },
  {
    name: 'PostgreSQL',
    value: 80,
  },
  {
    name: 'Mapbox',
    value: 75,
  },
  {
    name: 'Lemon Squeezy',
    value: 70,
  },
];

const services = [
  {
    title: 'Web Development',
    description:
      'I develop web applications using React, Node.js, Express, MongoDB, Django, etc.',
  },
  {
    title: 'Ecommerce Development with CMS',
    description:
      'I develop ecommerce websites with CMS like Shopify, Wordpress, Wix, etc.',
  },
  {
    title: 'Backend Development',
    description:
      'I develop backend applications using Node.js, Express, MongoDB, Django, etc.',
  },
];

const dataportfolio = [
  {
    id: 'ecocollect',
    title: 'EcoCollect - Waste Management Platform',
    img: 'https://images.unsplash.com/photo-1503596476-1c12a8ba09a9?q=80&w=400&h=400&auto=format&fit=crop',
    description:
      'A comprehensive full-stack waste management platform that connects users with waste collection services. Features subscription management, real-time tracking, driver assignment, and payment processing for a complete waste management ecosystem.',
    shortDescription:
      'Full-stack waste management platform with real-time tracking',
    technologies: [
      'MongoDB',
      'Express.js',
      'React',
      'Node.js',
      'TypeScript',
      'Tailwind CSS',
      'Mapbox',
      'Lemon Squeezy',
      'JWT Authentication',
    ],
    challenge:
      'Building a comprehensive waste management platform that handles multiple user roles (customers, admins, drivers), real-time location tracking, subscription management, payment processing, and efficient request assignment workflows while ensuring scalability and user experience.',
    solution:
      'Developed a full-stack MERN application with TypeScript for type safety. Implemented Mapbox for real-time location tracking and route optimization, Lemon Squeezy for secure payment processing, and JWT for authentication. Created role-based access control for different user types and real-time updates for request status tracking.',
    features: [
      'Multi-role user system (Customers, Admins, Drivers)',
      'Waste collection request creation and management',
      'Real-time vehicle tracking with Mapbox integration',
      'Subscription management with recurring billing',
      'Secure payment processing via Lemon Squeezy',
      'Admin dashboard for request assignment and monitoring',
      'Driver mobile interface for task management',
      'Real-time notifications and status updates',
      'Route optimization for efficient collection',
      'Customer subscription history and billing',
      'Responsive design for mobile and desktop',
      'JWT-based authentication and authorization',
    ],
    deployedLink: 'https://eco-collect-omega.vercel.app/',
    githubLink: 'https://github.com/Sculptor97/trashapp-frontend',
    isDeployed: true,
    isPublicRepo: true,
    created: '2025-09-23',
    gallery: [],
  },
  {
    id: 'eld-log',
    title: 'ELD Log Route Planning System',
    img: 'https://images.unsplash.com/photo-1711942179703-fce59b6afac6?q=80&w=400&h=700&auto=format&fit=crop',
    description:
      'A comprehensive full-stack application for commercial drivers that generates route instructions and automated ELD (Electronic Logging Device) logs based on trip details, ensuring compliance with DOT regulations',
    shortDescription:
      'Full-stack ELD log and route planning system for commercial drivers',
    technologies: [
      'Django',
      'React',
      'TypeScript',
      'PostgreSQL',
      'Mapbox API',
      'OpenRouteService API',
      'Turf.js',
      'html2canvas',
      'jsPDF',
    ],
    challenge:
      'Building a complex full-stack application that takes trip details as inputs and generates accurate route instructions with automated ELD logs, ensuring compliance with DOT regulations (70hrs/8days cycle) while providing an intuitive user interface for commercial drivers.',
    solution:
      'Developed a Django REST API backend with PostgreSQL database for robust data management. Created a React frontend with TypeScript for type safety and better development experience. Integrated Mapbox for interactive mapping, OpenRouteService for route optimization, and Turf.js for spatial analysis. Implemented html2canvas and jsPDF for generating printable ELD log sheets.',
    features: [
      'Interactive route planning with real-time map visualization',
      'Automated ELD log generation with DOT compliance (70hrs/8days cycle)',
      'Trip input system (current location, pickup, dropoff, current cycle hours)',
      'Route optimization with rest stops and fueling stations',
      'Multiple daily log sheets for longer trips',
      'PDF export functionality for printed logs',
      'Spatial analysis for distance and time calculations',
      'Responsive design for mobile and desktop use',
      'Data persistence with PostgreSQL database',
      'RESTful API architecture for scalability',
    ],
    deployedLink: 'https://ddl-frontend-eta.vercel.app/',
    githubLink: 'https://github.com/Sculptor97/ddl-frontend',
    isDeployed: true,
    isPublicRepo: true,
    created: '2025-09-15',
    gallery: [],
  },
  {
    id: 'xp-portfolio',
    title: 'XP Portfolio',
    img: 'https://images.unsplash.com/photo-1624644128945-920c0da6931b?auto=format&fit=crop&q=80&w=500&h=400',
    description:
      'A nostalgic Windows XP-themed portfolio website that recreates the classic desktop experience with modern web technologies. Features an authentic XP interface with draggable windows, start menu, taskbar, and desktop applications including a file explorer, command prompt, and project showcase.',
    shortDescription:
      'Windows XP-themed portfolio website with authentic desktop experience',
    technologies: [
      'React',
      'TypeScript',
      'Tailwind CSS',
      'GSAP',
      'React Query',
      'React Router',
      'React95',
      'XP.css',
    ],
    challenge:
      'Creating an authentic Windows XP desktop experience in a web browser while maintaining modern performance and accessibility standards. The challenge involved recreating complex UI interactions like draggable windows, start menu animations, and the classic Luna theme styling.',
    solution:
      'Built a component-based architecture using React with TypeScript for type safety. Implemented GSAP for smooth animations, Radix UI for accessible components, and custom CSS with XP.css for authentic styling. Used React Query for efficient data management and created reusable window components that mimic the original XP interface.',
    features: [
      'Authentic Windows XP desktop interface with Luna theme',
      'Draggable and resizable windows with minimize/maximize functionality',
      'Interactive start menu with application shortcuts',
      'File explorer with project showcase and image galleries',
      'Command prompt terminal with custom commands',
      'Responsive design that works on desktop and mobile',
      'Dark mode support with proper theme switching',
      'Smooth animations and transitions using GSAP',
      'Modern React patterns with hooks and context',
      'TypeScript for type safety and better development experience',
    ],
    deployedLink: 'https://xp-portfolio-livid.vercel.app/',
    githubLink: 'https://github.com/Sculptor97/xp-portfolio',
    isDeployed: true,
    isPublicRepo: true,
    created: '2025-10-17',
    gallery: [],
  },
  {
    id: 'browsebright',
    title: 'Sentiment Analysis Chrome Extension',
    img: 'https://images.unsplash.com/photo-1584735414166-8c436d5854ac?q=80&w=400&h=500&auto=format&fit=crop',
    description:
      'A Chrome extension that analyzes webpage content sentiment and recommends similar content',
    shortDescription: 'Chrome extension for content sentiment analysis',
    technologies: [
      'React',
      'TypeScript',
      'Sentiment API',
      'Chrome Extensions API',
    ],
    challenge:
      'Creating a seamless browser extension that could analyze any webpage content in real-time and provide meaningful sentiment insights while maintaining performance and user privacy.',
    solution:
      'Developed a lightweight React-based extension with TypeScript for type safety. Implemented efficient content parsing algorithms and integrated with sentiment analysis APIs to provide real-time insights. Added smart caching mechanisms to improve performance and reduce API calls.',
    features: [
      'Real-time sentiment analysis of webpage content',
      'Content recommendations based on sentiment',
      'User-friendly dashboard with sentiment visualization',
      'Privacy-focused design with local processing',
      'Customizable sentiment thresholds',
    ],
    deployedLink:
      'https://chromewebstore.google.com/detail/browsebright/jgjgjgjgjgjgjgjgjgjgjgjgjgjgjgjg',
    githubLink: 'https://github.com/nkeumosoft/BrowseBright',
    isDeployed: false,
    isPublicRepo: false,
    created: '2024-01-10',
    gallery: [
      'https://res.cloudinary.com/dtercvq2v/image/upload/v1757609920/bb_1280_wnwtrn.jpg',
      'https://res.cloudinary.com/dtercvq2v/image/upload/v1757609920/bb_neutral_g0wlnk.jpg',
      'https://res.cloudinary.com/dtercvq2v/image/upload/v1757609920/bb_poster_image_it087w.jpg',
      'https://res.cloudinary.com/dtercvq2v/image/upload/v1757609921/bb_thems_xgxmyw.jpg',
    ],
  },
  {
    id: 'verbotic',
    title: 'WhatsApp Messaging Automation Platform',
    img: 'https://images.unsplash.com/photo-1599382103240-5f2a57137d28?q=80&w=400&h=700&auto=format&fit=crop',
    description:
      'A comprehensive WhatsApp automation platform for workflow management and contact management',
    shortDescription: 'WhatsApp automation platform with workflow management',
    technologies: [
      'React',
      'TypeScript',
      'ReactFlow',
      'GSAP',
      'Tailwind CSS',
      'Node.js',
    ],
    challenge:
      'Building a complex automation platform that allows users to create intricate workflows for WhatsApp messaging, manage large contact databases, and provide a seamless user experience for both technical and non-technical users.',
    solution:
      'Led the entire frontend development using React and TypeScript. Implemented ReactFlow for visual workflow creation, GSAP for smooth animations, and Tailwind CSS for responsive design. Created an intuitive drag-and-drop interface for workflow building and comprehensive contact management system.',
    features: [
      'Visual workflow builder with drag-and-drop interface',
      'Contact management and segmentation',
      'WhatsApp template creation and management',
      'Real-time chat interface',
      'Analytics and reporting dashboard',
      'Multi-user collaboration features',
    ],
    deployedLink: 'https://app.verboticls.com/',
    githubLink: 'https://github.com/Verbotic/appointment-booking-frontend',
    isDeployed: true,
    isPublicRepo: false,
    created: '2024-01-05',
    gallery: [
      'https://res.cloudinary.com/dtercvq2v/image/upload/v1757609923/wa_1_ppbpfr.png',
      'https://res.cloudinary.com/dtercvq2v/image/upload/v1757609924/wa_2_eqnlzx.png',
      'https://res.cloudinary.com/dtercvq2v/image/upload/v1757609924/wa_3_dgkvob.png',
      'https://res.cloudinary.com/dtercvq2v/image/upload/v1757609918/wa_4_cxqqos.png',
      'https://res.cloudinary.com/dtercvq2v/image/upload/v1757609919/wa_5_z2rwxk.png',
    ],
  },
  {
    id: 'alien-invasion',
    title: 'Alien Shooting Game',
    img: 'https://images.unsplash.com/photo-1572224104820-98a5279d861b?q=80&w=400&h=600&auto=format&fit=crop',
    description:
      'A fun and engaging 2D shooting game built with Python and Pygame',
    shortDescription: '2D shooting game with Python and Pygame',
    technologies: ['Python', 'Pygame', 'Object-Oriented Programming'],
    challenge:
      'Creating an engaging 2D shooting game with smooth gameplay mechanics, collision detection, scoring system, and multiple levels while ensuring optimal performance and user experience.',
    solution:
      'Developed a complete 2D shooting game using Python and Pygame. Implemented object-oriented design patterns for game entities, created smooth player movement and shooting mechanics, added collision detection systems, and designed multiple levels with increasing difficulty.',
    features: [
      'Smooth player movement and shooting mechanics',
      'Multiple enemy types with different behaviors',
      'Collision detection and physics',
      'Scoring system and high score tracking',
      'Multiple levels with increasing difficulty',
      'Sound effects and visual feedback',
      'Game over and restart functionality',
    ],
    deployedLink: '#',
    githubLink: 'https://github.com/Sculptor97/Alien_invasion',
    isDeployed: false,
    isPublicRepo: true,
    created: '2023-12-20',
    gallery: ['/images/alien_invasion.jpg'],
  },
  {
    id: 'fpl-insights',
    title: 'Fantasy Premier League Insights Refactor',
    img: 'https://images.unsplash.com/photo-1568101794887-a7a3f149f6e6?q=80&w=400&h=500&auto=format&fit=crop',
    description:
      'Performance optimization and refactoring of a football statistics website',
    shortDescription: 'Fantasy Premier League statistics platform refactor',
    technologies: [
      'TypeScript',
      'React',
      'Shadcn UI',
      'Fantasy Premier League API',
      'AOS',
    ],
    challenge:
      'Refactoring and improving the performance of an existing website that manages complex football statistics and fantasy premier league data, while maintaining data accuracy and improving user experience.',
    solution:
      'Completely refactored the codebase using TypeScript for better type safety and React for improved component architecture. Implemented Shadcn UI for consistent design system and AOS for smooth scroll animations. Optimized API calls and data processing for better performance.',
    features: [
      'Real-time football statistics and analytics',
      'Fantasy Premier League player insights',
      'Performance-optimized data visualization',
      'Responsive design with smooth animations',
      'Advanced filtering and search capabilities',
      'Historical data analysis and trends',
    ],
    deployedLink: 'https://www.fplinsights.com/',
    githubLink: 'https://github.com/FPL-insights/fpl-insights',
    isDeployed: true,
    isPublicRepo: false,
    created: '2025-05-15',
    gallery: [
      'https://res.cloudinary.com/dtercvq2v/image/upload/v1757609925/fpl_1_asxslp.png',
      'https://res.cloudinary.com/dtercvq2v/image/upload/v1757609925/fpl_2_svmxl7.png',
      'https://res.cloudinary.com/dtercvq2v/image/upload/v1757609922/fpl_3_bjoac3.png',
    ],
  },

  {
    id: 'nkeumosoft-portfolio',
    title: 'Agency Portfolio Website',
    img: 'https://images.unsplash.com/photo-1702479744062-1880502275b1?q=80&w=400&h=550&auto=format&fit=crop',
    description:
      'Modern agency portfolio website showcasing company services and projects',
    shortDescription: 'Modern agency portfolio with animations',
    technologies: ['React', 'GSAP', 'Shadcn UI', 'TypeScript', 'Tailwind CSS'],
    challenge:
      "Creating a modern, visually appealing agency portfolio that effectively showcases the company's services, team, and projects while providing an engaging user experience with smooth animations and professional design.",
    solution:
      'Built a comprehensive agency portfolio using React and TypeScript. Implemented GSAP for smooth scroll animations and interactive elements, used Shadcn UI for consistent component design, and created a responsive layout that works seamlessly across all devices.',
    features: [
      'Modern, responsive design with smooth animations',
      'Interactive project showcase with filtering',
      'Team member profiles and contact information',
      'Service offerings with detailed descriptions',
      'Testimonials and client reviews section',
      'Contact form with email integration',
      'SEO optimized with meta tags and structured data',
    ],
    deployedLink: 'https://nkeumosoft.com/',
    githubLink: 'https://github.com/nkeumosoft/agency-portfolio-v3',
    isDeployed: false,
    isPublicRepo: false,
    created: '2023-12-10',
    gallery: [],
  },
  {
    id: 'real-estate-showcase',
    title: 'Real Estate Product Showcase',
    img: 'https://images.unsplash.com/photo-1708196889869-1405f43976ea?q=80&w=400&h=600&auto=format&fit=crop',
    description:
      'Single product showcase website for a premium real estate property',
    shortDescription: 'Premium real estate property showcase',
    technologies: ['React', 'GSAP', 'Shadcn UI', 'TypeScript', 'Tailwind CSS'],
    challenge:
      'Creating an immersive single-product website that effectively showcases a premium real estate property, highlighting its unique features and creating an emotional connection with potential buyers.',
    solution:
      "Developed a focused single-product website using React and TypeScript. Implemented GSAP for smooth scroll animations and interactive elements, used high-quality imagery and virtual tours, and created an intuitive user experience that guides visitors through the property's features.",
    features: [
      'Immersive property showcase with high-quality imagery',
      'Interactive virtual tour and 360° views',
      'Detailed property specifications and amenities',
      'Location highlights and neighborhood information',
      'Contact forms and inquiry system',
      'Mobile-responsive design for on-the-go viewing',
      'Fast loading times optimized for image-heavy content',
    ],
    deployedLink: 'https://app.gohighlevel.com/v2/preview/Y3U7A0V281JHp10Mg1ho',
    githubLink: '#',
    isDeployed: true,
    isPublicRepo: false,
    created: '2023-12-05',
    gallery: [
      'https://res.cloudinary.com/dtercvq2v/image/upload/v1757609923/re_1_mahmwv.png',
      'https://res.cloudinary.com/dtercvq2v/image/upload/v1757609922/re_2_jx7qd2.png',
      'https://res.cloudinary.com/dtercvq2v/image/upload/v1757609923/re_3_bdvipe.png',
    ],
  },
  {
    id: 'flex-reviews',
    title: 'Real Estate Review Management Dashboard',
    img: 'https://images.unsplash.com/photo-1740484409661-75d41ff41a9b?q=80&w=400&h=700&auto=format&fit=crop',
    description:
      'A comprehensive dashboard for real estate managers to manage and respond to property reviews across multiple platforms',
    shortDescription: 'Real estate review management dashboard',
    technologies: [
      'Next.js',
      'MongoDB',
      'Recharts',
      'TypeScript',
      'Tailwind CSS',
      'Node.js',
    ],
    challenge:
      'Building a centralized dashboard that allows real estate managers to efficiently manage reviews from multiple platforms (Google Reviews, Hostaway, etc.), respond to customer feedback, moderate content, and gain insights through analytics while maintaining a seamless user experience.',
    solution:
      'Developed a full-stack Next.js application with MongoDB for data storage and Recharts for analytics visualization. Created a unified interface that aggregates reviews from multiple sources, implements automated moderation workflows, and provides comprehensive analytics. Built responsive design with real-time updates and notification systems.',
    features: [
      'Multi-platform review aggregation (Google, Hostaway, etc.)',
      'Real-time review response and management system',
      'Automated review approval/disapproval workflows',
      'Comprehensive analytics dashboard with Recharts',
      'Review sentiment analysis and trending insights',
      'Bulk actions and automated response templates',
      'Role-based access control for team management',
      'Real-time notifications and email alerts',
      'Export functionality for reports and data analysis',
    ],
    deployedLink: 'https://flex-reviews-rosy.vercel.app/',
    githubLink: 'https://github.com/Sculptor97/flex-reviews',
    isDeployed: true,
    isPublicRepo: true,
    created: '2025-08-28',
    gallery: [],
  },
  {
    id: 'afroconnect',
    title: 'Afroconnect - African Business Marketplace',
    img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=400&h=650&auto=format&fit=crop',
    description:
      'A Fiverr-like platform designed specifically for the African business market, connecting local service providers with clients',
    shortDescription: 'African business marketplace platform',
    technologies: [
      'React',
      'TypeScript',
      'TanStack Query',
      'Shadcn UI',
      'Tailwind CSS',
      'Framer Motion',
    ],
    challenge:
      'Creating a comprehensive marketplace platform that caters to the unique needs of African service providers and businesses, including professionals like barbers, mechanics, drivers, and car wash services, while ensuring a seamless user experience and robust functionality.',
    solution:
      "Developed a full-featured marketplace using React and TypeScript for type safety. Implemented TanStack Query for efficient data fetching and caching, Shadcn UI for consistent design components, and Framer Motion for smooth animations. Built with Tailwind CSS for responsive design and optimized for the African market's specific requirements.",
    features: [
      'Business profile creation and management',
      'Service listing and categorization system',
      'Advanced search and filtering capabilities',
      'Real-time messaging between providers and clients',
      'Booking and scheduling system',
      'Payment integration for African markets',
      'Review and rating system',
      'Location-based service discovery',
      'Mobile-responsive design for accessibility',
      'Multi-language support for African regions',
    ],
    deployedLink: 'https://www.makna.io/',
    githubLink: 'https://github.com/nkeumosoft/afroconnect_v0',
    isDeployed: true,
    isPublicRepo: false,
    created: '2025-08-20',
    gallery: [
      'https://res.cloudinary.com/dtercvq2v/image/upload/v1757609920/ac_1_al6bxi.png',
      'https://res.cloudinary.com/dtercvq2v/image/upload/v1757609918/ac_2_a9znu8.png',
      'https://res.cloudinary.com/dtercvq2v/image/upload/v1757609919/ac_3_efle71.png',
      'https://res.cloudinary.com/dtercvq2v/image/upload/v1757609918/ac_4_yr49fg.png',
      'https://res.cloudinary.com/dtercvq2v/image/upload/v1757609920/ac_5_ll4krb.png',
      'https://res.cloudinary.com/dtercvq2v/image/upload/v1757609918/ac_6_njht5o.png',
    ],
  },
  {
    id: 'boardroom-os',
    title: 'BoardroomOS - AI Full Stack Chat Application',
    img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=400&h=600&auto=format&fit=crop',
    description:
      'An AI-powered full stack chat application that serves as the bridge between businesses and their sophisticated AI chat assistants, enabling seamless communication and interaction',
    shortDescription: 'AI full stack chat application with OpenAI integration',
    technologies: [
      'Next.js',
      'OpenAI API',
      'TypeScript',
      'Tailwind CSS',
      'Node.js',
      'MongoDB',
    ],
    challenge:
      'Building a comprehensive AI chat platform that seamlessly connects end users with business AI assistants, handling real-time conversations, session management, data extraction, and providing a scalable architecture for multiple business integrations.',
    solution:
      'Developed a full-stack Next.js application with OpenAI API integration for intelligent chat capabilities. Implemented real-time messaging, session persistence, and data extraction features. Created a scalable architecture that can handle multiple business AI assistants with proper authentication and user management.',
    features: [
      'Real-time AI chat interface with OpenAI integration',
      'Session management and conversation history',
      'Live response streaming for immediate feedback',
      'Session data extraction and download functionality',
      'Multi-business AI assistant support',
      'User authentication and role-based access',
      'Responsive design for all devices',
      'Customizable AI assistant personalities',
      'Export conversations in multiple formats',
    ],
    deployedLink: 'https://boardroom-os.vercel.app',
    githubLink: '#',
    isDeployed: true,
    isPublicRepo: false,
    created: '2023-11-15',
    gallery: [],
  },
];

const contactConfig = {
  YOUR_EMAIL: 'kangleghagha@gmail.com',
  YOUR_FONE: '+237 6 83 17 93 94',
  description: "Let's talk about your project",
  YOUR_SERVICE_ID: 'service_c0k3d6e',
  YOUR_TEMPLATE_ID: 'template_sg4645i',
  YOUR_USER_ID: 'aVCRRYuCl7qdrvZjv',
  RESUME: '/Legha-gha_Resume.pdf',
};

const socialprofils = {
  github: 'https://github.com/Sculptor97',
  facebook: 'https://www.facebook.com/kangcmd/',
  linkedin: 'https://www.linkedin.com/in/sculptork',
  twitter: 'https://x.com/pie_ape?s=21',
};
export {
  meta,
  dataabout,
  dataportfolio,
  worktimeline,
  skills,
  services,
  introdata,
  contactConfig,
  socialprofils,
  logotext,
};
