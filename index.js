import {chromium} from 'playwright';

(async () => {
    const browser = await chromium.launch({
        headless: false
    });
    const context = await browser.newContext({
        storageState: './storage.json'
    });
    const page = await context.newPage();
    await page.goto('https://juejin.cn/');

    // 判断是否已登录
    const noLogin = await page.$('//*[@id="juejin"]/div[1]/div[1]/header/div/nav/ul/ul/li[3]/div/button');

    if (noLogin) {
        console.log('未登录')
        // 点击登录出现扫码框
        await page.getByRole('button', {name: '登录 注册'}).click();
        // 等待头像出现代表已登录
        await page.waitForSelector('//*[@id="juejin"]/div[1]/div[1]/header/div/nav/ul/ul/li[4]/div/div/img');
        // 模拟等待2秒
        await page.waitForTimeout(2 * 1e3)
        // 前往签到
        await page.getByRole('button', {name: '去签到'}).click();
        // 模拟等待5秒
        await page.waitForTimeout(5 * 1e3)
        // 立即签到
        await page.getByRole('button', {name: '立即签到'}).click();

    } else {

        console.log('已登录')
        const hasLogin = await page.$('//*[@id="juejin"]/div[1]/div[1]/header/div/nav/ul/ul/li[4]/div/div/img');
        console.log(hasLogin ? '有头像' : '无头像')

        // 检测是否已签到
        const isSign = await page.$('//*[@id="juejin"]/div[1]/main/div/div[2]/div/aside/div[1]/div/button/span');
        // const isSign = await page.locator('//*[@id="juejin"]/div[1]/main/div/div[2]/div/aside/div[1]/div/button/span').filter({hasText: '去签到'});
        console.log(isSign ? '已签到' : '未签到')
    }

    // 已签到 xpath
    // //*[@id="juejin"]/div[1]/main/div[2]/div/div[1]/div[2]/div[2]/div[2]/div[1]/button
    // 等待时间
    await page.waitForTimeout(10 * 1e3)

    // await page.getByRole('button', {name: '去签到'}).click();
    // await page.getByRole('button', {name: '立即签到'}).click();
    // const page1 = await page1Promise;
    // await page1.locator('.success-modal > .byte-modal__wrapper > .byte-modal__content > .byte-modal__header > .byte-modal__headerbtn > .byte-icon').click();

    await context.storageState({path: './storage.json'})
    console.log(context.cookies())
    // ---------------------
    console.log('内容关闭');
    await context.close();
    await browser.close();
    console.log('浏览器关闭');

})();