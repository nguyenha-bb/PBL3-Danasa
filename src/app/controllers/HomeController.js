const account = require('../models/Account');
const schedulePublic= require('../models/SchedulePublic');
const MyDate = require('../models/Date');
const province = require('../models/Province');
const {mutipleMongooseToObject} = require('../../util/mongoose')
class HomeController {

    // [GET] /home
    index(req, res) {
        const passedVariable = req.session.nameCustomer;
        new province().getProvince()
            .then((provinces)=>{
                req.session.provinces = provinces;
                if(passedVariable != null) {
                    const obj = {
                        title: 'Trang chủ',
                        provinces: provinces,
                        infoLogin: passedVariable, 
                    }
                    res.render('home', obj);
                } else {
                    const obj = {
                        title: 'Trang chủ',
                        provinces: provinces,
                        infoLogin: 'Đăng nhập', 
                    }
                    res.render('home', obj);
                }
            })
            .catch((err)=>{
                res.json(err);
            })
    }
    

}

module.exports = new HomeController;