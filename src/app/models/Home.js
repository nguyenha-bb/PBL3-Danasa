const db = require('../../config/db');

class Home{
    constructor(from, to, date){
        this.from = from;
        this.to = to;
        this.date = date;
    }

    async search(){
        return new Promise((resolve, reject)=>{
            const searchQuery = `SELECT * FROM routes INNER JOIN directedroutes ON routes.idRoute = directedroutes.idRoute INNER JOIN provinces AS startProvince ON directedroutes.idStartProvince = startProvince.idProvince INNER JOIN provinces AS endProvince ON directedroutes.idEndProvince = endProvince.idProvince INNER JOIN schedules ON directedroutes.iddirectedroutes = schedules.idDirectedRoute INNER JOIN stations AS startStations ON schedules.idStartStation = startStations.idStation INNER JOIN stations AS endStations ON schedules.idEndStation = endStations.idStation INNER JOIN coachs ON schedules.idCoach = coachs.idCoach INNER JOIN typeofcoachs ON typeofcoachs.idType = coachs.idType where startProvince.provinceName = ? AND endProvince.provinceName = ? AND DATE_FORMAT(startTime,'%d/%m/%Y')`;
            db.query(searchQuery, [this.from, this.to, this.date], (err, results)=>{
                if(err){
                    return reject(err);
                }
                console.log("home.js")
                console.log(results);
                return resolve(results[0]);
            })
        })
    }
}
module.exports = Home;