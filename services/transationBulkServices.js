import { readFileSync } from 'fs';

import Transaction from '../models/transaction.js';


//get data from the json file 
export default class TransactionDataSevice {

    constructor(path) {
        this.path = path;
        this.Transations = []
    }
    // Store data for future useages
    
    // Get all data from file 
    GetAllData() {
        let result = [];

        let rawdata = readFileSync(this.path);
        let transactions = JSON.parse(rawdata);

        // Read all transactions and push into an array
        transactions.forEach((transaction, index) => {
            transaction.id = index;
            result.push(new Transaction(index, transaction.date, transaction.user_id, transaction.user_type, transaction.type, transaction.operation))
        });
        //TODO: need refactoring to store data globaly
        global.Data=result;
        
         return result;
    }

}

