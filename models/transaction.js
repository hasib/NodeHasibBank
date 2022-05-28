import  Utilites   from '../utilities.js';
export default class Transaction {

    constructor(id,date,user_id,user_type,type,operation) {
   
        this.id = id;
        this.date = date;
        this.user_id = user_id;
        this.user_type = user_type;
        this.type = type;
        this.operation = operation;
        this.commissionAmount=0;
         
    } 

}