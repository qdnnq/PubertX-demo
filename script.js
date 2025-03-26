document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const navLinks = document.querySelectorAll('.nav-link');
    const switchButtons = document.querySelectorAll('.switch-btn');
    const contentSections = document.querySelectorAll('.content-section');

    // Funkcija za promjenu aktivnog taba
    function switchTab(tabId) {
        // Ukloni active klasu sa svih tabova i sadržaja
        tabs.forEach(tab => tab.classList.remove('active'));
        tabContents.forEach(content => {
            content.classList.remove('active');
            const lessonContent = content.querySelector('.lesson-content');
            if (lessonContent) {
                lessonContent.classList.remove('active');
            }
        });
        navLinks.forEach(link => link.classList.remove('active'));

        // Dodaj active klasu na odabrani tab i sadržaj
        const selectedTab = document.querySelector(`[data-tab="${tabId}"]`);
        const selectedContent = document.getElementById(tabId);
        const selectedNavLink = document.querySelector(`[href="#${tabId}"]`);

        if (selectedTab) selectedTab.classList.add('active');
        if (selectedContent) {
            selectedContent.classList.add('active');
            const lessonContent = selectedContent.querySelector('.lesson-content');
            if (lessonContent) {
                setTimeout(() => {
                    lessonContent.classList.add('active');
                }, 50);
            }
        }
        if (selectedNavLink) selectedNavLink.classList.add('active');
    }

    // Funkcija za promjenu sadržaja (modules/quiz)
    function switchContent(contentId) {
        // Ukloni active klasu sa svih sadržaja i gumba
        contentSections.forEach(section => section.classList.remove('active'));
        switchButtons.forEach(button => button.classList.remove('active'));

        // Dodaj active klasu na odabrani sadržaj i gumb
        const selectedSection = document.getElementById(`${contentId}-content`);
        const selectedButton = document.querySelector(`[data-content="${contentId}"]`);

        if (selectedSection) selectedSection.classList.add('active');
        if (selectedButton) selectedButton.classList.add('active');
    }

    // Event listeneri za tabove
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // Event listeneri za navigacijske linkove
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Ako link nije za chatbot ili diskusije, sprječavamo defaultno ponašanje
            if (!this.getAttribute('href').includes('chatbot.html') && 
                !this.getAttribute('href').includes('diskusija.html')) {
                e.preventDefault();
            }
            
            // Uklanjamo active klasu sa svih linkova
            navLinks.forEach(l => l.classList.remove('active'));
            // Dodajemo active klasu na kliknuti link
            this.classList.add('active');
        });
    });

    // Event listeneri za gumbe za prebacivanje sadržaja
    switchButtons.forEach(button => {
        button.addEventListener('click', () => {
            const contentId = button.getAttribute('data-content');
            switchContent(contentId);
        });
    });

    // Event listeneri za gumb "Započni Kviz"
    const startQuizButtons = document.querySelectorAll('.start-quiz');
    startQuizButtons.forEach(button => {
        button.addEventListener('click', () => {
            const quizTitle = button.closest('.quiz-category').querySelector('h3').textContent;
            alert(`Započinje kviz: ${quizTitle}`);
            // Ovdje možete dodati logiku za preusmjeravanje na stranicu s kvizom
        });
    });

    // Postavi početni tab i sadržaj
    const initialTab = window.location.hash.substring(1) || 'learning';
    switchTab(initialTab);
    switchContent('modules');

    // Dodaj event listener za start journey gumb
    const startJourneyBtn = document.querySelector('.start-journey');
    if (startJourneyBtn) {
        startJourneyBtn.addEventListener('click', function() {
            const lessonsSection = document.getElementById('lessons-section');
            if (lessonsSection) {
                lessonsSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});

// Quiz functionality
const quizLevels = document.querySelectorAll('.quiz-level');
const quizContent = document.querySelector('.quiz-map');
let currentQuestion = 0;
let score = 0;

const quizData = {
  questions: [
    {
      question: "What is the first physical change that typically occurs during puberty?",
      options: [
        "Growth spurt",
        "Voice changes",
        "Body hair growth",
        "Acne"
      ],
      correct: 0
    },
    {
      question: "Which hormone is primarily responsible for triggering puberty in both boys and girls?",
      options: [
        "Estrogen",
        "Testosterone",
        "Growth hormone",
        "Thyroid hormone"
      ],
      correct: 2
    },
    {
      question: "At what age does puberty typically begin for girls?",
      options: [
        "8-13 years",
        "10-15 years",
        "12-16 years",
        "14-18 years"
      ],
      correct: 0
    },
    {
      question: "What is the average duration of puberty?",
      options: [
        "2-3 years",
        "3-4 years",
        "4-5 years",
        "5-6 years"
      ],
      correct: 1
    },
    {
      question: "Which of these is NOT a common physical change during puberty?",
      options: [
        "Increased height",
        "Loss of all baby teeth",
        "Body hair growth",
        "Changes in body shape"
      ],
      correct: 1
    }
  ]
};

function showQuiz() {
  quizContent.innerHTML = `
    <div class="quiz-container">
      <div class="quiz-header">
        <button class="exit-quiz" onclick="exitQuiz()">
          <i class="fas fa-times"></i>
        </button>
        <div class="quiz-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${(currentQuestion / quizData.questions.length) * 100}%"></div>
          </div>
          <span>Question ${currentQuestion + 1}/${quizData.questions.length}</span>
        </div>
        <div class="lives">
          <span class="life">❤️</span>
          <span class="life">❤️</span>
          <span class="life">❤️</span>
        </div>
      </div>
      
      <div class="quiz-content">
        <div class="quiz-question">
          <h3>${quizData.questions[currentQuestion].question}</h3>
          <div class="quiz-options">
            ${quizData.questions[currentQuestion].options.map((option, index) => `
              <div class="quiz-option" data-index="${index}">
                ${option}
              </div>
            `).join('')}
          </div>
        </div>
        
        <div class="quiz-footer">
          <button class="skip-button">Skip</button>
          <button class="check-button" disabled>Check</button>
        </div>
      </div>
    </div>
  `;

  // Add event listeners
  const options = document.querySelectorAll('.quiz-option');
  const checkButton = document.querySelector('.check-button');
  const skipButton = document.querySelector('.skip-button');

  options.forEach(option => {
    option.addEventListener('click', () => {
      options.forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');
      checkButton.disabled = false;
    });
  });

  checkButton.addEventListener('click', () => {
    const selected = document.querySelector('.quiz-option.selected');
    if (!selected) return;

    const selectedIndex = parseInt(selected.dataset.index);
    const correct = quizData.questions[currentQuestion].correct;

    options.forEach(option => {
      option.classList.remove('selected');
      if (parseInt(option.dataset.index) === correct) {
        option.classList.add('correct');
      }
    });

    if (selectedIndex === correct) {
      score++;
    } else {
      selected.classList.add('incorrect');
    }

    checkButton.disabled = true;
    setTimeout(() => {
      if (currentQuestion < quizData.questions.length - 1) {
        currentQuestion++;
        showQuiz();
      } else {
        showResults();
      }
    }, 1500);
  });

  skipButton.addEventListener('click', () => {
    if (currentQuestion < quizData.questions.length - 1) {
      currentQuestion++;
      showQuiz();
    } else {
      showResults();
    }
  });
}

function showResults() {
  const percentage = (score / quizData.questions.length) * 100;
  quizContent.innerHTML = `
    <div class="quiz-container">
      <div class="lesson-complete">
        <h2>Quiz Complete!</h2>
        <img src="https://cdn-icons-png.flaticon.com/512/190/190411.png" alt="Success">
        <div class="stats">
          <div class="stat">
            <div class="stat-value">${score}/${quizData.questions.length}</div>
            <div class="stat-label">Correct Answers</div>
          </div>
          <div class="stat">
            <div class="stat-value">${Math.round(percentage)}%</div>
            <div class="stat-label">Score</div>
          </div>
        </div>
        <button class="buttonta" onclick="resetQuiz()">Try Again</button>
      </div>
    </div>
  `;
}

function resetQuiz() {
  currentQuestion = 0;
  score = 0;
  showQuiz();
}

function exitQuiz() {
  if (confirm('Are you sure you want to exit the quiz? Your progress will be lost.')) {
    currentQuestion = 0;
    score = 0;
    showQuizMap();
  }
}

function showQuizMap() {
  quizContent.innerHTML = `
    <div class="quiz-map">
      <div class="quiz-module">
        <h3>Module 1: Understanding Puberty</h3>
        <div class="quiz-levels">
          <div class="quiz-level completed">
            <div class="level-icon">
              <i class="fas fa-check-circle"></i>
            </div>
            <div class="level-info">
              <h4>Level 1</h4>
              <p>Basic Concepts</p>
              <span>5 questions</span>
            </div>
          </div>
          <div class="quiz-level current">
            <div class="level-icon">
              <i class="fas fa-star"></i>
            </div>
            <div class="level-info">
              <h4>Level 2</h4>
              <p>Body Changes</p>
              <span>8 questions</span>
            </div>
          </div>
          <div class="quiz-level locked">
            <div class="level-icon">
              <i class="fas fa-lock"></i>
            </div>
            <div class="level-info">
              <h4>Level 3</h4>
              <p>Emotional Changes</p>
              <span>10 questions</span>
            </div>
          </div>
        </div>
      </div>

      <div class="quiz-module">
        <h3>Module 2: Relationships & Health</h3>
        <div class="quiz-levels">
          <div class="quiz-level locked">
            <div class="level-icon">
              <i class="fas fa-lock"></i>
            </div>
            <div class="level-info">
              <h4>Level 1</h4>
              <p>Healthy Relationships</p>
              <span>7 questions</span>
            </div>
          </div>
          <div class="quiz-level locked">
            <div class="level-icon">
              <i class="fas fa-lock"></i>
            </div>
            <div class="level-info">
              <h4>Level 2</h4>
              <p>Consent & Boundaries</p>
              <span>9 questions</span>
            </div>
          </div>
        </div>
      </div>

      <div class="quiz-module">
        <h3>Module 3: Mental Health</h3>
        <div class="quiz-levels">
          <div class="quiz-level locked">
            <div class="level-icon">
              <i class="fas fa-lock"></i>
            </div>
            <div class="level-info">
              <h4>Level 1</h4>
              <p>Understanding Emotions</p>
              <span>6 questions</span>
            </div>
          </div>
          <div class="quiz-level locked">
            <div class="level-icon">
              <i class="fas fa-lock"></i>
            </div>
            <div class="level-info">
              <h4>Level 2</h4>
              <p>Self-Care & Support</p>
              <span>8 questions</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Re-add click event listeners to quiz levels
  const quizLevels = document.querySelectorAll('.quiz-level');
  quizLevels.forEach(level => {
    level.addEventListener('click', () => {
      if (level.classList.contains('current')) {
        showQuiz();
      }
    });
  });
}

// Add click event listeners to quiz levels
quizLevels.forEach(level => {
  level.addEventListener('click', () => {
    if (level.classList.contains('current')) {
      showQuiz();
    }
  });
});

// Funkcija za prikazivanje discuss sekcije
function showDiscuss() {
  const mainContent = document.querySelector('.main-content');
  mainContent.innerHTML = `
    <div class="discussion-header">
      <h2>Razgovor i Podrška</h2>
      <p>Povežite se s drugima i podijelite svoja iskustva</p>
    </div>
    <div class="discussion-container">
      <div class="discussion-card">
        <div class="discussion-icon">
          <i class="fas fa-comments"></i>
        </div>
        <h3 class="discussion-title">Forum za Razgovor</h3>
        <p class="discussion-text">Povežite se s drugima koji prolaze kroz slična iskustva. Podijelite svoje misli, pitanja i savjete.</p>
        <a href="#" class="discussion-button">Pridružite se Forumu</a>
      </div>
      <div class="discussion-card">
        <div class="discussion-icon">
          <i class="fas fa-user-friends"></i>
        </div>
        <h3 class="discussion-title">Grupe za Podršku</h3>
        <p class="discussion-text">Pridružite se grupi za podršku gdje možete razgovarati s drugima koji razumiju vaše iskustvo.</p>
        <a href="#" class="discussion-button">Pronađite Grupu</a>
      </div>
      <div class="discussion-card">
        <div class="discussion-icon">
          <i class="fas fa-hand-holding-heart"></i>
        </div>
        <h3 class="discussion-title">Savjetovanje</h3>
        <p class="discussion-text">Dobijte profesionalnu podršku i savjete od stručnjaka koji su tu da vam pomognu.</p>
        <a href="#" class="discussion-button">Zatražite Savjet</a>
      </div>
    </div>
  `;
}

// Dodajemo event listener za discuss dugme
document.addEventListener('DOMContentLoaded', function() {
  const discussBtn = document.querySelector('.nav-link[href="#discuss"]');
  if (discussBtn) {
    discussBtn.addEventListener('click', function(e) {
      e.preventDefault();
      showDiscuss();
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const navButtons = document.querySelectorAll('.nav-button');
  const comingSoonModal = document.getElementById('comingSoonModal');
  const modalClose = comingSoonModal.querySelector('.modal-close');

  navButtons.forEach(button => {
      button.addEventListener('click', (event) => {
          event.preventDefault();
          comingSoonModal.style.display = 'flex';
      });
  });

  modalClose.addEventListener('click', () => {
      comingSoonModal.style.display = 'none';
  });

  // Close modal if clicked outside
  window.addEventListener('click', (event) => {
      if (event.target === comingSoonModal) {
          comingSoonModal.style.display = 'none';
      }
  });
});