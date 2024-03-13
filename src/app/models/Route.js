const db = require('../../config/db');

class Route{
    constructor(idRoute,idFirstProvince,idSecondProvince,distance,hour,isDelete){
        this.idRoute = idRoute;
        this.idFirstProvince = idFirstProvince;
        this.idSecondProvince = idSecondProvince;
        this.distance = distance;
        this.hour = hour;
        this.isDelete = isDelete;
    }
    checkRouteFromProvince(firstID, secondID) {
        return new Promise(function(resolve, reject){
            db.query(`select * from routes where idFirstProvince = ? and idSecondProvince = ? and isDelete = 0`, [firstID, secondID] ,function (err, rows) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(rows);
                }
            })
        })
    }
    getAllRoute(){
        return new Promise(function(resolve, reject){
            db.query(`select * from danasa.routes`, function (err, rows) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(rows);
                }
            })
        })
    }
    getAllRouteNotDelete(){
        return new Promise(function(resolve, reject){
            db.query(`select * from danasa.routes where isDelete = 0`, function (err, rows) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(rows);
                }
            })
            })
    }
    getCountOfRoute(id){
        return new Promise(function(resolve, reject){
            db.query(`SELECT * FROM schedules as sch join directedroutes as dr on sch.idDirectedRoute = dr.iddirectedroutes where dr.idRoute = ${id} order by sch.idSchedule`, function (err, rows) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(rows);
                }
            })
        })
    }
    getInfoRoute(id){
        return new Promise(function(resolve, reject){
            db.query(`SELECT * FROM routes where idRoute = ${id}`, function (err, rows) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(rows[0]);
                }
            })
        })
    }
    addRoute(distance, hours, idFirstProvince, idSecondProvince) {
        return new Promise(function(resolve, reject){
            db.query(`insert into routes (distance, hours, idFirstProvince, idSecondProvince, isDelete) values(?, ?, ?, ?, ?)`, [distance, hours, idFirstProvince, idSecondProvince, 0] ,function (err, rows) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(rows.insertId);
                }
            })
        })
    }
    getAllRouteExisted() {
        return new Promise(function(resolve, reject){
            db.query(`select * from danasa.routes where isDelete = 0`, function (err, rows) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(rows);
                }
            })
        })
    }

    async countRoute() {
        return new Promise((resolve, reject) => {
            const maxID = `SELECT MAX(idRoute) FROM routes`;
            db.query(maxID, (err, results) => {
                if (err) {
                    return reject(err);
                }
                if(results.length === 0) {
                    return reject(err);
                }
                else {
                    return resolve(results[0]['MAX(idRoute)'] + 1);
                }
            });
        });
    }
    async update(distance, hours, idRoute) {
        return new Promise((resolve, reject) => {
            const editQuery = `UPDATE routes SET distance = ?, hours = ? WHERE idRoute = ?`;
            db.query(editQuery, [distance, hours, idRoute], (err, results) => {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            })
        })
    }
    async remove(idRoute) {
        return new Promise((resolve, reject) => {
            const editQuery = `UPDATE routes SET isDelete = 1 WHERE idRoute = ?`;
            db.query(editQuery, [idRoute], (err, results) => {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            })
        })
    }

}
module.exports = Route;