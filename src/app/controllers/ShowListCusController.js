const account = require('../models/Account');
const { mutipleMongooseToObject } = require('../../util/mongoose')
class ShowListCusController {

    // [GET] /home
    async index(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const perPage = 5;
            const start = (page - 1) * perPage;
            const end = page * perPage;
            const ac = new account();
            const accountList = await ac.getAllAccount();
            const prev = page === 1 ? false : page - 1;
            const lastPage = Math.ceil(accountList.length / perPage);
            const next = page === lastPage ? false : page + 1;
            
            res.render('admin-xemTK', {
                accountList: Array.from(accountList).slice(start, end),
                title: 'Xem tài khoản khách hàng',
                current: page,
                prev: prev,
                next: next
            });
        }
        catch (err) {
            console.log(err);
        }
    }
    
}

module.exports = new ShowListCusController;
