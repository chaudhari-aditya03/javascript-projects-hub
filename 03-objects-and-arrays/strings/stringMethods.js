let name = "I am aditya Chaudhari , I am learning JavaScript";

//Strings in JS are Immutable

// 1. toUpperCase() - Converts the string to uppercase letters.
console.log(name.toUpperCase()); // Output: "I AM ADITYA CHAUDHARI , I AM LEARNING JAVASCRIPT"

// 2. toLowerCase() - Converts the string to lowercase letters.
console.log(name.toLowerCase()); // Output: "i am aditya chaudhari , i am learning javascript"

// 3. slice() - Extracts a section of the string and returns it as a new string.
console.log(name.slice(5, 12)); // Output: "aditya "

// 4. replace() - Replaces a specified value with another value in the string.
console.log(name.replace("aditya", "John")); // Output: "I am John Chaudhari , I am learning JavaScript"

// 5. concat() - Joins two or more strings.
let greeting = "Hello, ";
console.log(greeting.concat(name)); // Output: "Hello, I am aditya Chaudhari , I am learning JavaScript"

// 6. trim() - Removes whitespace from both ends of the string.     
let spacedString = "   Hello World!   ";
console.log(spacedString.trim()); // Output: "Hello World!"

// 7. charAt() - Returns the character at a specified index.
console.log(name.charAt(7)); // Output: "a"

// 8. indexOf() - Returns the index of the first occurrence of a specified value.
console.log(name.indexOf("Chaudhari")); // Output: 13

// 9. split() - Splits the string into an array of substrings.
console.log(name.split(" ")); 
// Output: [ 'I', 'am', 'aditya', 'Chaudhari', ',', 'I', 'am', 'learning', 'JavaScript' ]

// 10. includes() - Checks if the string contains a specified value.
console.log(name.includes("learning")); // Output: true

// 11. startsWith() - Checks if the string starts with a specified value.
console.log(name.startsWith("I am")); // Output: true

// 12. endsWith() - Checks if the string ends with a specified value.
console.log(name.endsWith("JavaScript")); // Output: true

// 13.trim() - Removes whitespace from both ends of the string.
let stringWithSpaces = "   Hello, World!   ";
console.log(stringWithSpaces.trim()); // Output: "Hello, World!"

// 14. toString() - Converts a value to a string.
let num = 123;
console.log(num.toString()); // Output: "123"

