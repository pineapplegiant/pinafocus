/* ==========================================================================
 * timer objects is the data for the app
 * Data flows from the DOM to change timer and back to the DOM
======================================================================== */

// DATA
const timer = {
  state: "pomo",
  time: 1500,
  pomo: "25:00",
  short: "5:00",
  long: "15:00",
};

// ELEMENTS
const pomoSettings = document.getElementById("settings");
const pomoButtons = document.querySelectorAll(".pomodoro--button");
const pomoString = document.getElementById("pomodoro-string");
const mainSection = document.getElementById("main");
const startButton = document.getElementById("start");
const progressBar = document.getElementById("progress-bar");
const docTitle = document.title;
const buttonSound = new Audio("click.mp3");
const hurray = new Audio("yay.m4a");

// Used to STAHP the damn timer when pressed
var wrapper;

// EVENT LISTENERS
pomoSettings.addEventListener("click", handleButtons);
startButton.addEventListener("click", () => {
  buttonSound.play();
  const { action } = startButton.dataset;
  if (action === "start") {
    startButton.dataset.action = "stop";
    startButton.textContent = "stop";
    startButton.classList.add("active-start");
    wrapper = setInterval(() => {
      startTimer();
    }, 1000);
  } else {
    stopTimer();
  }
});

/* ==========================================================================
 * handleButtons(clickEvent)
 *  updates the DOM by appending the active class to each button if clicked
 *  passes the button state to the buttonClick function
======================================================================== */
function handleButtons(event) {
  // If it's the pomoButton, do the thing
  if (event.target.tagName === "BUTTON") {
    if (event.target.classList.contains("active")) {
      return;
    } else {
      // Remove the active class on each button first
      pomoButtons.forEach((btn) => {
        btn.classList.remove("active");
      });
      // Add active class on button
      event.target.classList.add("active");

      // Handle the specific button
      buttonClick(event.target.id); // 'pomo', 'short', 'long'
    }
  }
}

/* ==========================================================================
 * buttonClick(string -> button'id')
*   toggles pomo/short/long class on the main section to change color 
======================================================================== */
function buttonClick(button) {
  // Remove any class on mainSection first
  // Change the text then the background
  switch (button) {
    case "pomo":
      mainSection.classList.remove("short");
      mainSection.classList.remove("long");
      break;
    case "short":
      mainSection.classList.remove("pomo");
      mainSection.classList.remove("long");
      break;
    case "long":
      mainSection.classList.remove("pomo");
      mainSection.classList.remove("short");
      break;
    default:
      console.log(`Sorry, I suck with this...? ${button}.`);
  }

  // Change state internally
  timer["state"] = button; // pomo, short, long
  timer["time"] = parseInt(timer[button]) * 60; // 25:00, 05:00, 15:00 -> 25, 5, 15 -> 1500, 300, 900
  progressBar.style.width = 0; // Width of progressbar is 0

  // Rerender DOM to correct time amount
  pomoString.innerText = timer[button];
  document.title = `${timer[button]} — ${docTitle}`;

  // Add style class to main
  mainSection.classList.add(button);

  stopTimer();
}
/* ==========================================================================
 * startTimer()
 *  event listener on start button that will handle the timer functionality 
======================================================================== */

function startTimer() {
  // Subtract inner clock
  timer["time"] = timer["time"] - 1;

  // Manipulation to min/seconds
  let minutes = Math.floor(timer["time"] / 60);
  let seconds = timer["time"] % 60;

  // If seconds or minutes are less than 10, redefine as double digit
  seconds = seconds < 10 ? "0" + seconds : seconds;

  // RERENDER THE DOM BABY!
  document.title = `${minutes}:${seconds} — ${docTitle}`;
  pomoString.innerText = `${minutes}:${seconds}`;

  // UPDATE THE PROGRESSBAR
  // Fraction of time left over totaltime
  let progress =
    (parseInt(timer[timer["state"]]) * 60 - timer["time"]) /
    (parseInt(timer[timer["state"]]) * 60);
  progress = progress * 100;
  progressBar.style.width = `${progress}%`;

  if (timer["time"] <= 0) {
    // Redefine timer back to its original state
    timer["time"] = parseInt(timer[timer["state"]]) * 60;

    if (timer["state"] == "pomo") {
      celebrateGoodTimesCmon();
    }
    stopTimer();
    return;
  }
}

function stopTimer() {
  clearTimeout(wrapper);
  startButton.dataset.action = "start";
  startButton.textContent = "start";
  startButton.classList.remove("active-start");
}


function celebrateGoodTimesCmon() {
  hurray.play();
  confetti.start(4000);
}
