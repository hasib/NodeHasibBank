import { readFileSync } from 'fs';
import Transaction from '../models/transaction.js';
import TransactionDataSevice from './transationBulkServices.js';
import Utilites from '../utilities.js';
import Configuration from '../Configuration.js';

//get data from the json file 
export default class CommissionService {

    constructor() {

    }
    //Get cash in and cash out comission
    GetComission(item) {
        if (item.type == "cash_in" && item.operation.amount > 0) {
            return this.GetCashInComission(item);
        }
        else {
            return this.GetCashoutCommission(item);

        }
    };

    //Get cash in comission
    GetCashInComission(item) {
        let calculateComission = item.operation.amount * Configuration.CashIn.percents / 100;
        //Commission fee - 0.03% from total amount, but no more than 5.00 EUR.
        return Utilites.round(calculateComission >= Configuration.CashIn.max.amount ? Configuration.CashIn.max.amount : calculateComission);
    }

    //Get cash out commission
    GetCashoutCommission(transaction) {

        if (transaction.user_type == "natural") {

            let commission = 0;
            //get the week from the transation data
            let { monday, sunday } = this.GetWeeklyDateRange(transaction);

            // check previous transation from data for the user 
            var transationThisWeek = global.Data.filter(function (titem, pos) {
                let txDate = new Date(titem.date);
                let txDateWithTimeZero = new Date(txDate.getFullYear(), txDate.getMonth(), txDate.getDate());

                return (titem.type == "cash_out" && titem.user_id == transaction.user_id && (txDateWithTimeZero >= monday && txDateWithTimeZero <= sunday && titem.id < transaction.id));
            });

            // if there is no previous transation then use commission 
            if (transationThisWeek.length == 0) {
                // check amount is exceeded 
                if (transaction.operation.amount > Configuration.CashOutNatural.week_limit.amount) {

                    commission = (transaction.operation.amount - Configuration.CashOutNatural.week_limit.amount) * Configuration.CashOutNatural.percents / 100;
                }

                else {//not exceeded then it is free  

                   
                    commission = 0;
                }
            } 
            else {
                // Prevoisu transation available and get the total amount 
                var previousTotalTransntionThisWeek = transationThisWeek.reduce(Utilites.getSum, 0);
                //new total this week including current transation
                var newAmountThisWeek = previousTotalTransntionThisWeek + transaction.operation.amount;
              
                // check prevous transation limit exceeded
                if (previousTotalTransntionThisWeek > Configuration.CashOutNatural.week_limit.amount) {
                    
                    commission = (transaction.operation.amount) * Configuration.CashOutNatural.percents / 100;
                }
                // check limit for new amount this week including current transation  is exceeded
                else if (newAmountThisWeek > Configuration.CashOutNatural.week_limit.amount) {
                    
                    commission = (newAmountThisWeek - Configuration.CashOutNatural.week_limit.amount) * Configuration.CashOutNatural.percents / 100;
                }
                // free transation 
                else if (previousTotalTransntionThisWeek < Configuration.CashOutNatural.week_limit.amount) {
                    
                    commission = 0;
                }

            }
            return Utilites.round(commission);
        } else {
            return Utilites.round(transaction.operation.amount > Configuration.CashOutJuridical.min.amount ? transaction.operation.amount * Configuration.CashOutNatural.percents / 100 : 0);
        }
    }

    // get weekly date range
    GetWeeklyDateRange(transaction) {
        let minday = new Date(transaction.date);
        let monday = new Date(transaction.date);
        let sunday = new Date(transaction.date);

        if (minday.getDay() === 0) {
              monday = new Date(minday.getFullYear(), minday.getMonth(), minday.getDate() - (minday.getDay() + 6));
              sunday = minday;
            // console.log(monday, sunday);
        } else {
              monday = new Date(minday.getFullYear(), minday.getMonth(), minday.getDate() - (minday.getDay() - 1));
              sunday = new Date(minday.getFullYear(), minday.getMonth(), (minday.getDate() - (minday.getDay())) + 7);
            // console.log(monday, sunday);
        }
        return { monday, sunday };
    }
}


