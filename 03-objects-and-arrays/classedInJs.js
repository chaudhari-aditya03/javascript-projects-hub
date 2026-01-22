// Class definition
class Employee {
    // Constructor to initialize object properties
  constructor(name, salary) {
    this.name = name;
    this.salary = salary;
  }

  // Method to display employee details
  work() {
    console.log(this.name + " is working");
  }
}
// Creating an instance of the Employee class i.e object
let emp1 = new Employee("John", 50000);
// Accessing properties and methods of the object
console.log(`Employee Name: ${emp1.name}`);
console.log(`Employee Salary: ${emp1.salary}`);
emp1.work();
