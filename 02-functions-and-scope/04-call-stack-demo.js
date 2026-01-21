function one() {
  two();
}
function two() {
  three();
}
function three() {
  console.log("Done");
}

one();
// Call Stack:
// one()
// two()
// three()