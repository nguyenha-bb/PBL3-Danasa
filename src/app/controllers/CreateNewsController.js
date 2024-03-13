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

class CreateNewsController {

  // [GET] /home
  async index(req, res) {
    const NEWS = new news();
    const obj = {
      title: 'Tạo tin tức',
      idNews: await NEWS.countNews(),
    }
    res.render('admin-taoTT', obj);
  }

  async createNews(req, res) {
    upload(req, res, async function (err) {
      if (req.file) {
        const image = req.file.filename;
        const { idNews, titleNews, contentNews } = req.body;
        try {
          const News = new news(idNews, titleNews, contentNews, image);
          const saveNews = await News.createNews();
          req.flash('success', 'Thêm thành công!');
          res.redirect('/admin/list-news');
        }
        catch (err) {
          console.log(err);
          res.render('errorPage', {
            title: 'Error',
          });
        }
      }
      else {
        const { idNews, titleNews, contentNews } = req.body;
        try {
          const News = new news(idNews, titleNews, contentNews);
          const saveNews = await News.createNews();
          req.flash('success', 'Thêm thành công!');
          res.redirect('/admin/list-news');
        }
        catch (err) {
          console.log(err);
          res.render('errorPage', {
            title: 'Error',
          });
        }
      }
    });
  }
}

module.exports = new CreateNewsController;
