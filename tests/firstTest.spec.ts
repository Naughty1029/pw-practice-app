import { test } from "@playwright/test";

//全体に対するhooks
test.beforeEach(async({page})=>{
  await page.goto("http://localhost:4200/")
})

//グループ化
test.describe.only("suite1", ()=>{
  //グループ内に対するhooks
  test.beforeEach(async({page})=>{
    await page.getByText("Charts").click()
  })

  test("the first test", async({page})=>{
    await page.getByText("Form Layouts").click()
  })
  
  test("navigate to datepicker page", async({page})=>{
    await page.getByText("Datepicker").click()
  })
})

//グループ化
test.describe("suite1", ()=>{
  //グループ内に対するhooks
  test.beforeEach(async({page})=>{
    await page.getByText("Forms").click()
  })

  test("the first test1", async({page})=>{
    await page.getByText("Form Layouts").click()
  })
  
  test("navigate to datepicker page2", async({page})=>{
    await page.getByText("Datepicker").click()
  })
})
