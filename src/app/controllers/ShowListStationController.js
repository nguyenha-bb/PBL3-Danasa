const station = require('../models/Station');
const province = require('../models/Province')

class ShowListStationController {
    index(req,res){
        const id = req.query.province;
        if(id != null && Number.parseInt(id) !== 0) {
            Promise.all([new station().getStationByIdProvince(id), new province().getProvince()])
                .then(([stations, provinces]) => {
                    const listStation = Array.from(stations);
                    const listProvince = Array.from(provinces);
                    listStation.forEach(stt => {
                        const pr = listProvince.find(prv => prv.idProvince === stt.idProvince);
                        stt.provinceName = pr.provinceName;
                    })

                    const page = parseInt(req.query.page) || 1;
                    const perPage = 5;
                    const start = (page - 1) * perPage;
                    const end = page * perPage;

                    const prev = page === 1 ? false : page - 1;
                    const lastPage = Math.ceil(listStation.length / perPage);
                    var next = page === lastPage ? false : page + 1;
                    if(listStation.length === 0) next = false;
                    const obj = {
                        title: 'Xem bến xe',
                        listProvince: listProvince,
                        listStation: Array.from(listStation).slice(start, end),
                        current: page,
                        next: next,
                        prev: prev,
                        idProvinceSelected: id,
                    };
                    res.render('admin-xemBen', obj);
                })
                .catch((err) => {
                    console.log(err);
                    res.render('errorPage',{
                        title: 'Error'
                    });
                })
        } else {
            Promise.all([new station().getStationExisted(), new province().getProvince()])
            .then(([stations, provinces]) => {
                const listStation = Array.from(stations);
                const listProvince = Array.from(provinces);
                listStation.forEach(stt => {
                    const pr = listProvince.find(prv => prv.idProvince === stt.idProvince);
                    stt.provinceName = pr.provinceName;
                })

                const page = parseInt(req.query.page) || 1;
                const perPage = 5;
                const start = (page - 1) * perPage;
                const end = page * perPage;

                const prev = page === 1 ? false : page - 1;
                const lastPage = Math.ceil(listStation.length / perPage);
                var next = page === lastPage ? false : page + 1;
                if(listStation.length === 0) next = false;
                const obj = {
                    title: 'Xem bến xe',
                    listProvince: listProvince,
                    listStation: Array.from(listStation).slice(start, end),
                    current: page,
                    next: next,
                    prev: prev,
                    idProvinceSelected: 0,
                };
                res.render('admin-xemBen', obj);
            })
            .catch((err) => {
                console.log(err);
                res.render('errorPage',{
                    title: 'Error'
                });
            })
        }
    }
}
module.exports = new ShowListStationController;