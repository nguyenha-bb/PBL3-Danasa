const statistics = require('../models/Statistics');
class DetailStaticsMonthController {

    async index(req, res) {
        try{
            var idSort = req.query.sort;
            if(idSort === undefined) idSort = "1";
            const page = parseInt(req.query.page) || 1;
            const perPage = 5;
            const start = (page - 1) * perPage;
            const end = page * perPage;
            const statisticModel = new statistics();
            const listStatistics = await statisticModel.listStatistics_month_arranged(idSort);
            const prev = page === 1 ? false : page - 1;
            const lastPage = Math.ceil(listStatistics.length / perPage);
            const next = page === lastPage ? false : page + 1;
            const obj = {
                title: 'Chi tiết thống kê doanh thu theo tháng',
                newsListStatistics: Array.from(listStatistics).slice(start, end),
                current: page,
                next: next,
                prev: prev,
                idSort: idSort
            };
            res.render('admin-CT-TKDT-thang', obj);
        }
        catch(err){
            res.render('admin-CT-TKDT-thang',{
                title: 'Chi tiết thống kê doanh thu theo tháng',
                current: 1
            });
        }
    }
}

module.exports = new DetailStaticsMonthController;
