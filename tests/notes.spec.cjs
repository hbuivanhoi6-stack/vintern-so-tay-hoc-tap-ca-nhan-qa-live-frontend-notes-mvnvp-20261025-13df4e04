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

async function createNote(page,title='QA complete note') {
  await page.getByTestId('note-new').click();
  await page.getByTestId('note-title').fill(title);
  await page.getByTestId('note-content').fill('Synthetic learning notes');
  await page.getByTestId('note-tags').fill('react,typescript');
  await page.getByTestId('note-save').click();
}
test('restores a saved note after a real page reload',async({page})=>{
  await createNote(page,'Persistent note'); await page.reload();
  await expect(page.getByTestId('note-card')).toHaveCount(1);
  await expect(page.getByRole('heading',{name:'Persistent note',exact:true})).toBeVisible();
});
test('combines text/tag filters and requires confirmation before deleting',async({page})=>{
  await createNote(page);
  await page.getByTestId('note-search').fill('not-present'); await expect(page.getByTestId('note-card')).toHaveCount(0);
  await page.getByTestId('note-search').fill('complete'); await expect(page.getByTestId('note-card')).toHaveCount(1);
  await page.getByTestId('note-tag-filter').fill('missing'); await expect(page.getByTestId('note-card')).toHaveCount(0);
  await page.getByTestId('note-tag-filter').fill('react'); await expect(page.getByTestId('note-card')).toHaveCount(1);
  page.once('dialog',dialog=>dialog.dismiss()); await page.getByTestId('note-delete').click();
  await expect(page.getByTestId('note-card')).toHaveCount(1);
  page.once('dialog',dialog=>dialog.accept()); await page.getByTestId('note-delete').click();
  await expect(page.getByTestId('note-card')).toHaveCount(0); await page.reload();
  await expect(page.getByTestId('note-card')).toHaveCount(0);
});
test('downloads the same versioned JSON shown in the export preview',async({page},testInfo)=>{
  await createNote(page,'Exported note');
  const pending=page.waitForEvent('download'); await page.getByTestId('note-export').click(); const download=await pending;
  expect(download.suggestedFilename()).toBe('notes-v1.json');
  const file=testInfo.outputPath('notes-v1.json'); await download.saveAs(file);
  const exported=JSON.parse(await require('node:fs/promises').readFile(file,'utf8'));
  expect(exported).toEqual(JSON.parse(await page.getByTestId('note-export-preview').innerText()));
  expect(exported.schemaVersion).toBe(1); expect(exported.notes).toHaveLength(1);
  expect(exported.notes[0]).toMatchObject({title:'Exported note',content:'Synthetic learning notes',tags:['react','typescript']});
});
test('preserves corrupt stored data and blocks overwriting it',async({page})=>{
  await page.evaluate(()=>localStorage.setItem('vintern.qa.notes.v1','{corrupt'));
  await page.reload(); await expect(page.getByRole('alert')).toContainText('Original data is preserved');
  await expect(page.getByTestId('note-save')).toBeDisabled();
  expect(await page.evaluate(()=>localStorage.getItem('vintern.qa.notes.v1'))).toBe('{corrupt');
});
