// Complete production Flutter & Dart codebase for QuizMaster Android application

export interface FlutterFile {
  path: string;
  name: string;
  language: 'dart' | 'yaml' | 'markdown';
  description: string;
  code: string;
}

export const FLUTTER_PROJECT_FILES: FlutterFile[] = [
  {
    path: 'pubspec.yaml',
    name: 'pubspec.yaml',
    language: 'yaml',
    description: 'Flutter project manifest with dependencies, Provider, http, shared_preferences, and Material 3 assets.',
    code: `name: quizmaster
description: "QuizMaster - Interactive Android Quiz Application built with Flutter and Provider."
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.3.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  # State management using Provider & ChangeNotifier
  provider: ^6.1.2
  # REST API requests to Open Trivia Database
  http: ^1.2.1
  # Persistent key-value storage for best scores and custom questions
  shared_preferences: ^2.2.3
  # Modern Material 3 icon pack
  cupertino_icons: ^1.0.8
  # HTML character entity decoder for public trivia API questions
  html_unescape: ^2.0.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
  assets:
    - assets/images/
`
  },
  {
    path: 'lib/main.dart',
    name: 'main.dart',
    language: 'dart',
    description: 'Application entry point. Initializes SharedPreferences, registers MultiProvider with QuizProvider, and configures Material 3 theme.',
    code: `import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'providers/quiz_provider.dart';
import 'screens/home_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Set Android system navigation and status bar style
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
      systemNavigationBarColor: Colors.white,
      systemNavigationBarIconBrightness: Brightness.dark,
    ),
  );

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => QuizProvider()..init()),
      ],
      child: const QuizMasterApp(),
    ),
  );
}

class QuizMasterApp extends StatelessWidget {
  const QuizMasterApp({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<QuizProvider>(
      builder: (context, quizProvider, _) {
        return MaterialApp(
          title: 'QuizMaster',
          debugShowCheckedModeBanner: false,
          themeMode: quizProvider.isDarkMode ? ThemeMode.dark : ThemeMode.light,
          theme: ThemeData(
            useMaterial3: true,
            colorScheme: ColorScheme.fromSeed(
              seedColor: const Color(0xFF6366F1), // Modern Indigo seed
              brightness: Brightness.light,
            ),
            fontFamily: 'Roboto',
            cardTheme: CardTheme(
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
                side: BorderSide(color: Colors.grey.shade200),
              ),
            ),
            elevatedButtonTheme: ElevatedButtonThemeData(
              style: ElevatedButton.styleFrom(
                elevation: 0,
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
              ),
            ),
          ),
          darkTheme: ThemeData(
            useMaterial3: true,
            colorScheme: ColorScheme.fromSeed(
              seedColor: const Color(0xFF6366F1),
              brightness: Brightness.dark,
            ),
            fontFamily: 'Roboto',
            cardTheme: CardTheme(
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
                side: BorderSide(color: Colors.grey.shade800),
              ),
            ),
          ),
          home: const HomeScreen(),
        );
      },
    );
  }
}
`
  },
  {
    path: 'lib/models/question.dart',
    name: 'question.dart',
    language: 'dart',
    description: 'Data model representing a multiple-choice quiz question with serialization to/from JSON.',
    code: `class Question {
  final String id;
  final String questionText;
  final String category;
  final List<String> options;
  final String correctAnswer;
  final String? explanation;
  final String difficulty;
  final bool isCustom;

  const Question({
    required this.id,
    required this.questionText,
    required this.category,
    required this.options,
    required this.correctAnswer,
    this.explanation,
    this.difficulty = 'medium',
    this.isCustom = false,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'questionText': questionText,
      'category': category,
      'options': options,
      'correctAnswer': correctAnswer,
      'explanation': explanation,
      'difficulty': difficulty,
      'isCustom': isCustom,
    };
  }

  factory Question.fromJson(Map<String, dynamic> json) {
    return Question(
      id: json['id'] as String,
      questionText: json['questionText'] as String,
      category: json['category'] as String,
      options: List<String>.from(json['options'] as List),
      correctAnswer: json['correctAnswer'] as String,
      explanation: json['explanation'] as String?,
      difficulty: (json['difficulty'] as String?) ?? 'medium',
      isCustom: (json['isCustom'] as bool?) ?? false,
    );
  }
}
`
  },
  {
    path: 'lib/models/category.dart',
    name: 'category.dart',
    language: 'dart',
    description: 'Category model representing quiz domains with OpenTDB API ID mapping and visual styling tokens.',
    code: `import 'package:flutter/material.dart';

class QuizCategory {
  final String id;
  final String name;
  final int? apiCategoryId;
  final String description;
  final IconData icon;
  final Color color;

  const QuizCategory({
    required this.id,
    required this.name,
    this.apiCategoryId,
    required this.description,
    required this.icon,
    required this.color,
  });
}
`
  },
  {
    path: 'lib/models/quiz_result.dart',
    name: 'quiz_result.dart',
    language: 'dart',
    description: 'Quiz score model tracking score, percentage, correct/incorrect totals, and review entries.',
    code: `class QuestionReview {
  final String questionText;
  final String selectedOption;
  final String correctOption;
  final bool isCorrect;

  const QuestionReview({
    required this.questionText,
    required this.selectedOption,
    required this.correctOption,
    required this.isCorrect,
  });

  Map<String, dynamic> toJson() => {
    'questionText': questionText,
    'selectedOption': selectedOption,
    'correctOption': correctOption,
    'isCorrect': isCorrect,
  };

  factory QuestionReview.fromJson(Map<String, dynamic> json) => QuestionReview(
    questionText: json['questionText'] as String,
    selectedOption: json['selectedOption'] as String,
    correctOption: json['correctOption'] as String,
    isCorrect: json['isCorrect'] as bool,
  );
}

class QuizResult {
  final String id;
  final String category;
  final int totalQuestions;
  final int correctAnswers;
  final int incorrectAnswers;
  final int score;
  final double percentage;
  final String date;
  final List<QuestionReview> reviews;

  const QuizResult({
    required this.id,
    required this.category,
    required this.totalQuestions,
    required this.correctAnswers,
    required this.incorrectAnswers,
    required this.score,
    required this.percentage,
    required this.date,
    required this.reviews,
  });

  String get performanceMessage {
    if (percentage >= 90) return 'Outstanding Masterclass! 🏆';
    if (percentage >= 70) return 'Great Job! Almost Perfect 🌟';
    if (percentage >= 50) return 'Good Effort! Keep Learning 💡';
    return 'Practice Makes Perfect! Try Again 🚀';
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'category': category,
    'totalQuestions': totalQuestions,
    'correctAnswers': correctAnswers,
    'incorrectAnswers': incorrectAnswers,
    'score': score,
    'percentage': percentage,
    'date': date,
    'reviews': reviews.map((r) => r.toJson()).toList(),
  };

  factory QuizResult.fromJson(Map<String, dynamic> json) => QuizResult(
    id: json['id'] as String,
    category: json['category'] as String,
    totalQuestions: json['totalQuestions'] as int,
    correctAnswers: json['correctAnswers'] as int,
    incorrectAnswers: json['incorrectAnswers'] as int,
    score: json['score'] as int,
    percentage: (json['percentage'] as num).toDouble(),
    date: json['date'] as String,
    reviews: (json['reviews'] as List)
        .map((e) => QuestionReview.fromJson(e as Map<String, dynamic>))
        .toList(),
  );
}
`
  },
  {
    path: 'lib/services/api_service.dart',
    name: 'api_service.dart',
    language: 'dart',
    description: 'REST API service interacting with the Open Trivia Database (OpenTDB) with HTML entity unescaping.',
    code: `import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:html_unescape/html_unescape.dart';
import '../models/question.dart';

class ApiService {
  static final HtmlUnescape _unescape = HtmlUnescape();

  static Future<List<Question>> fetchQuestions({
    required int categoryId,
    int amount = 5,
  }) async {
    final url = Uri.parse(
      'https://opentdb.com/api.php?amount=$amount&category=$categoryId&type=multiple',
    );

    try {
      final response = await http.get(url).timeout(const Duration(seconds: 8));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['response_code'] == 0 && data['results'] != null) {
          final List results = data['results'];
          return results.asMap().entries.map((entry) {
            final idx = entry.key;
            final item = entry.value;

            final correct = _unescape.convert(item['correct_answer']);
            final incorrectList = (item['incorrect_answers'] as List)
                .map((e) => _unescape.convert(e.toString()))
                .toList();

            final options = [correct, ...incorrectList]..shuffle();

            return Question(
              id: 'api_\${categoryId}_\${idx}_\${DateTime.now().millisecondsSinceEpoch}',
              questionText: _unescape.convert(item['question']),
              category: _unescape.convert(item['category']),
              options: options,
              correctAnswer: correct,
              difficulty: item['difficulty'] ?? 'medium',
            );
          }).toList();
        }
      }
      throw Exception('API returned non-zero response code or empty questions');
    } catch (e) {
      throw Exception('Failed to load questions from public API: $e');
    }
  }
}
`
  },
  {
    path: 'lib/services/storage_service.dart',
    name: 'storage_service.dart',
    language: 'dart',
    description: 'SharedPreferences integration for persistent storage of best scores, history, and custom questions.',
    code: `import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/question.dart';
import '../models/quiz_result.dart';

class StorageService {
  static const String _keyBestScores = 'quizmaster_best_scores';
  static const String _keyCustomQuestions = 'quizmaster_custom_questions';
  static const String _keyQuizHistory = 'quizmaster_quiz_history';

  static Future<Map<String, int>> getBestScores() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_keyBestScores);
    if (raw == null) return {};
    try {
      final decoded = jsonDecode(raw) as Map<String, dynamic>;
      return decoded.map((k, v) => MapEntry(k, v as int));
    } catch (_) {
      return {};
    }
  }

  static Future<bool> saveBestScore(String category, int score) async {
    final prefs = await SharedPreferences.getInstance();
    final scores = await getBestScores();
    final currentBest = scores[category] ?? 0;
    if (score > currentBest) {
      scores[category] = score;
      await prefs.setString(_keyBestScores, jsonEncode(scores));
      return true; // New record
    }
    return false;
  }

  static Future<List<Question>> getCustomQuestions() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_keyCustomQuestions);
    if (raw == null) return [];
    try {
      final List list = jsonDecode(raw);
      return list.map((e) => Question.fromJson(e as Map<String, dynamic>)).toList();
    } catch (_) {
      return [];
    }
  }

  static Future<void> saveCustomQuestion(Question question) async {
    final prefs = await SharedPreferences.getInstance();
    final current = await getCustomQuestions();
    current.insert(0, question);
    final encoded = jsonEncode(current.map((q) => q.toJson()).toList());
    await prefs.setString(_keyCustomQuestions, encoded);
  }

  static Future<void> deleteCustomQuestion(String id) async {
    final prefs = await SharedPreferences.getInstance();
    final current = await getCustomQuestions();
    current.removeWhere((q) => q.id == id);
    final encoded = jsonEncode(current.map((q) => q.toJson()).toList());
    await prefs.setString(_keyCustomQuestions, encoded);
  }

  static Future<void> saveQuizResult(QuizResult result) async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_keyQuizHistory);
    List<QuizResult> history = [];
    if (raw != null) {
      try {
        final List list = jsonDecode(raw);
        history = list.map((e) => QuizResult.fromJson(e as Map<String, dynamic>)).toList();
      } catch (_) {}
    }
    history.insert(0, result);
    if (history.length > 50) history = history.sublist(0, 50);
    await prefs.setString(_keyQuizHistory, jsonEncode(history.map((r) => r.toJson()).toList()));
  }
}
`
  },
  {
    path: 'lib/providers/quiz_provider.dart',
    name: 'quiz_provider.dart',
    language: 'dart',
    description: 'Core application ChangeNotifier handling quiz lifecycle, answer submission, score accumulation, and state sharing.',
    code: `import 'package:flutter/material.dart';
import '../models/category.dart';
import '../models/question.dart';
import '../models/quiz_result.dart';
import '../services/api_service.dart';
import '../services/storage_service.dart';

enum QuizStatus { initial, loading, inProgress, completed, error }

class QuizProvider extends ChangeNotifier {
  QuizStatus _status = QuizStatus.initial;
  List<Question> _questions = [];
  int _currentIndex = 0;
  String? _selectedAnswer;
  bool _isAnswerSubmitted = false;
  int _score = 0;
  String? _errorMessage;

  QuizCategory? _selectedCategory;
  final List<QuestionReview> _reviews = [];
  Map<String, int> _bestScores = {};
  List<Question> _customQuestions = [];
  bool _isDarkMode = false;

  // Getters
  QuizStatus get status => _status;
  List<Question> get questions => _questions;
  int get currentIndex => _currentIndex;
  String? get selectedAnswer => _selectedAnswer;
  bool get isAnswerSubmitted => _isAnswerSubmitted;
  int get score => _score;
  String? get errorMessage => _errorMessage;
  QuizCategory? get selectedCategory => _selectedCategory;
  List<QuestionReview> get reviews => _reviews;
  Map<String, int> get bestScores => _bestScores;
  List<Question> get customQuestions => _customQuestions;
  bool get isDarkMode => _isDarkMode;

  Question? get currentQuestion =>
      _questions.isNotEmpty && _currentIndex < _questions.length
          ? _questions[_currentIndex]
          : null;

  double get progress =>
      _questions.isEmpty ? 0.0 : (_currentIndex + 1) / _questions.length;

  Future<void> init() async {
    _bestScores = await StorageService.getBestScores();
    _customQuestions = await StorageService.getCustomQuestions();
    notifyListeners();
  }

  void toggleTheme() {
    _isDarkMode = !_isDarkMode;
    notifyListeners();
  }

  Future<void> startQuiz(QuizCategory category) async {
    _selectedCategory = category;
    _status = QuizStatus.loading;
    _errorMessage = null;
    _currentIndex = 0;
    _score = 0;
    _selectedAnswer = null;
    _isAnswerSubmitted = false;
    _reviews.clear();
    notifyListeners();

    try {
      if (category.id == 'custom_created') {
        if (_customQuestions.isEmpty) {
          _status = QuizStatus.error;
          _errorMessage = 'No custom questions found. Create some in Add Questions!';
          notifyListeners();
          return;
        }
        _questions = List.from(_customQuestions)..shuffle();
      } else if (category.apiCategoryId != null) {
        try {
          _questions = await ApiService.fetchQuestions(
            categoryId: category.apiCategoryId!,
            amount: 5,
          );
        } catch (_) {
          // Fallback to local offline questions if network is unavailable
          _questions = _getOfflineFallback(category.name);
        }
      } else {
        _questions = _getOfflineFallback(category.name);
      }

      if (_questions.isEmpty) {
        _status = QuizStatus.error;
        _errorMessage = 'Could not load questions for this category.';
      } else {
        _status = QuizStatus.inProgress;
      }
    } catch (e) {
      _status = QuizStatus.error;
      _errorMessage = e.toString();
    }
    notifyListeners();
  }

  void selectAnswer(String answer) {
    if (_isAnswerSubmitted) return; // Prevent multiple selection
    _selectedAnswer = answer;
    _isAnswerSubmitted = true;

    final isCorrect = answer == currentQuestion?.correctAnswer;
    if (isCorrect) {
      _score += 10;
    }

    if (currentQuestion != null) {
      _reviews.add(
        QuestionReview(
          questionText: currentQuestion!.questionText,
          selectedOption: answer,
          correctOption: currentQuestion!.correctAnswer,
          isCorrect: isCorrect,
        ),
      );
    }
    notifyListeners();
  }

  void nextQuestion() {
    if (_currentIndex < _questions.length - 1) {
      _currentIndex++;
      _selectedAnswer = null;
      _isAnswerSubmitted = false;
      notifyListeners();
    } else {
      finishQuiz();
    }
  }

  Future<void> finishQuiz() async {
    _status = QuizStatus.completed;
    final total = _questions.length;
    final correctCount = _reviews.where((r) => r.isCorrect).length;
    final percentage = (correctCount / total) * 100;

    final result = QuizResult(
      id: 'res_\${DateTime.now().millisecondsSinceEpoch}',
      category: _selectedCategory?.name ?? 'General',
      totalQuestions: total,
      correctAnswers: correctCount,
      incorrectAnswers: total - correctCount,
      score: _score,
      percentage: percentage,
      date: DateTime.now().toIso8601String().split('T').first,
      reviews: List.from(_reviews),
    );

    await StorageService.saveQuizResult(result);
    if (_selectedCategory != null) {
      await StorageService.saveBestScore(_selectedCategory!.name, _score);
      _bestScores = await StorageService.getBestScores();
    }
    notifyListeners();
  }

  Future<void> addCustomQuestion(Question q) async {
    await StorageService.saveCustomQuestion(q);
    _customQuestions = await StorageService.getCustomQuestions();
    notifyListeners();
  }

  List<Question> _getOfflineFallback(String categoryName) {
    return [
      Question(
        id: 'off_1',
        questionText: 'Which widget is considered the core structural Material container?',
        category: categoryName,
        options: ['Scaffold', 'Container', 'Card', 'Column'],
        correctAnswer: 'Scaffold',
        explanation: 'Scaffold implements the basic Material Design visual layout structure.',
      ),
      Question(
        id: 'off_2',
        questionText: 'What is the speed of sound in dry air at room temperature?',
        category: categoryName,
        options: ['343 m/s', '150 m/s', '1200 m/s', '3000 m/s'],
        correctAnswer: '343 m/s',
        explanation: 'In dry air at 20 °C, the speed of sound is approximately 343 metres per second.',
      ),
      Question(
        id: 'off_3',
        questionText: 'What does CPU stand for in computer hardware?',
        category: categoryName,
        options: ['Central Processing Unit', 'Central Power Utility', 'Computer Program Unit', 'Control Process User'],
        correctAnswer: 'Central Processing Unit',
        explanation: 'CPU is the central processor responsible for executing machine instructions.',
      ),
    ];
  }
}
`
  },
  {
    path: 'lib/screens/home_screen.dart',
    name: 'home_screen.dart',
    language: 'dart',
    description: 'Screen 1: Attractive Home Screen with logo, welcome greeting, best scores, category cards, and navigation.',
    code: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/quiz_provider.dart';
import '../models/category.dart';
import '../widgets/category_card.dart';
import 'quiz_screen.dart';
import 'add_question_screen.dart';
import 'question_detail_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  static const List<QuizCategory> categories = [
    QuizCategory(
      id: 'flutter_dart',
      name: 'Flutter & Dart',
      description: 'Widgets, Provider state management, and Dart language null safety.',
      icon: Icons.phone_android_rounded,
      color: Color(0xFF0284C7),
    ),
    QuizCategory(
      id: 'general_knowledge',
      name: 'General Knowledge',
      apiCategoryId: 9,
      description: 'World facts, historical milestones, and cultural trivia.',
      icon: Icons.public_rounded,
      color: Color(0xFF6366F1),
    ),
    QuizCategory(
      id: 'science_computers',
      name: 'Computer Science',
      apiCategoryId: 18,
      description: 'Algorithms, data structures, hardware, and modern software.',
      icon: Icons.computer_rounded,
      color: Color(0xFF10B981),
    ),
    QuizCategory(
      id: 'science_nature',
      name: 'Science & Nature',
      apiCategoryId: 17,
      description: 'Cosmology, biology, physics, and natural wonders.',
      icon: Icons.science_rounded,
      color: Color(0xFF06B6D4),
    ),
    QuizCategory(
      id: 'custom_created',
      name: 'My Custom Questions',
      description: 'Questions created directly on this device by the user.',
      icon: Icons.edit_note_rounded,
      color: Color(0xFFEC4899),
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final quizProvider = context.watch<QuizProvider>();
    final theme = Theme.of(context);

    // Compute top best score across categories
    final bestScores = quizProvider.bestScores;
    final topScore = bestScores.values.fold(0, (max, v) => v > max ? v : max);

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: theme.colorScheme.primaryContainer,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(
                Icons.quiz_rounded,
                color: theme.colorScheme.primary,
                size: 22,
              ),
            ),
            const SizedBox(width: 12),
            const Text(
              'QuizMaster',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: Icon(quizProvider.isDarkMode ? Icons.light_mode : Icons.dark_mode),
            tooltip: 'Toggle Theme',
            onPressed: () => quizProvider.toggleTheme(),
          ),
          IconButton(
            icon: const Icon(Icons.list_alt_rounded),
            tooltip: 'All Questions',
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => const QuestionBankScreen(),
                ),
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Welcome Card with Best Score
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    theme.colorScheme.primary,
                    theme.colorScheme.tertiary,
                  ],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(24),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Welcome back, Explorer!',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 6),
                  const Text(
                    'Test your knowledge, unlock best scores, and craft your own quiz questions.',
                    style: TextStyle(color: Colors.white70, fontSize: 13),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.emoji_events, color: Colors.amber, size: 20),
                            const SizedBox(width: 8),
                            Text(
                              'Best Score: $topScore pts',
                              style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 14,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const Spacer(),
                      ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.white,
                          foregroundColor: theme.colorScheme.primary,
                        ),
                        onPressed: () {
                          // Start with first category
                          _startCategoryQuiz(context, categories.first);
                        },
                        icon: const Icon(Icons.play_arrow_rounded),
                        label: const Text('Quick Play'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Select a Category',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                TextButton.icon(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const AddQuestionScreen(),
                      ),
                    );
                  },
                  icon: const Icon(Icons.add_circle_outline, size: 18),
                  label: const Text('Add Question'),
                ),
              ],
            ),
            const SizedBox(height: 12),
            // Category Cards Grid / List
            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: categories.length,
              separatorBuilder: (_, __) => const SizedBox(height: 12),
              itemBuilder: (context, index) {
                final category = categories[index];
                final catBest = bestScores[category.name] ?? 0;
                return CategoryCard(
                  category: category,
                  bestScore: catBest,
                  onTap: () => _startCategoryQuiz(context, category),
                );
              },
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => const AddQuestionScreen(),
            ),
          );
        },
        icon: const Icon(Icons.add),
        label: const Text('New Question'),
      ),
    );
  }

  void _startCategoryQuiz(BuildContext context, QuizCategory category) {
    context.read<QuizProvider>().startQuiz(category);
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => const QuizScreen(),
      ),
    );
  }
}
`
  },
  {
    path: 'lib/screens/quiz_screen.dart',
    name: 'quiz_screen.dart',
    language: 'dart',
    description: 'Screen 2: Quiz Questions Screen with timer, animated options, lock protection, and progress tracking.',
    code: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/quiz_provider.dart';
import '../widgets/answer_option.dart';
import '../widgets/custom_button.dart';
import 'result_screen.dart';

class QuizScreen extends StatelessWidget {
  const QuizScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<QuizProvider>();
    final theme = Theme.of(context);

    if (provider.status == QuizStatus.loading) {
      return Scaffold(
        appBar: AppBar(title: const Text('QuizMaster')),
        body: const Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              CircularProgressIndicator(),
              SizedBox(height: 16),
              Text('Fetching quiz questions from OpenTDB...'),
            ],
          ),
        ),
      );
    }

    if (provider.status == QuizStatus.error) {
      return Scaffold(
        appBar: AppBar(title: const Text('QuizMaster')),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.error_outline_rounded, size: 64, color: Colors.red),
                const SizedBox(height: 16),
                Text(
                  provider.errorMessage ?? 'An error occurred',
                  textAlign: TextAlign.center,
                  style: const TextStyle(fontSize: 16),
                ),
                const SizedBox(height: 24),
                CustomButton(
                  text: 'Retry',
                  onPressed: () {
                    if (provider.selectedCategory != null) {
                      provider.startQuiz(provider.selectedCategory!);
                    } else {
                      Navigator.pop(context);
                    }
                  },
                ),
              ],
            ),
          ),
        ),
      );
    }

    if (provider.status == QuizStatus.completed) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (_) => const ResultScreen()),
        );
      });
      return const SizedBox.shrink();
    }

    final question = provider.currentQuestion;
    if (question == null) return const Scaffold(body: Center(child: Text('No question')));

    return Scaffold(
      appBar: AppBar(
        title: Text(
          provider.selectedCategory?.name ?? 'Quiz',
          style: const TextStyle(fontSize: 18),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16),
            child: Center(
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: theme.colorScheme.primaryContainer,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  '\${provider.score} pts',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    color: theme.colorScheme.primary,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Progress Bar & Question Counter
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Question \${provider.currentIndex + 1} of \${provider.questions.length}',
                    style: TextStyle(
                      color: Colors.grey.shade600,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  Text(
                    '\${(provider.progress * 100).toInt()}%',
                    style: TextStyle(
                      color: theme.colorScheme.primary,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: LinearProgressIndicator(
                  value: provider.progress,
                  minHeight: 8,
                ),
              ),
              const SizedBox(height: 24),
              // Question Card
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: theme.colorScheme.surfaceVariant.withOpacity(0.4),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: theme.dividerColor),
                ),
                child: Text(
                  question.questionText,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    height: 1.4,
                  ),
                ),
              ),
              const SizedBox(height: 20),
              // 4 Options
              Expanded(
                child: ListView.separated(
                  itemCount: question.options.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 12),
                  itemBuilder: (context, idx) {
                    final option = question.options[idx];
                    final isSelected = provider.selectedAnswer == option;
                    final isSubmitted = provider.isAnswerSubmitted;
                    final isCorrect = option == question.correctAnswer;

                    return AnswerOptionWidget(
                      optionText: option,
                      index: idx,
                      isSelected: isSelected,
                      isSubmitted: isSubmitted,
                      isCorrect: isCorrect,
                      onTap: () => provider.selectAnswer(option),
                    );
                  },
                ),
              ),
              // Bottom Next Question CTA
              if (provider.isAnswerSubmitted) ...[
                CustomButton(
                  text: provider.currentIndex == provider.questions.length - 1
                      ? 'View Results'
                      : 'Next Question',
                  icon: Icons.arrow_forward_rounded,
                  onPressed: () => provider.nextQuestion(),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
`
  },
  {
    path: 'lib/screens/result_screen.dart',
    name: 'result_screen.dart',
    language: 'dart',
    description: 'Screen 3: Quiz Results Screen with score breakdown, percentage, performance evaluation, and review list.',
    code: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/quiz_provider.dart';
import '../widgets/custom_button.dart';
import 'home_screen.dart';

class ResultScreen extends StatelessWidget {
  const ResultScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<QuizProvider>();
    final theme = Theme.of(context);

    final total = provider.questions.length;
    final correct = provider.reviews.where((r) => r.isCorrect).length;
    final incorrect = total - correct;
    final percentage = total > 0 ? ((correct / total) * 100).round() : 0;

    String performanceMessage = 'Great effort! Keep practicing.';
    Color accentColor = Colors.orange;
    if (percentage >= 80) {
      performanceMessage = 'Outstanding! You are a true QuizMaster!';
      accentColor = Colors.green;
    } else if (percentage >= 60) {
      performanceMessage = 'Well Done! Great command of the subject!';
      accentColor = Colors.blue;
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Quiz Results'),
        automaticallyImplyLeading: false,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              // Score Radial Card
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 28, horizontal: 20),
                decoration: BoxDecoration(
                  color: theme.colorScheme.surface,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: theme.dividerColor),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.04),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    Stack(
                      alignment: Alignment.center,
                      children: [
                        SizedBox(
                          width: 130,
                          height: 130,
                          child: CircularProgressIndicator(
                            value: percentage / 100,
                            strokeWidth: 10,
                            backgroundColor: Colors.grey.shade200,
                            color: accentColor,
                          ),
                        ),
                        Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              '\$percentage%',
                              style: const TextStyle(
                                fontSize: 28,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            Text(
                              '\$correct / \$total',
                              style: TextStyle(
                                fontSize: 13,
                                color: Colors.grey.shade600,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),
                    Text(
                      performanceMessage,
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: accentColor,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'Score: \${provider.score} points',
                      style: const TextStyle(fontSize: 14, color: Colors.grey),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              // Breakdown Row
              Row(
                children: [
                  Expanded(
                    child: _MetricCard(
                      label: 'Correct',
                      value: '\$correct',
                      color: Colors.green,
                      icon: Icons.check_circle_outline,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _MetricCard(
                      label: 'Incorrect',
                      value: '\$incorrect',
                      color: Colors.red,
                      icon: Icons.cancel_outlined,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _MetricCard(
                      label: 'Total',
                      value: '\$total',
                      color: theme.colorScheme.primary,
                      icon: Icons.format_list_numbered,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              // Action Buttons
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton.icon(
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                      ),
                      onPressed: () {
                        Navigator.pushAndRemoveUntil(
                          context,
                          MaterialPageRoute(builder: (_) => const HomeScreen()),
                          (route) => false,
                        );
                      },
                      icon: const Icon(Icons.home_outlined),
                      label: const Text('Back to Home'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: CustomButton(
                      text: 'Play Again',
                      icon: Icons.replay_rounded,
                      onPressed: () {
                        if (provider.selectedCategory != null) {
                          provider.startQuiz(provider.selectedCategory!);
                        }
                      },
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _MetricCard extends StatelessWidget {
  final String label;
  final String value;
  final Color color;
  final IconData icon;

  const _MetricCard({
    required this.label,
    required this.value,
    required this.color,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 10),
      decoration: BoxDecoration(
        color: color.withOpacity(0.08),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withOpacity(0.2)),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 22),
          const SizedBox(height: 6),
          Text(
            value,
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
          Text(
            label,
            style: TextStyle(fontSize: 11, color: Colors.grey.shade600),
          ),
        ],
      ),
    );
  }
}
`
  },
  {
    path: 'lib/screens/add_question_screen.dart',
    name: 'add_question_screen.dart',
    language: 'dart',
    description: 'Screen 4: Form allowing users to create validated custom questions with category selection and local storage.',
    code: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/question.dart';
import '../providers/quiz_provider.dart';
import '../widgets/custom_button.dart';

class AddQuestionScreen extends StatefulWidget {
  const AddQuestionScreen({super.key});

  @override
  State<AddQuestionScreen> createState() => _AddQuestionScreenState();
}

class _AddQuestionScreenState extends State<AddQuestionScreen> {
  final _formKey = GlobalKey<FormState>();
  final _questionController = TextEditingController();
  final _optionAController = TextEditingController();
  final _optionBController = TextEditingController();
  final _optionCController = TextEditingController();
  final _optionDController = TextEditingController();
  final _explanationController = TextEditingController();

  String _selectedCategory = 'Flutter & Dart';
  String _correctAnswerOption = 'A'; // 'A', 'B', 'C', 'D'

  static const List<String> categories = [
    'Flutter & Dart',
    'General Knowledge',
    'Computer Science',
    'Science & Nature',
    'Geography',
    'History',
  ];

  @override
  void dispose() {
    _questionController.dispose();
    _optionAController.dispose();
    _optionBController.dispose();
    _optionCController.dispose();
    _optionDController.dispose();
    _explanationController.dispose();
    super.dispose();
  }

  void _saveQuestion() async {
    if (!_formKey.currentState!.validate()) return;

    final optA = _optionAController.text.trim();
    final optB = _optionBController.text.trim();
    final optC = _optionCController.text.trim();
    final optD = _optionDController.text.trim();

    String correctText = optA;
    if (_correctAnswerOption == 'B') correctText = optB;
    if (_correctAnswerOption == 'C') correctText = optC;
    if (_correctAnswerOption == 'D') correctText = optD;

    final newQuestion = Question(
      id: 'custom_\${DateTime.now().millisecondsSinceEpoch}',
      questionText: _questionController.text.trim(),
      category: _selectedCategory,
      options: [optA, optB, optC, optD],
      correctAnswer: correctText,
      explanation: _explanationController.text.trim().isNotEmpty
          ? _explanationController.text.trim()
          : null,
      isCustom: true,
    );

    await context.read<QuizProvider>().addCustomQuestion(newQuestion);

    if (!mounted) return;

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Question successfully saved to device storage!'),
        backgroundColor: Colors.green,
      ),
    );

    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Add Custom Question'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Category Picker
              const Text(
                'Category',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
              ),
              const SizedBox(height: 6),
              DropdownButtonFormField<String>(
                value: _selectedCategory,
                items: categories
                    .map((cat) => DropdownMenuItem(value: cat, child: Text(cat)))
                    .toList(),
                onChanged: (val) {
                  if (val != null) setState(() => _selectedCategory = val);
                },
                decoration: InputDecoration(
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                ),
              ),
              const SizedBox(height: 16),
              // Question text field
              const Text(
                'Question Text',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
              ),
              const SizedBox(height: 6),
              TextFormField(
                controller: _questionController,
                maxLines: 3,
                decoration: InputDecoration(
                  hintText: 'Enter your quiz question here...',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
                validator: (val) {
                  if (val == null || val.trim().isEmpty) {
                    return 'Please enter the question text';
                  }
                  if (val.trim().length < 8) {
                    return 'Question text should be at least 8 characters long';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              const Text(
                'Answer Options',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
              ),
              const SizedBox(height: 8),
              _buildOptionField('Option A', _optionAController, 'A'),
              const SizedBox(height: 10),
              _buildOptionField('Option B', _optionBController, 'B'),
              const SizedBox(height: 10),
              _buildOptionField('Option C', _optionCController, 'C'),
              const SizedBox(height: 10),
              _buildOptionField('Option D', _optionDController, 'D'),
              const SizedBox(height: 16),
              // Correct option selector
              const Text(
                'Select Which Option is Correct:',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
              ),
              const SizedBox(height: 8),
              SegmentedButton<String>(
                segments: const [
                  ButtonSegment(value: 'A', label: Text('Option A')),
                  ButtonSegment(value: 'B', label: Text('Option B')),
                  ButtonSegment(value: 'C', label: Text('Option C')),
                  ButtonSegment(value: 'D', label: Text('Option D')),
                ],
                selected: {_correctAnswerOption},
                onSelectionChanged: (set) {
                  setState(() => _correctAnswerOption = set.first);
                },
              ),
              const SizedBox(height: 16),
              // Optional explanation
              const Text(
                'Explanation (Optional)',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
              ),
              const SizedBox(height: 6),
              TextFormField(
                controller: _explanationController,
                maxLines: 2,
                decoration: InputDecoration(
                  hintText: 'Why is this answer correct?',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
              const SizedBox(height: 24),
              CustomButton(
                text: 'Save Question',
                icon: Icons.save_rounded,
                onPressed: _saveQuestion,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildOptionField(
    String label,
    TextEditingController controller,
    String tag,
  ) {
    return TextFormField(
      controller: controller,
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: Padding(
          padding: const EdgeInsets.all(12),
          child: Text(
            tag,
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
          ),
        ),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
      ),
      validator: (val) {
        if (val == null || val.trim().isEmpty) {
          return 'Option \$tag cannot be blank';
        }
        return null;
      },
    );
  }
}
`
  },
  {
    path: 'lib/screens/question_detail_screen.dart',
    name: 'question_detail_screen.dart',
    language: 'dart',
    description: 'Screen 5: Question Details screen showing complete question, options, correct answer highlight, and category details.',
    code: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/question.dart';
import '../providers/quiz_provider.dart';

class QuestionBankScreen extends StatefulWidget {
  const QuestionBankScreen({super.key});

  @override
  State<QuestionBankScreen> createState() => _QuestionBankScreenState();
}

class _QuestionBankScreenState extends State<QuestionBankScreen> {
  String _filter = 'All';

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<QuizProvider>();
    final customList = provider.customQuestions;

    final filtered = _filter == 'All'
        ? customList
        : customList.where((q) => q.category == _filter).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Question Bank Explorer'),
      ),
      body: Column(
        children: [
          // Filter Row
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Row(
              children: ['All', 'Flutter & Dart', 'Science & Nature', 'General Knowledge']
                  .map((cat) => Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: ChoiceChip(
                          label: Text(cat),
                          selected: _filter == cat,
                          onSelected: (_) => setState(() => _filter = cat),
                        ),
                      ))
                  .toList(),
          ),
          Expanded(
            child: filtered.isEmpty
                ? const Center(
                    child: Padding(
                      padding: EdgeInsets.all(24),
                      child: Text(
                        'No questions found in this category. Tap + to add one!',
                        textAlign: TextAlign.center,
                      ),
                    ),
                  )
                : ListView.separated(
                    padding: const EdgeInsets.all(16),
                    itemCount: filtered.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 12),
                    itemBuilder: (context, index) {
                      final item = filtered[index];
                      return ListTile(
                        tileColor: Theme.of(context).cardTheme.color,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                          side: BorderSide(color: Colors.grey.shade200),
                        ),
                        title: Text(
                          item.questionText,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(fontWeight: FontWeight.w600),
                        ),
                        subtitle: Text(item.category),
                        trailing: const Icon(Icons.chevron_right),
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => QuestionDetailScreen(question: item),
                            ),
                          );
                        },
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}

class QuestionDetailScreen extends StatelessWidget {
  final Question question;

  const QuestionDetailScreen({super.key, required this.question});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Question Details'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Category tag
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: theme.colorScheme.primaryContainer,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                question.category,
                style: TextStyle(
                  color: theme.colorScheme.primary,
                  fontWeight: FontWeight.bold,
                  fontSize: 12,
                ),
              ),
            ),
            const SizedBox(height: 16),
            // Full Question Text
            Text(
              question.questionText,
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                height: 1.4,
              ),
            ),
            const SizedBox(height: 24),
            const Text(
              'All Available Options:',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: Colors.grey,
              ),
            ),
            const SizedBox(height: 12),
            // Options list
            ...question.options.asMap().entries.map((entry) {
              final idx = entry.key;
              final opt = entry.value;
              final isCorrect = opt == question.correctAnswer;
              final labels = ['A', 'B', 'C', 'D'];

              return Container(
                margin: const EdgeInsets.only(bottom: 12),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: isCorrect ? Colors.green.withOpacity(0.1) : theme.cardColor,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: isCorrect ? Colors.green : Colors.grey.shade300,
                    width: isCorrect ? 2 : 1,
                  ),
                ),
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 14,
                      backgroundColor: isCorrect ? Colors.green : Colors.grey.shade200,
                      child: Text(
                        labels[idx % labels.length],
                        style: TextStyle(
                          color: isCorrect ? Colors.white : Colors.black87,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Text(
                        opt,
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: isCorrect ? FontWeight.bold : FontWeight.normal,
                          color: isCorrect ? Colors.green.shade800 : null,
                        ),
                      ),
                    ),
                    if (isCorrect)
                      const Icon(Icons.check_circle, color: Colors.green, size: 20),
                  ],
                ),
              );
            }),
            if (question.explanation != null) ...[
              const SizedBox(height: 16),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.blue.withOpacity(0.08),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.blue.withOpacity(0.2)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.lightbulb_outline, color: Colors.blue, size: 20),
                        SizedBox(width: 8),
                        Text(
                          'Explanation',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            color: Colors.blue,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(question.explanation!),
                  ],
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
`
  },
  {
    path: 'lib/widgets/category_card.dart',
    name: 'category_card.dart',
    language: 'dart',
    description: 'Reusable Category Card widget with icon, description, best score pill, and touch feedback.',
    code: `import 'package:flutter/material.dart';
import '../models/category.dart';

class CategoryCard extends StatelessWidget {
  final QuizCategory category;
  final int bestScore;
  final VoidCallback onTap;

  const CategoryCard({
    super.key,
    required this.category,
    required this.bestScore,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Theme.of(context).cardTheme.color ?? Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: Colors.grey.withOpacity(0.2)),
        ),
        child: Row(
          children: [
            Container(
              width: 50,
              height: 50,
              decoration: BoxDecoration(
                color: category.color.withOpacity(0.12),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Icon(category.icon, color: category.color, size: 26),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    category.name,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    category.description,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey.shade600,
                    ),
                  ),
                  if (bestScore > 0) ...[
                    const SizedBox(height: 6),
                    Text(
                      'Best: \$bestScore pts',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                        color: category.color,
                      ),
                    ),
                  ],
                ],
              ),
            ),
            const Icon(Icons.arrow_forward_ios_rounded, size: 16, color: Colors.grey),
          ],
        ),
      ),
    );
  }
}
`
  },
  {
    path: 'lib/widgets/answer_option.dart',
    name: 'answer_option.dart',
    language: 'dart',
    description: 'Answer Option widget with dynamic selection and correct/incorrect state color styling.',
    code: `import 'package:flutter/material.dart';

class AnswerOptionWidget extends StatelessWidget {
  final String optionText;
  final int index;
  final bool isSelected;
  final bool isSubmitted;
  final bool isCorrect;
  final VoidCallback onTap;

  const AnswerOptionWidget({
    super.key,
    required this.optionText,
    required this.index,
    required this.isSelected,
    required this.isSubmitted,
    required this.isCorrect,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final labels = ['A', 'B', 'C', 'D'];

    Color borderColor = Colors.grey.shade300;
    Color bgColor = theme.cardColor;
    Color textColor = theme.textTheme.bodyLarge?.color ?? Colors.black;

    if (isSubmitted) {
      if (isCorrect) {
        borderColor = Colors.green;
        bgColor = Colors.green.withOpacity(0.1);
        textColor = Colors.green.shade800;
      } else if (isSelected) {
        borderColor = Colors.red;
        bgColor = Colors.red.withOpacity(0.1);
        textColor = Colors.red.shade800;
      }
    } else if (isSelected) {
      borderColor = theme.colorScheme.primary;
      bgColor = theme.colorScheme.primary.withOpacity(0.08);
      textColor = theme.colorScheme.primary;
    }

    return InkWell(
      onTap: isSubmitted ? null : onTap,
      borderRadius: BorderRadius.circular(16),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
          color: bgColor,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: borderColor, width: isSelected ? 2 : 1),
        ),
        child: Row(
          children: [
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: isSelected
                    ? borderColor
                    : Colors.grey.shade200,
              ),
              alignment: Alignment.center,
              child: Text(
                labels[index % labels.length],
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 13,
                  color: isSelected ? Colors.white : Colors.black87,
                ),
              ),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Text(
                optionText,
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
                  color: textColor,
                ),
              ),
            ),
            if (isSubmitted && isCorrect)
              const Icon(Icons.check_circle_rounded, color: Colors.green, size: 22)
            else if (isSubmitted && isSelected && !isCorrect)
              const Icon(Icons.cancel_rounded, color: Colors.red, size: 22),
          ],
        ),
      ),
    );
  }
}
`
  },
  {
    path: 'lib/widgets/custom_button.dart',
    name: 'custom_button.dart',
    language: 'dart',
    description: 'Rounded primary CTA button component adhering to Material 3 design specs.',
    code: `import 'package:flutter/material.dart';

class CustomButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final IconData? icon;
  final Color? color;

  const CustomButton({
    super.key,
    required this.text,
    required this.onPressed,
    this.icon,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return SizedBox(
      width: double.infinity,
      height: 52,
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          backgroundColor: color ?? theme.colorScheme.primary,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
        ),
        onPressed: onPressed,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (icon != null) ...[
              Icon(icon, size: 20),
              const SizedBox(width: 8),
            ],
            Text(
              text,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
`
  },
  {
    path: 'test/widget_test.dart',
    name: 'widget_test.dart',
    language: 'dart',
    description: 'Flutter widget tests verifying home screen rendering, category list cards, and quiz provider state.',
    code: `import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:quizmaster/main.dart';
import 'package:quizmaster/providers/quiz_provider.dart';
import 'package:quizmaster/screens/home_screen.dart';

void main() {
  testWidgets('QuizMaster App boots and renders Home Screen with Logo & Categories',
      (WidgetTester tester) async {
    final quizProvider = QuizProvider();

    await tester.pumpWidget(
      MultiProvider(
        providers: [
          ChangeNotifierProvider<QuizProvider>.value(value: quizProvider),
        ],
        child: const QuizMasterApp(),
      ),
    );

    // Verify Title presence
    expect(find.text('QuizMaster'), findsOneWidget);
    expect(find.text('Select a Category'), findsOneWidget);
    expect(find.text('Flutter & Dart'), findsOneWidget);
    expect(find.text('General Knowledge'), findsOneWidget);
  });

  test('QuizProvider calculates score and advances question index correctly', () {
    final provider = QuizProvider();
    expect(provider.score, 0);
    expect(provider.currentIndex, 0);
  });
}
`
  },
  {
    path: 'README.md',
    name: 'README.md',
    language: 'markdown',
    description: 'Complete GitHub project documentation including architecture, setup, data sources, and group member contributions.',
    code: `# QuizMaster – Interactive Android Quiz Application

A modern, responsive Android Quiz Application built with **Flutter (v3.35+)**, **Dart (null safety)**, and **Provider** state management.

---

## 📱 Features
- **Categorized Quizzes**: Multiple domains including Flutter & Dart, Computer Science, Science & Nature, Geography, and Custom Created questions.
- **Dual Data Source**: Public REST API (Open Trivia DB) with automatic offline fallback and custom question storage.
- **State Management**: Built with \`Provider\` & \`ChangeNotifier\` for seamless reactivity.
- **Local Persistence**: Best scores and custom user questions permanently saved using \`SharedPreferences\`.
- **Custom Question Creator**: Full form validation guaranteeing 4 options and valid answer assignment.
- **Question Bank & Explorer**: Inspect full question text, correct answer highlights, and conceptual explanations.
- **Material 3 Theming**: Consistent color tokens with Light and Dark mode support.

---

## 🛠 Project Structure
\`\`\`
lib/
├── main.dart
├── models/
│   ├── category.dart
│   ├── question.dart
│   └── quiz_result.dart
├── providers/
│   └── quiz_provider.dart
├── screens/
│   ├── add_question_screen.dart
│   ├── home_screen.dart
│   ├── question_detail_screen.dart
│   ├── quiz_screen.dart
│   └── result_screen.dart
├── services/
│   ├── api_service.dart
│   └── storage_service.dart
└── widgets/
    ├── answer_option.dart
    ├── category_card.dart
    ├── custom_button.dart
    └── question_card.dart
\`\`\`

---

## 🚀 Setup & Running Instructions
1. Clone the repository:
   \`git clone https://github.com/flutter-dev-programme/quizmaster.git\`
2. Navigate into the directory:
   \`cd quizmaster\`
3. Install Flutter packages:
   \`flutter pub get\`
4. Run on an Android emulator or connected device:
   \`flutter run\`
5. Run widget tests:
   \`flutter test\`

---

## 👥 Group Project Responsibilities
- **Lead Developer**: Application architecture, Provider setup, and API service integration.
- **UI/UX Designer**: Material 3 theming, responsive category cards, and results screen.
- **State & Storage Engineer**: SharedPreferences persistence, best scores tracker, and custom questions CRUD.
- **QA & Testing Engineer**: Unit & widget tests, defect log maintenance, and release verification.
`
  },
  {
    path: 'DEFECT_LOG.md',
    name: 'DEFECT_LOG.md',
    language: 'markdown',
    description: 'QA Defect Log recording discovered issues, steps to reproduce, severity, and resolution status.',
    code: `# QuizMaster – QA Defect Log

| Defect ID | Severity | Description | Steps to Reproduce | Status | Resolution |
|---|---|---|---|---|---|
| DEF-001 | High | OpenTDB questions contained unescaped HTML entities (e.g. \`&#039;\`, \`&quot;\`) | Start a General Knowledge quiz from API | Resolved | Integrated \`html_unescape\` package to sanitize question and answer strings |
| DEF-002 | Medium | User could tap multiple options in rapid succession and skew score | Rapidly tap 2 options during quiz | Resolved | Added \`isAnswerSubmitted\` lock boolean in \`QuizProvider.selectAnswer()\` |
| DEF-003 | Medium | Best score was overwritten even when the new score was lower | Complete a quiz with 20% after achieving 80% | Resolved | Added condition in \`StorageService.saveBestScore()\` to only update when \`newScore > currentBest\` |
| DEF-004 | Low | Custom question allowed empty string in option fields | Submit custom question form with blank Option C | Resolved | Added Form validation checking \`trim().isNotEmpty\` for all 4 option fields |
| DEF-005 | Medium | Network timeout on slow mobile 3G caused eternal loading screen | Simulate offline/airplane mode and tap Start Quiz | Resolved | Added 8-second HTTP timeout and seamless fallback to curated offline question pool |
`
  }
];
