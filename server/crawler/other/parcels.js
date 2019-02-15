import xlsx from 'node-xlsx';
// import groupBy from 'lodash/groupBy';
import fs from 'fs';


const workSheetsFromFile = xlsx.parse('./p.xlsx');
const { data } = workSheetsFromFile[0];
console.log('data');
console.log(data);

const aa = data.map((i) => {
  const bb = { };

  const list = ['carrier', 'package', 'value', 'size', 'weight', 'maximum', 'international_limit', 'content', 'type'];

  list.map((key, index) => {
    // console.log('i[index]');
    // console.log(i[index]);
    const cc = !i[index] ? '' : (`${i[index]}`)
      .replace(/\s\s+/g, '')
      .replace(/^\s*/, '');

    if (cc && cc.indexOf('N/A') === -1) {
      switch (key) {
        case 'maximum': {
          bb[key] = parseFloat(cc);
          break;
        }

        case 'international_limit': {
          console.log('cc');
          console.log(cc);
          bb[key] = parseFloat(cc);
          break;
        }
        default: {
          bb[key] = cc;
        }
      }
    }
  });

  return bb;
});

// console.log(aa);

const t = JSON.stringify(aa, 2, false);
fs.writeFileSync('p.jso', t);
// const group = groupBy(data, x => x[1]);
// console.log(group);
// const result = Object.keys(group).map((key) => {
//   if (group[key].length === 1) {
//     return group[key][0];
//   } else {
//     const temp = group[key][0];
//     temp[2] = group[key].map(j => j[2]).join(',');
//     return temp;
//   }
// });

// console.log(result);

// const buffer = xlsx.build([{ name: 'mySheetName', data: result }]); // Returns a buffer
// fs.writeFileSync('./b.xlsx', buffer);
