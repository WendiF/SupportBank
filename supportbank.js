const fs = require('fs');
const Papa = require('papaparse');
// const fileUrl = new URL('file:///C:/Work/Training/SupportBank/Transactions2014.csv');
// const fileUrl = new URL ('file:///C:/Work/Training/SupportBank/DodgyTransactions2015.csv');
const fileUrl = new URL ('file:///C:/Work/Training/SupportBank/Transactions2013.json');
const fileExtension = String(fileUrl).replace(/^.*\./, '');
const readline = require('readline-sync');
const moment = require('moment');
const log4js = require('log4js');

log4js.configure({
    appenders: {
        file: { type: 'fileSync', filename: 'logs/debug.log' }
    },
    categories: {
        default: { appenders: ['file'], level: 'debug'}
    }
});

class Account {
    constructor(name, balance) {
        this.name = name;
        this.balance = balance;
    }

    transaction(to, amount) {
        this.balance = this.balance - amount;
        to.balance = to.balance + amount;
    }
}

class Transaction {
    constructor(date, from, to, narrative, amount) {
        this.date = date;
        this.from = from;
        this.to = to;
        this.narrative = narrative;
        this.amount = amount;
    }
}

let logger = log4js.getLogger();

while (true) {
    main();
}

function main() {
    let [transactions, names]= formatFile(fileUrl);
    let accountList = getAccounts(names);
    processTransfers(transactions, accountList);
    processUserCommand(accountList, transactions);
}

function formatFile() {
    let data = fs.readFileSync(fileUrl, {encoding: 'utf8'});
    let transfers = parser(data);
    parseDates(transfers);

    let transactions = getTransactions(transfers);
    let names = getNamesOfAllAccounts(transactions);
    return [transactions, names];
}

function parser(data) {
    if (fileExtension === 'csv') {
        return Papa.parse(data, {header: true}).data;
    } else if (fileExtension === 'json') {
        return JSON.parse(data);
    }
}

function parseDates(transfers) {
    for (let transfer of transfers) {
        if (fileExtension === 'csv') {
            let maybeDate = moment(transfer.Date, 'DD/MM/YYYY');
            if (!maybeDate.isValid()) {
                logger.error('Date is in an incorrect format');
                transfer.Date = null;
            }
        } else if (fileExtension === 'json') {
            transfer.Date = moment(transfer.Date).format('DD/MM/YYYY');
            // let maybeDate = transfer.Date;
            // if (!maybeDate.isValid()) {
            //     logger.error('Date is in an incorrect format');
            //     transfer.Date = null;
            // }
        }

    }
}

function getNamesOfAllAccounts(transactions) {
    return Array.from(new Set(transactions.map(a => a.from).concat(transactions.map(a => a.to))));
}



function getAccounts(names) {
    return names.map((name) => {
        return new Account(name, 0);
    });
}

function getTransactions(transfers) {
    return transfers.map((transfer) => {
        if (fileExtension === 'csv') {
            return new Transaction(transfer.Date, transfer.From, transfer.To, transfer.Narrative, transfer.Amount);
        } else if (fileExtension === 'json') {
            return new Transaction(transfer.Date, transfer.FromAccount, transfer.ToAccount, transfer.Narrative, transfer.Amount);
        }
    });
}

function processTransfers(transactions, accountList) {
    transactions.forEach((transaction) => {
        let fromPerson = accountList.find((account) => {
            return account.name === transaction.from;
        });
        let toPerson = accountList.find((account) => {
            return account.name === transaction.to;
        });

        if (!isNaN(transaction.amount)) {
            fromPerson.transaction(toPerson, parseFloat(transaction.amount));
        } else {
            logger.debug('transfer amount is not a number');
        }
    });
}

function getTransfersForPerson(person, transactions) {
    return transactions.filter((transaction) => {
        return transaction.from === person || transaction.to === person;
    });
}

function processUserCommand(accountList, transactions) {
    console.log('What would you like to know?');
    let command = readline.prompt();
    if (command === 'List All') {
        console.log(accountList);
    } else if (command.substr(0, 4) === 'List') {
        let person = command.substr(5);
        let personTrans = getTransfersForPerson(person, transactions);
        console.log(personTrans);
    }
}