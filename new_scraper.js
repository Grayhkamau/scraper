const puppeteer = require('puppeteer');
const xlsx = require('xlsx');

const email = process.argv[2];
const password = process.argv[3];
const filters = ["CFO","Kenya","engineering"]

if(!email||!password) {
    console.log('please provide your email and password');
    process.exit(1);
}

async function delay(duration){
    return new Promise((resolve) => {
        setTimeout(resolve,duration)
    })
}

async function login(page,browser){

    await page.click('.login');
    await page.waitForNetworkIdle();
    
    await page.focus('input[placeholder="Email"]')
    await page.keyboard.type(email)

    await page.focus('input[placeholder="Password"]')
    await page.keyboard.type(password)

    await page.click('button[form="loginForm"]');

    await dashboard(page,browser)

}


const dashboard = async (page,browser)=>{
    console.log('reached dashboard')
    await delay(7000)
    const nav = await page.$('.pro-item-content > a');
    console.log('this is the link-> ',nav)
    await page.click('.pro-item-content > a');

    // await page.waitForNetworkIdle()

    async function getFilterIndex(indexOfFilter){
        await delay(4000)

        await page.click(`.MuiGrid-item:nth-of-type(${indexOfFilter}) > div`)
        await delay(4000)

        let titles;
        if(indexOfFilter===2){
            titles = await page.$$('.css-xr8o0o > .d-flex > small');
        }
        else if(indexOfFilter===4){
            titles = await page.$$('.css-1f8k2gf > div > div > div > small')
        }

        let arrayOfTitles = Array.from(titles);
        arrayOfTitles.pop();
        console.log('array of titles', arrayOfTitles)
        let targetTitleIndex;
        let counter = 2
        for(one of arrayOfTitles){
            let currentSmallElement
            if(indexOfFilter===2){
            currentSmallElement = await page.$(`.css-xr8o0o > .d-flex:nth-of-type(${counter}) > small`)
            }
            else if(indexOfFilter===4){
            currentSmallElement = await page.$(`.css-1f8k2gf:nth-of-type(${counter}) > div > div > div > small`)
            }
            console.log('currentTitle',currentSmallElement)

            let currentTitle = await currentSmallElement.evaluate((el)=> el.textContent);
            console.log('currentTitle',currentTitle)
            if(currentTitle===filters[0]){
                targetTitleIndex = counter
                break;
            }
            counter++
        }
        return targetTitleIndex
    }

    async function location(location){
        await page.focus('.MuiGrid-item:nth-of-type(3) > div > div > div > input')
        await page.keyboard.type(location)
    }

    if(filters[0]){
       let index = await getFilterIndex(2);

       if(!index){
        await browser.close()
        process.exit(1)
       }
       await page.click(`.css-xr8o0o > .d-flex:nth-of-type(${index}) > small`)
       await page.waitForNetworkIdle();
    }
    if(filters[1]){
        await location(filters[1])
    }
    if(filters[2]){
        let index = await getFilterIndex(4);

        if(!index){
            await browser.close;
            process.exit(1)
        }
        await page.click(`.css-1f8k2gf:nth-of-type(${index}) > div > div > div > small`)
        await page.waitForNetworkIdle();
    }



}

(async()=>{
    try{
        const browser = await puppeteer.launch({
            headless:false,
            args:['--lang=en-US,en;q=0.9']
          });

        const page = await browser.newPage();
        await page.setViewport({ width: 1047, height: 672});

        page.setDefaultNavigationTimeout(120000)
        await page.goto('https://instantly.ai/',{timeout: 0});
        
        await login(page,browser)
        

    }
    catch(error){
        console.log('error-> ', error)
    }


})()