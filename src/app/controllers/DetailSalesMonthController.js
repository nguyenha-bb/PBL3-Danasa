const sales = require('../models/Sales');

class DetailSalesMonthController {

    // [GET] /home
    async index(req, res) {
        
        try {
            var idSort = req.query.sort;
            if(idSort === undefined) idSort = "1";
            const page = parseInt(req.query.page) || 1;
            const perPage = 5;
            const start = (page - 1) * perPage;
            const end = page * perPage;
            const salesModel = new sales();
            const listSales = await salesModel.listSales_month_arranged(idSort);
            const prev = page === 1 ? false : page - 1;
            const lastPage = Math.ceil(listSales.length / perPage);
            const next = page === lastPage ? false : page + 1;
            const obj = {
                title: 'Chi tiết thống kê doanh số theo tháng',
                newsListSales: Array.from(listSales).slice(start, end),
                current: page,
                next: next,
                prev: prev,
                idSort: idSort
            };
            res.render('admin-CT-TKDS-thang', obj);
        }
        catch(err){
            res.render('admin-CT-TKDS-thang',{
                title: 'Chi tiết thống kê doanh số theo tháng',
                current: 1
            });
        }
    }

}

module.exports = new DetailSalesMonthController;
