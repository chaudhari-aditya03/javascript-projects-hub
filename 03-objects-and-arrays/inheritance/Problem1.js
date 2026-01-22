class Employee {
  constructor(name, salary) {
    this.name = name;
    this.salary = salary;
  }
  work() {
    console.log(this.name + " is working.");
  }
}
class Teacher extends Employee {
  constructor(name, salary, subject) {
    super(name, salary);   // call parent constructor
    this.subject = subject;
  }

  teach() {
    console.log(this.name + " teaches " + this.subject);
  }
}
let t1 = new Teacher("Aditya", 50000, "JavaScript");

t1.work();     // inherited method
t1.teach();    // child method
