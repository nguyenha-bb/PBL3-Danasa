const db = require('../../config/db');
class Coach {
    constructor(idCoach, idRoute, licensePlate, idType, isDelete) {
        this.idCoach = idCoach;
        this.idRoute = idRoute;
        this.licensePlate = licensePlate;
        this.idType = idType;
        this.isDelete = isDelete;
    };
    GetIDCoach(id) {
        return new Promise(function (resolve, reject) {
            db.query(`select idCoach from danasa.schedules where idSchedule = ${id} and isDeleted = 0`, function (err, rows) {
                if (err) {
                    return reject(err);
                } else if (rows.length == 0) return reject('Not Found');
                else return resolve(rows[0]);
            })
        })
    }
    GetIDLast() {
        return new Promise(function (resolve, reject) {
            db.query('select idCoach from coachs order by idCoach desc', function (err, rows) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(rows[0]);
                }
            })
        })
    }
    GetListCoach(query) {
        return new Promise(function (resolve, reject) {
            db.query(query, function (err, rows) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(rows);
                }
            })
        })
    }
    CheckExist(license) {
        return new Promise(function (resolve, reject) {
            db.query(`SELECT * FROM danasa.coachs where isDelete = 0 and licensePlate = '${license}'`, function (err, rows) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(rows);
                }
            })
        })
    }
    // CheckExistInDelete(license){
    //     return new Promise(function(resolve, reject){
    //         db.query(`SELECT * FROM danasa.coachs where isDelete = 1 and licensePlate = ${license}`, function (err, rows) {
    //             if (err) {
    //                 return reject(err);
    //             } else {
    //                 return resolve(rows);
    //             }
    //         })
    //     })  
    // }
    CheckListSchedule(license) {
        return new Promise(function (resolve, reject) {
            db.query(`SELECT * FROM danasa.coachs as c join schedules as sch on c.idCoach = sch.idCoach where c.isDelete = 1 and c.licensePlate = '${license}' and sch.isDeleted = 0 order by sch.endTime desc`, function (err, rows) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(rows);
                }
            })
        })
    }
    create(idRoute, idType, license) {
        return new Promise(function (resolve, reject) {
            db.query(`insert into coachs (idRoute,licensePlate,idType,isDelete) values (${idRoute},'${license}',${idType},0)`, function (err) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve();
                }
            })
        })
    }

    // GetCoachBusy(query){
    //     return new Promise(function(resolve, reject){
    //         db.query(query, function (err, rows) {
    //             if (err) {
    //                 return reject(err);
    //             } else {
    //                 return resolve(rows);
    //             }
    //         })
    //         })
    // }
    getInfoCoach(id) {
        return new Promise(function (resolve, reject) {
            db.query(`select * from (coachs as c join typeofcoachs as tc on c.idType = tc.idType) join routes as r on r.idRoute = c.idRoute where c.idCoach = ${id} and c.isDelete = 0`, function (err, rows) {
                if (err) {
                    return reject(err);
                } else if (rows.length == 0) return reject('Not Found');
                else return resolve(rows[0]);
            })
        })
    }
    getAllCoachByIDTypeAndRoute(idType, idRoute) {
        return new Promise(function (resolve, reject) {
            db.query(`select idCoach from coachs where idType = ${idType} and idRoute = ${idRoute} and isDelete = 0`, function (err, rows) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(rows);
                }
            })
        })
    }
    getAllCoach() {
        return new Promise(function (resolve, reject) {
            db.query(`select * from coachs  where isDelete = 0`, function (err, rows) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(rows);
                }
            })
        })
    }
    async removeCoach(idRoute) {
        return new Promise((resolve, reject) => {
            const editQuery = `UPDATE coachs SET isDelete = 1 WHERE idRoute = ?`;
            db.query(editQuery, [idRoute], (err, results) => {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            })
        })
    }

    deleteSoftCoach(id) {
        return new Promise(function (resolve, reject) {
            db.query(`update coachs set isDelete = 1 where idCoach = ${id}`, function (err) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve();
                }
            })
        })
    }
}

module.exports = Coach;