const db = require('../../config/db');
class Seat {
    constructor(idSeat, idSchedule, statusSeat, idCoach, nameSeat) {
        this.idSeat = idSeat;
        this.idSchedule = idSchedule;
        this.statusSeat = statusSeat;
        this.idCoach = idCoach;
        this.nameSeat = nameSeat;
    }

    async getListSeat(idSchedule) {
        return new Promise((resolve, reject) => {
            var query = `SELECT * FROM seats where idSchedule = ?`;
            db.query(query, [idSchedule], (err, results) => {
                if (err) {
                    return reject(err);
                }
                if (results.length === 0) {
                    return reject(err);
                }
                return resolve(results);
            });
        });
    }
    
    async save(nameSeat, idSchedule) {
        return new Promise((resolve, reject) => {
            var query = `UPDATE seats SET statusSeat = ? WHERE nameSeat = ? and idSchedule = ?`;
            db.query(query, [1, nameSeat, idSchedule], (err, results) => {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            });
        });
    }
    async create(query) {
        return new Promise((resolve, reject) => {
            db.query(query, (err) => {
                if (err) {
                    return reject(err);
                }
                return resolve();
            });
        });
    }
    async getIdSeat(nameSeat, idSchedule) {
        return new Promise((resolve, reject) => {
            var query = `select * from seats WHERE nameSeat = ? and idSchedule = ?`;
            db.query(query, [nameSeat, idSchedule], (err, results) => {
                if (err) {
                    return reject(err);
                }
                return resolve(results[0].idSeat);
            });
        });
    }

    async getStatusSeat(nameSeat, idSchedule) {
        return new Promise((resolve, reject) => {
            var query = `select * from seats WHERE nameSeat = ? and idSchedule = ?`;
            db.query(query, [nameSeat, idSchedule], (err, results) => {
                if (err) {
                    return reject(err);
                }
                return resolve(results[0].statusSeat);
            });
        });
    }
}
module.exports = Seat;