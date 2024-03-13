const schedulePublic = require('../models/SchedulePublic');
const Station = require('../models/Station');
const Province = require('../models/Province');
const Type = require('../models/TypeOfCoach');
const Ticket = require('../models/Ticket');
const MyDate = require('../models/Date');
class BuyTicket2Controller{

    // [GET] /histor-buy-ticket
    index(req, res,next){
        const passedVariable = req.session.nameCustomer;
        var start = req.query["start"];
        var end = req.query["end"];
        var awhileTime = req.query["awhile"];
        var type = req.query["type"];
        var timeQuery = req.query["time"];
        if(!type) type = 0;
        if(!awhileTime) awhileTime = 0;
        var idEnd,idStart,typesName;
        var info = [];
        const page = parseInt(req.query.page) || 1;
        const perPage = 5;
        const startPage = (page - 1) * perPage;
        const endPage = page * perPage;
        var awhile = [{min: 0, max: 24},{min: 0,max: 6,},{min: 6,max: 12,},{min: 12,max: 18,},{min: 18,max: 24,}]
        // lấy thông tin các lịch trình
        var query = 'SELECT * FROM (((danasa.schedules as sch join danasa.directedroutes as dr on idDirectedRoute = iddirectedroutes) join danasa.coachs as s on s.idCoach = sch.idCoach) join danasa.typeofcoachs as tp on s.idType = tp.idType) join routes as r on dr.idRoute = r.idRoute where sch.isDeleted = 0';
        // lấy số ghế ngồi
        var queryCount = 'SELECT t.idSchedule, count(t.idSchedule) as SL FROM tickets as t join schedules as sch on t.idSchedule = sch.idSchedule where sch.isDeleted = 0 group by t.idSchedule;';
        Promise.all([new Station().getStation(),new Province().getProvince(),new Type().getTypeOfCoach()])
            .then(([stations,provinces,types])=>{
                req.session.stations = stations;
                req.session.provinces = provinces;
                typesName = types;
                if(start!==""){
                    idStart = req.session.provinces.find(province=>province.provinceName === start).idProvince;
                    query += ` and dr.idStartProvince = ${idStart}`;
                    if(end!==""){
                        idEnd = req.session.provinces.find(province=>province.provinceName === end).idProvince;
                        query += ` and dr.idEndProvince = ${idEnd}`;
                    }
                    else{
                        query += ` and dr.idEndProvince = 0`;
                    }
                }
                else{
                    query += ` and dr.idStartProvince = 0`;
                    if(end!==""){
                        idEnd = req.session.provinces.find(province=>province.provinceName === end).idProvince;
                        query += ` and dr.idEndProvince = ${idEnd}`;
                    }
                    else{
                        query += ` and dr.idEndProvince = 0`;
                    }
                }
                query += ' order by sch.startTime';
                return Promise.all([schedulePublic.getSchedule(query),new Ticket().getCount(queryCount)]);
            })
            .then(([schedules,countSchedules]) => {
            const timeNow = new MyDate();
            if(timeQuery){
                var min,max;
                if(awhileTime<=0){
                    min=0;max=24;
                }
                else{
                    var long = awhile[awhileTime];
                    min = long["min"];
                    max = long["max"];
                }
                var time__S = new MyDate(timeQuery.toString());
                for(var index in schedules){
                    var x = schedules[index];
                    var timeStart = new MyDate(x.startTime.toString());
                    if(timeStart < timeNow) continue;
                    var hour = timeStart.getHours();    
                    var count = countSchedules.find(count => count.idSchedule === x.idSchedule);
                    if(count === undefined) x.haveSeat = x.numberOfSeat;
                    else x.haveSeat = x.numberOfSeat-count["SL"];
                    if(timeStart.getMinutes()>0) hour++;
                    if(time__S.toDate()===timeStart.toDate()&&min<=hour && hour<=max && x.haveSeat > 0){
                        if(type<=0) info.push(x);
                        else if (x.idType == type) info.push(x);
                    }
                }
            }
            const prev = page === 1 ? false : page - 1;
            var lastPage = Math.ceil(info.length / perPage);
            if(lastPage === 0)  lastPage = 1;
            const next = page === lastPage ? false : page + 1;
            info = Array.from(info).slice(startPage,endPage);
            for(var x of info) {
                var time = new MyDate(x.startTime.toString());
                var time2 = new MyDate(x.endTime.toString());
                x.price = Number(x.price).toLocaleString('vi-VN');
                x.start = `${time.toLocaleTimeString()}`;
                x.end = `${time2.toLocaleTimeString()}`;
                x.day = `${time.toLocaleDateString()}`;
                x.startStation = req.session.stations.find(station => station.idStation === x.idStartStation).stationName;
                x.endStation = req.session.stations.find(station => station.idStation === x.idEndStation).stationName;
                // var count = countSchedules.find(count => count.idSchedule === x.idSchedule);
                // if(count === undefined) x.haveSeat = x.numberOfSeat;
                // else x.haveSeat = x.numberOfSeat-count["SL"];
                // if (x.haveSeat == 0) info.
            }
            if(passedVariable != null) {
                res.render('buyticketstep2', {
                    title: 'Đặt vé xe',
                    infoLogin: passedVariable,
                    timeQuery: timeQuery,
                    startProvince: start,
                    endProvince: end,
                    schedule: info,
                    types: typesName,
                    typeCBB: type,
                    awhileCBB: awhileTime,
                    current: page,
                    prev: prev,
                    next: next,
                });
            } else {
                res.render('buyticketstep2', {
                    title: 'Đặt vé xe',
                    infoLogin: 'Đăng nhập',
                    startProvince: start,
                    endProvince: end,
                    timeQuery: timeQuery,
                    schedule: info,
                    types: typesName,
                    typeCBB: type,
                    awhileCBB: awhileTime,
                    current: page,
                    prev: prev,
                    next: next,
                });
            }
        })
        .catch(err =>{
            console.error(err);
            res.render('errorPage',{
                title: 'Error',
            })
        });
    }

    //[GET]/buy-ticket-step2/:slug
    show(req, res){
        res.send('Detail');
    }
}

module.exports = new BuyTicket2Controller;