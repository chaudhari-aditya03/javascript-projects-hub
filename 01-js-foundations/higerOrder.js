// Example usages of array methods with arrow functions using high-order functions
//map, filter, reduce, find, findIndex
//map : adds 2 to each element
console.log([2,3,5,7,8,4,6,8,10].map(a => a+2));
//filter : filters even numbers
console.log([2,3,5,7,8,4,6,8,10].filter(num => num % 2 === 0));
//reduce : sums all elements
console.log([2,3,5,7,8,4,6,8,10].reduce((acc, num) => acc + num, 0));
//find : finds first number greater than 5
console.log([2,3,5,7,8,4,6,8,10].find(num => num > 5));
//findIndex : finds index of first number greater than 5
console.log([2,3,5,7,8,4,6,8,10].findIndex(num => num > 5));
