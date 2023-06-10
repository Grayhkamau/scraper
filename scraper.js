const puppeteer = require('puppeteer');
const XLSX = require('xlsx')

let places = [];

let oldFileName = process.argv[2];
let newFileName = process.argv[3];

let citiesPage
if(!oldFileName||!newFileName) process.exit(1);

async function getCities(browser){
  citiesPage = await browser.newPage();

  await citiesPage.goto(
  'https://www.washington-demographics.com/cities_by_population'    
    ,{timeout: 0});
  
  await citiesPage.waitForNetworkIdle();

  const allCities = await citiesPage.$$('.ranklist > tbody tr');

  if(allCities) return allCities
  await browser.close()
  process.exit(1)
}

function writeToSheet(){
  let workbook = XLSX.readFile(`./${oldFileName}.xlsx`)
  console.log('start workbook',workbook)
  const sheet = workbook.SheetNames[0]
  const actualSheet = workbook.Sheets[sheet]
  let exelShopsArray = XLSX.utils.sheet_to_json(workbook.Sheets.Sheet1)
console.log(exelShopsArray,'excelShopsArray')
  let phoneNumbers = [];
  if(exelShopsArray&&exelShopsArray.length){
    phoneNumbers = exelShopsArray.map(shop=>{
      return shop.phone
    })
  }
  console.log(phoneNumbers,'phone')

  let phoneNumbersInScrapedCities = places.map(shop=>{
    return shop.phone
  })

  let noDublicatesScrapedDataArray = []
  places.forEach(shop=>{
    let result = phoneNumbersInScrapedCities.filter(phone=>phone===shop.phone)
    if(result.length<=1) noDublicatesScrapedDataArray.push(shop)
  })


  let newScrapedDataArray = [...noDublicatesScrapedDataArray]
  if(phoneNumbers&&phoneNumbers.length){
    newScrapedDataArray = [];
    noDublicatesScrapedDataArray.forEach(shop=>{
      if(!phoneNumbers.includes(shop.phone)) newScrapedDataArray.push(shop);
    })
  }
  console.log('newScraedDataArray',newScrapedDataArray)
  if(!newScrapedDataArray.length) return
  console.log(newScrapedDataArray,'newScrapedArray')
  XLSX.utils.sheet_add_json(actualSheet,newScrapedDataArray,{origin:-1})
  XLSX.writeFile(workbook, `${newFileName}.xlsx`);

  places = []
}

async function hasNextPage(page,browser){
  let nextPageButton = await page.$('button[aria-label="Next"] > span');

  if(!nextPageButton)return false
  const nextPageText = await nextPageButton.evaluate(el=>el.textContent.trim())

  if(!nextPageText)return false
  else if(nextPageButton) return true
}
async function gotoNextPage(page){
  await page.click('button[aria-label="Next"] > span');
  await page.waitForNetworkIdle();
}

async function getWebAddress(browser,siteElement){
  let siteaddress = await siteElement.evaluate(el=>el.href);
  if(siteaddress){
    return siteaddress
}
return ''
}
async function parsePlaces(page,browser) {
  await page.waitForNetworkIdle()
  const nameElement = await page.$('.tZPcob');
  const addressElement = await page.$('.fccl3c > span');
  const phoneElement = await page.$('.eigqqc');
  const siteElement = await page.$('.rX5xSc > a')

  let address = '';
  let name = '';
  let phone = '';
  let webAddress = '';
  if(addressElement) address = await addressElement.evaluate((el) => el.textContent.trim());
  if(nameElement) name = await nameElement.evaluate((el) => el.textContent.trim());
  if(phoneElement) phone = await phoneElement.evaluate((el) => el.textContent.trim());

  if(siteElement){
    webAddress = await getWebAddress(browser,siteElement)
  }
  // console.log('store',name,address,phone);
  places.push({name,phone,address,webAddress})
  return;
}

//entry point
(async () => {
  // try{
    const browser = await puppeteer.launch({
      headless:false,
      args:['--lang=en-US,en;q=0.9']

    });
   
    let cities = await getCities(browser)
    console.log(cities,citiesPage)
    let counter = 56
    for(city of cities.slice(40,41)){
      let cityElement = await citiesPage.$(`.ranklist > tbody tr:nth-of-type(${counter}) > td:nth-of-type(2) > a`);
      let cityName
      console.log('cityElement',cityElement);

      if(cityElement) cityName = await cityElement.evaluate((el)=>el.textContent.trim());
      else if(!cityElement){
        cityElement = await citiesPage.$(`.ranklist > tbody tr:nth-of-type(${counter}) > td:nth-of-type(2)`);
        cityName = cityName = await cityElement.evaluate((el)=>el.textContent.trim());
      }
      console.log('cityName',cityName)
      if(cityName){
      const page = await browser.newPage();
      page.setDefaultNavigationTimeout(120000)
      await page.goto(
      `https://www.google.com/localservices/prolist?g2lbs=ADZRdktIdNtlCprUQ40esLGNjS0gIIYOS_yDSr7VQyuDUt0Ij0drsytrtl-cnNm2BvbakFSUGQUpglilK4inY4KWuNWWXJZnRhxVyfVjnxJXRjVKathlL_VXT4Ilfw7K4SsSjrOd-OoV&hl=en-KE&gl=ke&ssta=1&q=pest%20control%20in%20${cityName}%20washington&oq=pest%20control%20in%20${cityName}%20washington&slp=MgA6HENoTUlfTDZ2ajhpdl93SVZFc25WQ2gzT1pnaEhSAggCYACSAbECCg0vZy8xMWp6cGo1c19fCg0vZy8xMWhkdnN4czdmCgsvZy8xdGYxYmZuOAoLL2cvMXRnY2xfMHYKDS9nLzExaDUwZzU2eTcKDS9nLzExcHp2c3hkN3cKDC9nLzFoY2JkY3J3dwoNL2cvMTFrMzgxX2dqawoNL2cvMTFjNXQ0NDFxNQoNL2cvMTFqX3Y1dHd3aAoNL2cvMTFxbjdmZF9qXwoNL2cvMTFtdmc3dDlodAoNL2cvMTFoMTVfcnQ4bAoML2cvMTI2MWhqNHB6Cg0vZy8xMWJ5X3AyanhwCg0vZy8xMWg1cmZxenBkCgwvZy8xamt2eDU5dHEKDS9nLzExaDA4MGh2MTQKDS9nLzExcmo1eGprdnIKDS9nLzExZzY5azFwZHoSBBICCAESBAoCCAGaAQYKAhcZEAA%3D&src=2&serdesk=1&sa=X&ved=2ahUKEwi14KiPyK__AhUJdqQEHXfhBv4QjGp6BAhMEAE&scp=ChlnY2lkOnBlc3RfY29udHJvbF9zZXJ2aWNlElQSEgkNNLTweUmFVBHV8Yag0ROKtBoSCcmxfe7nnppUEalETBmKww5nIhJBcmxpbmd0b24sIFdBLCBVU0EqFA3vRbIcFRwWK7cdWFK7HCW03ze3MAAaDHBlc3QgY29udHJvbCIkcGVzdCBjb250cm9sIGluIGFybGluZ3RvbiB3YXNoaW5ndG9uKhRQZXN0IGNvbnRyb2wgc2VydmljZQ%3D%3D` 
            ,{timeout: 0});
    
      await page.waitForNetworkIdle();
    async function run(){
      const allShops = await page.$$('.DVBRsc');
      let counter = 1

      if(allShops&&allShops.length){
        for (shop of allShops){    
          const isThereShop = await page.$(`.ykYNg > div:nth-of-type(${counter}) > div[jsname="oW7RTd"] > .DVBRsc`);
      
          if(isThereShop){
            try{
              await page.click(`.ykYNg > div:nth-of-type(${counter}) > div[jsname="oW7RTd"] > .DVBRsc`)
              await page.waitForNetworkIdle();
              await parsePlaces(page,browser)
            }
            catch{
              console.log(`shop ${shop} in city ${city} not clickable`)
            }
            
          }     
          counter +=2
        }
      }
      const doesIt = await hasNextPage(page,browser);
    
      if(doesIt){
        counter -= 1
        await gotoNextPage(page);
        await page.waitForNetworkIdle();
        await run();
      } 
    }
    await run();
  }
    counter++
  }
    writeToSheet()
    await browser.close();
    console.log('Done Scraping');
    process.exit(1)

}
)()



