const {test,expect}=require('@playwright/test');
test.beforeEach(async({page})=>{await page.goto('/');});
test('rejects empty and whitespace-only titles without creating a note',async({page})=>{
  for(const title of ['', '   ']){
    await page.getByTestId('note-title').fill(title);
    await page.getByTestId('note-save').click();
    await expect(page.getByRole('alert')).toHaveText('A title is required.');
    await expect(page.getByTestId('note-card')).toHaveCount(0);
  }
});
test('keyboard submission creates a note and editing preserves the other note',async({page})=>{
  for(const title of ['First note','Second note']){
    await page.getByTestId('note-title').fill(title);
    await page.getByTestId('note-content').fill('Original content');
    await page.getByTestId('note-save').focus();
    await page.keyboard.press('Enter');
  }
  const first=page.getByTestId('note-card').filter({has:page.getByRole('heading',{name:'First note',exact:true})});
  await first.getByTestId('note-edit').click();
  await page.getByTestId('note-title').fill('First note revised');
  await page.getByTestId('note-save').click();
  await expect(page.getByTestId('note-card')).toHaveCount(2);
  await expect(page.getByRole('heading',{name:'First note revised',exact:true})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Second note',exact:true})).toBeVisible();
});
