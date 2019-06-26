const userInput = require('./userInput');
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

exports.performProcessing = function(names, transactions, logger) {
    while (true) {
        let accountList = getAccounts(names);
        processTransfers(transactions, accountList, logger);
        processUserCommand(accountList, transactions);
    }

};

function processTransfers(transactions, accountList, logger) {
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

function getAccounts(names) {
    return names.map((name) => {
        return new Account(name, 0);
    });
}

function processUserCommand(accountList, transactions) {
    let command = userInput.getStringWithPrompt('What would you like to know?');
    if (command === 'List All') {
        console.log(accountList);
    } else if (command.substr(0, 4) === 'List') {
        let person = command.substr(5);
        let personTrans = getTransfersForPerson(person, transactions);
        console.log(personTrans);
    }
}

function getTransfersForPerson(person, transactions) {
    return transactions.filter((transaction) => {
        return transaction.from === person || transaction.to === person;
    });
}