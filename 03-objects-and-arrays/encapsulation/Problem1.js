class BankAccount {
  #balance;   // private

  constructor(name, balance) {
    this.name = name;
    this.#balance = balance;
  }

  deposit(amount) {
    this.#balance += amount;
    console.log(`Deposited: ${amount}`);
  }

  getBalance() {
    console.log("Balance:", this.#balance);
  }
}

let acc1 = new BankAccount("Aditya", 2000);

acc1.deposit(500);
acc1.getBalance();
// Trying to access private field directly will result in an error
// console.log(`Balance directly: ${acc1.#balance}`); // This will throw an error
