const fs = require('fs')
const Papa = require('papaparse');
const fileUrl = new URL('file:///C:/Work/Training/SupportBank/Transactions2014.csv');
const readlineSync = require('readline-sync');

let data = fs.readFileSync(fileUrl, 'utf8');
let transfers = Papa.parse(data, {header: true}).data;
let names = Array.from(new Set(transfers.map(a => a.From).concat(transfers.map(a => a.To))));


class accounts{
    constructor(name, balance) {
        this.name = name;
        this.balance = balance;
    }
}

let accountlist = [];
for (let val of names) {
    accountlist.push(new accounts(val, 0));
}

// function completeTransfer(from, to, amount) {
//
//
// }


for (let transfer of transfers) {
    let fromPerson = accountlist.find((account) => {
        return account.name === transfer.From;
    });
    fromPerson.balance += - parseFloat(transfer.Amount);
    let toPerson = accountlist.find((account) => {
        return account.name === transfer.To;
    });
    toPerson.balance += parseFloat(transfer.Amount);
}

let command = readlineSync.promptCL();
if (command[0] === 'List' && command[1] === 'All') {
    console.log(accountlist);
} else if (command[0] === 'List') {
    let person = accountlist.find((account) => {
        return account.name === command[1];
    });

    console.log(command[1] + ' is copied to ' + command[2] + '.');
}