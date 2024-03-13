const news = require('../models/News');
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/public/img')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage }).single('image');

class EditNewsController {

    // [GET] /home
    async index(req, res) {
        try {
            const idNews = new news(req.params.id)
            const obj = {
                title: 'Sửa tin tức',
                newsItem: await idNews.searchNews(),
            }
            res.render('admin-suaTT', obj);
        }
        catch (err) {
            res.render('errorPage', {
                title: 'Error',
            });
        }
    }

    async edit(req, res) {
        try{
            upload(req, res, async function (err) {
                const { idNews, titleNews, contentNews } = req.body;
                console.log(titleNews)
                const oldImage = req.body.oldImage;
                let newImage = null;
                if (req.file) {
                    newImage = req.file.filename;
                }
                else {
                    newImage = oldImage;
                }
                const news_edit = new news(idNews, titleNews, contentNews, newImage);
                await news_edit.editNews();
                req.flash('success', 'Cập nhật thành công!');
                res.redirect('/admin/list-news')
            });
        }
        catch(err){
            res.render('errorPage', {
                title: 'Error',
            });
        }
    }
}

module.exports = new EditNewsController;
