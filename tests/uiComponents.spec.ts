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

test('Lists and dropdowns', async({page})=>{
  const dropDownMenu = page.locator('ngx-header nb-select');
  await dropDownMenu.click();

  page.getByRole('list'); //when the list has a UL tag
  page.getByRole('listitem');  //when the list has a LI tag

  const optionList = page.locator('nb-option-list nb-option');
  await expect(optionList).toHaveText(['Light','Dark','Cosmic','Corporate']);
  await optionList.filter({hasText: 'Cosmic'}).click();
  const header = page.locator('nb-layout-header');
  await expect(header).toHaveCSS('background-color','rgb(50, 50, 89)')

  const colors = {
    'Light':'rgb(255, 255, 255)',
    'Dark':'rgb(34, 43, 69)',
    'Cosmic':'rgb(50, 50, 89)',
    'Corporate':'rgb(255, 255, 255)'
  }
  await dropDownMenu.click();
  for(const color in colors){
    await optionList.filter({hasText: color}).click();
    await expect(header).toHaveCSS('background-color', colors[color])
    if(color !== "Corporate"){
      await dropDownMenu.click();
    }
  }
})

test('tooltips', async({page})=>{
  await page.getByText('Modal & Overlays').click();
  await page.getByText('Tooltip').click();

  const toolTipCart =  page.locator('nb-card',{hasText:"Tooltip Placements"});
  await toolTipCart.getByRole('button',{name:'Top'}).hover();

  const tooltip = await page.locator('nb-tooltip').textContent();
  expect(tooltip).toEqual('This is a tooltip');
})

test('dialog box', async({page})=>{
  await page.getByText('Tables & Data').click();
  await page.getByText('Smart Table').click();

  page.on('dialog', dialog => {
    expect(dialog.message()).toEqual('Are you sure you want to delete?')
    dialog.accept()
  })

  await page.getByRole('table').locator('tr', {hasText: 'mdo@gmail.com'}).locator('.nb-trash').click();
  await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com');
})

test('web tables', async({page})=>{
  await page.getByText('Tables & Data').click();
  await page.getByText('Smart Table').click();

  //1. get the row by any test in this row
  const targetRow = page.getByRole('row',{name:"twitter@outlook.com"})
  await targetRow.locator('.nb-edit').click()
  await page.locator('input-editor').getByPlaceholder('Age').clear()
  await page.locator('input-editor').getByPlaceholder('Age').fill('35')
  await page.locator('.nb-checkmark').click()

  //2. get the row based on the value in the specific column
  await page.locator('.ng2-smart-pagination-nav').getByText('2').click()
  const targetRowById = page.getByRole('row').filter({has:page.locator('td').nth(1).getByText('11')})
  await targetRowById.locator('.nb-edit').click();
  await page.locator('input-editor').getByPlaceholder('E-mail').clear()
  await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@test.com')
  await page.locator('.nb-checkmark').click()
  await expect(targetRowById.locator('td').nth(5)).toHaveText('test@test.com');

  //3. test filter of the table
  const ages = ["20","30","200"]

  for(let age of ages){
    await page.locator('input-filter').getByPlaceholder('Age').clear()
    await page.locator('input-filter').getByPlaceholder('Age').fill(age)
    await page.waitForTimeout(500)
    const ageRows = page.locator('tbody tr');

    for(let row of await ageRows.all()){
      const cellValue = await row.locator('td').last().textContent();
      if(age === "200"){
        expect(await page.getByRole('table').textContent()).toContain('No data found')
      }else{
        expect(cellValue).toEqual(age);
      }
    }
  }
})