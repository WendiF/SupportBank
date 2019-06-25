// const fs = require('fs');
// const csv = require('csv-parser');
// const fileUrl = new URL('file:///C:/Work/Training/SupportBank/Transactions2014.csv');
//
// fs.createReadStream(fileUrl)
//     .pipe(csv())
//     .on('data', function(data){
//         try {
//             let data = fs.readFileSync(fileUrl, 'utf8');
//             console.log(data);
//         } catch(e) {
//             console.log('Error:', e.stack);
//         }
//     })
//     .on('end',function(){
//         //some final operation
//     });

const fs = require('fs')
const Papa = require('papaparse');
// var $ = jQuery = require('jquery');
// require('./jquery.csv.js');
// const csv = require('/.jquery.csv.js');
const fileUrl = new URL('file:///C:/Work/Training/SupportBank/Transactions2014.csv');


let data = fs.readFileSync(fileUrl, 'utf8');
// console.log(data);
let result = Papa.parse(data, {header: true});
console.log(result.data);

let accounts 


// let result = $.csv.toObjects(data);
// console.log(data);


