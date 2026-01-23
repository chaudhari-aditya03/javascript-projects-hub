let todo = [];

let request = prompt("Enter command (list, add, delete, quit)");

while (true) {

  if (request === "quit") {
    console.log("👋 Quitting To-Do App...");
    break;
  }

  else if (request === "list") {
    console.log("📋 Your Tasks:");
    console.log("----------------");

    if (todo.length === 0) {
      console.log("No tasks available.");
    } else {
      for (let i = 0; i < todo.length; i++) {
        console.log(`${i + 1}. ${todo[i]}`);
      }
    }

    console.log("----------------");
  }

  else if (request === "add") {
    let task = prompt("Enter the task you want to add:");

    if (task && task.trim() !== "") {
      todo.push(task);
      console.log(`✅ Task added: ${task}`);
    } else {
      console.log("⚠️ Empty task not allowed!");
    }
  }

  else if (request === "delete") {
    let index = prompt("Enter task number to delete:");

    index = Number(index) - 1;

    if (index >= 0 && index < todo.length) {
      let deleted = todo.splice(index, 1);
      console.log(`🗑️ Deleted task: ${deleted}`);
    } else {
      console.log("❌ Invalid task number!");
    }
  }

  else {
    console.log("❗ Unknown command. Try again.");
  }

  request = prompt("Enter command (list, add, delete, quit)");
}
