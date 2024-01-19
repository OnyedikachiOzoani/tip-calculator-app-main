/** @format */

const tipInputForm = document.getElementById("tip-input-control-form");
const numberInputs = tipInputForm.querySelectorAll(".number-input");
const percentBtns = document.querySelectorAll(
	".percent-buttons-inner-container button"
);
const tipPerPersonEl = document.querySelector(".tip-per-person");
const totalTipsSumEl = document.querySelector(".total-tips-sum");
const resetBtn = document.querySelector(".reset-btn");

// set initial arithmetic variables
let billAmount = 142.55;
let tipPercent = 0.15;
let noOfPersons = 5;

// add input event listener to input fields to update feedback as user types
numberInputs.forEach((numberInput) => {
	numberInput.addEventListener("input", handleEvents);
});
// add click event listener to the percent buttons
const randomNumber = Math.floor(Math.random() * percentBtns.length);
percentBtns.forEach((percentBtn, index) => {
	percentBtn.addEventListener("click", handleEvents);
});
// add click event to reset button
resetBtn.addEventListener("click", handleEvents);

// set initial feedback results
updateResultFeedback(calculateTips(billAmount, tipPercent, noOfPersons));

// event handler
function handleEvents(event) {
	// check which event was fired
	if (event.type === "input") {
		switch (event.target.id) {
			case "bill-amount-input": {
				billAmount = parseFloat(event.target.value);
				break;
			}

			case "custom-percent": {
				tipPercent = parseFloat(event.target.value) / 100;
				break;
			}

			case "number-of-people-input": {
				noOfPersons = parseFloat(event.target.value);
			}

			default:
				break;
		}
	} else if (event.type === "click") {
		if (event.target.classList.contains("reset-btn")) {
			resetAllValues();
		} else {
			tipPercent =
				parseFloat(event.target.textContent.slice(0, -1)) / 100;
		}
	}

	// update the feedback section
	updateResultFeedback(calculateTips(billAmount, tipPercent, noOfPersons));
}

// tip calculator function
function calculateTips(billAmount, tipPercent, noOfPersons) {
	// get initial amount to be paid each person without tips
	const initialAmountPerPerson = billAmount / noOfPersons;
	// get the tip amount to be paid each person
	let tipAmountPerPerson = (billAmount * tipPercent) / noOfPersons;
	// get the final total amount to be paid each person including the tips
	let finalAmountPerPerson = initialAmountPerPerson + tipAmountPerPerson;
	// round values to 2 decimal places
	tipAmountPerPerson = Math.round(tipAmountPerPerson * 100) / 100;
	finalAmountPerPerson = Math.round(finalAmountPerPerson * 100) / 100;

	const feedbackObject = {
		tipPerPerson: tipAmountPerPerson,
		totalAmountPerPerson: finalAmountPerPerson,
	};
	return feedbackObject;
}

function updateResultFeedback(feedbackObject) {
	tipPerPersonEl.textContent = `$${feedbackObject.tipPerPerson}`;
	totalTipsSumEl.textContent = `$${feedbackObject.totalAmountPerPerson}`;
}

// reset all values to zero
function resetAllValues(params) {
	// load through all input fields and set values to zero
	numberInputs.forEach((numberInput) => {
		numberInput.value = "0";
	});
}
