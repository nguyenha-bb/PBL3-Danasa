const path = require('path');
const multer = require('multer');
const Coach = require('../models/Coach');
const Province = require('../models/Province');
const TypeOfCoach = require('../models/TypeOfCoach');
const Route = require('../models/Route');
const MyDate = require('../models/Date');
const { Console } = require('console');

class CreateCoachController {

  // [GET] /home
  index(req, res) {
    Promise.all([new Coach().GetIDLast(), new Route().getAllRouteNotDelete(), new TypeOfCoach().getTypeOfCoach(), new Province().getProvince()])
      .then(([idlast, routes, types, provinces]) => {
        for (var route of routes) {
          route.firstProvince = provinces.find(province => province.idProvince === route.idFirstProvince).provinceName;
          route.secondProvince = provinces.find(province => province.idProvince === route.idSecondProvince).provinceName;
        }
        res.render('admin-taoXK', {
          title: 'Thêm xe khách',
          idCoach: idlast["idCoach"],
          types: types,
          routes: routes,
        });
      })
      .catch(err => console.error(err))
  }

  //[POST] /updateinfo/success
  getNumberSeat(req, res) {
    var idType = req.query["type"];
    if(idType == undefined) res.json("Not Found");
    else{
      new TypeOfCoach().getTypeByID(idType)
      .then((type)=>{
        res.json(type);
      })
      .catch(err => {
        console.error(err);
        res.render('errorPage',{
          title: 'Error',
        })
      })
    }
  }

  //[POST] 
  create(req, res) {
    const idRoute = req.body["route"];
    const idType = req.body["type-coach"];
    const license = req.body["license-plate"];
    var message = '';
    var conflict = false;
    Promise.all([new Coach().CheckExist(license), new Coach().CheckListSchedule(license)])
      .then(([coachExist, listCoachDelete]) => {
        //xe đang hoạt động và xe ngừng hoạt động
        if (coachExist.length === 0) {
          // không trùng xe đang hoạt động
          if (listCoachDelete.length > 0) {
            // trùng với xe bị xóa -> lấy thời gian gần nhất
            var info = listCoachDelete[0];
            const nowTime = new MyDate(Date.now());
            const lastTime = new MyDate(info.endTime);
            if (lastTime > nowTime) {
              conflict = true;
              message = `Chưa thể thêm mới. Xe vẫn còn lịch trình đang chạy cho tới ${lastTime.toLocaleTimeString()} ${lastTime.toMyLocaleDateString()} !`;
            }
          }
        }
        else {
          //trùng với xe đang hoạt động
          message = 'Biển số xe trùng !!';
          conflict = true;
        }
        req.session.message = message;
        return new Promise(function (resolve, reject) {
          if (conflict) return reject();
          else return resolve();
        })
      })
      .then(() => {
        return new Coach().create(idRoute, idType, license);
      })
      .then(() => {
        req.flash('success', 'Thêm thành công!');
        res.redirect('/admin/list-coach');
      })
      .catch(err => {
        if (conflict) res.redirect('/admin/create-coach/fail');
        else console.error(err);
      })
  }
  fail(req, res) {
    Promise.all([new Coach().GetIDLast(), new Route().getAllRouteNotDelete(), new TypeOfCoach().getTypeOfCoach(), new Province().getProvince()])
      .then(([idlast, routes, types, provinces]) => {
        for (var route of routes) {
          route.firstProvince = provinces.find(province => province.idProvince === route.idFirstProvince).provinceName;
          route.secondProvince = provinces.find(province => province.idProvince === route.idSecondProvince).provinceName;
        }
        res.render('admin-taoXK', {
          title: 'Thêm xe khách',
          idCoach: idlast["idCoach"],
          types: types,
          routes: routes,
          messageError: req.session.message,
          failure: "Thêm không thành công!",
        });
      })
      .catch(err => console.error(err))
  }
}

module.exports = new CreateCoachController;
