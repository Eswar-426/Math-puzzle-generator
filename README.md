<!DOCTYPE html>
<html lang="en">
<head>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-L2PH03CRDE"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-L2PH03CRDE');
</script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interactive Math App</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #f9ff3c 0%, #2ebf91 100%);
            margin: 0;
            padding: 0;
            color: #000;
            text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.6);
        }

        header {
            background: linear-gradient(135deg, #ffdd00 0%, #2ebf91 100%);
            color: white;
            text-align: center;
            padding: 1.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border-bottom: 2px solid #fff;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        main {
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
            text-align: center;
        }

        section {
            background: rgba(255, 255, 255, 0.3);
            backdrop-filter: blur(15px);
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 15px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }

        h2 {
            color: #2ebf91;
        }

        #progress-bar-container {
            width: 100%;
            background-color: #ddd;
            height: 25px;
            border-radius: 15px;
            overflow: hidden;
            margin-bottom: 20px;
            box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.2);
        }

        #progress-bar {
            height: 100%;
            width: 0%;
            background: linear-gradient(135deg, #ffdd00, #2ebf91);
            border-radius: 15px;
            transition: width 0.5s ease;
        }

        #level-indicator {
            font-size: 1.5rem;
            margin-bottom: 10px;
            color: #2ebf91;
        }

        button {
            background-color: #ffdd00;
            color: #000;
            padding: 12px 24px;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            transition: background-color 0.3s ease, box-shadow 0.3s ease;
            margin-top: 10px;
            text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.6);
        }

        button:hover {
            background-color: #f4c200;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        #answer {
            padding: 12px;
            font-size: 1rem;
            border-radius: 10px;
            border: 1px solid #ddd;
            width: calc(100% - 24px);
            box-sizing: border-box;
            margin-top: 10px;
            background: rgba(255, 255, 255, 0.7);
            color: #000;
        }

        #feedback {
            font-size: 1.2rem;
            margin-top: 15px;
            color: #ff6b6b;
        }

        footer {
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            color: #000;
            text-align: center;
            padding: 10px;
            position: fixed;
            width: 100%;
            bottom: 0;
            box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.1);
            text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.6);
        }

        .modal {
            display: none;
            position: fixed;
            z-index: 1;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            justify-content: center;
            align-items: center;
        }

        .modal-content {
            background-color: #fff;
            margin: auto;
            padding: 20px;
            border: 1px solid #888;
            width: 80%;
            max-width: 400px;
            text-align: center;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            border-radius: 15px;
            animation: scale-up 0.3s ease-out;
        }

        @keyframes scale-up {
            from {
                transform: scale(0.7);
            }
            to {
                transform: scale(1);
            }
        }

        .close {
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
        }

        .close:hover,
        .close:focus {
            color: black;
            text-decoration: none;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <header>
        <h1>Interactive Math App</h1>
    </header>

    <main>
        <section>
            <h2 id="level-indicator">Level 1</h2>
            <div id="progress-bar-container">
                <div id="progress-bar"></div>
            </div>
            <div id="problem-container"></div>
            <input type="text" id="answer" placeholder="Enter your answer">
            <button id="submit-button">Submit</button>
            <div id="feedback"></div>
        </section>
    </main>

    <footer>
        <p>&copy; 2024 MathMind. All rights reserved.</p>
    </footer>

    <div id="level-up-modal" class="modal">
        <div class="modal-content">
            <span class="close" id="close-modal">&times;</span>
            <h2>Level Up!</h2>
            <p>Congratulations! You've leveled up to <span id="new-level"></span>!</p>
        </div>
    </div>

    <script>
        let level = 1;
        let progress = 0;
        let incorrectAttempts = 0;
        const progressBar = document.getElementById('progress-bar');
        const levelIndicator = document.getElementById('level-indicator');
        const levelUpModal = document.getElementById('level-up-modal');
        const closeModal = document.getElementById('close-modal');
        const problemContainer = document.getElementById('problem-container');
        const answerInput = document.getElementById('answer');
        const feedback = document.getElementById('feedback');
        const newLevelDisplay = document.getElementById('new-level');
        let currentProblem = {};

        function generateProblem() {
            const operations = ['+', '-', '*', '/'];
            const num1 = Math.floor(Math.random() * (level * 10)) + 1;
            const num2 = Math.floor(Math.random() * (level * 10)) + 1;
            const operation = operations[Math.floor(Math.random() * operations.length)];
            let problemText = `${num1} ${operation} ${num2}`;
            let solution;

            if (operation === '/') {
                problemText = `${num1 * num2} / ${num2}`;
                solution = num1;
            } else {
                solution = eval(problemText);
            }

            problemContainer.textContent = `Solve: ${problemText}`;
            return { problemText, solution };
        }

        function checkAnswer() {
            const userAnswer = parseFloat(answerInput.value).toFixed(2);
            if (userAnswer == currentProblem.solution) {
                feedback.textContent = "Correct!";
                feedback.style.color = "green";
                updateProgress();
                incorrectAttempts = 0;
            } else {
                incorrectAttempts++;
                feedback.textContent = `Incorrect! You have ${2 - incorrectAttempts} attempts left.`;
                feedback.style.color = "red";
                if (incorrectAttempts >= 2) {
                    feedback.textContent = `Incorrect! The correct answer was ${currentProblem.solution}.`;
                    incorrectAttempts = 0;
                    updateProgress(true);
                }
            }
            answerInput.value = '';
            currentProblem = generateProblem();
        }

        function updateProgress(reset = false) {
            if (reset) {
                progress -= 10;
                if (progress < 0) progress = 0;
            } else {
                progress += 10;
            }

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
            setTimeout(() => {
                levelUpModal.style.display = 'none';
            }, 2000);
        }

        closeModal.addEventListener('click', () => {
            levelUpModal.style.display = 'none';
        });

        document.getElementById('submit-button').addEventListener('click', checkAnswer);

        document.getElementById('answer').addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                checkAnswer();
            }
        });

        // Initialize the first problem
        currentProblem = generateProblem();
    </script>
</body>
</html>
