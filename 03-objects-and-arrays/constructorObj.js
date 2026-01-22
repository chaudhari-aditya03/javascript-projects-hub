// Constructor function to create Student objects
const Student = function(name, age, course) {
    this.name = name;
    this.age = age;
    this.course = course;
  }
  // Function to display student details
  const Display = function(student){
    console.log("Name:", student.name);
    console.log("Age:", student.age);
    console.log("Course:", student.course);
  }
  //Using For In Loop to iterate over object properties
  const IterateProperties = function(student){
    for (let key in student) {
      console.log(key + ": " + student[key]);
    }
}

// Creating Student objects
let Student1 = new Student("Aditya", 22, "FSD");
// Displaying Student1 details
Display(Student1);

// Creating another Student object
let Student2 = new Student("Pratiksha", 21, "DSA");


console.log(`Iterating over ${Student2.name}'s properties:`);
IterateProperties(Student2);