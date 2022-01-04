const puppeteer = require('puppeteer');

const url = 'https://www.inshorts.com/en/read/';

const formateDateToObject = (date) => {
    let dateDay = '';
    let dateMonth = '';
    let dateYear = '';
    let weekDay = '';
    for(let i=0;i<date.length;i++) {
        if(i<=1)
            dateDay+=date[i];
        else if(i>=3 && i<=5)
            dateMonth+=date[i];
        else if(i>=7 && i<=10)
            dateYear+=date[i];
        else if(i>=12)
            weekDay+=date[i];
    }
    date = {dateDay, dateMonth, dateYear, weekDay};
    return(date);
}
const oneShortScrapper = async() => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    await page.waitFor(1000);
    await page.click("#load-more-btn");
    await page.waitFor(2000);

    let arr = [];
    for(let i=0;i<=100;i++) {
        // getting title
        let title = '';
        try {
            let titleXPath = `/html/body/div[4]/div/div[3]/div[${i}]/div/div[2]/a/span/text()`;
            let [titleElement] = await page.$x(titleXPath);
            
            if(titleElement) {
                const titleTxt = await titleElement.getProperty('textContent');
                title = await titleTxt.jsonValue();
            }
        } catch (error) {
            console.log(error);
        }
        

        // getting author
        let author = '';
        try {
            let authorXPath = `/html/body/div[4]/div/div[3]/div[${i}]/div/div[2]/div/span[1]`
            let [authorElement] = await page.$x(authorXPath);
            
            if(authorElement) {
                const authorTxt = await authorElement.getProperty('textContent');
                author = await authorTxt.jsonValue();
            }
        } catch (error) {
            console.log(error);
        }
        

        // getting date
        let date = '';
        try {
            let dateXPath = `/html/body/div[4]/div/div[3]/div[${i}]/div/div[2]/div/span[3]`;
            let [dateElement] = await page.$x(dateXPath);
            
            if(dateElement) {
                const dateTxt = await dateElement.getProperty('textContent');
                date = await dateTxt.jsonValue();
                date = formateDateToObject(date);
            }
        } catch (error) {
            console.log(error);
        }
        

        // getting authorPage
        // getting authorPage: url
        let pageUrl = '';
        try {
            let pageUrlXPath = `/html/body/div[4]/div/div[3]/div[${i}]/div/div[4]/div/a`;
            let [pageUrlElement] = await page.$x(pageUrlXPath);
            
            if(pageUrlElement) {
                const pageUrlTxt = await pageUrlElement.getProperty('href');
                pageUrl = await pageUrlTxt.jsonValue();
            }
        } catch (error) {
            console.log(error);
        }
        
        // getting authorPage: name
        let authorPage = null;
        let pageName = '';
        try {
            let pageNameXPath = `/html/body/div[4]/div/div[3]/div[${i}]/div/div[4]/div/a`;
            let [pageNameElement] = await page.$x(pageNameXPath);
            
            if(pageNameElement) {
                const pageNameTxt = await pageNameElement.getProperty('textContent');
                pageName = await pageNameTxt.jsonValue();
            }
            authorPage = { pageName, pageUrl };
        } catch (error) {
            console.log(error);
        }
        
        
        // getting description
        let description = '';
        try {
            let descriptionXPath = `/html/body/div[4]/div/div[3]/div[${i}]/div/div[3]/div[1]`;
            let [descriptionElement] = await page.$x(descriptionXPath);
            
            if(descriptionElement) {
                const descriptionTxt = await descriptionElement.getProperty('textContent');
                description = await descriptionTxt.jsonValue();
            }
        } catch (error) {
            console.log(error);
        }
        

        // push object into array
        if(title!=='' && author!=='') 
            arr.push({date, title, author, authorPage, description});
    }
    browser.close();
    return(arr);
}

module.exports = oneShortScrapper;

// oneShortScrapper().then(resArray => {
//     console.log(resArray);
//     console.log(resArray.length);
// }).catch(err => {
//     console.log(err);
// })


//title
// /html/body/div[4]/div/div[3]/div[i]/div/div[2]/a/span/text()

//discription
// /html/body/div[4]/div/div[3]/div[i]/div/div[2]/div/span[1]

// date
// /html/body/div[4]/div/div[3]/div[i]/div/div[2]/div/span[3]

//pageUrl and pageName
// /html/body/div[4]/div/div[3]/div[i]/div/div[4]/div/a

// description
// /html/body/div[4]/div/div[3]/div[i]/div/div[3]/div[1]

// imageUrl
// /html/body/div[4]/div/div[3]/div[i]/div/div[1]

