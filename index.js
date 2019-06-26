const userInput = require('./userInput');
const csvFileProcessor = require('./csvFileProcesser');
const jsonFileProcessor = require('./jsonFileProcessor');
const main = require('./main');
const fs = require('fs');
const log4js = require('log4js');

log4js.configure({
    appenders: {
        file: { type: 'fileSync', filename: 'logs/debug.log' }
    },
    categories: {
        default: { appenders: ['file'], level: 'debug'}
    }
});
let logger = log4js.getLogger();

function getFile() {
    return userInput.getStringWithPrompt('Which file would you like to process?')
}

function formatFile(fileUrl, fileType) {
    let data = fs.readFileSync(fileUrl, {encoding: 'utf8'});
    let transactions;
    if (fileType === 'csv') {
        transactions = csvFileProcessor.parseFile(data, logger);
    } else if (fileType === 'json') {
        transactions = jsonFileProcessor.parseFile(data, logger);
    }
    let names = getNamesOfAllAccounts(transactions);
    return [transactions, names];
}

function getNamesOfAllAccounts(transactions) {
    return Array.from(new Set(transactions.map(a => a.from).concat(transactions.map(a => a.to))));
}

// noinspection InfiniteLoopJS
while (true) {
    const fileUrl = new URL (getFile());
    const fileType = String(fileUrl).replace(/^.*\./, '');
    [transactions, names] = formatFile(fileUrl, fileType);
    main.performProcessing(names, transactions, logger);
}