let a = 50;
let b = 20;

//Function Declaration
function multiply(x, y) {
    return x * y;
}
//Expression Function
const sub = function(x, y){
    return x - y;
}
//Arrow Function
const sum = (a,b) => a + b;

//Calling the Functions
console.log("Multiplication: " + multiply(a, b));
console.log("Subtraction: " + sub(a, b));
console.log("Addition: " + sum(a, b));

for(let i =0;i<5;i++){
    for(let j=i;j<5;j++){
        process.stdout.write("* ");
    }
    console.log("\n");
}