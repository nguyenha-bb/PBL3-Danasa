const news = require('../models/News');

class DeleteNewsController {

    // [GET] /home
    async index(req, res) {
        try {
            const idNews = new news(req.params.id)
            const obj = {
                title: 'Xóa tin tức',
                newsItem: await idNews.searchNews(),
            }
            res.render('admin-xoaTT', obj);
        }
        catch (err) {
            res.render('errorPage', {
                title: 'Error',
            });
        }
    }

    //[GET]/updateinfo/:slug
    async delete(req, res) {
        try {
            const news_delete = new news(req.params.id);
            await news_delete.deleteNews();
            req.flash('success', 'Xóa thành công!');
            res.redirect('/admin/list-news')
        }
        catch (err) {
            console.log(err);
            res.render('errorPage', {
                title: 'Error',
            });
        }
    }
}

module.exports = new DeleteNewsController;
