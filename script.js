//! BANK APP
"use strict";

// Data
const account1 = {
  owner: "Dinesh",
  movements: [200, 450, -400, 1300, -650, -130, 70, 20000],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    "2020-11-18T21:31:17.178Z",
    "2020-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2021-05-08T14:11:59.604Z",
    "2021-05-27T17:01:17.194Z",
    "2021-07-11T23:36:17.929Z",
    "2021-03-04T10:51:36.790Z",
  ],
  currency: "USD",
  locale: "en-US",
};
const account2 = {
  owner: "kumar",
  movements: [150, 300, -200, 500, -1500, -350, 40, 10000],
  interestRate: 1.3, // %
  pin: 2222,
  movementsDates: [
    "2020-11-01T13:15:33.035Z",
    "2020-11-30T09:48:16.867Z",
    "2020-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2021-02-05T16:33:06.386Z",
    "2021-04-10T14:43:26.374Z",
    "2021-06-25T18:49:59.371Z",
    "2021-08-05T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: "Sam",
  movements: [210, 720, -600, 2500, -150, -30, 150, 2000],
  interestRate: 1.2, // %
  pin: 3333,
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "EUR",
  locale: "pt-PT",
};

const accounts = [account1, account2, account3];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputUsername = document.querySelector(".login__input--user");
const inputPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

//* Username
function createUsername(accs) {
  accs.forEach((acc) => {
    const nameSplit = acc.owner.toLowerCase().split(" ");

    if (nameSplit.length <= 1) {
      [acc.username] = nameSplit.map((n) => {
        const fLtr = n.slice(0, 1);
        const lLtr = n.slice(-1);
        return fLtr.concat(lLtr);
      });
    } else {
      acc.username = nameSplit.map((n) => n[0]).join("");
    }
  });
}
createUsername(accounts);

//* Date option
const option = {
  hour: "numeric",
  minute: "numeric",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
};

//* Currency Format
const currencyFormat = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

//* Display-Movement
const displayMovement = function (account, sort = false) {
  containerMovements.innerHTML = "";

  //sorting
  const sortCondition = sort
    ? account.movements.slice().sort((ele1, ele2) => ele1 - ele2)
    : account.movements;

  //show moves
  sortCondition.forEach((mov, i) => {
    //movement date
    const movDate = new Date(account.movementsDates[i]);
    const displayMovDate = new Intl.DateTimeFormat(
      account.locale,
      option
    ).format(movDate);

    //movement html
    const type = mov > 0 ? "deposit" : "withdrawal";
    const curFormat = currencyFormat(mov, account.locale, account.currency);
    const html = `
    <div class="movements__row">
    <div class="movements__number">${i + 1} .</div>
          <div class="movements__type movements__type--${type}">${type}</div>
          <div class="movements__date">${displayMovDate}</div>
          <div class="movements__value">${curFormat.replaceAll("-", "")}</div>
        </div>
   `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

//* Display Balance
const displayBalance = function (account) {
  account.balance = account.movements.reduce((acc, ele) => acc + ele, 0);
  labelBalance.textContent = currencyFormat(
    account.balance,
    account.locale,
    account.currency
  );
};

//* Display Summery
const displaySummery = function (account) {
  const summeryIn = account.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = currencyFormat(
    summeryIn,
    account.locale,
    account.currency
  );

  const summeryOut = account.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = currencyFormat(
    summeryOut,
    account.locale,
    account.currency
  ).replaceAll("-", "");

  const interest = account.movements
    .filter((mov) => mov > 0)
    .map((interest) => (interest * account.interestRate) / 100)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = currencyFormat(
    interest,
    account.locale,
    account.currency
  );
};

// Calling updateUI
const updateUi = function (curAcc) {
  // display movements
  displayMovement(curAcc);
  // display balance
  displayBalance(curAcc);
  // display summary
  displaySummery(curAcc);
};

//NOTE Login
let currentAccount, timer;

btnLogin.addEventListener("click", (e) => {
  e.preventDefault();

  // get user account
  currentAccount = accounts.find((acc) => acc.username === inputUsername.value);

  // pin validation
  if (currentAccount?.pin === Number(inputPin.value)) {
    // display UI
    containerApp.style.opacity = 1;
    // welcome msg
    labelWelcome.textContent = `Welcome ${currentAccount.owner}`;
    // updateUI
    updateUi(currentAccount);
    //today date
    const today = new Date();
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      option
    ).format(today);
    //timer
    if (timer) clearInterval(timer);
    timer = LogOutTimer();
  }
  // clear input fields
  inputUsername.value = inputPin.value = "";
  inputPin.blur();
});

//NOTE Money Transfer
btnTransfer.addEventListener("click", (e) => {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  // clear input fields
  inputTransferAmount.value = inputTransferTo.value = "";
  inputTransferAmount.blur();

  // input validation
  if (
    amount > 0 &&
    receiverAcc &&
    amount <= currentAccount.balance &&
    receiverAcc.username !== currentAccount.username
  ) {
    // equating money
    receiverAcc.movements.push(amount);
    currentAccount.movements.push(-amount);
    // add date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    //reset timer
    clearInterval(timer);
    timer = LogOutTimer();
    // update UI
    setTimeout(() => updateUi(currentAccount), 1000); // time interval
  }
});

//NOTE Loan Amount
btnLoan.addEventListener("click", (e) => {
  e.preventDefault();

  // loan condition
  const loanAmount = Number(inputLoanAmount.value);
  const loanCondition = currentAccount.movements.some(
    (mov) => mov >= loanAmount / 10
  );

  // condition checking
  if (loanAmount > 0 && loanCondition) {
    // add amount
    currentAccount.movements.push(loanAmount);
    // add date
    currentAccount.movementsDates.push(new Date().toISOString());
    //reset timer
    clearInterval(timer);
    timer = LogOutTimer();
    // update UI
    setTimeout(() => updateUi(currentAccount), 1000); // time interval
  }

  // clear input fields
  inputLoanAmount.value = "";
  inputLoanAmount.blur();
});

//NOTE Delete Account
btnClose.addEventListener("click", (e) => {
  e.preventDefault();

  // input validation
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    // get index
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    // deleting
    accounts.splice(index, 1);
    // hide UI
    containerApp.style.opacity = 0;
    // login mag
    labelWelcome.textContent = `Log in to get started`;
  }

  // clear input fields
  inputCloseUsername.value = inputClosePin.value = "";
  inputClosePin.blur();
});

//* Sort
let sorted = false;
btnSort.addEventListener("click", (e) => {
  e.preventDefault();

  //
  displayMovement(currentAccount, !sorted);
  sorted = !sorted;
});

//* Timer
const LogOutTimer = function () {
  let time = 60;
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(LogOutTimer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = `Log in to get started`;
    }
    time--;
  };
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};
