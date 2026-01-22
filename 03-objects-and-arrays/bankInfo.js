
let  bankAccount={
    accountHolderName: "Aditya",
    accountNumber: "1234567890",
    balance: 5000,
    deposit: function(amount){
        this.balance = this.balance + amount;
        console.log(`Deposited: ${amount}. New Balance: ${this.balance}`);
    },
    withdraw: function(amount){
        if(amount > this.balance){
            console.log("Insufficient balance");
        }
        else{
            this.balance = this.balance - amount;
            console.log(`Withdrawn: ${amount}. New Balance: ${this.balance}`);
        }
    },
    checkBalance: function(){
        console.log(`Current Balance: ${this.balance}`);
    }
};
console.log(`Account Holder: ${bankAccount.accountHolderName}`);
console.log(`Account Number: ${bankAccount.accountNumber}`);
bankAccount.checkBalance();
bankAccount.deposit(2000);
bankAccount.withdraw(1000);
bankAccount.checkBalance();