'use client';

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  category: 'beginner' | 'intermediate' | 'advanced';
  year: number;
  link?: string;
}

const books: Book[] = [
  {
    id: '1',
    title: 'Artificial Intelligence: A Modern Approach',
    author: 'Stuart Russell & Peter Norvig',
    description: 'The definitive AI textbook, comprehensive coverage from search to ethics.',
    category: 'advanced',
    year: 2022,
    link: 'http://aima.cs.berkeley.edu'
  },
  {
    id: '2',
    title: 'Deep Learning',
    author: 'Ian Goodfellow, Yoshua Bengio & Aaron Courville',
    description: 'Foundational reference on deep neural networks, theory and practice.',
    category: 'advanced',
    year: 2016,
    link: 'https://www.deeplearningbook.org'
  },
  {
    id: '3',
    title: 'Human Compatible: Artificial Intelligence and the Problem of Control',
    author: 'Stuart Russell',
    description: 'Insightful discussion on AI alignment and ensuring machines act in our interest.',
    category: 'intermediate',
    year: 2019,
    link: 'https://en.wikipedia.org/wiki/Human_Compatible'
  },
  {
    id: '4',
    title: 'Homo Deus: A Brief History of Tomorrow',
    author: 'Yuval Noah Harari',
    description: 'Examines humanity\'s future in the age of AI and biotechnology.',
    category: 'intermediate',
    year: 2017,
    link: 'https://www.ynharari.com/book/homo-deus/'
  },
  {
    id: '4.5',
    title: 'NEXUS: A Brief History of Information Networks from the Stone Age to AI',
    author: 'Yuval Noah Harari',
    description: 'Explores humanity\'s voyage into the Information Age and how information networks have shaped our world, providing essential context for understanding today\'s AI revolution.',
    category: 'intermediate',
    year: 2025,
    link: 'https://www.ynharari.com/book/nexus/'
  },
  {
    id: '6',
    title: 'Superintelligence: Paths, Dangers, Strategies',
    author: 'Nick Bostrom',
    description: 'Seminal work on existential risks and the future of human-level AI.',
    category: 'intermediate',
    year: 2014,
    link: 'https://en.wikipedia.org/wiki/Superintelligence_(book)'
  },
  {
    id: '8',
    title: 'Weapons of Math Destruction',
    author: 'Cathy O\'Neil',
    description: 'Powerful critique of biased algorithms and unfair systems.',
    category: 'beginner',
    year: 2016,
    link: 'https://en.wikipedia.org/wiki/Weapons_of_Math_Destruction'
  },
  {
    id: '9',
    title: 'Life 3.0: Being Human in the Age of Artificial Intelligence',
    author: 'Max Tegmark',
    description: 'Explores possible futures of AI and how we might shape them to ensure beneficial outcomes for humanity.',
    category: 'intermediate',
    year: 2017,
    link: 'https://en.wikipedia.org/wiki/Life_3.0'
  },
  {
    id: '10',
    title: 'The Master Algorithm: How the Quest for the Ultimate Learning Machine Will Remake Our World',
    author: 'Pedro Domingos',
    description: 'Introduces five paradigms of machine learning and argues for a unifying master algorithm.',
    category: 'intermediate',
    year: 2015,
    link: 'https://en.wikipedia.org/wiki/The_Master_Algorithm'
  },
  {
    id: '11',
    title: 'Artificial Intelligence: A Guide for Thinking Humans',
    author: 'Melanie Mitchell',
    description: 'Offers a clear, skeptical look at what AI can and cannot do, emphasizing real-world limitations.',
    category: 'intermediate',
    year: 2019,
    link: 'https://en.wikipedia.org/wiki/Artificial_Intelligence:_A_Guide_for_Thinking_Humans'
  },
  {
    id: '12',
    title: 'The Alignment Problem: Machine Learning and Human Values',
    author: 'Brian Christian',
    description: 'Explores the challenges of aligning AI systems with human values and intentions.',
    category: 'intermediate',
    year: 2020,
    link: 'https://en.wikipedia.org/wiki/The_Alignment_Problem'
  },
  {
    id: '13',
    title: 'The Singularity Is Nearer: When We Merge with AI',
    author: 'Ray Kurzweil',
    description: 'A follow-up to The Singularity Is Near, examining the path to human-AI merger and what it means for our future.',
    category: 'intermediate',
    year: 2024,
    link: 'https://en.wikipedia.org/wiki/The_Singularity_Is_Nearer'
  }
];

const getCategoryColor = (category: Book['category']) => {
  switch (category) {
    case 'beginner':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'intermediate':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'advanced':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
  }
};

const getCategoryLabel = (category: Book['category']) => {
  switch (category) {
    case 'beginner':
      return 'Beginner';
    case 'intermediate':
      return 'Intermediate';
    case 'advanced':
      return 'Advanced';
  }
};

export default function BooksSection() {
  return (
    <section id="books" className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Recommended Books</h3>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Curated selection of essential books on artificial intelligence, machine learning, and the future of technology. 
            From beginner-friendly introductions to advanced theoretical works.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div 
              key={book.id}
              className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow border border-slate-200 dark:border-slate-700"
            >
              {/* Category Badge */}
              <div className="mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(book.category)}`}>
                  {getCategoryLabel(book.category)}
                </span>
              </div>
              
              {/* Book Info */}
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                {book.title}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                by {book.author}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-3">
                {book.description}
              </p>
              
              {/* Book Details */}
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3">
                <span>{book.year}</span>
              </div>
              
              {/* Action Link */}
              {book.link && (
                <a
                  href={book.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                >
                  Learn more →
                </a>
              )}
            </div>
          ))}
        </div>
        
        {/* Additional Info */}
        <div className="mt-12 text-center">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 max-w-2xl mx-auto">
            <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Reading Recommendations</h4>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-600 dark:text-slate-400">
              <div>
                <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                <strong>Beginner:</strong> Start with "You Look Like a Thing and I Love You"
              </div>
              <div>
                <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                <strong>Intermediate:</strong> Try "Human Compatible"
              </div>
              <div>
                <span className="inline-block w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                <strong>Advanced:</strong> Dive into "Artificial Intelligence: A Modern Approach"
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 