// Normal Function
function add1(a, b) {
  return a + b;
}

// Function Expression
const add2 = function(a, b) {
  return a + b;
};

// Arrow Function
const add3 = (a, b) => a + b;

//Function Calls
console.log(add1(2, 3)); // Output: 5
console.log(add2(5, 7)); // Output: 12
console.log(add3(10, 15)); // Output: 25