let arr = [10,19,30,40,50];

const demo = arr.map((element)=>{
    return element%2==0?element:0;
})

console.log(demo);