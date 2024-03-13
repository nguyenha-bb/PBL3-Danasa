const db = require('../../config/db');

class Schedule{
    constructor(idSchedule,idDirectedRoute,idStartStation,idEndStation,startTime,endTime,price,idCoach){
        this.idSchedule = idSchedule;
        this.idDirectedRoute = idDirectedRoute;
        this.idStartStation = idStartStation;
        this.idEndStation = idEndStation;
        this.startTime = startTime;
        this.endTime = endTime;
        this.price = price;
        this.idCoach = idCoach;
    };
    getIDLast(){
        return new Promise(function(resolve, reject){
            db.query('select idSchedule from schedules order by idSchedule desc', function (err, rows) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(rows);
                }
            })
            })
    }
    create(idDirectedRoute,idStartStation,idEndStation,startTime,endTime,price,idCoach){
        return new Promise(function(resolve, reject){
            db.query(`insert into schedules (idDirectedRoute, idStartStation, idEndStation, startTime, endTime, price, idCoach,isDeleted) values(${idDirectedRoute},${idStartStation},${idEndStation},'${startTime}','${endTime}',${price},${idCoach},0)`, function (err) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve();
                }
            })
            })
    }
    getSchedulesByCondition(query){
        return new Promise(function(resolve, reject){
            db.query(query, function (err,rows) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(rows);
                }
            })
        })    
    }
    getTickets(id){
        return new Promise(function(resolve, reject){
            db.query(`select count(distinct idSeat) as sum from tickets where idSchedule = ${id} group by (idSchedule)`, function (err,rows) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(rows[0]);
                }
            })
        }) 
    }

}
module.exports = Schedule;