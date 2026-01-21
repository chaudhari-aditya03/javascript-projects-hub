const arr1 = [3, 5, 15, 2, 8];
let largest = arr1[0];
for(let i=0; i<arr1.length; i++)
    if(arr1[i]>largest)
    {
        largest = arr1[i];
    }
console.log(`The largest number is ${largest}`);