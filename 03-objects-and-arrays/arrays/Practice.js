//Arrays :- Practice

// 1. Create an array of your favorite fruits and log it to the console.
let favoriteFruits = ['Mango', 'Banana', 'Apple', 'Orange'];
console.log(favoriteFruits);
// 2. Add a new fruit to the end of the array and log the updated array.
favoriteFruits.push('Grapes');
console.log(favoriteFruits);

// 3. Remove the first fruit from the array and log the updated array.
favoriteFruits.shift();
console.log(favoriteFruits);

// 4. Find the index of a specific fruit in the array and log it to the console.
let indexOfApple = favoriteFruits.indexOf('Apple');
console.log(indexOfApple);

// 5. Create a new array that contains only the fruits that start with the letter 'A' and log it to the console.
let fruitsStartingWithA = favoriteFruits.filter(fruit => fruit.startsWith('A'));
console.log(fruitsStartingWithA);

// 6. Sort the array of fruits in alphabetical order and log the sorted array.
favoriteFruits.sort();
console.log(favoriteFruits);    

// 7. Create a new array that combines your favorite fruits with another array of fruits and log the combined array.
let moreFruits = ['Pineapple', 'Kiwi', 'Strawberry'];
let combinedFruits = favoriteFruits.concat(moreFruits);
console.log(combinedFruits);

// 8. Find the length of the array and log it to the console.
let lengthOfFruitsArray = favoriteFruits.length;
console.log(lengthOfFruitsArray);

// 9. Reverse the order of the array and log the reversed array.
favoriteFruits.reverse();
console.log(favoriteFruits);

// 10. Create a new array that contains only the first three fruits from the original array and log it to the console.
let firstThreeFruits = favoriteFruits.slice(0, 3);
console.log(firstThreeFruits);

// 11. Splice(): remove , replace and add the elements in place
