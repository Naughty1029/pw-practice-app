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

  test('radio buttons', async({page})=>{
    const UsingTheGridForm = page.locator('nb-card',{hasText:'Using the Grid'});

    await UsingTheGridForm.getByRole('radio', {name:'Option 1'}).check({force:true});
    const radioStatus =  await UsingTheGridForm.getByRole('radio', {name:'Option 1'}).isChecked();
    expect(radioStatus).toBeTruthy();

    await UsingTheGridForm.getByRole('radio', {name:'Option 2'}).check({force:true});
    expect(await UsingTheGridForm.getByRole('radio', {name:'Option 1'}).isChecked()).toBeFalsy();
    expect(await UsingTheGridForm.getByRole('radio', {name:'Option 2'}).isChecked()).toBeTruthy();

  })
})

test('checkboxes', async({page})=>{
  await page.getByText('Modal & Overlays').click();
  await page.getByText('Toastr').click();

  await page.getByRole('checkbox',{name:'Hide on click'}).uncheck({force:true});
  await page.getByRole('checkbox',{name:'Prevent arising of duplicate toast'}).check({force:true});

  const allBoxes =  page.getByRole('checkbox');

  for(const box of await allBoxes.all()){
    await box.uncheck({force:true});
    expect(await box.isChecked()).toBeFalsy();
  }
})