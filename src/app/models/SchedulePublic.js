const db = require('../../config/db');
class SchedulePublic {
    getStation__Province() {
        var p2 = new Promise(function (resolve, reject) {
            db.query('SELECT * FROM stations', function (err, rows) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(rows);
                }
            })
        })
        var p3 = new Promise(function (resolve, reject) {
            db.query('SELECT * FROM provinces', function (err, rows) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(rows);
                }
            })
        })
        return Promise.all([p2, p3]);
    }
    getScheduleByID(id){
        var query = `SELECT * FROM (((danasa.schedules as sch join danasa.directedroutes as dr on idDirectedRoute = iddirectedroutes) join danasa.coachs as s on s.idCoach = sch.idCoach) join danasa.typeofcoachs as tp on s.idType = tp.idType) join danasa.routes as r on r.idRoute = dr.idRoute where sch.idSchedule = ${id} and sch.isDeleted = 0`;
        return new Promise(function (resolve, reject) {
            db.query(query, function (err, rows) {
                if (err) {
                    return reject(err);
                } 
                else if (rows.length == 0) return reject('Not Found');
                else return resolve(rows);
            })
        })
    }
    getSchedule(query) {
        return new Promise(function (resolve, reject) {
            db.query(query, function (err, rows) {
                if (err) {
                    return reject(err);
                } 
                else return resolve(rows);
            })
        })
    }
    deleteSoftSchedule(id) {
        return new Promise(function (resolve, reject) {
            db.query(`update schedules set isDeleted = 1 where idSchedule = ${id}`, function (err) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve();
                }
            })
        })
    }
    save(start, end, price, id) {
        return new Promise(function (resolve, reject) {
            db.query(`update danasa.schedules set startTime = '${start}',endTime = '${end}', price = '${price}' where idSchedule = ${id}`, function (err) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve();
                }
            })
        })
    }
    getToCreate() {
        var p2 = new Promise(function (resolve, reject) {
            db.query('SELECT * FROM stations', function (err, rows) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(rows);
                }
            })
        })
        var p3 = new Promise(function (resolve, reject) {
            db.query('SELECT * FROM provinces', function (err, rows) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(rows);
                }
            })
        })
        var p4 = new Promise(function (resolve, reject) {
            db.query('SELECT * FROM directedroutes as dr join routes as r on dr.idRoute = r.idRoute', function (err, rows) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(rows);
                }
            })
        })
        var p5 = new Promise(function (resolve, reject) {
            db.query('SELECT * FROM routes', function (err, rows) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(rows);
                }
            })
        })
        var p6 = new Promise(function (resolve, reject) {
            db.query('SELECT * FROM coachs as c join typeofcoachs as type on type.idType = c.idType', function (err, rows) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(rows);
                }
            })
        })
        var p7 = new Promise(function (resolve, reject) {
            db.query('SELECT * FROM typeofcoachs', function (err, rows) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(rows);
                }
            })
        })
        var p8 = new Promise(function (resolve, reject) {
            db.query('select idSchedule from schedules order by idSchedule desc', function (err, rows) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(rows);
                }
            })
        })
        return Promise.all([p2, p3, p4, p5, p6, p7, p8]);
    }
}
module.exports = new SchedulePublic;