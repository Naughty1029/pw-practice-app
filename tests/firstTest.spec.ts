import { expect, test } from "@playwright/test";

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

test("User facing locators",async({page})=>{
  await page.getByRole('textbox',{name:"Email"}).first().click();
  await page.getByRole('button',{name:"Sign in"}).first().click();

  await page.getByLabel('Email').first().click();

  await page.getByPlaceholder('Jane Doe').click();

  await page.getByText('Using the Grid').click();
  await page.getByTestId('SignIn')
  await page.getByTitle('IoT Dashboard').click();
})

test("locationg child elements",async({page})=>{
  //どちらでも可能
  await page.locator('nb-card nb-radio :text-is("Option 1")').click();
  await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 1")').click();

  await page.locator('nb-card').getByRole('button',{name:"Sign in"}).first().click();

  //indexを指定することはなるべく避ける
  await page.locator('nb-card').nth(3).getByRole('button').click();
})

test("locationg parent elements",async({page})=>{
  await page.locator('nb-card', {hasText:'Using the Grid'}).getByRole('textbox',{name:"Email"}).click();
  await page.locator('nb-card', {has:page.locator('#inputEmail1')}).getByRole('textbox',{name:"Email"}).click();

  await page.locator('nb-card').filter( {hasText:'Basic form'}).getByRole('textbox',{name:"Email"}).click();
  await page.locator('nb-card').filter( {has:page.locator('.status-danger')}).getByRole('textbox',{name:"Password"}).click();

  await page.locator('nb-card').filter( {has:page.locator('nb-checkbox')}).filter( {hasText:'Sign in'})
    .getByRole('textbox',{name:"Email"}).click();

  await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox',{name:"Email"}).click();
})


test("Reusing the locators",async({page})=>{
  const basicForm = page.locator('nb-card').filter( {hasText:'Basic form'});
  const emailField = basicForm.getByRole('textbox',{name:"Email"});
  await emailField.fill('test@test.com');
  await basicForm.getByRole('textbox',{name:"Password"}).fill('Welcome123');
  await basicForm.locator('nb-checkbox').click();
  await basicForm.getByRole('button').click();

  await expect(emailField).toHaveValue('test@test.com');
})