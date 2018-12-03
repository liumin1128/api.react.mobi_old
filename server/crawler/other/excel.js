import xlsx from 'node-xlsx';
import groupBy from 'lodash/groupBy';
import fs from 'fs';


const workSheetsFromFile = xlsx.parse('./a.xlsx');
const { data } = workSheetsFromFile[0];
const group = groupBy(data, x => x[1]);
// console.log(group);
const result = Object.keys(group).map((key) => {
  if (group[key].length === 1) {
    return group[key][0];
  } else {
    const temp = group[key][0];
    temp[2] = group[key].map(j => j[2]).join(',');
    return temp;
  }
});

// console.log(result);

const buffer = xlsx.build([{ name: 'mySheetName', data: result }]); // Returns a buffer
fs.writeFileSync('./b.xlsx', buffer);
