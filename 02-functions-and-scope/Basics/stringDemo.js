let name = "TONY STARK";
// for(let i=name.length; i>=0; i--){
//     process.stdout.write(name[i] + " ");
// }
console.log(name.length);
console.log(name.toLowerCase());
console.log(name.toUpperCase());
console.log(name.indexOf("S"));
console.log(name[name.length - 1]);

//String Concatenation
let firstName = "Tony";
let lastName = "Stark";
let fullName = firstName + " " + lastName;
console.log(fullName);

//Template Literals
let city = "New York";
let aboutMe = `My name is ${fullName}. I live in ${city}.`;
console.log(aboutMe);

// Escape Sequences
let message = "He said, \"I am Iron Man.\"";
console.log(message);