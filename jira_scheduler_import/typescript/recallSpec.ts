function main(wb: ExcelScript.Workbook) {
    const ws: ExcelScript.Worksheet = wb.getWorksheet('Form');
    const aggWksht: ExcelScript.Worksheet = wb.getWorksheet('Aggregated');
    const impTempWksht: ExcelScript.Worksheet = wb.getWorksheet('Import_Template');
    const upCmExWksht:ExcelScript.Worksheet = wb.getWorksheet('Upcoming_Executions');
    const specToRecall:string = ws.getRange("M5").getText();
    if(specToRecall == ''){
      ws.getRange("N5").setValue('Please Select a valid spec to recall');
      throw new Error
    } else{
      ws.getRange('N6').setValue('');
    }

  const specTemplate:object = {
    'scheduledIssueName': '',
    'summary': '',
    'description': '',
    'stp': '',
    'pids': '',
    'numPrograms': '',
    'seg': '',
    'caseNum': '',
    'admin': '',
    'holdFiles': '',
    'dueDateVal': '',
    'region': '',
    'logoPhoto': '',
    'lang': '',
    'custom': '',
    'pa': '',
    'budgetInConfig': '',
    'solicitation': '',
    'allowableBudget': '',
    'pricingMod': '',
    'specialInst': '',
    'diffInstr': '',
    'firstExDate': '',
    'dueDateType': '',
    'camJobType': '',
    'reporter': '',
    'fixbug': '',
  };

  const specName:string = ws.getRange('W5').getText();

  const aggSheetCleanup = (specName:string, template:object):object => {
    let lastRow:number = aggWksht.getUsedRange().getLastRow().getRowIndex();
    let found:boolean = false;
    let idx:number = 1;
    while(!found){
      if(aggWksht.getRangeByIndexes(idx,0,1,1).getText() == specName){
        found = true;
      } else {
        idx += 1;
      }
    }
    let c:number = 0;
    Object.keys(template).forEach((spec) => {
      template[spec] = aggWksht.getRangeByIndexes(idx,c,1,1).getText();
      c++;
    });
    sortSheet(aggWksht);
    return template;
  };

  const importTempCleanup = (specName:string) => {
    let lastRow:number = impTempWksht.getUsedRange().getRowIndex();
    let found:boolean = false;
    let idx:number = 1;
    while(!found){
      if(impTempWksht.getRangeByIndexes(idx,0,1,1).getText() == specName){
        found = true;
      } else {
        idx+=1;
      }
    }
    impTempWksht.getRangeByIndexes(idx,0,1,1).getEntireRow().setValue('');
    sortSheet(impTempWksht);
  }

  const upcomingExesCleanup = (specName:string) => {
    const lRow:number = upCmExWksht.getUsedRange().getLastRow().getRowIndex();
    for(let i = lRow; i > 0; i--){
      if(upCmExWksht.getRangeByIndexes(i,1,1,1).getText() == specName){
        for(let j:number = 0; j<=4; j++){
          upCmExWksht.getRangeByIndexes(i,j,1,1).setValue('');
        }
      }
    }
  };

  const dataValCleanup = (specName:string) => {
    let stringSplit:string[] = ws.getRange('M5').getDataValidation().getRule().list.source.toString().split(',');
    stringSplit.splice(stringSplit.indexOf(specName),1);
    ws.getRange('M5').getDataValidation().setRule({
      list:{
        inCellDropDown: true,
        source: stringSplit.join(',')
      }
    })
  };

  const fillForm = (obj:object) => {
    ws.activate();
    let i:number = 4;
    Object.keys(obj).forEach((spec) => {
      ws.getRangeByIndexes(i,4,1,1).setValue(spec);
      i++;
    });
  }

  function sortSheet(wkst:ExcelScript.Worksheet){
    const lastCol:number = wkst.getUsedRange().getLastColumn().getColumnIndex();
    wkst.getAutoFilter().getRange().getSort().apply([{ key: 0, ascending: true }], false, true);
  };

  fillForm(aggSheetCleanup(specToRecall,specTemplate));
  importTempCleanup(specToRecall);
  upcomingExesCleanup(specToRecall);
  dataValCleanup(specToRecall);
  
}
