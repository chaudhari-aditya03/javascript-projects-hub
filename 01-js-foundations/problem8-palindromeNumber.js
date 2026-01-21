let num = 121;
let a = num;
let reversed = 0;
while(num > 0) {
    let rem = num%10;
    reversed = reversed*10+ rem;
    num = Math.floor(num/10);
}
const palindrome = (a,reversed) => (a===reversed) ? true : false;
//     {
//     if(a === reversed) return true;
//     else return false;
// }
console.log(`Is the number a palindrome? => ${palindrome(a, reversed)}`);