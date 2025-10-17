// ========== AUTHENTICATION ==========
const authTitle = document.getElementById("auth-title");
const authBtn = document.getElementById("auth-btn");
const toggleAuth = document.getElementById("toggle-auth");
const errorMsg = document.getElementById("error-message");
const authPage = document.getElementById("auth-page");
const appPage = document.getElementById("app-page");
const welcomeUser = document.getElementById("welcome-user");
let isSignUp = false;

toggleAuth.addEventListener("click", () => {
  isSignUp = !isSignUp;
  if (isSignUp) {
    authTitle.textContent = "📝 Sign Up";
    authBtn.textContent = "Sign Up";
    toggleAuth.textContent = "Already have an account? Sign In";
  } else {
    authTitle.textContent = "🔐 Sign In";
    authBtn.textContent = "Sign In";
    toggleAuth.textContent = "Don't have an account? Sign Up";
  }
  errorMsg.textContent = "";
});

authBtn.addEventListener("click", () => {
  const username = document.getElementById("auth-username").value.trim();
  const password = document.getElementById("auth-password").value.trim();
  if (!username || !password) {
    errorMsg.textContent = "Please fill all fields!";
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || {};

  if (isSignUp) {
    if (users[username]) {
      errorMsg.textContent = "User already exists!";
      return;
    }
    users[username] = password;
    localStorage.setItem("users", JSON.stringify(users));
    alert("Sign Up successful! Please Sign In now.");
    isSignUp = false;
    authTitle.textContent = "🔐 Sign In";
    authBtn.textContent = "Sign In";
    toggleAuth.textContent = "Don't have an account? Sign Up";
  } else {
    if (users[username] === password) {
      authPage.style.display = "none";
      appPage.style.display = "block";
      localStorage.setItem("mathUser", username);
      welcomeUser.textContent = `Welcome, ${username}! Ready to challenge your brain 🧠`;
      startGame();
    } else {
      errorMsg.textContent = "Invalid credentials!";
    }
  }
});

// ========== GAME LOGIC ==========
let level = 1, progress = 0, incorrectAttempts = 0, score = 0;
const progressBar = document.getElementById('progress-bar');
const levelIndicator = document.getElementById('level-indicator');
const levelUpModal = document.getElementById('level-up-modal');
const closeModal = document.getElementById('close-modal');
const problemContainer = document.getElementById('problem-container');
const answerInput = document.getElementById('answer');
const feedback = document.getElementById('feedback');
const newLevelDisplay = document.getElementById('new-level');
const showAnswerBtn = document.getElementById('show-answer-btn');
const leaderboardList = document.getElementById('leaderboard-list');
let currentProblem = {};

function generateProblem() {
  const operations = ['+', '-', '*', '/'];
  const num1 = Math.floor(Math.random() * (level * 10)) + 1;
  const num2 = Math.floor(Math.random() * (level * 10)) + 1;
  const operation = operations[Math.floor(Math.random() * operations.length)];
  let text = `${num1} ${operation} ${num2}`;
  let solution = (operation === '/') ? num1 : eval(text);
  problemContainer.textContent = `Solve: ${text}`;
  return { text, solution };
}

function checkAnswer() {
  const userAnswer = parseFloat(answerInput.value);
  if (userAnswer === currentProblem.solution) {
    feedback.textContent = "✅ Correct!";
    feedback.style.color = "green";
    updateProgress();
    score += 10;
    incorrectAttempts = 0;
  } else {
    incorrectAttempts++;
    feedback.textContent = `❌ Incorrect! Attempts left: ${2 - incorrectAttempts}`;
    feedback.style.color = "red";
    if (incorrectAttempts >= 2) {
      feedback.textContent = `❌ The correct answer was ${currentProblem.solution}`;
      incorrectAttempts = 0;
      updateProgress(true);
    }
  }
  answerInput.value = '';
  currentProblem = generateProblem();
}

function updateProgress(reset = false) {
  progress = reset ? Math.max(progress - 10, 0) : progress + 10;
  if (progress >= 100) {
    levelUp();
    progress = 0;
  }
  progressBar.style.width = progress + '%';
}

function levelUp() {
  level++;
  levelIndicator.textContent = 'Level ' + level;
  newLevelDisplay.textContent = `Level ${level}`;
  levelUpModal.style.display = 'flex';
  setTimeout(() => { levelUpModal.style.display = 'none'; }, 2000);
  updateLeaderboard();
}

closeModal.addEventListener('click', () => { levelUpModal.style.display = 'none'; });

document.getElementById('submit-button').addEventListener('click', checkAnswer);
answerInput.addEventListener('keydown', e => { if (e.key === 'Enter') checkAnswer(); });
showAnswerBtn.addEventListener('click', () => {
  feedback.textContent = `💡 Correct Answer: ${currentProblem.solution}`;
  feedback.style.color = "#2c3e50";
});

function startGame() { currentProblem = generateProblem(); loadLeaderboard(); }

// ========== LEADERBOARD ==========
function updateLeaderboard() {
  let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  const user = localStorage.getItem("mathUser");
  leaderboard.push({ user, score });
  leaderboard.sort((a, b) => b.score - a.score);
  leaderboard = leaderboard.slice(0, 5);
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  loadLeaderboard();
}

function loadLeaderboard() {
  leaderboardList.innerHTML = "";
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboard.forEach(entry => {
    const li = document.createElement("li");
    li.textContent = `${entry.user} — ${entry.score} pts`;
    leaderboardList.appendChild(li);
  });
}
