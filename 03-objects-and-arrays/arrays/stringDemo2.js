//  Write a JavaScript function that accepts a list of country names as input and
// returns the longest country name as output.
// Example : country = ["Australia", "Germany", "United States of America"]
// output : "United States of America
let country =["India","South Africa","UAE is the beautiful country on the World","New Zeland","sri lanka","United States of America"];
console.log(country);
const longCountry =(country)=>{
    let len =[];
    for(let i =0;i<country.length;i++)
    {
        len[i] = country[i].length;
    }
    // console.log(len)
    for(let i =0;i<len.length-1;i++)
    {
        for(let j =i+1;j<len.length;j++)
        {
            if(len[i]>len[j])
            {
                let temp = len[i];
                len[i]=len[j];
                len[j]=temp;
            }
        }
    }
    // console.log(len)
    for(let i =0;i<country.length;i++)
    {
        if(len[len.length-1] == country[i].length)
        {
            console.log(country[i]);
        }
    }
}
longCountry(country);