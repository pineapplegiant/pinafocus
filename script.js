// BUTTONS
const pomoSettings = document.getElementById("settings");
pomoSettings.addEventListener("click", handleButtons); // Event propagation
const pomoButtons = document.querySelectorAll(".pomodoro--button");

// Main section
const mainSection = document.getElementById("main");

// Pomodoro settings buttons
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

// Handle button click by using the button's ID
function buttonClick(button) {

  // Remove anything first
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
      console.log(`Sorry, I suck...?  ${button}.`);
  }
  mainSection.classList.add(button);
}
