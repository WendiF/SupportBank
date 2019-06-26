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

exports.parseFile = function(data) {
    let transfers = parser(data);
    parseDates(transfers);

    let transactions = getTransactions(transfers);
    return transactions;
}

function parser(data) {
    return JSON.parse(data);
}

function parseDates(transfers) {
    for (let transfer of transfers) {
            transfer.Date = moment(transfer.Date).format('DD/MM/YYYY');
            // let maybeDate = transfer.Date;
            // if (!maybeDate.isValid()) {
            //     logger.error('Date is in an incorrect format');
            //     transfer.Date = null;
            // }
    }
}

function getTransactions(transfers) {
    return transfers.map((transfer) => {
        return new Transaction(transfer.Date, transfer.FromAccount, transfer.ToAccount, transfer.Narrative, transfer.Amount);
    });}