'use strict';
//import { readFileSync } from 'fs';
//#Author : hasibul Wahab
//#Email: hasib.wahab@gmail.com

import TransactionDataSevice from './services/transationBulkServices.js';
import CommissionService from './services/commissionService.js';
import Transaction from './models/transaction.js';
import Configuration from './Configuration.js';
import Utilites from './utilities.js';




// read the file path
const args = process.argv.slice(2);
const filepath = args.length > 0 ? args.toString() : "input.json";



// Process data from json and show commission
export default class Bank {
    constructor(filepath) {
        this.filepath = filepath;
        //Init transaction data Sevice  
        this.transactionDataSevice = new TransactionDataSevice(this.filepath);
        // Init commission service to calculate commission
        this.commissionService = new CommissionService();
    }

    processTransationData() {
        // transations 
        var taransactions = [];

        // Get all transations
        taransactions = this.transactionDataSevice.GetAllData();

        // read all transation's  commission to console window
        taransactions.forEach((element) => {
            element.commissionAmount = this.commissionService.GetComission(element);
            console.log(element.commissionAmount);
        });
        return taransactions;
    }
    processTransationDataTest() {
        return 9
    }


}

let myBank = new Bank(filepath);
myBank.processTransationData();