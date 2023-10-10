function main(wb: ExcelScript.Workbook) {
    const ws:ExcelScript.Worksheet = wb.getWorksheet('Form');
    const aggWksht:ExcelScript.Worksheet = wb.getWorksheet('Aggregated');
    const impTempWksht:ExcelScript.Worksheet = wb.getWorksheet('Import_Template');
    const upcmExWksht:ExcelScript.Worksheet = wb.getWorksheet('Upcoming_Executions');

    const specs:object = {
        'scheduledIssueName': '',
        'summary':'',
        'description':'',
        'stp':'',
        'pids':'',
        'numPrograms':'',
        'seg':'',
        'caseNum':'',
        'admin':'',
        'holdFiles':'',
        'dueDateVal':'',
        'region':'',
        'logoPhoto':'',
        'lang':'',
        'custom':'',
        'pa':'',
        'budgetInConfig':'',
        'solicitation':'',
        'allowableBudget':'',
        'pricingMod':'',
        'specialInst':'',
        'diffInstr':'',
        'firstExDate':'',
        'dueDateType':'',
        'camJobType':'',
        'reporter':'',
        'fixbug':'',
    };

    const specReplacement:object = {
        'custom': {'Yes':'16991','No':'16992'},
        'pricingMod': {'':'-1','Legacy Pricing':'18002','Market-Based':'18000'},
        'region': {'Australia':'22685','Canada':'22686','US':'22687','Tanner Europe':'22688','MFG':'22689'},
        'pa':{'Yes':'18300','No':'18301'},
        'admin':{'Yes':'15045','No':'15046'},
        'solicitation':{'':'-1','Yes':'22169','No':'22170'},
        'logoPhoto':{'Yes':'15051','No':'15052'},
        'seg':{'Signature':'25893','Large Enterprise':'22322','Enterprise':'22323',
            'Corporate':'22324','Mid':'22325','Small':'22326'},
        'lang':{'Yes':'15055','No':'15056'},
        'budgetInConfig':{'':'-1','Yes':'21739','No':'21740'},
        'holdFiles':{'':'-1','Yes':'25694','No':'25695'},
        'allowableBudget':{'':'-1','~10%':'21744','~5%':'21745','Other':'21746'},
    }

    const isDupe = (stp:string):boolean => {
      let lastRow:number = aggWksht.getUsedRange().getLastRow().getRowIndex();
      const stpColVals = aggWksht.getRangeByIndexes(1,3,lastRow,1).getValues();
      const simpleArr:(string|number|boolean)[] = [];
      stpColVals.forEach((val) => {
        val.forEach((subVal) => {
          simpleArr.push(subVal.toString());
        })
      });
      return simpleArr.includes(stp)?true:false;
    }


    const gatherData = (obj:object):object => {
        let row:number = 4;
        let errorExists:boolean = false;
        Object.keys(obj).forEach((spec) => {
            const rng:ExcelScript.Range = ws.getRangeByIndexes(row,4,1,1);
            if(rng.getOffsetRange(0,-2).getText() === '**' && rng.getText() == ''){
                rng.getOffsetRange(0,1).setValue(`${rng.getOffsetRange(0,-1).getText()} is required.`)
                errorExists = true;
            }else{
                obj[spec] = rng.getText();
            }
            row++;
        });
        if(isDupe(obj['stp'])){
          ws.getRange('F8').setValue('This is a duplicate STP');
          errorExists = true;
        }
        if(!['d','w','m'].includes(obj['dueDateVal'][obj['dueDateVal'].length -1])){
          ws.getRange('F15').setValue('This value must be a dynamic value like 10d, 2w, 6m, etc.');
          errorExists = true;
        }
        if(errorExists){
          throw new Error;
        } else{
            ws.getRangeByIndexes(4,4,23,1).setValues(formArrBuilder(22,''));
            ws.getRangeByIndexes(4,5,23,1).setValues(formArrBuilder(22,''))
        }
        return obj;
    }
    
    const aggregate = (obj:object) => {
        aggWksht.activate();
        let lRow:number = aggWksht.getUsedRange().getLastRow().getRowIndex() + 1;//offset
        let c:number = 0;
        Object.keys(obj).forEach((spec) => {
            aggWksht.getRangeByIndexes(lRow,c,1,1).setValue(obj[spec]);
            c++;
        });
    };

    const extrapolate = (obj:object, replacementObj:object) => {
        const order:string[] = ['scheduledIssueName','firstExDate','dueDateType','diffInstr','custom',
            'description','pricingMod','stp','pids','region','numPrograms','pa','admin','solicitation',
            'logoPhoto','seg','lang','summary','budgetInConfig','holdFiles','caseNum','reporter',
            'allowableBudget','specialInst','camJobType','dueDate','dueDateVal'];
        impTempWksht.activate();
        const lastRow = impTempWksht.getUsedRange().getLastRow().getRowIndex() + 1;
        let col:number = 0;
        for(let key of order){
            if(key in replacementObj){
                let currVal:string = obj[key];
                obj[key] = replacementObj[key][currVal];
            } else if(['reporter','camJobType','dueDateType'].includes(key)){
                if(key == 'reporter'){
                    obj[key] = 'JIRAUSER16847'
                } else if(key == 'camJobType'){
                    obj[key] = '16462'
                } else if(key == 'dueDateType'){
                    obj[key] = 'DYNAMIC'
                };
            } else if(key == 'firstExDate'){
              obj[key] = new Date(addHoursToDate(new Date(obj[key]),7));
              obj[key] = parseInt((new Date(obj[key]).getTime() / 1000).toFixed(0));
            }
            impTempWksht.getRangeByIndexes(lastRow,col ,1,1).setValue(obj[key]);
            col++;
        }
    }

    const addUpcomingExecutions = (issueName:string, seg:string, firstExDate:string, dueDateInterval:string) => {
        upcmExWksht.activate();
        let lRow:number = upcmExWksht.getUsedRange().getLastRow().getRowIndex();
        let exDate:Date = new Date(firstExDate);
        const interval = {
          'Signature':1,
          'Large Enterprise':1, 
          'Enterprise':3,
          'Coporate':6,
          'Mid':6,
          'Small':6,
        };
        let formula:string = '=RC[-2] + (NUMBERVALUE(LEFT(RC[-1],LEN(RC[-1])-1))*IFS(RIGHT(RC[-1],1)="d",1,RIGHT(RC[-1],1)="w",7,RIGHT(RC[-1],1)="m",30))';
        let int:number = interval[seg];
        for(let i:number = 0; i<=10; i++){
          const newExDate:Date = new Date(exDate.setMonth(exDate.getMonth()+int));
          const arr:(Date|string)[] = ['CAM',issueName,newExDate.toLocaleDateString(),dueDateInterval];
          let c:number = 0;
          for(let i of arr){
            upcmExWksht.getRangeByIndexes(lRow+1,c,1,1).setValue(i);
            c++;
          }
          upcmExWksht.getRangeByIndexes(lRow+1,c,1,1).setFormulaR1C1(formula);
          lRow++;
          i+=int;
        }
    }
    
    const updateDataValidation = (valToPrepend:string) => {
      ws.activate();
      let currentValidation:string|ExcelScript.Range = ws.getRange('M5').getDataValidation().getRule().list.source;
     
      ws.getRange('M5').getDataValidation().setRule({
        list: {
          inCellDropDown:true,
          source:(valToPrepend + ',' + currentValidation),
        }
      })
    }
    
  function addHoursToDate(dateObj:Date, hrs:number):Date{
    return new Date(dateObj.setHours(dateObj.getHours() + hrs));
  }
    //helper function for setvalues/setformulas
    function formArrBuilder(num:number, form:string){
        const outerArray:string[][] = []
        for(let n:number = 0; n<=num; n++){
            outerArray.push([form]);
        }
        return outerArray;
    }


    const updatedSpec:object = gatherData(specs);
    aggregate(updatedSpec);
    addUpcomingExecutions(updatedSpec['scheduledIssueName'],updatedSpec['seg'],updatedSpec['firstExDate'],updatedSpec['dueDateVal']);
    extrapolate(updatedSpec,specReplacement);
    updateDataValidation(updatedSpec['scheduledIssueName']);
    
};
