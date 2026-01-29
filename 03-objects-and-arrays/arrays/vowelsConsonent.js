// Qs4. Write a JavaScript function to count the number of vowels in a String argument
let str ="aeiou";
str.toLowerCase();
let count = 0;
const vowels = (str)=>{
        for(let i =0;i<str.length;i++)
        {
            if(str[i].includes("a") || str[i].includes("e")  || str[i].includes("i") || str[i].includes("o") || str[i].includes("u"))
            {
                count++;
            }
        }
        console.log(`Total Numbers of Vowels in the String is ${count}`);
}
vowels(str);