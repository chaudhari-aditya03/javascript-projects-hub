let num = 121;
let a = num;
let reversed = 0;
while(num > 0) {
    let rem = num%10;
    reversed = reversed*10+ rem;
    num = Math.floor(num/10);
}
console.log(`The reversed number is ${reversed}`);