const path = require('path');
const multer = require('multer');
const Coach = require('../models/Coach');
const Province = require('../models/Province');
const TypeOfCoach = require('../models/TypeOfCoach');
const Route = require('../models/Route');
//const 

class ShowListCoachController {

  // [GET] /home
  index(req, res) {
    var idRoute = req.query.route ? req.query.route : 0;
    var idType = req.query.type ? req.query.type : 0;
    const page = parseInt(req.query.page) || 1;
    const perPage = 5;
    const start = (page - 1) * perPage;
    const end = page * perPage;
    var queryList = `SELECT * FROM (danasa.coachs as c join typeofcoachs as type on c.idType = type.idType) join routes as r on c.idRoute =  r.idRoute where c.isDelete = 0 and r.isDelete = 0`;
    if(idRoute > 0) queryList += ` and r.idRoute = ${idRoute}`;
    if(idType > 0) queryList += ` and type.idType = ${idType}`;
    Promise.all([new Coach().GetListCoach(queryList),new Province().getProvince(),new TypeOfCoach().getTypeOfCoach(),new Route().getAllRouteNotDelete()])
      .then(([coachs,provinces,types,routes])=>{
        for(var coach of coachs){
          coach.firstProvince = provinces.find(province => province.idProvince === coach.idFirstProvince).provinceName;
          coach.secondProvince = provinces.find(province => province.idProvince === coach.idSecondProvince).provinceName;
        }
        for(var route of routes){
          route.firstProvince = provinces.find(province => province.idProvince === route.idFirstProvince).provinceName;
          route.secondProvince = provinces.find(province => province.idProvince === route.idSecondProvince).provinceName;
        }
        const prev = page === 1 ? false : page - 1;
        var lastPage = Math.ceil(coachs.length / perPage);
        if(lastPage === 0)  lastPage = 1;
        const next = page === lastPage ? false : page + 1;
        coachs = Array.from(coachs).slice(start,end);
        res.render('admin-xemXK',{
          title: 'Xem xe khách',
          coachs: coachs,
          current: page,
          prev: prev,
          next: next,
          types: types,
          routes:  routes,
          idType: idType,
          idRoute: idRoute
        })
      })
      .catch(err => res.json(err))
  }
  //[POST] /updateinfo/success
  
}

module.exports = new ShowListCoachController;