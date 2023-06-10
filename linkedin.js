// const { resolve } = require('path');
// const puppeteer = require('puppeteer');
// const readline = require("readline");
const xlsx = require('xlsx');

let oldFileName = process.argv[2];
let newFileName = process.argv[3];
console.log(oldFileName,newFileName)
// let profileArray = [];
// const delay = async(delay)=>{
//     return new Promise(resolve=>setTimeout(resolve,delay))
// }
// const gotoNextPage = async(page,browser)=>{
//     const nextButton = await page.$('#content-main > div > div:nth-of-type(2) > div:nth-of-type(2) > div > div:nth-of-type(4) > div > button[aria-label="Next"]');
//     if(!nextButton) {
//         await browser.close();
//         console.log('no next button found');
//         process.exit(1);
//     }
//     const isthereAnextPage = await nextButton.evaluate((el)=> el.disabled);
//     if(!isthereAnextPage){
//         await browser.close();
//         console.log('done scrapping');
//         process.exit(1);
//     }
  
//     await delay(3000);
//     await scrap(page,browser);
// }

// const scrap = async(page,browser)=>{
//     console.log('reaching scrap function')

//     try{
//     const numberOfProfiles = await page.$$('.artdeco-list > li');
//     let counter = 1
//     if(numberOfProfiles&&numberOfProfiles.length){
//         for(profile of numberOfProfiles){
//             if(counter>1){
//                 await page.evaluate(()=>{
//                     document.querySelector('#search-results-container').scrollBy(0,185)
//                 })
//                 await delay(5000)
//             }
//             const doesProfileExist = await page.$(`.artdeco-list > li:nth-of-type(${counter})`);

//             if(doesProfileExist){
//                 let profileImage = await page.$(`.artdeco-list > li:nth-of-type(${counter}) > div > div > div:nth-of-type(2) > div > div > div > div > a > div > img`)
//                 let name = await page.$(`.artdeco-list > li:nth-of-type(${counter}) > div > div > div:nth-of-type(2) > div > div > div > div:nth-of-type(2) > div > div > a > span`)
//                 let companyStatus = await page.$(`.artdeco-list > li:nth-of-type(${counter}) > div > div > div:nth-of-type(2) > div > div > div > div:nth-of-type(2) > div:nth-of-type(2) > span[data-anonymize="title"]`)
//                 let companyName = await page.$(`.artdeco-list > li:nth-of-type(${counter}) > div > div > div:nth-of-type(2) > div > div > div > div:nth-of-type(2) > div:nth-of-type(2) > a[data-anonymize="company-name"]`)
//                 let location = await page.$(`.artdeco-list > li:nth-of-type(${counter}) > div > div > div:nth-of-type(2) > div > div > div > div:nth-of-type(2) > div:nth-of-type(3) > span[data-anonymize="location"]`)
//                 let experience = await page.$(`.artdeco-list > li:nth-of-type(${counter}) > div > div > div:nth-of-type(2) > div > div > div > div:nth-of-type(2) > div:nth-of-type(4)`);
//                 let seeMoreAboutbutton = await page.$(`.artdeco-list > li:nth-of-type(${counter}) > div > div > div:nth-of-type(2) > div > div:nth-of-type(2) > dl > div > dd > div > span:nth-of-type(2) > .t-12`)

//                 if(seeMoreAboutbutton){
//                     await page.evaluate(el=>{
//                         el.click()
//                     },seeMoreAboutbutton)
//                     await delay(2000)
//                 }
//                 let about = await page.$(`.artdeco-list > li:nth-of-type(${counter}) > div > div > div:nth-of-type(2) > div > div:nth-of-type(2) > dl > div > dd > div > span:nth-of-type(2)`)
            
//                 if(name) name = await name.evaluate(el=>el.innerText);
//                 if(profileImage) profileImage = await profileImage.evaluate((el)=>el.src);
//                 if (companyStatus) companyStatus = await companyStatus.evaluate(el=>el.innerText);
//                 if (companyName) companyName = await companyName.evaluate(el=>el.innerText);
//                 if (location) location = await location.evaluate(el=>el.innerText);
//                 if(experience) experience = await experience.evaluate(el=>el.innerText);
//                 if(about) about = await about.evaluate(el=>el.innerText);

//                 profileArray.push({name,profileImage,about,companyName,companyStatus,experience,location});
//                 console.log('counter', counter)

//                 console.log('array->', {name,profileImage,about,companyName,companyStatus,experience,location})

//                 counter++
//                 if(counter===numberOfProfiles.length){
//                     await gotoNextPage(page,browser)
//                 }
//             }
//         }
//     }
//     console.log('no profiles to scrap');
//     //await browser.close();
//     //process.exit(1);

// }
// catch(error){
//     console.log('scrap function error->',error)
// }
// }

// const gotoSalesNavigator = async(page,browser)=>{
//     try{

//     console.log('reaching sale navigator function')

//     const salesPage = await browser.newPage();
//     await salesPage.goto('https://www.linkedin.com/sales/search/people?page=1&query=(recentSearchParam%3A(id%3A2726505916%2CdoLogHistory%3Atrue)%2Cfilters%3AList((type%3AFUNCTION%2Cvalues%3AList((id%3A1%2Ctext%3AAccounting%2CselectionType%3AINCLUDED)))%2C(type%3ASENIORITY_LEVEL%2Cvalues%3AList((id%3A10%2Ctext%3AOwner%2CselectionType%3AINCLUDED)))%2C(type%3AREGION%2Cvalues%3AList((id%3A101174742%2Ctext%3ACanada%2CselectionType%3AINCLUDED)))%2C(type%3ACOMPANY_HEADCOUNT%2Cvalues%3AList((id%3AB%2Ctext%3A1-10%2CselectionType%3AINCLUDED)))))&sessionId=65Yc%2Bf37TdKPqB9kK2Wl%2Bg%3D%3D', {waitUntil:"domcontentloaded",timeout:0});
    
    
//     await delay(20000)
//     await scrap(salesPage,browser)
// }
// catch(error){
//     console.log('gotosalesnavigator error->',error)
// }
// }

// const login = async(browser)=>{ 
//     try{
//     const loginPage = await browser.newPage();
//     // loginPage.setDefaultNavigationTimeout(0); 
//     await loginPage.goto('https://www.linkedin.com/login',{waitUntil: "domcontentloaded",timeout:0});

//     await loginPage.evaluate(username=> document.querySelector('#username').value = username,'karanstainandpaint@gmail.com');
//     await loginPage.evaluate(password=> document.querySelector('#password').value = password,'Honeycomb123!l');

//     await delay(3000);
    
//     await loginPage.click('button[aria-label="Sign in"]');
//     await delay(10000)
//             let url = await loginPage.evaluate(()=>window.location.href);
//             if(url==='https://www.linkedin.com/feed/'){
//                 await gotoSalesNavigator(loginPage,browser)
//             }
//             else if(url.includes('https://www.linkedin.com/checkpoint/challenge/')){
//                 console.log('reaching verification')
//                 const element1 = await loginPage.waitForSelector('#app__container > .app__content > iframe[title="Captcha Challenge"]');
//                 const iframe1 = await element1.contentFrame();

//                 const element2 = await iframe1.waitForSelector('#app__container > .app__content > #arkoseframe');

//                 const iframe2 = await element2.contentFrame();

//                 const element3 = await iframe2.waitForSelector('#arkose > div > iframe');
//                 const iframe3 = await element3.contentFrame();

//                 const element4 = await iframe3.waitForSelector('#app > #challenge > #FunCaptcha > iframe');
//                 const iframe4 = await element4.contentFrame();

//                 const element5 = await iframe4.$('.main-ctn > .upper-ctn > #ctn-1 > iframe')

//                 const iframe5 = await element5.contentFrame();

//                 await iframe5.waitForSelector('#app > div > #home > button[aria-describedby="descriptionVerify"]');

//                 const button = await iframe5.waitForSelector('#app > div > #home > button[aria-describedby="descriptionVerify"]');

//                 await button.click()
               
//                 //await loginPage.waitForNetworkIdle();
//                 async function verify(){
//                     const rl = readline.createInterface({
//                         input: process.stdin,
//                         output: process.stdout
//                     });

//                     rl.question("Which one is it ? ", async function(position) {
//                         console.log('position->', position)

//                         const buttonelement = await iframe5.waitForSelector(`#app > div > #game > #game_children_wrapper > #game_children_challenge > div > ul > #image${position} > a`)
//                         await buttonelement.click()
//                         await delay(6000);
//                         if(url.includes('https://www.linkedin.com/checkpoint/challenge/')){
//                             verify()
//                         }
//                         else{
//                             rl.close();
//                         }
//                     })
//                 }
//                     verify()


//                         //await loginPage.waitForNetworkIdle();

//                         //url = await loginPage.evaluate(()=>window.location.href);
//                         //if(url==='https://www.linkedin.com/feed/'){
//                             await delay(15000)
//                             await gotoSalesNavigator(loginPage,browser)
//                         //}
                    

//             }
//           //  else if(url!=='https://www.linkedin.com/feed/') await browser.close()

// }
//     catch(error){
//         console.log('login error->',error)
//     }

  
// }


// const run = async()=>{
//     try {
//         const browser =await puppeteer.launch({
//             headless:false
//         });

//         const page = await browser.newPage();

//         await login(browser)

//     } catch (error) {
//         console.log('run function error->', error)
//     }
// }

// run()