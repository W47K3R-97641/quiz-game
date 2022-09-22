// Select Element
let countSpan = document.querySelector(".quiz-info .count");
let bullets = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitBtn = document.querySelector(".submit-btn");
let quizApp = document.querySelector(".quiz-app");
let bulletsContainer = document.querySelector(".bullets");
let counterTime = document.querySelector(".count-time");

// Set Option
let currentIndex = 0;
let count_Right_Quiz = 0;
let countdownInterval;

function getQuestions() {
  fetch("./questions/html.json")
    .then((dataQuestions) => {
      return dataQuestions.json();
    })
    .then((quiz) => {
      let number_Of_Answers = quiz[currentIndex].answer.length;
      // Create Bullets + Set Quiz Count
      let quiz_Count = quiz.length;
      createBullets(quiz_Count);

      // Add Quiz Data
      addQuiz(quiz[currentIndex], number_Of_Answers, quiz_Count);

      // Count Down Timer
      counterDown(5, quiz_Count);

      // Click On Submit
      submitBtn.onclick = function () {
        // Get Right Answer Quiz
        let right_Answer_Quiz = quiz[currentIndex].right_answer;

        // Increase Index
        currentIndex++;

        // Check If Right Answer Of Quiz
        check_Quiz(right_Answer_Quiz, quiz_Count);

        // Remove Previous Quiz
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";

        // Add  Next Quiz Data
        addQuiz(quiz[currentIndex], number_Of_Answers, quiz_Count);

        // Handle Bullets Class
        handleBullets();

        // Stop Counter Down
        clearInterval(countdownInterval);

        // Start New Counter Down
        counterDown(5, quiz_Count);

        // Check If Quiz_Count End
        if (quiz_Count === currentIndex) {
          // Show Result Of Quiz
          showResult(quiz_Count, true);

          // Set Button For Again Quiz
          submitBtn.innerHTML = "Again";
          submitBtn.onclick = function () {
            window.location.reload();
          };
        }
      };
    });
}

getQuestions();

function createBullets(quiz_Count, create_delete) {
  // Add Num Questions
  countSpan.innerHTML = `Questions Count: ${quiz_Count}`;

  for (let index = 0; index < quiz_Count; index++) {
    // Create Bullet
    let theBullet = document.createElement("span");

    // Check First Bullet Active
    if (index == 0) {
      theBullet.className = "on";
    }

    // Append Bullets To Main Bullet Container
    bullets.appendChild(theBullet);
  }
}

function addQuiz(obj, number_Of_Answers, quiz_Count) {
  if (currentIndex < quiz_Count) {
    // Create H2 Question Title
    let questionTitle = document.createElement("h2");

    // Text Align:center For questionTitle
    questionTitle.style.textAlign = "center";
    
    // Create H2 Question Text
    questionTitle.appendChild(document.createTextNode(obj.title));

    // Append H2 To The Quiz Area
    quizArea.appendChild(questionTitle);

    // Random Index Answer
    let randomAnswer = random(number_Of_Answers);

    // Create The Answers
    for (let index = 0; index < number_Of_Answers; index++) {
      // Create Main Answer Div
      let mainDiv = document.createElement("div");

      // Add Class "Answer" For Main Div
      mainDiv.className = "answer";

      // Create Radio Input
      let radioInput = document.createElement("input");

      // Add Type + Name + Id + Data-Attribute
      radioInput.name = "questions";
      radioInput.type = "radio";
      radioInput.id = `answer_${index + 1}`;
      radioInput.dataset.answer = obj.answer[randomAnswer[index]];

      // Make First Answer Selected
      if (index === 0) {
        radioInput.checked = true;
      }

      // Create Label
      let theLabel = document.createElement("label");

      // Add For Attribute
      theLabel.htmlFor = `answer_${index + 1}`;

      // Create Label Text And Add To Label
      theLabel.appendChild(
        document.createTextNode(obj.answer[randomAnswer[index]])
      );

      // Add radioInput + Label To Main div
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);

      // Append All Divs To Answers Area
      answersArea.appendChild(mainDiv);
    }
  }
}

function random(number_Of_Answers) {
  let arrRandom = [];
  let index = 0;
  while (index < number_Of_Answers) {
    let random = Math.floor(Math.random() * number_Of_Answers);
    if (arrRandom.includes(random)) {
      continue;
    } else {
      arrRandom[index] = random;
      index++;
    }
  }
  return arrRandom;
}

function check_Quiz(right_Answer_Quiz, quiz_Count) {
  // Answers Quiz
  let answers_Quiz = document.getElementsByName("questions");
  let theChosenAnswer;

  // Check The Chosen Answer
  answers_Quiz.forEach((answer) => {
    if (answer.checked == true) {
      theChosenAnswer = answer.dataset.answer;
    }
  });

  // Check If Answer Is Right Answer Of Quiz
  if (theChosenAnswer === right_Answer_Quiz) {
    // Increase Count Right Quiz
    count_Right_Quiz++;
  }
}

function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");

  // Add CLass On For Current Quiz
  bulletsSpans.forEach((span, index) => {
    if (currentIndex == index) {
      span.className = "on";
    }
  });
}

function showResult(quiz_Count, on_of) {
  if (on_of) {
    // Remove Bullets + Time Count Down
    bulletsContainer.remove();

    // Create h2 For Result
    let h2 = document.createElement("h2");

    // Add Class "result" To h2 Of Result
    h2.className = "result";

    // Add Count Right + Quiz Count To H2
    h2.innerHTML = `You Have <span class="right-count">${count_Right_Quiz}</span> Right Of <span class="count-Quiz">${quiz_Count}</span>`;

    // Add H2 Of Result To Quiz Area To Show Result
    quizArea.appendChild(h2);
  } else {
    quizArea.removeChild(quizArea.children[0]);
  }
}

function counterDown(duration, quiz_Count) {
  if (currentIndex < quiz_Count) {
    let minutes, seconds;

    countdownInterval = setInterval(() => {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      counterTime.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitBtn.click();
      }
    }, 1000);
  }
}
