import { expect, test } from "@playwright/test";

test.beforeEach(async({page})=>{
  await page.goto("http://localhost:4200/")
})

test.describe('Form Layouts page', ()=>{
  test.beforeEach(async({page})=>{
    await page.getByText("Forms").click()
    await page.getByText("Form Layouts").click()
  })

  test('input fields', async({page})=>{
    const inputTheGridEmailInput = page.locator('nb-card',{hasText:'Using the Grid'}).getByRole('textbox',{name:'Email'});

    await inputTheGridEmailInput.fill('test@test.com');
    await inputTheGridEmailInput.clear();
    await inputTheGridEmailInput.pressSequentially('test2@test.com',{delay:500});

    //Generic assertion
    const inputValue = await inputTheGridEmailInput.inputValue();
    expect(inputValue).toEqual('test2@test.com');

    //Locator assertion
    await expect(inputTheGridEmailInput).toHaveValue('test2@test.com');
  })
})