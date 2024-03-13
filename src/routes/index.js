const homeRouter = require('./home');
const newsRouter = require('./news');
const siteRouter = require('./site');
const loginRouter = require('./login');
const registerRouter = require('./register');
const buyticketstep2Router = require('./buyticketstep2');
const buyticketstep3Router = require('./buyticketstep3');
const buyticketstep4Router = require('./buyticketstep4');
const historybuyticketRouter = require('./historybuyticket');
const contactRouter = require('./contact');
const changepasswordRouter = require('./changepassword');
const updateinfoRouter = require('./updateinfo');


const showlistcus = require('./admin-show-list-cus');
const deletecus = require('./admin-delete-cus');
const showlistschedule = require('./admin-show-list-schedule');
const deleteschedule = require('./admin-delete-schedule');
const createschedule = require('./admin-create-schedule');
const editschedule = require('./admin-edit-schedule');
const detailstatistics_quarter = require('./admin-ct-tkdt-quy');
const detailstatistics_month = require('./admin-ct-tkdt-thang');
const detailSales_month = require('./admin-ct-tkds-thang');
const detailSales_quarter = require('./admin-ct-tkds-quy');
const showlistnews = require('./admin-show-news');
const createnews = require('./admin-create-news');
const editnews = require('./admin-edit-news');
const deletenews = require('./admin-delete-news');
const sales = require('./admin-sales');
const statistics = require('./admin-statistics');
const showlistcoach = require('./admin-show-list-coach');
const deletecoach = require('./admin-delete-coach');
const createcoach = require('./admin-create-coach');
const showlistroute = require('./admin-show-list-route');
const deleteroute = require('./admin-delete-route');
const createroute = require('./admin-create-route');
const editroute = require('./admin-edit-route');
const showliststation = require('./admin-show-list-station');
const deletestation = require('./admin-delete-station');
const createstation = require('./admin-create-station');
const editstation = require('./admin-edit-station');
const undefinedroute = require('./error');
const { register } = require('../app/controllers/RegisterController');

const authMiddleware = require('../middleware/auth');

function route(app) {

    

    app.use('/admin', authMiddleware.authAdmin ,statistics);
    app.use('/admin', authMiddleware.authAdmin, sales);
    app.use('/admin', authMiddleware.authAdmin, deletenews);
    app.use('/admin', authMiddleware.authAdmin, editnews);
    app.use('/admin', authMiddleware.authAdmin, createnews);
    app.use('/admin', authMiddleware.authAdmin, showlistnews);
    app.use('/admin', authMiddleware.authAdmin, detailSales_month);
    app.use('/admin', authMiddleware.authAdmin, detailSales_quarter);
    app.use('/admin', authMiddleware.authAdmin, detailstatistics_month);
    app.use('/admin', authMiddleware.authAdmin, detailstatistics_quarter);
    app.use('/admin', authMiddleware.authAdmin, editschedule);
    app.use('/admin', authMiddleware.authAdmin, createschedule);
    app.use('/admin', authMiddleware.authAdmin, deleteschedule);
    app.use('/admin', authMiddleware.authAdmin, showlistschedule);
    app.use('/admin', authMiddleware.authAdmin, deletecus);
    app.use('/admin', authMiddleware.authAdmin, showlistcus);
    app.use('/admin', authMiddleware.authAdmin, showlistcoach);
    app.use('/admin', authMiddleware.authAdmin, deletecoach);
    app.use('/admin', authMiddleware.authAdmin, createcoach);
    app.use('/admin', showlistroute);
    app.use('/admin', deleteroute);
    app.use('/admin', createroute);
    app.use('/admin', editroute);
    app.use('/admin', createcoach);
    app.use('/admin', authMiddleware.authAdmin, showlistroute);
    app.use('/admin', authMiddleware.authAdmin, deleteroute);
    app.use('/admin', authMiddleware.authAdmin, createroute);
    app.use('/admin', authMiddleware.authAdmin, editroute);
    app.use('/admin', authMiddleware.authAdmin, showliststation);
    app.use('/admin', authMiddleware.authAdmin, deletestation);
    app.use('/admin', authMiddleware.authAdmin, createstation);
    app.use('/admin', authMiddleware.authAdmin, editstation);
    app.use('/admin/:slug',undefinedroute);

    app.use('/', homeRouter);
    app.use('/updateinfo', authMiddleware.authCus, updateinfoRouter);
    app.use('/change-password', authMiddleware.authCus, changepasswordRouter);
    app.use('/contact', contactRouter);
    app.use('/history-buy-ticket', authMiddleware.authCus, historybuyticketRouter);
    app.use('/buy-ticket-step4', authMiddleware.authCus, buyticketstep4Router);
    app.use('/buy-ticket-step3', authMiddleware.authCus, buyticketstep3Router);
    app.use('/buy-ticket-step2', buyticketstep2Router);
    app.use('/register', registerRouter);
    app.use('/login', loginRouter);
    app.use('/news', newsRouter);
    app.use('/', siteRouter);
    app.use('/:slug',undefinedroute);
}

module.exports = route;
