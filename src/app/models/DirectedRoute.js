const db = require('../../config/db');

class DirectedRoute{
    constructor(iddirectedroutes,idRoute,idStartProvince,idEndProvince){
        this.iddirectedroutes = iddirectedroutes;
        this.idRoute = idRoute;
        this.idStartProvince = idStartProvince;
        this.idEndProvince = idEndProvince;
    }
    getDirectedRouteByIDRoute(id){
        return new Promise(function(resolve, reject){
            var query = `select * from directedroutes where idRoute = ${id}`;
            db.query(query, function (err, rows) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(rows);
                }
            })
            })
    }
    getDirectedRouteByIDDirect(idDirect){
        return new Promise(function(resolve, reject){
            var query = `select * from directedroutes where iddirectedroutes = ${idDirect}`;
            db.query(query, function (err, rows) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(rows[0]);
                }
            })
            })
    }
    async addDirectedRoute(idRoute, idStartProvince, idEndProvince) {
        return new Promise(function(resolve, reject){
            db.query(`insert into directedroutes (idRoute, idStartProvince, idEndProvince) values(?, ?, ?)`, [idRoute, idStartProvince, idEndProvince] ,function (err, rows) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(rows);
                }
            })
        })
    }
    
}
module.exports = DirectedRoute;