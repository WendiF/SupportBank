const fs = require('fs')
const Papa = require('papaparse');
const fileUrl = new URL('file:///C:/Work/Training/SupportBank/Transactions2014.csv');
const readline = require('readline-sync');

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

let command = readline.prompt();

if (command === 'List All') {
    console.log(accountlist);
} else if (command.substr(0,4) === 'List') {
    let personTrans = getTransfers(command);
    console.log(personTrans);

}




function getTransfers() {
    let person = command.substr(5);
    let personTrans = [];
    for (let transfer of transfers) {
        if (transfer.From === person || transfer.To === person) {
            personTrans.push(transfer);
        }
    }
    return personTrans;
}