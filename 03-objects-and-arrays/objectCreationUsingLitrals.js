
//Object creation using object literals
let student = {
  name: "Aditya",
  age: 22,
  course: "FSD"
};

// Display the student object
console.log(student);

// Accessing properties of the student object
console.log("Name:", student.name);
console.log("Age:", student.age);
console.log("Course:", student.course);

// Modifying properties of the student object
student.age = 23;
console.log("Updated Age:", student.age);

// Adding a new property to the student object
student.grade = "A";
console.log("Added Grade:", student.grade);

// Display the updated student object
console.log("Updated student object:", student);

// Deleting a property from the student object
delete student.course;
console.log("After deleting course property:", student);

// Checking if a property exists in the student object
console.log("Does 'name' property exist?", "name" in student);
console.log("Does 'course' property exist?", "course" in student);

// Iterating over the properties of the student object
for (let key in student) {
  console.log(key + ": " + student[key]);
}