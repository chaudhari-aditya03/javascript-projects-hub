

student = function(name, age, grade, subjects) {
    this.name = name;
    this.age = age;
    this.grade = grade;
    this.subjects = subjects;
}

function printInfo(student) {
    for(let key in student) {
        console.log(`${key}: ${student[key]}`);
    }
}

let stud1 = new student("Aditya", 21, "A+", ["English", "Biology"]);
printInfo(stud1);
console.log("");
let stud2 = new student("Ram", 21, "O", ["Maths", "History"]);
printInfo(stud2);