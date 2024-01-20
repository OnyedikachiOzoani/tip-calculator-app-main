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
	// set initial values
	switch (numberInput.id) {
		case "bill-amount-input": {
			numberInput.value = billAmount;
			break;
		}

		case "number-of-people-input": {
			numberInput.value = noOfPersons;
		}

		default:
			break;
	}
});
// add click event listener to the percent buttons
percentBtns.forEach((percentBtn, index) => {
	percentBtn.addEventListener("click", handleEvents);
	// set initial value
	if (percentBtn.innerText === "15%") percentBtn.classList.add("active");
});
// set initial feedback results
updateResultFeedback(calculateTips(billAmount, tipPercent, noOfPersons));

// add click event to reset button
resetBtn.addEventListener("click", handleEvents);

// event handler
function handleEvents(event) {
	// update the reset button if used recently, and only if the new event.currentTarget's value can parse to a number type
	if (valuesResetted) {
		if (
			canNumericParse(event.currentTarget.value) ||
			canNumericParse(event.currentTarget.innerText.slice(0, -1))
		) {
			valuesResetted = false;
			resetBtn.classList.remove("active");
		}
	}

	// check which event was fired
	if (event.type === "input") {
		// update arithmetic values for each input cases
		switch (event.currentTarget.id) {
			case "bill-amount-input": {
				if (canNumericParse(event.currentTarget.value)) {
					billAmount = parseFloat(event.currentTarget.value);
					// remove any error feedback
					removeError(event.currentTarget);
				} else {
					showError(event.currentTarget);
				}
				break;
			}

			case "custom-percent-input": {
				if (canNumericParse(event.currentTarget.value)) {
					tipPercent = parseFloat(event.currentTarget.value) / 100;
					// remove any error feedback
					removeError(event.currentTarget);

					// remove any visual feedback on the percentBtns
					percentBtns.forEach((percentBtn) => {
						if (percentBtn.classList.contains("active"))
							percentBtn.classList.remove("active");
					});
				} else {
					showError(event.currentTarget);
				}
				break;
			}

			case "number-of-people-input": {
				if (canNumericParse(event.currentTarget.value)) {
					noOfPersons = parseFloat(event.currentTarget.value);
					// remove any error feedback
					removeError(event.currentTarget);
				} else {
					showError(event.currentTarget);
				}
				break;
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
		// this block runs if any of the percentBtns was clicked
		tipPercent =
			parseFloat(event.currentTarget.innerText.slice(0, -1)) / 100;

		// check if arithmetic variables are valid before updating feedback
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
	const tipPerPersonText = `${feedbackObject.tipPerPerson}`;
	const totalTipsSumText = `${feedbackObject.totalAmountPerPerson}`;

	// patterns for formating feedback number
	const regex1 = /^\d+\.\d$/;
	const regex2 = /^\d$/;

	// format feedback number if matched any of the patterns
	switch (true) {
		// next two cases are for formatting number with one decimal place
		case regex1.test(tipPerPersonText): {
			tipPerPersonEl.textContent = `$${tipPerPersonText}0`;
			break;
		}

		case regex1.test(totalTipsSumText): {
			totalTipsSumEl.textContent = `$${totalTipsSumText}0`;
			break;
		}

		// next two cases are for formatting number with only one digit
		case regex2.test(tipPerPersonText): {
			tipPerPersonEl.textContent = `$${tipPerPersonText}.00`;
			break;
		}

		case regex2.test(totalTipsSumText): {
			totalTipsSumEl.textContent = `$${totalTipsSumText}.00`;
			break;
		}

		// if none of the above cases match, then don't format
		default: {
			tipPerPersonEl.textContent = `${tipPerPersonText}`;
			totalTipsSumEl.textContent = `${totalTipsSumText}`;
		}
	}
}

// reset all values to zero
function resetAllValues() {
	billAmount = 0;
	tipPercent = 0;
	noOfPersons = 0;
	// set input fields values to zero
	numberInputs.forEach((numberInput) => {
		numberInput.value = "0";
		// remove any error messages
		removeError(numberInput);
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

// created this function to fix the issue of whether the inputted string value can be parsed to a number, and doesn't return true for zero (0) values
function canNumericParse(string) {
	const numberPattern = /^(?!^0+(\.0+)?$)\d+(\.\d+)?$/;
	return numberPattern.test(string);
}

// show error on negative numbers, zero or invalid characters
function showError(inputElement) {
	// add the invalid class to the input element
	inputElement.classList.add("invalid");

	// get the errorMessage element
	const errorMessage = inputElement.nextElementSibling;
	// set appropriate messages for each error
	if (/^0+$/.test(inputElement.value)) {
		errorMessage.textContent = "Can't be zero";
	} else if (/^-/.test(inputElement.value)) {
		// this block runs if it's a negative value
		errorMessage.textContent = "Can't be negative";
	} else {
		errorMessage.textContent = "Enter a valid number";
	}
	// display error message
	errorMessage.classList.add("active");
	// make the reset button clickable anytime an error is shown
	valuesResetted = false;
	resetBtn.classList.remove("active");

	// position the errorMessage element
	const gap = parseFloat(
		window
			.getComputedStyle(inputElement.parentElement.parentElement)
			.getPropertyValue("gap")
			.slice(0, -2)
		// slice removes the px at the
	);
	const errorMessageHeight = errorMessage.getBoundingClientRect().height;
	const inputElementHeight = inputElement.getBoundingClientRect().height;
	if (inputElement.id !== "custom-percent-input") {
		errorMessage.style.top = `-${gap + errorMessageHeight}px`;
	} else {
		errorMessage.style.top = `${inputElementHeight + 2}px`;
	}
}

// remove error if conditions are valid
function removeError(inputElement) {
	// remove unrequired classes
	inputElement.classList.remove("invalid");
	// get the error message element
	const errorMessage = inputElement.nextElementSibling;
	errorMessage.classList.remove("active");
}
