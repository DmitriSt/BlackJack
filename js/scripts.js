var cardsVariables = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'D', 'K', 'A'];
//var cardsVariables = [ 'J', 'D', 'K', 'A'];
var allCard = [];
var playerCards = document.getElementsByClassName('player-cards')[0];
var playerPoints = document.getElementsByClassName('player-points')[0];

var computerCards = document.getElementsByClassName('computer-cards')[0];
var computerPoints = document.getElementsByClassName('computer-points')[0];

var result = document.getElementsByClassName('result-game')[0];

var countersComputer = document.getElementsByClassName('counters-computer')[0];
var countersPlayer = document.getElementsByClassName('counters-player')[0];

var buttonAdd = document.getElementById('add');
var buttonPass = document.getElementById('pass');
var buttonStart = document.getElementById('start');

// create all cards
function createNewDesk() {
	allCard = [];
	for (var i = 4; i > 0; i--) {
		Array.prototype.push.apply(allCard, cardsVariables);
		// for (var j = 0; j < cardsVariables.length; j++) {
		// 	allCard.push(cardsVariables[j]);
		// }
	}

	allCard.sort((a, b) => {return Math.random() - 0.5;});
	return allCard;
}
createNewDesk();

// player object
var player = {
	countCards: 0,
	// countWin: 0,
	sumCards: 0,
	eleven: 0,
	luck: 0
}

// computer object
var computer = {
	countCards: 0,
	// countWin: 0,
	sumCards: 0,
	luck: 0,
	tableMoney: 0
}

// take 2 cards for player 
function startGame() {
	buttonAdd.style.pointerEvents = 'auto';
	buttonPass.style.pointerEvents = 'auto';
	var firstCard = randomCards();
	var secondCard = randomCards();
	
	playerCards.innerHTML += `<div class="player-card">${firstCard}</div>`;
	playerCards.innerHTML += `<div class="player-card">${secondCard}</div>`;

	firstCard = checkCard(firstCard);
	secondCard = checkCard(secondCard);

	player.sumCards = +firstCard + +secondCard;
	player.countCards = 2;

	setTimeout(() => {
		playerPoints.innerHTML = `${player.sumCards}`;
	}, 500);

	if (player.sumCards == 21) {
		buttonAdd.style.pointerEvents = 'none';
		setTimeout(() => {
			computerGame();
		}, 1300);
	}
}

// press add new card
buttonAdd.onclick = function() {
	var newCart = randomCards();
	playerCards.innerHTML += `<div class="player-card">${newCart}</div>`;

	newCart = checkCard(newCart);

	player.sumCards += +newCart;
	
	if (player.sumCards > 21 && player.eleven != 0 && player.luck == 0) {
		player.sumCards -= 10;
		player.luck++;
	} 

	playerPoints.innerHTML = `${player.sumCards}`;
	
	if (player.sumCards == 21) {
		buttonAdd.style.pointerEvents = 'none';
		setTimeout(() => {
			computerGame();
		}, 800);
	}

	if (player.sumCards > 21) {
		buttonAdd.style.pointerEvents = 'none';
		setTimeout(() => {
			computerGame();
		}, 800);
	}
};

// press Pass
buttonPass.onclick = function() {
	buttonPass.style.pointerEvents = 'none';
	delete player.eleven;
	computer.eleven = 0;
	computerGame();
};

// computer game
function computerGame() {
	var newCart = randomCards();
	computerCards.innerHTML += `<div class="computer-card">${newCart}</div>`;

	if (newCart == 'A') {
		computer.eleven++;
	}

	newCart = checkCard(newCart);

	computer.sumCards += +newCart;

	if (computer.sumCards > 21 && computer.eleven != 0 && computer.luck == 0) {
		computer.sumCards -= 10;
		computer.luck++;
	}
	
	computerPoints.innerHTML = `${computer.sumCards}`;
	
	if (computer.sumCards < 17) {
		computerGame();
	} else {
		setTimeout(() => {
			finishGame();
		}, 800);
	}
}

// result wrapper click and start game
result.onclick = function() {
	playerPoints.innerHTML = "";
	computerPoints.innerHTML = "";
	player.sumCards = 0;
	player.countCards = 0;
	player.eleven = 0;
	player.luck = 0;
	computer.luck = 0;
	computer.eleven = undefined;
	tableCount.innerHTML = "";
	computer.sumCards = 0;
	computer.tableMoney = 0;
	computer.countCards = 0;
	result.style.display = "";
	allCard = createNewDesk();
	buttonAdd.style.display = 'none';
	buttonPass.style.display = 'none';
	chips.style.opacity = '1';
	while (computerCards.firstChild) {
		computerCards.removeChild(computerCards.firstChild);
	}
	while (playerCards.firstChild) {
		playerCards.removeChild(playerCards.firstChild);
	}
	buttonStart.style.display = 'inline-block';

	if (player.money == "0") {
		openStartModal();
		chooseUser();
		location.reload();
	}
};

// check summ card computer and player
function finishGame() {
	if (player.sumCards > computer.sumCards && player.sumCards <= 21) {
		win();
		reSumPoints();
	} else if (player.sumCards < computer.sumCards && computer.sumCards <= 21) {
		fail();
	} else if (player.sumCards <= 21 && computer.sumCards > 21) {
		win();
		reSumPoints();
	} else if (player.sumCards > 21 && computer.sumCards <= 21) {
		fail();
	} else {
		tied();
	}
}

function win() {
	result.innerHTML = `Congratulations! <br> Your win is <br> ${computer.tableMoney * 2}$`;
	result.style.display = "flex";
	// player.countWin++;
	// countersPlayer.innerHTML = `Player: ${player.countWin}`;
}

function fail() {
	result.innerHTML = 'Fail';
	result.style.display = "flex";
	// computer.countWin++;
	// countersComputer.innerHTML = `Computer: ${computer.countWin}`;

	if (player.money == "0") {
		for(var i = 0; i < users.length; i++) {
			if (users[i].name == player.name) {
				users.splice(i, 1);
			}
		}
		window.localStorage.setItem('users', JSON.stringify(users));
	}
}

function tied() {
	result.innerHTML = 'Tied';
	result.style.display = "flex";
	player.money += computer.tableMoney;
	countMoney.innerHTML = player.money;
}

function reSumPoints() {
	player.money += computer.tableMoney * 2;
	countMoney.innerHTML = player.money;
}

// convert card in number
function checkCard(card) {
	if (card == 'J' || card == 'D' || card == 'K') {
		card = 10;
	}
	if ((player.eleven == 0 || computer.eleven == 1) && card == 'A') {
		card = 11;
		player.eleven++;
	}
	if ((player.eleven >= 1 || computer.eleven >= 2) && card == 'A') {
		card = 1;
		player.eleven++;
	}
	return card;
}


// take random card
function randomCards() {
	var newArr = allCard;
	//var newArr = cardsVariables;
	var randomCard = newArr[newArr.length - 1];
	newArr.splice(newArr.length - 1, 1);
	return randomCard;
}

buttonAdd.style.display = 'none';
buttonPass.style.display = 'none';

buttonStart.onclick = function() {
	if (computer.tableMoney != 0) {
		startGame();
		chips.style.opacity = '0';
		buttonStart.style.display = 'none';
		buttonAdd.style.display = 'inline-block';
		buttonPass.style.display = 'inline-block';
	} else {
		moneyTooltip.classList.add('show');
	}
}


// chips
var chips = document.getElementsByClassName('chips')[0];

var chip_10 = document.getElementById('chip_10');
var chip_25 = document.getElementById('chip_25');
var chip_50 = document.getElementById('chip_50');
var chip_100 = document.getElementById('chip_100');
var chip_500 = document.getElementById('chip_500');
var tableCount = document.getElementsByClassName('table-count')[0];

var allIn = document.getElementById('allIn');

var countMoney = document.getElementById('count-money');
var moneyTooltip = document.getElementsByClassName('money-tooltip')[0];

function useChip(nominal) {
	if (player.money >= nominal) {
		countMoney.innerHTML = `${player.money - nominal}`;
		player.money = player.money - nominal;
		computer.tableMoney = computer.tableMoney + nominal;
		tableCount.innerHTML = `${computer.tableMoney}$`;
		moneyTooltip.classList.remove('show');
	}
}

allIn.onclick = function() {
	useChip(player.money);
}

chip_10.onclick = function() {
	useChip(10);
}

chip_25.onclick = function() {
	useChip(25);
}

chip_50.onclick = function() {
	useChip(50);
}

chip_100.onclick = function() {
	useChip(100);
}

chip_500.onclick = function() {
	useChip(500);
}

// registration

var mainWrapper = document.getElementsByClassName('wrapper')[0];
var allDivs = mainWrapper.querySelectorAll('.wrapper > div');

for (var i = 0; i < allDivs.length; i++) {
	allDivs[i].style.opacity = '0';
}

var users = (JSON.parse(window.localStorage.getItem('users')) != null) ? JSON.parse(window.localStorage.getItem('users')) : [];

var modalWrap = document.getElementsByClassName('modal-wrap')[0];
var addNew = document.getElementById('addNew');
var modalList = document.getElementsByClassName('modal__list')[0];
var modalListItems = document.getElementsByClassName('modal__list-items')[0];
var addNewInput = document.getElementById('addNewInput');
var modalInput = document.getElementsByClassName('modal__input')[0];
var modalInputError = document.getElementsByClassName('modal__input-error')[0];

var modalButtons = document.getElementsByClassName('modal__buttons')[0];

var modalTitle = document.getElementsByClassName('modal__title')[0];

var regist = document.getElementById('regist');

modalWrap.style.opacity = '1';

function checkLocalStorage() {
	if (JSON.parse(window.localStorage.getItem('users')) && 
		JSON.parse(window.localStorage.getItem('users')).length != 0) {
		modalChooseUser();
		addUsersInHTML();
		chooseUser();
	} else {
		modalInterName();
	}
}

function modalInterName() {
	addNewInput.value = "";
	modalWrap.style.display = 'flex';
	modalWrap.style.opacity = '1';
	modalInput.style.display = 'block';
	addNewInput.style.display = 'block';
	modalList.style.display = 'none';
	modalTitle.innerHTML = "Enter your name";
	modalButtons.innerHTML = `<button id="regist">Registration</button>`;
}

function modalChooseUser() {
	modalWrap.style.display = 'flex';
	modalWrap.style.opacity = '1';
	addNewInput.style.display = 'none';
	modalTitle.innerHTML = "Select a user or create a new user";
	modalList.style.display = 'block';
	modalButtons.innerHTML = `<button id="addNew">Add new</button>`;
}

function addNewPerson(person) {
	player.name = person;
	player.money = 2000;
	countMoney.innerHTML = player.money;
	userName.innerHTML = player.name;
}

// save & exit

var userName = document.getElementById('user-name');
var saveButton = document.getElementById('save');
var exitButton = document.getElementById('exit');

var modalSave = document.getElementById('modalSave');
var modalExit = document.getElementById('modalExit');

saveButton.onclick = function() {
	saveButton.classList.add('saved');
	for(var i = 0; i < users.length; i++) {
		if (users[i].name == player.name) {
			users.splice(i, 1);
		}
	}
	saveUsersInLocalStorage();
}

function saveUsersInLocalStorage() {
	users.push({name: player.name, money: player.money});
	window.localStorage.setItem('users', JSON.stringify(users));

	addUsersInHTML();
}

function addUsersInHTML() {
	if (users != null) {
		modalListItems.innerHTML = "";
		for (var i = 0; i < users.length; i++) {
			modalListItems.innerHTML += `
				<li class="modal__list-item">
					<div class="modal__list-name">${users[i].name}</div>
					<div class="modal__list-money">${users[i].money}$</div>
				</li>
			`;
		}
	}
}

exitButton.onclick = function() {
	exit();
}

function chooseSavedGame() {
	modalWrap.style.display = 'flex';
	modalTitle.innerHTML = "Are you sure you want to exit without saving the game";
	modalInput.style.display = 'none';
	modalList.style.display = 'none';
	modalButtons.innerHTML = `
		<button id="modalExit">Yes</button>
		<button id="modalCansel">Cancel</button>`;
}

function exit() {
	if (!saveButton.classList.contains('saved')) {
		chooseSavedGame();
	} else if (JSON.parse(window.localStorage.getItem('users')).length != 0) {
		for (var i = 0; i < allDivs.length; i++) {
			allDivs[i].style.opacity = '0';
		}
		modalChooseUser();
		chooseUser();
		saveButton.classList.remove('saved')
	}
}

modalWrap.onclick = function(event) {
	var target = event.target;
	if (target.id == 'modalCansel') {
		modalWrap.style.display = 'none';
	}
	if (target.id == 'modalExit') {
		openStartModal();
		chooseUser();
	}
	if (target.id == 'addNew') {
		modalInterName();
	}
	if (target.id == 'regist') {
		if (addNewInput.value != '') {
			modalInputError.classList.remove('show');
			addNewPerson(addNewInput.value);
			modalWrap.style.display = 'none';
			for (var i = 0; i < allDivs.length; i++) {
				allDivs[i].style.opacity = '1';
			}
		} else {
			modalInputError.classList.add('show');
		} 
	}
}

function openStartModal() {
	for (var i = 0; i < allDivs.length; i++) {
		allDivs[i].style.opacity = '0';
	}
	addNewInput.value = "";
	if (JSON.parse(window.localStorage.getItem('users')) && 
		JSON.parse(window.localStorage.getItem('users')).length != 0) {
		modalChooseUser();
		chooseUser();
	} else {
		modalInterName();
	}
}

checkLocalStorage();

// choose player

function chooseUser() {
	var listItem = modalListItems.querySelectorAll('.modal__list-item');
	for (var i = 0; i < listItem.length; i++) {
		listItem[i].onclick = function(event) {
			var target = event.target;
			while (target != listItem[i]) {
				if (target.tagName == 'LI') {
				  	var name = target.children[0].innerHTML;
					var money = parseFloat(target.children[1].innerHTML);
					player.name = name;
					player.money = money;
					userName.innerHTML = player.name;
					countMoney.innerHTML = player.money;
					for (var i = 0; i < allDivs.length; i++) {
						allDivs[i].style.opacity = '1';
					}
					modalWrap.style.display = 'none';
				  	return;
				}
				target = target.parentNode;
			}
		}
	}
}

	
