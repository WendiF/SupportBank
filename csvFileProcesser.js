const Papa = require('papaparse');
const moment = require('moment');

class Transaction {
    constructor(date, from, to, narrative, amount) {
        this.date = date;
        this.from = from;
        this.to = to;
        this.narrative = narrative;
        this.amount = amount;
    }
}

exports.parseFile = function(data, logger) {
    let transfers = parser(data);
    parseDates(transfers, logger);

    let transactions = getTransactions(transfers);
    return transactions;
}

function parser(data) {
    return Papa.parse(data, {header: true}).data;
}

function parseDates(transfers, logger) {
    for (let transfer of transfers) {
        let maybeDate = moment(transfer.Date, 'DD/MM/YYYY');
        if (!maybeDate.isValid()) {
            // logger.error('Date is in an incorrect format');
            transfer.Date = null;
        }


    }
}

function getTransactions(transfers) {
    return transfers.map((transfer) => {
        return new Transaction(transfer.Date, transfer.From, transfer.To, transfer.Narrative, transfer.Amount);
    });
}