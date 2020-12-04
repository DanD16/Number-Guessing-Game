let rand = (min, max) => {
		return Math.floor(Math.random() * (max - min +1)) + min;
};

//limiting input to a range
document.getElementById('guess-input').oninput = function () {
    let max = parseInt(this.max);

    if (parseInt(this.value) > max) {
        this.value = max; 
    }
};

//randomising images
const iconRandomiser = () => {
	document.getElementById('player-icon').src = `https://robohash.org/${rand(1,1000)}?set=set4`
	document.getElementById('opponent-icon').src = `https://robohash.org/${rand(1,1000)}?set=set3`
};

iconRandomiser();

//game logic & input checks
const noInputButtonText = document.getElementById('no-input-text');
const input = document.getElementById('guess-input');
const buttonInput = document.getElementById('guess-input-button');
const centerLog = document.getElementById('center-log');
const leftLog = document.getElementById('left-log');
const rightLog = document.getElementById('right-log');
const secretNumber = rand(0, 100);
let guess = undefined;
let oppGuess = undefined;

//for debugging and opponent logic purposes
let sortingObj = {
	playerGuess: [],
	oppGuess: [],
	tooHighArray: [],
	tooLowArray: [],
};

const inputLogic = () => {
	//checking for input value from <input> and <button>
	input.addEventListener('keydown', event => {
		input === document.activeElement && event.keyCode === 13 && input.value !== '' ? sorting() : null;
		//preventing string inputs
		if (event.keyCode != 8 && event.keyCode != 0 && event.keyCode < 48 || event.keyCode > 57 && event.keyCode < 96 || event.keyCode > 105) {
        	event.preventDefault();
    	}
	});
	buttonInput.onclick = () => {
		input.value === '' ?  noInput() : sorting();
	};
	//checking for winning condition, sorting values into arrays
	//for visual, debugging and opponent's logic purposes
	const sorting = () => {
		guess = input.value;
		input.value = '';
		if (guess == secretNumber) {
			win('player');
			return;
		};
		mainLog('player');
		sideLog('player');
		sortingObj.playerGuess.push(guess);
		guess < secretNumber ? sortingObj.tooLowArray.push(guess) : sortingObj.tooHighArray.push(guess);
		oppLogic();
	};
	//setting up warning message behaviour
	const noInput = () => {
		noInputButtonText.style.zIndex = '1';
		noInputButtonText.style.opacity = '1';
		noInputButtonText.style.animationName = 'fadingOut';
		noInputButtonText.style.animationDuration = '3s';
		noInputButtonText.addEventListener('animationend', () => {
			noInputButtonText.style.zIndex = '-1';
			noInputButtonText.style.opacity = '0';
			noInputButtonText.style.animationName = '';
		});
	};
};

inputLogic();

const mainLog = (i) => {
	if (i == 'player') {
		tooLow = `The guess: ${guess} was too low!`;
		tooHigh = `The guess: ${guess} was too high!`;
	} else {
		tooLow = `Opponent's guess: ${guess} was too low!`;
		tooHigh = `Opponent's guess: ${guess} was too high!`; 
	};
	
	const par = document.createElement('p');

	if (guess < secretNumber) {
		lowNode = document.createTextNode(`${tooLow}`);
		par.appendChild(lowNode);
		//had to leave appendchild here and below in the else
		//in vanilla other options for this formatting would've been: function returning a value or
		//create a span, append the p to span
		centerLog.appendChild(par);
		centerLog.lastElementChild.style.color = 'rgb(0, 0, 120)';
	} else {
		highNode = document.createTextNode(`${tooHigh}`);
		par.appendChild(highNode);
		centerLog.appendChild(par);
		centerLog.lastElementChild.style.color = 'rgb(120, 0, 0)';
	};

	centerLog.childElementCount === 6 ? centerLog.children[0].remove() : null;
};

const sideLog = (i) => {
	const par = document.createElement('p');
	guessNode = document.createTextNode(`${guess}`);
	par.appendChild(guessNode);

	if (i == 'player') {
		rightLog.appendChild(par);
		
		if (guess < secretNumber) {
			rightLog.lastElementChild.style.color = 'rgb(0, 0, 120)';
		} else {
			rightLog.lastElementChild.style.color = 'rgb(120, 0, 0)';
		};
	} else {
		leftLog.appendChild(par);

		if (guess < secretNumber) {
			leftLog.lastElementChild.style.color = 'rgb(0, 0, 120)';
		} else {
			leftLog.lastElementChild.style.color = 'rgb(120, 0, 0)';
		};
	};

	rightLog.childElementCount === 4 ? numbersOutRight() : null;
	leftLog.childElementCount === 4 ? numbersOutLeft() : null;

	numbersOutRight = () => {
		rightLog.children[0].style.animationName = 'zoomOutUp';
		rightLog.children[0].style.animationDuration = '1s';
		rightLog.children[0].addEventListener('animationend', () => {
			rightLog.children[0].remove();
		});
	};

	numbersOutLeft = () => {
		leftLog.children[0].style.animationName = 'zoomOutUp';
		leftLog.children[0].style.animationDuration = '1s';
		leftLog.children[0].addEventListener('animationend', () => {
			leftLog.children[0].remove();
		});
	};
};

//opponent's guess logic
const oppLogic = () => {
	input.disabled = true;
	buttonInput.disabled = true;
	setTimeout(() => {
		input.disabled = false;
		buttonInput.disabled = false;
	}, 3000);

	//limiting opponent choices to a range of numbers, based on previous guesses
	let low = Math.max(...sortingObj.tooLowArray);
	let high = Math.min(...sortingObj.tooHighArray);

	sortingObj.tooLowArray.length === 0 ? low = 0 : null;
	sortingObj.tooHighArray.length === 0 ? high = 100 : null;

	//adding/subtracting 1 to avoid boundary number choices
	//e.g. 70 is too high, but 70 is still a valid choice for opponent
	guess = rand(low + 1, high - 1);
	guess < secretNumber ? sortingObj.tooLowArray.push(guess) : sortingObj.tooHighArray.push(guess);
	setTimeout(() => {
		if (guess == secretNumber) {
			win('opp');
			return;
		};
		sideLog('opp');
		mainLog('opp');
	}, 1500);
};

const win = (i) => {
	if (guess == secretNumber) {
		const par = document.createElement('p');
		if (i == 'player') {
			winText = document.createTextNode(`Congratulations you guessed the secret number: ${guess}!`);
		} else {
			winText = document.createTextNode(`Your opponent guessed the secret number! It was ${guess}!`);
		}
		centerLog.childElementCount === 5 ? centerLog.children[0].remove() : null;
		par.appendChild(winText);
		centerLog.appendChild(par);
		if (i == 'opp') {
			setTimeout(() => {
				input.disabled = true;
				buttonInput.disabled = true;
			}, 1500);
		} else {
			input.disabled = true;
			buttonInput.disabled = true;
		};
	};
};