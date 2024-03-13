const route = require('../models/Route');
const province = require('../models/Province');

class ShowListRouteController {

    // [GET] /home

    async index(req, res) {
        try {
            Promise.all([new route().getAllRouteExisted(), new province().getProvince()])
                .then(([routes, provinces]) => {
                    const listProvince = Array.from(provinces);
                    const listRoute = [];
                    Array.from(routes).forEach(routeItem => {
                        listProvince.forEach(pr => {
                            if(pr.idProvince == routeItem.idFirstProvince) {
                                routeItem.nameFirstProvince = pr.provinceName;
                            }
                            if(pr.idProvince == routeItem.idSecondProvince) {
                                routeItem.nameSecondProvince = pr.provinceName;
                            }
                        })
                        listRoute.push(routeItem);
                    });

                    const page = parseInt(req.query.page) || 1;
                    const perPage = 5;
                    const start = (page - 1) * perPage;
                    const end = page * perPage;
                    const prev = page === 1 ? false : page - 1;
                    const lastPage = Math.ceil(listRoute.length / perPage);
                    var next = page === lastPage ? false : page + 1;
                    if(listRoute.length === 0) next = false;
                    const obj = {
                        title: 'Xem tuyến xe',
                        fullListRoute: Array.from(listRoute).slice(start, end),
                        current: page,
                        next: next,
                        prev: prev
                    };
                    res.render('admin-xemTX', obj);
                })
        }
        catch (err) {
            console.log(err);
            res.render('admin-xemTX', {
                title: 'Xem tuyến xe',
            })
        }
    }


}

module.exports = new ShowListRouteController;