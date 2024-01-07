import { expect, test } from "@playwright/test";

//全体に対するhooks
test.beforeEach(async({page})=>{
  await page.goto("http://uitestingplayground.com/ajax")
  await page.getByText("Button Triggering AJAX Request").click()
})

test('auto waiting', async({page})=> {
  const successButton = page.locator('.bg-success');

  // await successButton.click();

  // const text = await successButton.textContent();
  await successButton.waitFor({state: "attached"});
  const text = await successButton.allTextContents();
  expect(text).toContain('Data loaded with AJAX get request.');

  //locator assertionsのタイムアウトはデフォルトで5000s
  await expect(successButton).toHaveText('Data loaded with AJAX get request.',{timeout:20000});
})

test('alternative waits', async({page})=> {
  const successButton = page.locator('.bg-success');

  //__ wait for element
  await page.waitForSelector('.bg-success');

  //__ wait for particular response
  await page.waitForResponse('http://uitestingplayground.com/ajaxdata');

  //__ wait for network calls to be completed (NOT RECOMMENDED)
  await page.waitForLoadState('networkidle');

  const text = await successButton.allTextContents();
  expect(text).toContain('Data loaded with AJAX get request.');
})