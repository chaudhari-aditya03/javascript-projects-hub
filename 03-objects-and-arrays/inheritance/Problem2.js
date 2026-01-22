class Employee {
  constructor(name, salary) {
    this.name = name;
    this.salary = salary;
  }
  work() {
    console.log(this.name + " is working.");
  }
}
class Manager extends Employee {
  constructor(name, salary, teamSize) {
    super(name, salary);
    this.teamSize = teamSize;
  }

  manage() {
    console.log(this.name + " manages " + this.teamSize + " people.");
  }
}
let m1 = new Manager("Rahul", 80000, 10);
m1.work();
m1.manage();
