const news = require('../models/News');

class ShowListNewsController {

    // [GET] /home

    async index(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const perPage = 5;
            const start = (page - 1) * perPage;
            const end = page * perPage;
            const newsModel = new news();
            const listNews = await newsModel.loadNews();
            const prev = page === 1 ? false : page - 1;
            const lastPage = Math.ceil(listNews.length / perPage);
            const next = page === lastPage ? false : page + 1;
            const obj = {
                title: 'Xem tin tức',
                newsList: Array.from(listNews).slice(start, end),
                current: page,
                next: next,
                prev: prev
            };
            res.render('admin-xemTT', obj);
        }
        catch (err) {
            res.render('admin-xemTT', {
                title: 'Xem tin tức',
                current: 1,
            })
        }
    }
}

module.exports = new ShowListNewsController;
