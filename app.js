'use strict';
 
//Read the 
const args = process.argv.slice(2); 

const fs = require('fs');
var filepath = args.length > 0 ? args.toString() : "input.json";

let rawdata = fs.readFileSync(filepath);
let transactions = JSON.parse(rawdata);

//function ConfigIn()
var CacheIn = {
    percents: 0.03,
    max: {
        amount: 5,
        currency: "EUR"
    }
};
//function ConfigOut()
var CacheOut = {
    percents: 0.3,
    week_limit: {
        amount: 1000,
        currency: "EUR"
    }
}

function Transaction(obj) // CONSTRUCTOR CAN BE OVERLOADED WITH AN OBJECT
{
    this.id = 0;
    this.date = "2016-01-05";
    this.user_id = 2;
    this.user_type = "natural";
    this.type = "cash_in";
    this.operation = { amount: 0, currency: "eur" };
    //this.test = function () { return this.a * this.b; };
    this.commission = function () {
        if (this.type == "cash_in" && this.operation.amount > 0) {
            var calCom = this.operation.amount * 0.03 / 100;
            return (calCom >= 5 ? 5 : calCom);
        }
        else {
           // users.push({ user_id: this.user_id, amount: this.operation.amount });

            if (this.user_type == "natural") {
                //  1000.00 EUR per week(from monday to sunday) is free of charge.

                //   If total cash out amount is exceeded - commission is calculated only from exceeded amount(that is, for 1000.00 EUR there is still no commission fee).
                return GetCashoutCommission(this);
            } else {
                return this.operation.amount > 0.5 ? this.operation.amount * 0.3 / 100 : 0;
            }

        }
    }
    // IF AN OBJECT WAS PASSED THEN INITIALISE PROPERTIES FROM THAT OBJECT
    for (var prop in obj) this[prop] = obj[prop];
}
function operation() // CONSTRUCTOR CAN BE OVERLOADED WITH AN OBJECT
{
    this.amount = 0;
    this.currency = 0;


}
function GetTheWeek(datestr) {

    var minday = new Date(datestr);

    if (minday.getDay() === 0) {
        var minmonday = new Date(minday.getFullYear(), minday.getMonth(), minday.getDate() - (minday.getDay() + 6));
        var maxsunday = minday;
      //  console.log(minmonday, maxsunday);
    } else {
        var minmonday = new Date(minday.getFullYear(), minday.getMonth(), minday.getDate() - (minday.getDay() - 1));
        var maxsunday = new Date(minday.getFullYear(), minday.getMonth(), (minday.getDate() - (minday.getDay())) + 7);
       // console.log(minmonday, maxsunday);
    }
    return minmonday.toDateString() + maxsunday.toDateString()
}
 

transactions.forEach((element, index) => {
    element.id = index;


});

transactions.forEach(element => {
    var k = new Transaction(element);
    console.log(element.user_id, element.operation.amount, element.type, k.commission());
   // console.log(element.id, GetTheWeek(element.date));

});

/////
//var newtransation = [
//    { "date": "2016-01-06", "user_id": 1, "user_type": "natural", "type": "cash_out", "operation": { "amount": 30000, "currency": "EUR" } },
//    { "date": "2016-01-07", "user_id": 1, "user_type": "natural", "type": "cash_out", "operation": { "amount": 1000.00, "currency": "EUR" } },
//    { "date": "2016-01-07", "user_id": 1, "user_type": "natural", "type": "cash_out", "operation": { "amount": 100.00, "currency": "EUR" } },
//    { "date": "2016-01-10", "user_id": 1, "user_type": "natural", "type": "cash_out", "operation": { "amount": 100.00, "currency": "EUR" } },
//    { "date": "2016-02-15", "user_id": 1, "user_type": "natural", "type": "cash_out", "operation": { "amount": 300.00, "currency": "EUR" } },
//];
//var tarr =  [];
//var transactionObjs = newtransation.forEach((e, i) => {
//    e.id = i + 1;
//    tarr.push(new Transaction(e));
//});

function getSum(total, num) {
    return total + Math.round(num.operation.amount);
}
//tarr.forEach(item => {
//    var minday = new Date(item.date);
//    var minmonday = new Date(item.date);
//    var maxsunday = new Date(item.date);

//    if (minday.getDay() === 0) {
//        var minmonday = new Date(minday.getFullYear(), minday.getMonth(), minday.getDate() - (minday.getDay() + 6));
//        var maxsunday = minday;
//        console.log(minmonday, maxsunday);
//    } else {
//        var minmonday = new Date(minday.getFullYear(), minday.getMonth(), minday.getDate() - (minday.getDay() - 1));
//        var maxsunday = new Date(minday.getFullYear(), minday.getMonth(), (minday.getDate() - (minday.getDay())) + 7);
//        console.log(minmonday, maxsunday);
//    }

//    var transationThisWeek = tarr.filter(function (titem, pos) {
//        var t = new Date(titem.date);
//        var thedate = new Date(t.getFullYear(), t.getMonth(), t.getDate());

//        return (titem.type == "cash_out" && (thedate >= minmonday && thedate <= maxsunday && titem.id < item.id));
//    });
//    if (transationThisWeek.length == 0) {
//        if (item.operation.amount > 1000)
//            console.log((item.operation.amount - 1000) * 0.3 / 100)
//        else {
//            console.log(0)
//        }
//    } else {
//        var pretotaltransntionthisweek = transationThisWeek.reduce(getSum, 0);

//        var newtotal = pretotaltransntionthisweek + item.operation.amount;
//        if (pretotaltransntionthisweek > 1000)
//            console.log((item.operation.amount) * 0.3 / 100)
//        else if (newtotal > 1000)

//            console.log((newtotal - 1000) * 0.3 / 100)
//        else if (pretotaltransntionthisweek < 1000) {
//            console.log(0)
//        }

//    }

//});
function round(value) {
    var decimals = 2;
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals).toFixed(decimals);
}
function GetCashoutCommission(item) {
    var minday = new Date(item.date);
    var minmonday = new Date(item.date);
    var maxsunday = new Date(item.date);
    var commission = 0;
    if (minday.getDay() === 0) {
        var minmonday = new Date(minday.getFullYear(), minday.getMonth(), minday.getDate() - (minday.getDay() + 6));
        var maxsunday = minday;
       // console.log(minmonday, maxsunday);
    } else {
        var minmonday = new Date(minday.getFullYear(), minday.getMonth(), minday.getDate() - (minday.getDay() - 1));
        var maxsunday = new Date(minday.getFullYear(), minday.getMonth(), (minday.getDate() - (minday.getDay())) + 7);
       // console.log(minmonday, maxsunday);
    }

    var transationThisWeek = transactions.filter(function (titem, pos) {
        var t = new Date(titem.date);
        var thedate = new Date(t.getFullYear(), t.getMonth(), t.getDate());

        return (titem.type == "cash_out" && titem.user_id == item.user_id && (thedate >= minmonday && thedate <= maxsunday && titem.id < item.id));
    });
    if (transationThisWeek.length == 0) {
        if (item.operation.amount > 1000) {

            //console.log((item.operation.amount - 1000) * 0.3 / 100);
            commission= (item.operation.amount - 1000) * 0.3 / 100;
        }
        else {
           // console.log(0)
            commission = 0;
        }
    } else {
        var pretotaltransntionthisweek = transationThisWeek.reduce(getSum, 0);

        var newtotal = pretotaltransntionthisweek + item.operation.amount;
        if (pretotaltransntionthisweek > 1000) {
          //  console.log((item.operation.amount) * 0.3 / 100)
            commission = (item.operation.amount) * 0.3 / 100;
        }
        else if (newtotal > 1000) {
           // console.log((newtotal - 1000) * 0.3 / 100)
            commission = (newtotal - 1000) * 0.3 / 100;
        }
        else if (pretotaltransntionthisweek < 1000) {
           // console.log(0)
            commission = 0;
        }

    }
    return round(commission);
}
//console.log(students);
console.log('s');
