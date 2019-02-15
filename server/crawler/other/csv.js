import xlsx from 'node-xlsx';
// import groupBy from 'lodash/groupBy';
import fs from 'fs';


const workSheetsFromFile = xlsx.parse('./t.csv');
const { data } = workSheetsFromFile[0];
console.log('data');
console.log(data);
