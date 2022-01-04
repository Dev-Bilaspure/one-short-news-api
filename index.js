const puppeteer = require('puppeteer');

const url = 'https://www.inshorts.com/en/read';

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
const scrapProduct = async() => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    await page.waitFor(1000);
    await page.click("#load-more-btn");
    await page.waitFor(2000);

    let arr = [];
    for(let i=0;i<=100;i++) {
        // getting title
        let titleXPath = `/html/body/div[4]/div/div[3]/div[${i}]/div/div[2]/a/span/text()`;
        let [titleElement] = await page.$x(titleXPath);
        let title = '';
        if(titleElement) {
            const titleTxt = await titleElement.getProperty('textContent');
            title = await titleTxt.jsonValue();
        }

        // getting author
        let authorXPath = `/html/body/div[4]/div/div[3]/div[${i}]/div/div[2]/div/span[1]`
        let [authorElement] = await page.$x(authorXPath);
        let author = '';
        if(authorElement) {
            const authorTxt = await authorElement.getProperty('textContent');
            author = await authorTxt.jsonValue();
        }

        // getting date
        let dateXPath = `/html/body/div[4]/div/div[3]/div[${i}]/div/div[2]/div/span[3]`;
        let [dateElement] = await page.$x(dateXPath);
        let date = '';
        if(dateElement) {
            const dateTxt = await dateElement.getProperty('textContent');
            date = await dateTxt.jsonValue();
            date = formateDateToObject(date);
        }

        // getting authorPage
        // getting authorPage: url
        let pageUrlXPath = `/html/body/div[4]/div/div[3]/div[${i}]/div/div[4]/div/a`;
        let [pageUrlElement] = await page.$x(pageUrlXPath);
        let pageUrl = '';
        if(pageUrlElement) {
            const pageUrlTxt = await pageUrlElement.getProperty('href');
            pageUrl = await pageUrlTxt.jsonValue();
        }
        // getting authorPage: name
        let pageNameXPath = `/html/body/div[4]/div/div[3]/div[${i}]/div/div[4]/div/a`;
        let [pageNameElement] = await page.$x(pageNameXPath);
        let pageName = '';
        if(pageNameElement) {
            const pageNameTxt = await pageNameElement.getProperty('textContent');
            pageName = await pageNameTxt.jsonValue();
        }
        let authorPage = { pageName, pageUrl };
        
        // getting description
        let descriptionXPath = `/html/body/div[4]/div/div[3]/div[${i}]/div/div[3]/div[1]`;
        let [descriptionElement] = await page.$x(descriptionXPath);
        let description = '';
        if(descriptionElement) {
            const descriptionTxt = await descriptionElement.getProperty('textContent');
            description = await descriptionTxt.jsonValue();
        }

        // push object into array
        if(title!=='' && author!=='') 
            arr.push({date, title, author, authorPage, description});
    }
    browser.close();
    return(arr);
}



scrapProduct().then(resArray => {
    console.log(resArray);
    console.log(resArray.length);
}).catch(err => {
    console.log(err);
})
// console.log(newsArray);

//title
// /html/body/div[4]/div/div[3]/div[2]/div/div[2]/a/span/text()
// /html/body/div[4]/div/div[3]/div[1]/div/div[2]/a/span/text()
// /html/body/div[4]/div/div[3]/div[3]/div/div[2]/a/span/text()
// /html/body/div[4]/div/div[3]/div[20]/div/div[2]/a/span/text()

//discription
// /html/body/div[4]/div/div[3]/div[1]/div/div[2]/div/span[1]/text()
// /html/body/div[4]/div/div[3]/div[2]/div/div[2]/div/span[1]
// /html/body/div[4]/div/div[3]/div[4]/div/div[2]/div/span[1]

// date
// /html/body/div[4]/div/div[3]/div[1]/div/div[2]/div/span[3]
// /html/body/div[4]/div/div[3]/div[i]/div/div[2]/div/span[3]

//pageUrl and pageName
// /html/body/div[4]/div/div[3]/div[2]/div/div[4]/div/a
// /html/body/div[4]/div/div[3]/div[i]/div/div[4]/div/a

// description
// /html/body/div[4]/div/div[3]/div[4]/div/div[3]/div[1]
// /html/body/div[4]/div/div[3]/div[i]/div/div[3]/div[1]

// imageUrl
// /html/body/div[4]/div/div[3]/div[7]/div/div[1]
// /html/body/div[4]/div/div[3]/div[i]/div/div[1]