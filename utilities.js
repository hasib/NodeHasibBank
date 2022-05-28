export default class Utilites {

     
    static   getSum(total, num) {
        return total + Math.round(num.operation.amount);
    } 
    static  round(value) {
        var decimals = 2;
        return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals).toFixed(decimals);
    }


}