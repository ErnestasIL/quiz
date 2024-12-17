const API_URL =
  "https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple";

let questions = [];
let currentQuestionIndex = 0;
let score = 0;

const questionContainer = document.getElementById("questionContainer");
const choicesContainer = document.getElementById("choicesContainer");
const nextButton = document.getElementById("nextBtn");
const progressText = document.getElementById("progress");
const progressBar = document.getElementById("progressBar");

async function fetchQuestions() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    questions = data.results.map((q) => ({
      question: q.question,
      choices: shuffle([...q.incorrect_answers, q.correct_answer]),
      correctAnswer: q.correct_answer,
    }));

    loadQuestion();
  } catch (error) {
    console.error("Failed to fetch questions:", error);
    questionContainer.textContent =
      "Failed to load questions. Please try again later.";
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function loadQuestion() {
  const currentQuestion = questions[currentQuestionIndex];
  questionContainer.innerHTML = decodeHTML(currentQuestion.question);

  choicesContainer.innerHTML = "";

  currentQuestion.choices.forEach((choice) => {
    const button = document.createElement("button");
    button.textContent = decodeHTML(choice);
    button.classList.add("choiceBtn");
    button.addEventListener("click", () => checkAnswer(choice));
    choicesContainer.appendChild(button);
  });

  progressText.textContent = `Question ${currentQuestionIndex + 1} of ${
    questions.length
  }`;
  progressBar.style.width = `${
    ((currentQuestionIndex + 1) / questions.length) * 100
  }%`;
}

function checkAnswer(selectedChoice) {
  const currentQuestion = questions[currentQuestionIndex];
  const buttons = document.querySelectorAll(".choiceBtn");

  buttons.forEach((button) => (button.disabled = true));

  if (selectedChoice === currentQuestion.correctAnswer) {
    buttons.forEach((button) => {
      if (button.textContent === decodeHTML(currentQuestion.correctAnswer)) {
        button.classList.add("correct");
      }
    });
    score++;
  } else {
    buttons.forEach((button) => {
      if (button.textContent === decodeHTML(currentQuestion.correctAnswer)) {
        button.classList.add("correct");
      } else if (button.textContent === decodeHTML(selectedChoice)) {
        button.classList.add("incorrect");
      }
    });
  }

  nextButton.disabled = false;
}

function nextQuestion() {
  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    loadQuestion();
    nextButton.disabled = true;
  } else {
    showResults();
  }
}

function showResults() {
  questionContainer.textContent = `You scored ${score} out of ${questions.length}!`;
  choicesContainer.innerHTML = "";
  nextButton.textContent = "Restart";
  nextButton.onclick = restartQuiz;
}

function restartQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  nextButton.textContent = "Next";
  nextButton.onclick = nextQuestion;

  fetchQuestions();
}

function decodeHTML(html) {
  const textArea = document.createElement("textarea");
  textArea.innerHTML = html;
  return textArea.value;
}

fetchQuestions();

nextButton.addEventListener("click", nextQuestion);
