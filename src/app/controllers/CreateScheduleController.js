const schedulePublic = require('../models/SchedulePublic');
const Schedule = require('../models/Schedule')
const Route = require('../models/Route');
const Station = require('../models/Station');
const Province = require('../models/Province');
const TypeCoach = require('../models/TypeOfCoach');
const DirectedRoute = require('../models/DirectedRoute');
const MyDate = require('../models/Date');
const Seat = require('../models/Seat');
const account = require('../models/Account');
const Coach = require('../models/Coach');
const { response } = require('express');
const SchedulePublic = require('../models/SchedulePublic');
class CreateScheduleController {

    // [GET] /home
    index(req, res, next) {
        var id;
        Promise.all([new Route().getAllRouteNotDelete(), new Schedule().getIDLast(), new TypeCoach().getTypeOfCoach(), new Province().getProvince()])
            .then(([routes, schedules, types, provinces]) => {
                for (var r of routes) {
                    r.firstProvince = provinces.find(province => province.idProvince === r.idFirstProvince).provinceName;
                    r.secondProvince = provinces.find(province => province.idProvince === r.idSecondProvince).provinceName;
                }
                id = Number(schedules[0].idSchedule) + 1;
                res.render('admin-taoLT', {
                    idSch: id,
                    routes: routes,
                    types: types,
                    title: 'Tạo lịch trình',
                });
            })
            .catch(err =>{
                console.error(err);
                res.render('errorPage',{
                    title: 'Error',
                })
            });

    }
    //[GET] /admin/create-schedule/getDirect
    findInfoRoute(req, res, next) {
        var idRoute = req.query.route;
        var directRoute;
        //Tìm số chuyến của route đó
        // > 0 -> tự động mặc định 
        Promise.all([new DirectedRoute().getDirectedRouteByIDRoute(idRoute), new Province().getProvince(), new Route().getInfoRoute(idRoute)])
            .then(([directedRoutes, provinces, routeChosed]) => {
                directRoute = directedRoutes;
                for (var pr of directRoute) {
                    pr.startProvince = provinces.find(province => province.idProvince === pr.idStartProvince).provinceName;
                    pr.endProvince = provinces.find(province => province.idProvince === pr.idEndProvince).provinceName;
                }
                // req.session.distance = routeChosed["distance"];
                // req.session.hours = routeChosed["hours"];
                var result = {
                    hours: routeChosed["hours"],
                    distance: routeChosed["distance"],
                    direct: directRoute,
                }
                res.json(result);
            })
            .catch(err => console.error(err))
    }
    getDataStation(req, res, next) {
        var idDirect = req.query["route"];
        var idStartProvince, idEndProvince;
        new DirectedRoute().getDirectedRouteByIDDirect(idDirect)
            .then((direct) => {
                idStartProvince = direct["idStartProvince"];
                idEndProvince = direct["idEndProvince"];
                return Promise.all([new Station().getStationByIdProvince(idStartProvince), new Station().getStationByIdProvince(idEndProvince)]);
            })
            .then(([start, end]) => {
                var AllStation = {
                    startStaion: start,
                    endStaion: end,
                };
                //res.json(AllStation);
                res.json(AllStation);
            })
            .catch(err => console.err(err))
    }
    getCoach(req, res, next) {
        var idDirect = req.query["direct"];
        var idType = req.query["type"];
        var time = req.query["time"];
        var day = req.query["day"];
        var result = {
            message: "",
            coach: [],
        }
        var coach = [],busyCoach = []
        if(idDirect == 0 || time==="" || day===""){
            new TypeCoach().getTypeByID(idType)
                .then((type) => {
                    result.seat = type["numberOfSeat"];
                    result.message = "Dữ liệu chưa nhập đủ";
                    res.json(result);
                })
                .catch(err => console.error(err))
        }
        else {
            var timeStart__S = `${day} ${time}`;
            var timeStart = new MyDate(timeStart__S);
            var idRoute, idStartProvince, seats;
            Promise.all([new DirectedRoute().getDirectedRouteByIDDirect(idDirect), new TypeCoach().getTypeByID(idType)])
                .then(([direct, type]) => {
                    idRoute = direct["idRoute"];
                    idStartProvince = direct["idStartProvince"];
                    seats = type["numberOfSeat"];
                    var queryCoachBusy = `SELECT sch.idCoach FROM (schedules as sch join directedroutes as dr on sch.idDirectedRoute = dr.iddirectedroutes) join coachs as c on sch.idCoach = c.idCoach and c.idType = ${idType} and dr.idRoute = ${idRoute} and sch.isDeleted = 0 and c.isDelete = 0 group by sch.idCoach`;
                    var querySchedule = `SELECT * FROM (schedules as sch join directedroutes as dr on sch.idDirectedRoute = dr.iddirectedroutes) join coachs as c on sch.idCoach = c.idCoach and c.idType = ${idType} and dr.idRoute = ${idRoute} and sch.isDeleted = 0 and c.isDelete = 0 order by sch.startTime desc`;
                    return Promise.all([new Coach().GetListCoach(queryCoachBusy), new Coach().getAllCoachByIDTypeAndRoute(idType, idRoute), SchedulePublic.getSchedule(querySchedule), new Coach().getAllCoach()]);
                })
                .then(([busy, all, schedules, coachs]) => {
                    var TimeCoachException = [];
                    for (var x of busy) busyCoach.push(x.idCoach);
                    for (var x of all) {
                        if (!busyCoach.includes(x.idCoach)) {
                            coach.push(coachs.find(coachInfo => coachInfo.idCoach === x.idCoach));
                        }
                        else {
                            var schedule = schedules.find(schedule => schedule.idCoach === x.idCoach);
                            var timeEnd = new MyDate(schedule.endTime);
                            if (schedule.idEndProvince === idStartProvince) {
                                if (timeEnd <= timeStart) coach.push(coachs.find(coachInfo => coachInfo.idCoach === x.idCoach))
                                else TimeCoachException.push(`từ ${timeEnd.toLocaleTimeString()} ${timeEnd.toMyLocaleDateString()}`)
                            }
                        }
                    }
                    if (coach.length === 0) {
                        if (TimeCoachException.length > 0) result.message = "Chọn thời gian " + TimeCoachException.pop();
                        else result.message = "Không có xe ở thành phố đi";
                    }
                    result.coach = coach;
                    result.seat = seats;
                    res.json(result);
                })
                .catch(err => console.error(err))
            // tìm các xe thuộc chuyến idRoute
            //liệt kê ra những xe đi theo route đó
        }
    }
    createSchedule(req, res, next) {
        var idDirect = req.body["start-province"];
        var startStation = req.body["start-station"];
        var endStation = req.body["end-station"];
        var timeStart = new MyDate(`${req.body["start-date"]} ${req.body["start-time"]}`);
        var timeEnd = new MyDate(`${req.body["start-date"]} ${req.body["start-time"]}`);
        var idCoach = req.body["license-plate"];
        var price = req.body["price"];
        var timeNow = new MyDate();
        //console.log('first: ',timeNow)
        timeNow.setHours(timeNow.getHours()+1);
        //console.log('last: ',timeNow);
        if(timeStart < timeNow) {
            var id;
            Promise.all([new Route().getAllRouteNotDelete(), new Schedule().getIDLast(), new TypeCoach().getTypeOfCoach(), new Province().getProvince()])
                .then(([routes, schedules, types, provinces]) => {
                    for (var r of routes) {
                        r.firstProvince = provinces.find(province => province.idProvince === r.idFirstProvince).provinceName;
                        r.secondProvince = provinces.find(province => province.idProvince === r.idSecondProvince).provinceName;
                    }
                    id = Number(schedules[0].idSchedule) + 1;
                    res.render('admin-taoLT', {
                        idSch: id,
                        routes: routes,
                        types: types,
                        title: 'Tạo lịch trình',
                        message: 'Thời gian xuất phát không hợp lệ',
                        failure: "Thêm không thành công!",
                    });
                })
                .catch(err =>{
                    console.error(err);
                    res.render('errorPage',{
                        title: 'Error',
                    })
                });
        }
        else{
        //res.json(req.session.hours);
        new Route().getInfoRoute(req.body["route"])
            .then((route) => {
                timeEnd.setHours(timeEnd.getHours() + route.hours);
                var end = `${timeEnd.toDate()} ${timeEnd.toLocaleTimeString()}`;
                var start = `${timeStart.toDate()} ${timeStart.toLocaleTimeString()}`;
                return new Schedule().create(idDirect, startStation, endStation, start, end, price, idCoach);
            })
            .then(() => {
                return Promise.all([new Coach().getInfoCoach(idCoach), new Schedule().getIDLast()])
                //res.redirect('/admin/list-schedule');
            })
            .then(([coach, ids]) => {
                var numberOfSeat = coach["numberOfSeat"];
                var idSchedule = ids[0].idSchedule;
                var i = 1;
                var type = '';
                if (coach["idType"] === 1) type = 'A';
                else type = 'B';
                for (i; i <= numberOfSeat; i++) {
                    var nameSeat = (i < 10) ? `0${i}` : `${i}`;
                    nameSeat = type + '1' + nameSeat;
                    var query = `insert into seats values (${i},${idSchedule},0,${idCoach},'${nameSeat}')`;
                    new Seat().create(query);
                }
                req.flash('success', 'Thêm thành công!');
                res.redirect('/admin/list-schedule');
            })
            .catch(err =>{
                console.error(err);
                res.render('errorPage',{
                    title: 'Error',
                })
            });
        }
    }
}

module.exports = new CreateScheduleController;