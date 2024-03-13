const schedulePublic = require('../models/SchedulePublic');
const MyDate = require('../models/Date');
const Route = require('../models/Route');
const Coach = require('../models/Coach');
const SchedulePublic = require('../models/SchedulePublic');
class EditScheduleController {

    // [GET] /admin/edit-schedule/:id
    index(req, res, next) {
        var info;
        var id = req.params.id;
        var enable = true;
        var message = '';
        if (!req.session.stations) {
            schedulePublic.getStation__Province()
                .then(([stations, provinces]) => {
                    req.session.stations = stations;
                    req.session.provinces = provinces;
                })
                .catch(next);
        }
        new Coach().GetIDCoach(id)
            .then((idCoachs) => {
                var idCoach = idCoachs["idCoach"];
                return schedulePublic.getSchedule(`SELECT * FROM (((danasa.schedules as sch join danasa.directedroutes as dr on idDirectedRoute = iddirectedroutes) join danasa.coachs as s on s.idCoach = sch.idCoach) join danasa.typeofcoachs as tp on s.idType = tp.idType) join danasa.routes as r on r.idRoute = dr.idRoute where sch.idCoach = ${idCoach} and sch.isDeleted = 0 order by sch.idSchedule`)
            })
            .then((schedules) => {
                var indexSch;
                var length = schedules.length;
                for (var index in schedules) {
                    if (schedules[index].idSchedule == id) {
                        indexSch = index;
                        break;
                    }
                }
                info = schedules[indexSch];
                var next = Number(indexSch) + 1;
                var previous = indexSch - 1;
                var start, end, timeLength = '';
                const timeNow = new MyDate();
                var time = new MyDate(info.startTime.toString());
                var time2 = new MyDate(info.endTime.toString());
                info.firstProvince = req.session.provinces.find(province => province.idProvince === info.idFirstProvince).provinceName;
                info.secondProvince = req.session.provinces.find(province => province.idProvince === info.idSecondProvince).provinceName;
                info.startStation = req.session.stations.find(station => station.idStation === info.idStartStation).stationName;
                info.endStation = req.session.stations.find(station => station.idStation === info.idEndStation).stationName;
                info.startProvince = req.session.provinces.find(province => province.idProvince === info.idStartProvince).provinceName;
                info.endProvince = req.session.provinces.find(province => province.idProvince === info.idEndProvince).provinceName;
                info.start = `${time.toLocaleTimeString()}`;
                info.end = `${time2.toLocaleTimeString()}`;
                info.day = `${time.toDate()}`;
                if (indexSch > 0) start = schedules[previous].endTime; else start = null
                if (indexSch < (length - 1)) end = schedules[next].startTime; else end = null
                req.session.aboutStart = start;
                req.session.aboutEnd = end;
                if (timeNow > time) { message = 'Chuyến này đã được khởi hành. Không thể chỉnh sửa được nữa !'; enable = false; }
                else {
                    if (start) {
                        //console.log(req.session.aboutStart);
                        var myTime = new MyDate(start.toString());
                        //info.min = myTime.toLocaleTimeString();
                        timeLength += `từ ${myTime.toLocaleTimeString()} ${myTime.toMyLocaleDateString()}`;
                    }
                    else {
                        //console.log(req.session.aboutStart);
                        //info.min = NaN;
                        timeLength += 'bất kì';
                    }
                    if (end) {
                        //console.log(req.session.aboutEnd);
                        end.setHours(end.getHours() - info.hours);
                        req.session.aboutEnd = end;
                        //info.max = myTime.toLocaleTimeString();
                        var myTime = new MyDate(end.toString());
                        timeLength += ` đến ${myTime.toLocaleTimeString()} ${myTime.toMyLocaleDateString()}`
                    }
                    else {
                        //console.log(req.session.aboutEnd);
                        //info.max = NaN;
                    }
                }
                info.timeLength = timeLength;
                info.enable = enable;
                info.message = message;
                req.session.hours = info.hours;
                //res.json(info);
                res.render('admin-suaLT', {
                    schedule: info,
                    title: 'Sửa lịch trình',
                });
            })
            .catch(err => {
                console.error(err);
                res.render('errorPage',{
                  title: 'Error'
                });
            });        // else {
        //     const obj = {
        //         infoLogin: 'Đăng nhập', 
        //     }
        //     res.render('home', obj);
        // }
    }

    // [POST] /admin/edit-schedule/:id
    edit(req, res, next) {
        var timeStartEdit__S, timeStartEdit;
        var id = req.params.id;
        var end, start;
        //Lấy được thời gian hihihihihi
        new Promise(function (resolve, reject) {
            timeStartEdit__S = `${req.body["start-date"]} ${req.body["start-time"]}`;
            timeStartEdit = new MyDate(timeStartEdit__S);
            var timeEnd = new MyDate(req.session.aboutEnd);
            var timeStart = new MyDate(req.session.aboutStart);
            const timeNow = new MyDate();
            var result = false;
            // res.json({
            //     time: timeStartEdit,
            //     end: timeEnd,
            //     start: timeStart,
            // })
            //console.log(timeStartEdit);
            //console.log("timeStart",timeStart);
            //console.log("timeEnd",timeEnd);
            if (timeNow < timeStartEdit) {
                if (req.session.aboutEnd) {
                    if (timeStartEdit <= timeEnd) {
                        result = true;
                        if (req.session.aboutStart) {
                            if (timeStartEdit >= timeStart) result = true;
                            else result = false;
                        }
                    }
                    else result = false;
                }
                else {
                    result = true;
                    if (req.session.aboutStart) {
                        if (timeStartEdit >= timeStart) result = true;
                        else result = false;
                    }
                }
            }
            // console.log(timeStartEdit);
            // console.log(timeStart);
            // console.log(timeEnd);
            // console.log(result);
            if (result) return resolve(timeStartEdit);
            else return reject("Lỗi");
        })
            .then((x) => {
                var timeEndEdit = new MyDate(`${req.body["start-date"]} ${req.body["start-time"]}`);
                timeEndEdit.setHours(timeEndEdit.getHours() + req.session.hours);
                end = `${timeEndEdit.toDate()} ${timeEndEdit.toLocaleTimeString()}`;
                start = `${x.toDate()} ${x.toLocaleTimeString()}`;
                return SchedulePublic.save(start, end, req.body["price"], id)
                // res.json({
                //     end: end,
                //     start: start,
                // });
            })
            .then(() => {
                //res.json("Thành công");
                // req.session.messageEdit = {
                //     message: "",
                //     idSch: id,
                // };
                req.flash('success', 'Cập nhật thành công!');
                res.redirect('/admin/list-schedule');
            })
            .catch(err => {
                //res.json(err);
                // req.session.messageEdit = {
                //     message: "Thời gian không hợp lệ !",
                //     idSch: id,
                // }
                res.redirect(`/admin/edit-schedule/${id}/fail`);
            })
    }
    //[GET] /admin/edit-schedule/:id/fail
    fail(req, res, next) {
        var info;
        var id = req.params.id;
        var enable = true;
        var message = '';
        if (!req.session.stations) {
            schedulePublic.getStation__Province()
                .then(([stations, provinces]) => {
                    req.session.stations = stations;
                    req.session.provinces = provinces;
                })
                .catch(next);
        }
        new Coach().GetIDCoach(id)
            .then((idCoachs) => {
                var idCoach = idCoachs["idCoach"];
                return schedulePublic.getSchedule(`SELECT * FROM (((danasa.schedules as sch join danasa.directedroutes as dr on idDirectedRoute = iddirectedroutes) join danasa.coachs as s on s.idCoach = sch.idCoach) join danasa.typeofcoachs as tp on s.idType = tp.idType) join danasa.routes as r on r.idRoute = dr.idRoute where sch.idCoach = ${idCoach} and sch.isDeleted = 0 order by sch.idSchedule`)
            })
            .then((schedules) => {
                var indexSch;
                var length = schedules.length;
                for (var index in schedules) {
                    if (schedules[index].idSchedule == id) {
                        indexSch = index;
                        break;
                    }
                }
                info = schedules[indexSch];
                var next = Number(indexSch) + 1;
                var previous = indexSch - 1;
                var start, end, timeLength = '';
                const timeNow = new MyDate();
                var time = new MyDate(info.startTime.toString());
                var time2 = new MyDate(info.endTime.toString());
                info.firstProvince = req.session.provinces.find(province => province.idProvince === info.idFirstProvince).provinceName;
                info.secondProvince = req.session.provinces.find(province => province.idProvince === info.idSecondProvince).provinceName;
                info.startStation = req.session.stations.find(station => station.idStation === info.idStartStation).stationName;
                info.endStation = req.session.stations.find(station => station.idStation === info.idEndStation).stationName;
                info.startProvince = req.session.provinces.find(province => province.idProvince === info.idStartProvince).provinceName;
                info.endProvince = req.session.provinces.find(province => province.idProvince === info.idEndProvince).provinceName;
                info.start = `${time.toLocaleTimeString()}`;
                info.end = `${time2.toLocaleTimeString()}`;
                info.day = `${time.toDate()}`;
                if (indexSch > 0) start = schedules[previous].endTime; else start = null
                if (indexSch < (length - 1)) end = schedules[next].startTime; else end = null
                req.session.aboutStart = start;
                req.session.aboutEnd = end;
                if (timeNow > time) { message = 'Chuyến này đã được khởi hành. Không thể chỉnh sửa được nữa !'; enable = false; }
                else {
                    if (start) {
                        //console.log(req.session.aboutStart);
                        var myTime = new MyDate(start.toString());
                        //info.min = myTime.toLocaleTimeString();
                        timeLength += `từ ${myTime.toLocaleTimeString()} ${myTime.toMyLocaleDateString()}`;
                    }
                    else {
                        //console.log(req.session.aboutStart);
                        //info.min = NaN;
                        timeLength += 'bất kì';
                    }
                    if (end) {
                        //console.log(req.session.aboutEnd);
                        end.setHours(end.getHours() - info.hours);
                        req.session.aboutEnd = end;
                        //info.max = myTime.toLocaleTimeString();
                        var myTime = new MyDate(end.toString());
                        timeLength += ` đến ${myTime.toLocaleTimeString()} ${myTime.toMyLocaleDateString()}`
                    }
                    else {
                        //console.log(req.session.aboutEnd);
                        //info.max = NaN;
                    }
                }
                info.timeLength = timeLength;
                info.enable = enable;
                info.message = message;
                req.session.hours = info.hours;
                //res.json(info);
                res.render('admin-suaLT', {
                    schedule: info,
                    messageEdit: "Thời gian không hợp lệ !",
                    title: 'Sửa lịch trình',
                    failure: "Cập nhật không thành công!",
                });
            })
            .catch(err => {
                console.error(err);
                res.render('errorPage',{
                  title: 'Error'
                });
            });    
    }

    
}

module.exports = new EditScheduleController;
