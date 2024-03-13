const db = require('../../config/db');

class Ticket{
    constructor(idTicket, idSchedule, idUser, idSeat, phoneNumber, name, email){
        this.idTicket = idTicket,
        this.idSchedule = idSchedule,
        this.idUser = idUser,
        this.idSeat = idSeat,
        this.phoneNumber = phoneNumber,
        this.name = name,
        this.email = email
    }

    async save() {
        return new Promise((resolve, reject) => {
            var query = `INSERT INTO tickets (idSchedule, idUser, idSeat, phoneNumber, name, email) VALUES (?, ?, ?, ?, ?, ?)`;
            db.query(query, [this.idSchedule, this.idUser, this.idSeat, this.phoneNumber, this.name, this.email], (err, results) => {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            });
        });
    }
    
    async check(idSeat, idSchedule) {
        return new Promise((resolve, reject) => {
            var query = `select * from tickets WHERE idSeat = ? and idSchedule = ?`;
            db.query(query, [idSeat, idSchedule], (err, results) => {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            });
        });
    }

    getCount(query){
        return new Promise(function(resolve, reject){
            db.query(query, function (err, rows) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(rows);
                }
            })
        })
    }

    async getInfoTicket(idSchedule){
        return new Promise(function(resolve, reject){
            var query = `SELECT * FROM ((danasa.schedules as sch join danasa.directedroutes as dr on idDirectedRoute = iddirectedroutes) join danasa.coachs as s on s.idCoach = sch.idCoach) join danasa.typeofcoachs as tp on s.idType = tp.idType where sch.idSchedule = ?`;
            db.query(query, [idSchedule], function (err, rows) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(rows[0]);
                }
            })
        })
    }
}

module.exports = Ticket
