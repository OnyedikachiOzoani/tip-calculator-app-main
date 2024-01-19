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

let valuesResetted = false;

// add input event listener to input fields to update feedback as user types
numberInputs.forEach((numberInput) => {
	numberInput.addEventListener("input", handleEvents);
});
// add click event listener to the percent buttons
percentBtns.forEach((percentBtn, index) => {
	percentBtn.addEventListener("click", handleEvents);
});
// add click event to reset button
resetBtn.addEventListener("click", handleEvents);

// set initial feedback results
updateResultFeedback(calculateTips(billAmount, tipPercent, noOfPersons));

// event handler
function handleEvents(event) {
	// update the reset button if used recently, and only if the new event's value can parse to a number type
	if (valuesResetted && !isNaN()) {
		valuesResetted = false;
		resetBtn.classList.remove("active");
	}
	// check which event was fired
	if (event.type === "input") {
		switch (event.currentTarget.id) {
			case "bill-amount-input": {
				if (!isNaN(parseFloat(event.currentTarget.value))) {
					billAmount = parseFloat(event.currentTarget.value);
				}
				break;
			}

			case "custom-percent-input": {
				if (!isNaN(parseFloat(event.currentTarget.value))) {
					tipPercent = parseFloat(event.currentTarget.value) / 100;
				}
				// remove any visual feedback on the percentBtns
				percentBtns.forEach((percentBtn) => {
					if (percentBtn.classList.contains("active"))
						percentBtn.classList.remove("active");
				});
				break;
			}

			case "number-of-people-input": {
				if (parseFloat(event.currentTarget.value)) {
					noOfPersons = parseFloat(event.currentTarget.value);
				}
			}

			default:
				break;
		}
		// check if arithmetic variables are valid before updating feedback
		if (checkArithmeticValues()) {
			// update the feedback section
			updateResultFeedback(
				calculateTips(billAmount, tipPercent, noOfPersons)
			);
		}
	} else if (event.currentTarget.classList.contains("reset-btn")) {
		resetAllValues();
		// update the reset variable
		valuesResetted = true;
		event.currentTarget.classList.add("active");
	} else {
		tipPercent =
			parseFloat(event.currentTarget.textContent.slice(0, -1)) / 100;

		if (checkArithmeticValues()) {
			// update the feedback section
			updateResultFeedback(
				calculateTips(billAmount, tipPercent, noOfPersons)
			);
		}
		// Update visual feedback
		event.currentTarget.classList.add("active");
		percentBtns.forEach((percentBtn) => {
			if (event.currentTarget !== percentBtn) {
				if (percentBtn.classList.contains("active"))
					percentBtn.classList.remove("active");
			}
		});
		// remove any value on the custom input element
		event.currentTarget.parentElement.querySelector(
			"#custom-percent-input"
		).value = "";
	}
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
	// format number
	const regex1 = /\w/;
}

// reset all values to zero
function resetAllValues() {
	billAmount = 0;
	tipPercent = 0;
	noOfPersons = 0;
	// load through all input fields and set values to zero
	numberInputs.forEach((numberInput) => {
		numberInput.value = "0";
	});
	// remove any visual feedback on the percentBtns
	percentBtns.forEach((percentBtn) => {
		if (percentBtn.classList.contains("active"))
			percentBtn.classList.remove("active");
	});
	// set feedbacks to zero
	tipPerPersonEl.textContent = "$0.00";
	totalTipsSumEl.textContent = "$0.00";
}

//set a funnction to check whether all needed values are updated after resetting values
function checkArithmeticValues() {
	if (billAmount === 0 || tipPercent === 0 || noOfPersons === 0) {
		return false;
	} else {
		return true;
	}
}

// created this function to fix the issue of whether the inputted string value can be parsed to a number
function canNumericParse(string) {
	const numberPattern = /^\d+(\.\d+)?$/;
}
