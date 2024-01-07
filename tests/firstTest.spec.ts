import { test } from "@playwright/test";

//全体に対するhooks
test.beforeEach(async({page})=>{
  await page.goto("http://localhost:4200/")
  await page.getByText("Forms").click()
  await page.getByText("Form Layouts").click()
})

test("Locator syntax rules",async({page})=>{
  //by tag name
  await page.locator("input").first().click();
  //by ID
  await page.locator("#inputEmail1").click();
  //by Class Value
  page.locator(".shape-rectangle");
  //by attribute
  page.locator('[placeholder="Email"]')
  //by Class Value(full)
  page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')
  //Combine
  page.locator('input[placeholder="Email"]');
  //by partial text message
  page.locator(':text("Using")')
  //by exact text message
  page.locator(':text-is("Using the Grid")')
})