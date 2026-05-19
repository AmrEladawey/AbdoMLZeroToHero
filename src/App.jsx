import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'abdoMlZeroToHero_progress';

const roadmap = [
  {
    id: 'level-1',
    title: 'Level 1: The Foundation',
    description: 'Start with how computers work, algorithms, and setting up Google Colab.',
    tasks: [
      {
        id: '1.1',
        title: 'How Computers Work',
        details: 'Memory, CPUs, and execution. Source: CrashCourse Computer Science',
        link: 'https://www.youtube.com/watch?v=CxGSnA-RTsA&t=28s'
      },
      {
        id: '1.2',
        title: 'What is an Algorithm?',
        details: 'Code is a step-by-step recipe. Source: BBC Bitesize',
        link: 'https://www.bbc.co.uk/bitesize/topics/z3tbwmn/articles/z3bktv4'
      },
      {
        id: '1.3',
        title: 'The Workspace',
        details: 'Set up Google Colab to write Python in the browser.',
        link: 'https://colab.research.google.com/'
      }
    ],
    quiz: {
      title: 'Quiz',
      prompt: "Act as my computer science tutor. I just learned the basics of how computers work and what an algorithm is. Give me 3 short, everyday scenarios (like making a cup of coffee or sorting a deck of cards) and ask me to break them down into a step-by-step 'algorithmic' flowchart. Do not give me the answers; wait for me to try, then correct my logic."
    }
  },
  {
    id: 'level-2',
    title: 'Level 2: The Language',
    description: 'Learn Python basics, data work with Pandas, and cleaning data.',
    tasks: [
      {
        id: '2.1',
        title: 'Python Basics',
        details: 'Variables, loops, and logic in a gamified way. Source: LearnPython.today or CheckiO',
        links: [
          { href: 'https://www.youtube.com/watch?v=K5KVEU3aaeQ', label: 'Python Tutorial |\n'},
          { href: 'https://checkio.org/', label: 'CheckiO |\n' },
          { href: 'https://learnpython.today/', label: 'LearnPython.today'  }
        ]
      },
      {
        id: '2.2',
        title: 'Data Manipulation (Pandas)',
        details: 'Open, view, and manipulate spreadsheets in Python. Source: Kaggle micro-courses',
        links: [
          { href: 'https://www.youtube.com/watch?v=RBSUwFGa6Fk', label: 'What is Data Science? |\n' },
          { href: 'https://www.kaggle.com/learn/pandas', label: 'Kaggle Pandas Course |\n' },
          { href: 'https://drive.google.com/drive/folders/1EotEs_FnyoGxuLTvwhfxocUybBjsq0vA?usp=drive_link', label: 'Pandas from University' }
        ]
      },
      {
        id: '2.3',
        title: 'Data Cleaning',
        details: 'Handle missing values and scale numbers.',
        link: 'https://drive.google.com/drive/folders/18MlCiK3PYlmVFTqOGwD9UqlXzFaj8brc?usp=drive_link'
      }
    ],
    quiz: {
      title: 'Quiz',
      prompt: "Act as my Python coding tutor. Create a small mock dataset in Python representing a bookstore with columns for 'Title', 'Genre', 'Price', and 'Copies_Sold'. Ask me to write the exact Pandas code to: 1) Filter only the 'Sci-Fi' books, 2) Sort by price, and 3) Find the average number of copies sold. Wait for me to type my code. If I am wrong, give me a hint, not the full answer."
    }
  },
  {
    id: 'level-3',
    title: 'Level 3: The Math Refresher',
    description: 'Build the math intuition needed for machine learning with visuals and statistics.',
    tasks: [
      {
        id: '3.1',
        title: 'Visualizing Math',
        details: 'Linear algebra',
        link: 'https://youtu.be/ZFVFtVbeerI?si=6jDY9pYlh3b4WjhY'
      },
    ],
    quiz: {
      title: 'Quiz',
      prompt: "I have a master's background in calculus and linear algebra, but I am learning how to apply it in Python using NumPy. Give me 2 coding challenges: one asking me to perform matrix multiplication on two mock arrays, and one asking me to calculate the standard deviation of a mock array representing daily temperatures. Wait for my code before providing feedback."
    }
  },
  {
    id: 'level-4',
    title: 'Level 4: Core Machine Learning',
    description: 'Learn regression vs classification, and train first models in Scikit-Learn.',
    tasks: [
      {
        id: '4.1',
        title: 'The ML Landscape',
        details: 'Understand regression vs classification.',
        link: 'https://www.coursera.org/specializations/machine-learning-introduction'
      },
      {
        id: '4.2',
        title: 'Models & Intuition',
        details: 'Follow the DeepLearning.AI course focusing on Python labs.',
        link: 'https://www.coursera.org/specializations/machine-learning-introduction'
      }
    ],
    quiz: {
      title: 'Quiz',
      prompt: "I just learned the basics of supervised machine learning and Scikit-Learn. First, give me 3 general real-world scenarios and ask me to identify if they are regression or classification problems. Then, ask me to write the basic Scikit-Learn Python code to initialize a Linear Regression model, train it on mock variables X_train and y_train, and make a prediction. Evaluate my answers."
    }
  },
 {
    id: 'Top Secret',
    title: 'Top Top Top Secret Level',
    description: 'DONT OPEN IT',
    tasks: [ {
        id: 'secret-1',
        title: 'DO NOT OPEN THIS !!!!',
        details: 'NOOOOOOOO',
        link: 'https://drive.google.com/file/d/15PnlKmbr4UtfZHIKOMWSlEbAiTUA55vQ/view?usp=drive_link'
      }  
    ]
  }
];

function App() {
  const [openLevels, setOpenLevels] = useState({});
  const [checked, setChecked] = useState({});
  const [activePopup, setActivePopup] = useState(null);
  const [openQuiz, setOpenQuiz] = useState({});
  const [saveMessage, setSaveMessage] = useState('');
  const [hasLoaded, setHasLoaded] = useState(false);
  const [streak, setStreak] = useState(0);
  const [lastCompletedDate, setLastCompletedDate] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.checked) setChecked(parsed.checked);
        if (parsed.openLevels) setOpenLevels(parsed.openLevels);
        if (parsed.openQuiz) setOpenQuiz(parsed.openQuiz);
        if (parsed.streak) setStreak(parsed.streak);
        if (parsed.lastCompletedDate) setLastCompletedDate(parsed.lastCompletedDate);
      } catch (error) {
        console.warn('Unable to load saved progress', error);
      }
    }
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ checked, openLevels, openQuiz, streak, lastCompletedDate, updatedAt: new Date().toISOString() })
    );
    setSaveMessage('Progress saved!');
    const timeout = window.setTimeout(() => setSaveMessage(''), 1400);
    return () => window.clearTimeout(timeout);
  }, [checked, openLevels, openQuiz, hasLoaded]);

  const totalTasks = useMemo(
    () => roadmap.reduce((sum, level) => sum + level.tasks.length, 0),
    []
  );

  const completedTasks = Object.values(checked).filter(Boolean).length;
  const progressPercent = Math.round((completedTasks / totalTasks) * 100);

  const toggleLevel = (id) => {
    setOpenLevels((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleQuiz = (id) => {
    setOpenQuiz((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCheck = (taskId, title) => {
    setChecked((prev) => {
      const next = { ...prev, [taskId]: !prev[taskId] };
      if (next[taskId]) {
        setActivePopup(`Completed: ${title}`);
        window.setTimeout(() => setActivePopup(null), 1800);
      }
      return next;
    });
  };

  // helper for daily streak tracking
  const yyyyMMdd = (d) => d.toISOString().slice(0, 10);

  useEffect(() => {
    // when checked changes, update streak if today's first completion
    if (!hasLoaded) return;
    const anyCompletedToday = Object.keys(checked).some((tid) => {
      // We don't store per-task dates; assume first time completing any task today triggers streak.
      return checked[tid];
    });
    if (!anyCompletedToday) return;
    const today = yyyyMMdd(new Date());
    if (lastCompletedDate === today) return; // already counted today

    // compute if yesterday had completion
    const yesterday = (() => {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      return yyyyMMdd(d);
    })();

    if (lastCompletedDate === yesterday) {
      setStreak((s) => s + 1);
    } else {
      setStreak(1);
    }
    setLastCompletedDate(today);
  }, [checked, hasLoaded]);

  const exportProgress = () => {
    const payload = { checked, openLevels, openQuiz, streak, lastCompletedDate };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', 'abdoml-progress.json');
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const importProgress = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (parsed.checked) setChecked(parsed.checked);
        if (parsed.openLevels) setOpenLevels(parsed.openLevels);
        if (parsed.openQuiz) setOpenQuiz(parsed.openQuiz);
        if (parsed.streak) setStreak(parsed.streak || 0);
        if (parsed.lastCompletedDate) setLastCompletedDate(parsed.lastCompletedDate || null);
        setActivePopup('Progress imported');
        setTimeout(() => setActivePopup(null), 1400);
      } catch (err) {
        setActivePopup('Import failed');
        setTimeout(() => setActivePopup(null), 1400);
      }
    };
    reader.readAsText(file);
  };

  const resetProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
    setChecked({});
    setOpenLevels({});
    setOpenQuiz({});
    setActivePopup('Progress reset! Ready for a fresh run.');
  };

  return (
    <main className="page-shell">
      <div className="corner-cheer">
        <span className="corner-emoji">👾</span>
        <div className="cheer-bubble">han5eeb wla eehhhh!</div>
      </div>
      <div className="hero-panel">
        <div className="hero-badge">Bodz</div>
        <h1>ML Roadmap</h1>
        <p>From zero to hero in machine learning!</p>
        <div className="progress-bar">
          <span>Progress</span>
          <div className="meter">
            <div className="fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <span>{completedTasks}/{totalTasks} completed</span>
        </div>
        <div className="hero-actions">
          <button className="reset-button" onClick={resetProgress}>Reset progress</button>
          <button className="reset-button" onClick={exportProgress}>Export</button>
          <label className="import-label">
            <input type="file" accept="application/json" style={{ display: 'none' }} onChange={(e) => importProgress(e.target.files[0])} />
            <span className="reset-button">Import</span>
          </label>
          {saveMessage && <span className="save-notice">{saveMessage}</span>}
        </div>
      </div>

      <section className="roadmap-grid">
        <div className="status-row">
          <div className="streak">🔥 Streak: <strong>{streak}</strong></div>
          <div className="badges">
            <span className={`badge ${completedTasks >= 5 ? 'earned' : ''}`}>Bronze</span>
            <span className={`badge ${completedTasks >= 12 ? 'earned' : ''}`}>Silver</span>
            <span className={`badge ${completedTasks >= 20 ? 'earned' : ''}`}>Gold</span>
            <span className={`badge ${completedTasks === totalTasks ? 'earned' : ''}`}>Master</span>
          </div>
        </div>
        {roadmap.map((level) => (
          <article key={level.id} className="level-card">
            <button className="level-toggle" onClick={() => toggleLevel(level.id)}>
              <div>
                <span className="level-badge">{level.id.replace('-', '.')}</span>
                <h2>{level.title}</h2>
              </div>
              <span className="arrow">{openLevels[level.id] ? '▾' : '▸'}</span>
            </button>
            <p className="level-description">{level.description}</p>
            {openLevels[level.id] && (
              <div className="level-inner">
                <div className="task-list">
                  {level.tasks.map((task) => (
                    <label key={task.id} className={`task-card ${checked[task.id] ? 'done' : ''}`}>
                      <div className="task-top">
                        <div>
                          <span className="task-id">{task.id}</span>
                          <strong>{task.title}</strong>
                        </div>
                        <span className="checkmark">{checked[task.id] ? '✔' : ''}</span>
                      </div>
                      <p>{task.details}</p>
                      <div className="task-footer">
                        <div className="task-links">
                          {task.links ? (
                            task.links.map((l) => (
                              <a key={l.href} href={l.href} target="_blank" rel="noreferrer">{l.label}</a>
                            ))
                          ) : (
                            <a href={task.link} target="_blank" rel="noreferrer">Open source</a>
                          )}
                        </div>
                        <input
                          type="checkbox"
                          checked={!!checked[task.id]}
                          onChange={() => handleCheck(task.id, task.title)}
                        />
                      </div>
                    </label>
                  ))}
                </div>
                {level.quiz && (
                  <div className="quiz-card">
                    <button className="quiz-toggle" onClick={() => toggleQuiz(level.id)}>
                      {level.quiz.title}
                      <span>{openQuiz[level.id] ? '▾' : '▸'}</span>
                    </button>
                    {openQuiz[level.id] && (
                      <div className="quiz-body">
                        <p>{level.quiz.prompt}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </article>
        ))}
      </section>

      {activePopup && <div className="toast-popup">{activePopup}</div>}
    </main>
  );
}

export default App;
