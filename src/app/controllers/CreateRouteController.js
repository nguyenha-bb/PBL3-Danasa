const path = require('path');
const multer = require('multer');
const route = require('../models/Route');
const province = require('../models/Province');
const directedroute = require('../models/DirectedRoute');
class CreateRouteController {

  // [GET] /home
  async index(req, res) {
    try {
      Promise.all([new route().countRoute(), new province().getProvince()])
        .then(([id, provinces]) => {
          const idRoute = id;
          const listProvinces = Array.from(provinces);
          const obj = {
            idRoute: idRoute,
            title: 'Thêm tuyến xe',
            listProvinces: listProvinces,
          }
          res.render('admin-taoTX', obj);
        })

    } catch (err) {
      console.log(err);
    }
  }

  //[POST] /updateinfo/success
  async save(req, res) {
    try {
      const firstID = req.body.routeFirstProvince;
      const secondID = req.body.routeSecondProvince;
      Promise.all([new route().checkRouteFromProvince(firstID, secondID), new route().checkRouteFromProvince(secondID, firstID)])
        .then(([firstProvince, secondProvince]) => {
          if (Array.from(firstProvince).length !== 0 ||
            Array.from(secondProvince).length !== 0) {
            Promise.all([new route().countRoute(), new province().getProvince()])
              .then(([id, provinces]) => {
                const idRoute = id;
                const listProvinces = Array.from(provinces);
                const obj = {
                  idRoute: idRoute,
                  title: 'Thêm tuyến xe',
                  listProvinces: listProvinces,
                  message: "Đã tồn tại tuyến xe!",
                  failure: "Tạo không thành công!"
                }
                res.render('admin-taoTX', obj);
              })
            return;
          }

          // const firstId = await new province().getIdProvinceByName(req.body.routeFirstProvince);
          // const secondId = await new province().getIdProvinceByName(req.body.routeSecondProvince);
          new route().addRoute(req.body.routeInputDistance, req.body.routeInputDuration, firstID, secondID)
            .then(idRoute => {
              new directedroute().addDirectedRoute(idRoute, firstID, secondID);
              new directedroute().addDirectedRoute(idRoute, secondID, firstID);
              req.flash('success', 'Thêm thành công!');
              res.redirect('list-route');
            })


        })
    }
    catch (err) {
      console.log(err);
      res.render('errorPage',{
        title: 'Error'
      });
    }
  }
}

module.exports = new CreateRouteController;
