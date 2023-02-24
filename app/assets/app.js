const puppeteer = require('puppeteer');
const {JSDOM} = require("jsdom");
const fs = require('fs');

if (!fs.existsSync("./data")) fs.mkdirSync("./data");

(async () => {
    // const browser = await puppeteer.launch();
    const browser = await puppeteer.launch({
        headless: true
    });
    const page = await browser.newPage();
    await page.goto('https://www.bkashcluster.com:9081/mr_portal/', {waitUntil: 'networkidle2'});
    await page.type('input[name=j_username]', 'HOROFTECHRM50693');
    await page.type('input[name=j_password]', 'FahimFahadLeon64742812!@');
    await page.evaluate(async () => {
        document.querySelector('input[type=submit]').click();
    });
    await page.waitForNavigation({
        waitUntil: 'networkidle2',
    });
    await page.evaluate(function () {
        loadMenuItem('1', 'Daily_Transaction');
    });
    await new Promise(r => setTimeout(r, 1000));
    // await page.waitForTimeout(1000);
    let ex = (async () => {
        await Promise.all([
            page.evaluate(() => {
                viewTableFunction_new('View');
            }),
            new Promise(r => setTimeout(r, 60000)),
            page.waitForResponse(async (response) => {
                await response.text().then((val) => {
                    const document = new JSDOM(val).window.document;
                    let el = document.querySelectorAll("table.reference tr");
                    for (let i = 0; i < el.length; i++) {
                        (async function (td) {
                            if (td.length > 0) {
                                if (!fs.existsSync(`./data/${td.item(9).textContent}`)) {
                                    fs.writeFileSync(`./data/${td.item(9).textContent}`,
                                        JSON.stringify({
                                            "Serial No.": td.item(0).textContent,
                                            "Date & Time": td.item(1).textContent,
                                            "Transaction Type": td.item(2).textContent,
                                            "From Account Number": td.item(3).textContent,
                                            "To Account Number": td.item(4).textContent,
                                            "Transaction Amount": td.item(5).textContent,
                                            "Coupon Amount": td.item(6).textContent,
                                            "Total Transaction Amount": td.item(7).textContent,
                                            "Coupon Status": td.item(8).textContent,
                                            "Transaction ID": td.item(9).textContent,
                                        }, null, 4));
                                    await (async (file) => {
                                        const page1 = await browser.newPage();
                                        await page1.goto('http://localhost:81/', {waitUntil: 'networkidle2'});
                                        await page1.type('input[name=user]', 'mecloak');
                                        await page1.type('input[name=password]', '12345678');
                                        const inputUploadHandle = await page1.$('input[type=file]');
                                        await inputUploadHandle.uploadFile("./data/"+file);
                                        await page1.evaluate(() => document.getElementById('upload').click());
                                        await page1.waitForResponse(async (res) => {
                                            await res.text().then((r) => {
                                                console.log(r)
                                            })
                                            return true;
                                        }).then(async () => {
                                            await page1.close();
                                        })
                                    })(td.item(9).textContent)
                                }
                            }
                        })(el.item(i).querySelectorAll("td"));
                    }
                })
                return true;
            }),
        ]).then(async () => {
            let s = new Date().toLocaleString();
            console.log(s);
            await ex()
        }).catch(async (e) => {
            console.log(e);
            await new Promise(r => setTimeout(r, 60000)).then(async () => {
                let s = new Date().toLocaleString();
                console.log(s);
                await ex()
            });
        })
    });
    let s = new Date().toLocaleString();
    console.log(s);
    await ex();
    // await page.pdf({path: 'page.pdf', format: 'A4'});
    // await browser.close();
})();
