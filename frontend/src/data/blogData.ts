export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: 'Exam Preparation' | 'Stationery Guide' | 'Study Tips' | 'Book Recommendations';
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishedAt: string;
  readTime: string;
  coverImage: string;
  tags: string[];
  content: {
    intro: string;
    sections: {
      heading: string;
      body: string;
      bulletPoints?: string[];
    }[];
    conclusion: string;
  };
  recommendedProductIds?: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'tspsc-group-reference-books',
    slug: 'tspsc-group-reference-books',
    title: 'Top Recommended Reference Books for TSPSC Group Exams in 2025',
    excerpt: 'A comprehensive syllabus breakdown and vetted booklist for Telangana public service examinations, curated by academic toppers and local bookstore mentors.',
    category: 'Exam Preparation',
    author: {
      name: 'V. R. Sharma',
      role: 'Competitive Exams Mentor & Educator',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    publishedAt: 'October 8, 2025',
    readTime: '6 min read',
    coverImage: '/images/products/tspsc-group4-guide.jpg',
    tags: ['TSPSC', 'Telangana History', 'General Studies', 'Competitive Exams'],
    content: {
      intro: 'Preparing for Telangana State Public Service Commission (TSPSC) examinations requires disciplined subject mastery rather than collecting dozens of unfinished guides. At Sri Thirumala Store, we observe hundreds of aspirants visiting every season to consult on verified regional publications.',
      sections: [
        {
          heading: '1. Telangana History, Culture & Movement',
          body: 'This section carries significant weight across all Prelims and Mains papers. Stick strictly to standard academic authors rather than superficial summaries.',
          bulletPoints: [
            'Telangana History & Culture by Telugu Academy (standard prescribed curriculum)',
            'Telangana Movement: Statehood Struggle by V. Prakash',
            'Government of Telangana Socio-Economic Outlook latest edition'
          ]
        },
        {
          heading: '2. General Studies & Mental Ability',
          body: 'Quantitative Aptitude and Logical Reasoning can be guaranteed high-scoring zones with continuous daily problem sets.',
          bulletPoints: [
            'Quantitative Aptitude for Competitive Examinations by R.S. Aggarwal',
            'A Modern Approach to Verbal & Non-Verbal Reasoning by R.S. Aggarwal',
            'Monthly current affairs compilations with specific emphasis on state initiatives'
          ]
        },
        {
          heading: '3. Previous Question Papers & Mock Series',
          body: 'Solving previous 10-year question banks helps you recognize repeated conceptual themes and exam time constraints.'
        }
      ],
      conclusion: 'Visit Sri Thirumala General Store at Station Road, Kamareddy to inspect the latest revised editions before purchasing, or contact us on WhatsApp for syllabus consultations.'
    },
    recommendedProductIds: ['ce-1', 'ce-2']
  },
  {
    id: 'notebooks-and-pens-guide',
    slug: 'notebooks-and-pens-guide',
    title: 'How to Choose the Best Notebooks & Pens for Long Study Sessions',
    excerpt: 'Paper GSM, ruling types, smooth ink flow, and ergonomic binding: here is how the right student supplies reduce fatigue and elevate handwriting.',
    category: 'Stationery Guide',
    author: {
      name: 'P. Sai Krishna',
      role: 'Stationery Specialist at Sri Thirumala',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    },
    publishedAt: 'September 28, 2025',
    readTime: '4 min read',
    coverImage: '/images/products/classmate-notebooks.jpg',
    tags: ['Stationery', 'Notebooks', 'Classmate', 'Study Tips'],
    content: {
      intro: 'Writing hours of lecture summaries or solving hundreds of mathematical numericals daily requires paper that does not bleed and pens that prevent wrist strain.',
      sections: [
        {
          heading: 'Understanding Paper GSM (Grams per Square Metre)',
          body: 'Standard cheap notebooks often use 54-58 GSM paper, which leaks ink when using gel or fountain pens. Premium options like ITC Classmate feature 70 GSM elemental chlorine-free paper, ensuring zero bleed-through even with heavy highlighter usage.'
        },
        {
          heading: 'Binding Type: Spiral vs. Center-Stapled vs. Hardbound',
          body: 'For fast lectures, spiral notebooks lie completely flat on narrow desk benches. For end-of-year revision registers, hardbound registers keep pages protected through all terms.'
        },
        {
          heading: 'Pen Selection for Speed & Clarity',
          body: 'Ballpoint pens are best for optical OMR sheets and high-speed exams, while 0.5mm gel rollers provide crisp precision for diagrams and bulleted lecture notes.'
        }
      ],
      conclusion: 'Explore our wide range of Classmate notebook packs, practical registers, and geometry tools stocked directly at wholesale prices.'
    },
    recommendedProductIds: ['nb-1', 'nb-2', 'stat-1']
  },
  {
    id: 'class-10-ssc-board-preparation',
    slug: 'class-10-ssc-board-preparation',
    title: 'Class 10 SSC Board Preparation: Subject-wise Guide & VGS Model Papers',
    excerpt: 'Key strategies to score a perfect 10 GPA in the Telangana SSC Board examinations using NCERT foundations and VGS chapter-wise question banks.',
    category: 'Study Tips',
    author: {
      name: 'K. Sunitha Reddy',
      role: 'Senior High School Academic Advisor',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    },
    publishedAt: 'September 15, 2025',
    readTime: '5 min read',
    coverImage: '/images/products/vgs-ssc-science.jpg',
    tags: ['Class 10', 'SSC Board', 'VGS Publishing', 'NCERT'],
    content: {
      intro: 'The Class 10 Board exams mark a crucial milestone for students in Telangana. Achieving top grades requires balancing fundamental textbook theory with extensive model paper practice.',
      sections: [
        {
          heading: 'Master the Textbook First',
          body: 'Never jump directly into guides without reading the government textbook diagrams, definitions, and laboratory activities. Over 70% of board questions directly quote textbook situations.'
        },
        {
          heading: 'The Power of VGS Chapter-wise Question Banks',
          body: 'VGS publications organize questions by mark weightage (1-mark, 2-mark, 4-mark, and 8-mark questions). Reviewing these builds intuition on how examiners award step marks in Science and Mathematics.'
        },
        {
          heading: 'Timed Model Paper Solving',
          body: 'In the final 60 days before exams, solve one full 3-hour paper every weekend to build exam stamina and refine presentation skills.'
        }
      ],
      conclusion: 'Sri Thirumala is an authorised regional distributor of official VGS publications, SSC question banks, and NCERT textbooks in Kamareddy.'
    },
    recommendedProductIds: ['tb-2', 'qb-1']
  }
];
