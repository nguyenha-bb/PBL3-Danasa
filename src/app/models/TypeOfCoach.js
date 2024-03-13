const db = require('../../config/db');

class TypeOfCoach{
    constructor(idType,typeName,numberOfSeat){
        this.idType = idType;
        this.typeName = typeName;
        this.numberOfSeat = numberOfSeat;
    }
    getTypeOfCoach(){
        return new Promise(function(resolve, reject){
            db.query('SELECT * FROM danasa.typeofcoachs', function (err, rows) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(rows);
                }
            })
        })
    }
    getTypeByID(id){
        return new Promise(function(resolve, reject){
            db.query(`SELECT * FROM danasa.typeofcoachs where idType = ${id}`, function (err, rows) {
                if (err) {
                    return reject(err);
                } 
                else if (rows.length == 0) return reject("Not Found");
                else return resolve(rows[0]);
            })
        })
    }
}
module.exports = TypeOfCoach;