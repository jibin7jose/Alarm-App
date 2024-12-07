const timerRef = document.querySelector(".current-time");
const hourInput = document.getElementById("hour-input");
const minuteInput = document.getElementById("minute-input");
const activeAlarms = document.querySelector(".alarms-list");
const setAlarm = document.getElementById("set");
const clearAllButton = document.querySelector(".clear");
const alarmSound = new Audio("./alarm.mp3");

let alarmIndex = 0;
let alarmsArray = [];
let initialHour = 0;
let initialMinute = 0;

// function to append a leading zero to single digit value
const appendZero = (value) => (value < 10 ? "0" + value : value);

// function to display the time and trigger alarms 
const displayTimer = () => {
    const date = new Date();
    const currentTime = date.toLocaleTimeString("en-US", {
        hour12: false
    });
    timerRef.textContent = currentTime;

    // check if it's time to trigger alarms  
    alarmsArray.forEach((alarm) => {
        if (alarm.isActive && alarm.time === currentTime.slice(0, 5)) {
            alarmSound.play();
        }
    });
};

// create new alarm 
const createAlarm = (hour, minute) => {
    alarmIndex += 1;

    // create alarm Object 
    const alarmObj = {
        id: `${alarmIndex}_${hour}_${minute}`,
        time: `${appendZero(hour)}:${appendZero(minute)}`,
        isActive: false
    };

    // Add alarm to the array and create UI representation 
    alarmsArray.push(alarmObj);

    // Correctly create the alarm div element
    const alarmDiv = document.createElement("div"); // Corrected this line
    alarmDiv.className = "alarm";
    alarmDiv.dataset.id = alarmObj.id;
    alarmDiv.innerHTML = `<span>${alarmObj.time}</span>`;

    // Create checkbox to activate/deactivate the alarm 
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.addEventListener("change", () => toggleAlarm(alarmObj));
    alarmDiv.appendChild(checkbox);

    // Create delete button for the alarm
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    deleteButton.className = "deleteButton";
    deleteButton.addEventListener("click", () => deleteAlarm(alarmObj));
    alarmDiv.appendChild(deleteButton);

    // Append the alarm div to the alarms list
    activeAlarms.appendChild(alarmDiv); // Make sure this is appending to the correct parent element
};

// function to toggle  the alarm's active class 
const toggleAlarm = (alarm) => {
    alarm.isActive = !alarm.isActive;
    if (alarm.isActive) {
        const currentTime = new Date().toLocaleTimeString("en-US", { hour12: false }).slice(0, 5);
        if (alarm.time === currentTime) {
            alarmSound.play();
        }
    } else {
        alarmSound.pause();
    }
};

// function to delete an alarm 
const deleteAlarm = (alarm) => {
    const index = alarmsArray.indexOf(alarm);
    if (index > -1) {
        alarmsArray.splice(index, 1);
        // Find the alarm div by dataset.id and remove it
        document.querySelector(`[data-id="${alarm.id}"]`).remove();
    }
};

// Event listener for clearing all alarms
clearAllButton.addEventListener("click", () => {
    alarmsArray = [];
    activeAlarms.innerHTML = "";
});

// Event listener for setting a new alarm 
setAlarm.addEventListener("click", () => {
    let hour = parseInt(hourInput.value) || 0;
    let minute = parseInt(minuteInput.value) || 0;

    // validate the input values 
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
        alert("Invalid hour or minute. Please enter values within the valid range!");
        return;
    }

    // check if an alarm with the same time already exists 
    if (!alarmsArray.some(alarm => alarm.time === `${appendZero(hour)}:${appendZero(minute)}`)) {
        createAlarm(hour, minute);
    }

    // clear input fields 
    [hourInput.value, minuteInput.value] = ["", ""];
});

window.onload = () => {
    setInterval(displayTimer, 1000);
    [hourInput.value, minuteInput.value] = ["", ""];
};
