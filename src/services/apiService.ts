import { QuizCategory, QuizQuestion } from '../types/quiz';

// Decode HTML entities commonly returned by Open Trivia DB
function decodeHtmlEntities(str: string): string {
  if (!str) return '';
  const txt = document.createElement('textarea');
  txt.innerHTML = str;
  return txt.value;
}

// Built-in curated categories matching OpenTDB + Custom Flutter Track
export const APP_CATEGORIES: QuizCategory[] = [
  {
    id: 'flutter_dart',
    name: 'Flutter & Dart',
    description: 'Widgets, state management, provider, and Dart language fundamentals.',
    iconName: 'Smartphone',
    color: '#0284c7', // Sky Blue
    questionCount: 8,
  },
  {
    id: 'general_knowledge',
    name: 'General Knowledge',
    apiCategoryId: 9,
    description: 'Everyday trivia, world facts, inventions, and cultural milestones.',
    iconName: 'Globe',
    color: '#6366f1', // Indigo
    questionCount: 10,
  },
  {
    id: 'science_computers',
    name: 'Computer Science',
    apiCategoryId: 18,
    description: 'Hardware, software architectures, algorithms, and tech evolution.',
    iconName: 'Laptop',
    color: '#10b981', // Emerald
    questionCount: 10,
  },
  {
    id: 'science_nature',
    name: 'Science & Nature',
    apiCategoryId: 17,
    description: 'Physics, biology, astronomy, chemistry, and our natural cosmos.',
    iconName: 'Atom',
    color: '#06b6d4', // Cyan
    questionCount: 10,
  },
  {
    id: 'geography',
    name: 'Geography',
    apiCategoryId: 22,
    description: 'Continents, capitals, mountains, rivers, and global landmarks.',
    iconName: 'Compass',
    color: '#f59e0b', // Amber
    questionCount: 10,
  },
  {
    id: 'history',
    name: 'History',
    apiCategoryId: 23,
    description: 'Ancient empires, pivotal world events, and historic leaders.',
    iconName: 'Hourglass',
    color: '#8b5cf6', // Violet
    questionCount: 10,
  },
  {
    id: 'custom_created',
    name: 'My Custom Questions',
    description: 'Questions crafted directly by you and saved on this Android device.',
    iconName: 'Sparkles',
    color: '#ec4899', // Pink
    questionCount: 5,
  }
];

// Offline backup questions if OpenTDB times out or rate limits
const OFFLINE_FALLBACKS: Record<string, QuizQuestion[]> = {
  general_knowledge: [
    {
      id: 'gk_1',
      question: 'What is the largest organ in the human body?',
      category: 'General Knowledge',
      options: ['Skin', 'Liver', 'Brain', 'Heart'],
      correctAnswer: 'Skin',
      explanation: 'Skin is the largest organ, covering roughly 2 square meters in adults.',
      difficulty: 'easy'
    },
    {
      id: 'gk_2',
      question: 'Which country is known as the Land of the Rising Sun?',
      category: 'General Knowledge',
      options: ['Japan', 'China', 'South Korea', 'Thailand'],
      correctAnswer: 'Japan',
      explanation: 'Nihon/Nippon (Japan) translates literally to "sun origin", hence "Land of the Rising Sun".',
      difficulty: 'easy'
    },
    {
      id: 'gk_3',
      question: 'How many time zones are there in Russia?',
      category: 'General Knowledge',
      options: ['11', '9', '7', '13'],
      correctAnswer: '11',
      explanation: 'Russia stretches across 11 standard time zones from Kaliningrad to Kamchatka.',
      difficulty: 'medium'
    },
    {
      id: 'gk_4',
      question: 'What is the national flower of India?',
      category: 'General Knowledge',
      options: ['Lotus', 'Rose', 'Marigold', 'Jasmine'],
      correctAnswer: 'Lotus',
      explanation: 'The Nelumbo Nucifera (Lotus) is the sacred and national flower of India.',
      difficulty: 'easy'
    },
    {
      id: 'gk_5',
      question: 'What color is the "Black Box" flight data recorder in commercial aircraft?',
      category: 'General Knowledge',
      options: ['Bright Orange', 'Black', 'Yellow', 'White'],
      correctAnswer: 'Bright Orange',
      explanation: 'Flight recorders are painted high-visibility bright orange to aid underwater and terrain recovery.',
      difficulty: 'easy'
    }
  ],
  science_computers: [
    {
      id: 'cs_1',
      question: 'What does CPU stand for in computer hardware?',
      category: 'Computer Science',
      options: ['Central Processing Unit', 'Central Process Utility', 'Computer Power Unit', 'Core Processing Utility'],
      correctAnswer: 'Central Processing Unit',
      explanation: 'The CPU is often referred to as the electronic brain that executes program instructions.',
      difficulty: 'easy'
    },
    {
      id: 'cs_2',
      question: 'Which protocol is used for secure encrypted hypertext transfer across the World Wide Web?',
      category: 'Computer Science',
      options: ['HTTPS', 'HTTP', 'FTP', 'SMTP'],
      correctAnswer: 'HTTPS',
      explanation: 'HTTPS encrypts communication between the browser and web server using TLS/SSL.',
      difficulty: 'easy'
    },
    {
      id: 'cs_3',
      question: 'What data structure follows the First-In, First-Out (FIFO) principle?',
      category: 'Computer Science',
      options: ['Queue', 'Stack', 'Binary Tree', 'Graph'],
      correctAnswer: 'Queue',
      explanation: 'A Queue processes elements in arrival order (FIFO), whereas a Stack is LIFO.',
      difficulty: 'easy'
    },
    {
      id: 'cs_4',
      question: 'In object-oriented programming, what concept allows a child class to take on fields and methods of a parent class?',
      category: 'Computer Science',
      options: ['Inheritance', 'Encapsulation', 'Polymorphism', 'Abstraction'],
      correctAnswer: 'Inheritance',
      explanation: 'Inheritance enables hierarchical class structures where subclasses inherit behavior.',
      difficulty: 'easy'
    },
    {
      id: 'cs_5',
      question: 'What is the average time complexity of searching a balanced Binary Search Tree (BST)?',
      category: 'Computer Science',
      options: ['O(log n)', 'O(n)', 'O(1)', 'O(n^2)'],
      correctAnswer: 'O(log n)',
      explanation: 'Searching a balanced BST splits search space in half each step, giving O(log n).',
      difficulty: 'medium'
    }
  ],
  flutter_dart: [
    {
      id: 'fl_1',
      question: 'Which method must be implemented by every Flutter widget to describe its UI?',
      category: 'Flutter & Dart',
      options: ['build()', 'create()', 'render()', 'paint()'],
      correctAnswer: 'build()',
      explanation: 'The build(BuildContext context) method describes the part of the user interface represented by the widget.',
      difficulty: 'easy'
    },
    {
      id: 'fl_2',
      question: 'Which package is the official and most widely used state management solution recommended by the Flutter team for moderate-to-large apps?',
      category: 'Flutter & Dart',
      options: ['Provider', 'Redux', 'MobX', 'ScaffoldCore'],
      correctAnswer: 'Provider',
      explanation: 'Provider is a wrapper around InheritedWidget that makes state management clean, testable, and reactive.',
      difficulty: 'easy'
    },
    {
      id: 'fl_3',
      question: 'What is the file extension used for Flutter and Dart source code files?',
      category: 'Flutter & Dart',
      options: ['.dart', '.flutter', '.fl', '.dt'],
      correctAnswer: '.dart',
      explanation: 'Flutter applications are written in the Dart language and use the .dart file extension.',
      difficulty: 'easy'
    },
    {
      id: 'fl_4',
      question: 'What is the purpose of the pubspec.yaml file in a Flutter project?',
      category: 'Flutter & Dart',
      options: [
        'Manages app dependencies, assets, fonts, and project metadata',
        'Compiles Dart into native machine code directly',
        'Configures Android device USB debugging permissions',
        'Stores encrypted user credentials securely on disk'
      ],
      correctAnswer: 'Manages app dependencies, assets, fonts, and project metadata',
      explanation: 'pubspec.yaml specifies dependencies, Flutter SDK constraints, image assets, and custom fonts.',
      difficulty: 'easy'
    },
    {
      id: 'fl_5',
      question: 'In Flutter, what is the difference between StatelessWidget and StatefulWidget?',
      category: 'Flutter & Dart',
      options: [
        'StatelessWidget is immutable; StatefulWidget maintains mutable state that can trigger rebuilds via setState()',
        'StatelessWidget can only render text; StatefulWidget can render images',
        'StatelessWidget runs on iOS; StatefulWidget runs on Android',
        'StatelessWidget does not have a build method'
      ],
      correctAnswer: 'StatelessWidget is immutable; StatefulWidget maintains mutable state that can trigger rebuilds via setState()',
      explanation: 'StatefulWidget has an associated State object that persists across widget rebuilds and can invoke setState().',
      difficulty: 'medium'
    }
  ]
};

export const apiService = {
  // Fetch questions from Open Trivia DB or fallback
  async fetchQuestions(
    category: QuizCategory,
    customQuestions: QuizQuestion[],
    amount: number = 5
  ): Promise<{ questions: QuizQuestion[]; source: 'api' | 'custom' | 'offline_cache'; error?: string }> {
    // 1. If user selected My Custom Questions category
    if (category.id === 'custom_created') {
      const filtered = customQuestions;
      if (filtered.length === 0) {
        return {
          questions: [],
          source: 'custom',
          error: 'No custom questions added yet. Tap "Add Question" to create your first quiz question!',
        };
      }
      return {
        questions: this.shuffleArray([...filtered]),
        source: 'custom',
      };
    }

    // 2. If user selected Flutter & Dart category (custom local pool + any user custom in that category)
    if (category.id === 'flutter_dart') {
      const userCustom = customQuestions.filter((q) => q.category === 'Flutter & Dart');
      const seedList = OFFLINE_FALLBACKS.flutter_dart || [];
      const combined = [...userCustom, ...seedList];
      return {
        questions: this.shuffleArray(combined).slice(0, Math.min(amount, combined.length)),
        source: 'custom',
      };
    }

    // 3. For public OpenTDB categories, attempt network fetch
    if (category.apiCategoryId) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

        const url = `https://opentdb.com/api.php?amount=${amount}&category=${category.apiCategoryId}&type=multiple`;
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          if (data.response_code === 0 && Array.isArray(data.results) && data.results.length > 0) {
            const formatted: QuizQuestion[] = data.results.map((item: { question: string; category: string; correct_answer: string; incorrect_answers: string[]; difficulty?: string }, idx: number) => {
              const correct = decodeHtmlEntities(item.correct_answer);
              const incorrect = item.incorrect_answers.map((ans: string) => decodeHtmlEntities(ans));
              const allOptions = this.shuffleArray([correct, ...incorrect]);

              return {
                id: `api_${category.id}_${idx}_${Date.now()}`,
                question: decodeHtmlEntities(item.question),
                category: category.name,
                options: allOptions,
                correctAnswer: correct,
                difficulty: (item.difficulty as 'easy' | 'medium' | 'hard') || 'medium',
              };
            });

            return {
              questions: formatted,
              source: 'api',
            };
          }
        }
      } catch (err) {
        console.warn('OpenTDB public API call failed or timed out. Engaging verified offline database fallback.', err);
      }
    }

    // 4. Fallback to verified local offline questions pool
    const fallbackList = OFFLINE_FALLBACKS[category.id] || OFFLINE_FALLBACKS.general_knowledge;
    // Mix in any user custom questions matching category
    const matchingCustom = customQuestions.filter((q) => q.category.toLowerCase().includes(category.name.toLowerCase()));
    const finalPool = [...matchingCustom, ...fallbackList];

    return {
      questions: this.shuffleArray(finalPool).slice(0, Math.min(amount, finalPool.length)),
      source: 'offline_cache',
    };
  },

  shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
};
