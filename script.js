
const timer = {
  granted: false,
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
const message = document.getElementById("message");
const buttonSound = new Audio("click.mp3");
const hurray = new Audio("yay.m4a");
const hey = new Audio("hey.mp3");
const pomoInput = document.getElementById("pomodoro-input");
const shortInput = document.getElementById("short-input");
const longInput = document.getElementById("long-input");

configuration.addEventListener("click", () => {
})

// NOTIFICATIONS GRANTED PERMISSION
document.addEventListener("DOMContentLoaded", () => {
  MicroModal.init();
  // Check if the browser supports notifications
  if ("Notification" in window) {
    // If notification permissions have neither been granted or denied
    if (
      Notification.permission !== "granted" &&
      Notification.permission !== "denied"
    ) {
      // Ask user permission
      Notification.requestPermission().then(function (permission) {
        // If permission granted
        if (permission === "granted") {
          // Create a new notification
          new Notification(
            "Coolio! You will be notified when each session is done!"
          );
          timer.granted = true;
        }
      });
    }
  }
});


// Global Var used to STAHP the damn timer when pressed
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

// OPEN MODAL
//configuration.addEventListener("click", () => {
  //alert("Hey let's do this &times");
//})

/* ==========================================================================
 * handleButtons(clickEvent)
 *  updates the DOM by appending the active class to each button
 *  passes the button state to the buttonClick function
======================================================================== */
function handleButtons(event) {
  // We only want to do stuff if the button aint active
  if (event.target.tagName === "BUTTON") {
    if (event.target.classList.contains("active")) {
      return;
    } else {
      pomoButtons.forEach((btn) => {
        btn.classList.remove("active");
      });
      event.target.classList.add("active");
      buttonClick(event.target.id); // 'pomo', 'short', 'long'
    }
  }
}

/* ==========================================================================
 * buttonClick(string -> button'id')
*   toggles the pomo/short/long CSS class on the main section to change color 
======================================================================== */
function buttonClick(button) {
  // Remove any class on mainSection first,change the text then the background
  switch (button) {
    case "pomo":
      mainSection.classList.remove("short");
      mainSection.classList.remove("long");
      toggleMessage("Let's get to work!");
      break;
    case "short":
      mainSection.classList.remove("pomo");
      mainSection.classList.remove("long");
      toggleMessage("Time for a break!");
      break;
    case "long":
      mainSection.classList.remove("pomo");
      mainSection.classList.remove("short");
      toggleMessage("Time for a break!");
      break;
    default:
      console.log(`Sorry, I suck with this...? ${button}.`);
  }

  // Keep track of state internally
  timer["state"] = button; // pomo, short, long

  // 25:00, 05:00, 15:00 -> 25, 5, 15 -> 1500, 300, 900
  timer["time"] = parseInt(timer[button]) * 60;

  // Rerender DOM to correct time amount
  progressBar.style.width = 0;
  pomoString.innerText = timer[button];
  document.title = `${timer[button]} — ${docTitle}`;

  mainSection.classList.add(button);

  stopTimer();
}

/* ==========================================================================
 * startTimer()
 *  event listener on start button that will handle the timer functionality 
======================================================================== */
function startTimer() {
  timer["time"] = timer["time"] - 1;

  let minutes = Math.floor(timer["time"] / 60);
  let seconds = timer["time"] % 60;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  // RERENDER DOM BABY!
  document.title = `${minutes}:${seconds} — ${docTitle}`;
  pomoString.innerText = `${minutes}:${seconds}`;

  // UPDATE PROGRESSBAR
  let progress =
    (parseInt(timer[timer["state"]]) * 60 - timer["time"]) /
    (parseInt(timer[timer["state"]]) * 60);
  progress = progress * 100;
  progressBar.style.width = `${progress}%`;

  // TIMER IS DONE!
  if (timer.time <= 0) {
    // Redefine timer back to its original state
    timer.time = parseInt(timer[timer["state"]]) * 60;

    // Notification for the homies to stop
    if (Notification.permission === "granted" && timer.granted) {
      const text =
        timer.state === "pomo" ? "Get back to work my guy!" : "Take a break, you've done good brother!";
      new Notification(text);

    }

    // If you finished the sprint then celebrate!
    // If you didn't then back to work my guy
    if (timer.state == "pomo") {
      celebrateGoodTimesCmon();
    } else {
      backToWorkBaby();
    }

    stopTimer();
    return;
  }
}

/* ==========================================================================
 * stopTimer()
 *   ran whenever settings button is clicked, or stop button is pressed
 *   uses builtin clearTimeout() to stop JS recursive setInterval() calls
 *   updates start button to "START" mode
======================================================================== */
function stopTimer() {
  clearTimeout(wrapper);
  startButton.dataset.action = "start";
  startButton.textContent = "start";
  startButton.classList.remove("active-start");
}

/* ==========================================================================
 * celebrateGoodTimesCmon()
 *   called whenever pomodoro is done
 *   displays confetti and music for the kids in all of us
======================================================================== */

function celebrateGoodTimesCmon() {
  toggleMessage("You deff deserve a break now!");
  hurray.play();
  confetti.start(4000);
}

/* ==========================================================================
 * backToWorkBaby()
 *   called whenever break is done
 *   sounds a kid saying hey 4x
======================================================================== */

function backToWorkBaby() {
  hey.play();
  toggleMessage("Okiee let's work now!");
}

function toggleMessage(msg) {
  message.innerText = msg;
}

// Necessary for accidental reload
window.onbeforeunload = function() {
   if (data_needs_saving()) {
       return "Just displaying this incase you're in the middle of a pomodoro!";
   } else {
      return;
   }
};
