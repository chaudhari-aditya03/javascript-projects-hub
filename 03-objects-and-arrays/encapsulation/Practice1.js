class BankAccount {
  #balance;   // private variable

  constructor(initialBalance) {
    this.#balance = initialBalance;
  }

  deposit(amount) {
    if (amount <= 0) {
      console.log("Deposit amount must be positive");
      return;
    }

    this.#balance += amount;
    console.log("Deposited ₹" + amount);
  }

  withdraw(amount) {
    if (amount <= 0) {
      console.log("Withdraw amount must be positive ");
      return;
    }

    if (amount > this.#balance) {
      console.log("Insufficient balance ");
    } else {
      this.#balance -= amount;
      console.log("Withdrawn ₹" + amount);
    }
  }

  getBalance() {
    console.log("Current Balance: ₹" + this.#balance);
  }
}
let myAccount = new BankAccount(1000);

myAccount.getBalance();     // 1000

myAccount.deposit(500);    // +500
myAccount.getBalance();    // 1500

myAccount.withdraw(300);   // -300
myAccount.getBalance();    // 1200

myAccount.withdraw(100);  //  insufficient balance

// myAccount.#balance;  ERROR (private, cannot access)
