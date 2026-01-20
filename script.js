let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let correctAnswers = 0;
let wrongAnswers = 0;

const urlParams = new URLSearchParams(window.location.search);
const topic = urlParams.get('topic');
const numQuestions = parseInt(urlParams.get('questions'));

if (!topic) {
    alert('No topic selected. Redirecting to home page.');
    window.location.href = 'index.html';
}

fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        questions = data[topic] || [];
        if (questions.length === 0) {
            alert('No questions available for this topic. Redirecting to home page.');
            window.location.href = 'index.html';
        }

        // If a specific number of questions is requested, shuffle and limit the array
        if (numQuestions && numQuestions > 0 && numQuestions < questions.length) {
            // Shuffle the questions array
            for (let i = questions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [questions[i], questions[j]] = [questions[j], questions[i]];
            }
            // Take only the requested number of questions
            questions = questions.slice(0, numQuestions);
        }

        loadQuestion();
        updateUI();
    })
    .catch(error => {
        console.error('Error loading questions:', error);
        alert('Failed to load questions. Please try again.');
        window.location.href = 'index.html';
    });

function loadQuestion() {
    const questionContainer = document.getElementById('question-container');
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    const nextBtn = document.getElementById('next-btn');
    const questionNumElement = document.getElementById('question-num');

    if (currentQuestionIndex >= questions.length) {
        showResult();
        return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;
    questionNumElement.textContent = currentQuestionIndex + 1;
    optionsElement.innerHTML = '';

    currentQuestion.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        optionDiv.style.pointerEvents = 'auto';
        optionDiv.innerHTML = `
            <span class="option-letter">${String.fromCharCode(65 + index)}</span>
            <span class="option-text">${option}</span>
        `;
        optionDiv.onclick = () => selectOption(optionDiv, option);
        optionsElement.appendChild(optionDiv);
    });

    nextBtn.style.display = 'none';
    questionContainer.style.display = 'block';
    updateUI();
}

function selectOption(optionDiv, selectedOption) {
    const options = document.querySelectorAll('.option');
    
    // Disable all options from being clicked again
    options.forEach(option => {
        option.style.pointerEvents = 'none';
        option.classList.remove('selected');
    });
    
    const currentQuestion = questions[currentQuestionIndex];
    const correctAnswer = currentQuestion.options[currentQuestion.correct];
    
    if (selectedOption === correctAnswer) {
        score++;
        correctAnswers++;
        optionDiv.classList.add('correct');
    } else {
        wrongAnswers++;
        optionDiv.classList.add('incorrect');
        // Highlight correct answer
        options.forEach(option => {
            if (option.querySelector('.option-text').textContent === correctAnswer) {
                option.classList.add('correct');
            }
        });
    }

    document.getElementById('next-btn').style.display = 'block';
}

function nextQuestion() {
    currentQuestionIndex++;
    loadQuestion();
}

function showResult() {
    document.getElementById('question-container').style.display = 'none';
    document.getElementById('next-btn').style.display = 'none';
    const resultDiv = document.getElementById('result');
    const correctElement = document.getElementById('correct-answers');
    const wrongElement = document.getElementById('wrong-answers');
    const percentageElement = document.getElementById('percentage');
    const resultMessageElement = document.getElementById('result-message');

    correctElement.textContent = correctAnswers;
    wrongElement.textContent = wrongAnswers;
    const percentage = Math.round((score / questions.length) * 100);
    percentageElement.textContent = `${percentage}%`;

    let message = '';
    let messageClass = '';
    if (percentage >= 90) {
        message = 'Excellent! You\'re a computer science expert!';
        messageClass = 'excellent';
    } else if (percentage >= 80) {
        message = 'Great job! You have strong knowledge in this area.';
        messageClass = 'great';
    } else if (percentage >= 70) {
        message = 'Good work! Keep studying to improve further.';
        messageClass = 'good';
    } else if (percentage >= 60) {
        message = 'Not bad! Review the topics and try again.';
        messageClass = 'average';
    } else {
        message = 'Keep learning! Practice makes perfect.';
        messageClass = 'needs-improvement';
    }

    resultMessageElement.textContent = message;
    resultMessageElement.className = `result-message ${messageClass}`;

    resultDiv.style.display = 'block';
}

function updateUI() {
    const topicTitle = document.getElementById('topic-title');
    const questionCounter = document.getElementById('question-counter');
    const scoreDisplay = document.getElementById('score-display');
    const progressFill = document.getElementById('progress-fill');

    topicTitle.textContent = `${topic} Quiz`;
    questionCounter.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
    scoreDisplay.textContent = `Score: ${score}`;

    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressFill.style.width = `${progress}%`;
}

// Dark mode toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    const icon = themeToggle.querySelector('i');

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        html.setAttribute('data-theme', 'dark');
        icon.className = 'fas fa-sun';
    }

    themeToggle.addEventListener('click', function() {
        const currentTheme = html.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            html.removeAttribute('data-theme');
            icon.className = 'fas fa-moon';
            localStorage.setItem('theme', 'light');
        } else {
            html.setAttribute('data-theme', 'dark');
            icon.className = 'fas fa-sun';
            localStorage.setItem('theme', 'dark');
        }
    });
});

document.getElementById('next-btn').onclick = nextQuestion;
