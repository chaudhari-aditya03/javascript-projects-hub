// Global Scope : Outside any function or block
let x = 10;

//  Block Scope : Inside the block { }
if(true) {
  let y = 20;
}

//  Function Scope : Inside a function
function test() {
  var z = 30;
}


// Rule:
// let / const → block scoped
// var → function scoped (avoid)