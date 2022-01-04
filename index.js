const oneShortScrapper = require("./OneShortScrapper/oneShortScrapper");


oneShortScrapper().then(resArray => {
    console.log(resArray);
    console.log(resArray.length);
}).catch(err => {
    console.log(err);
})