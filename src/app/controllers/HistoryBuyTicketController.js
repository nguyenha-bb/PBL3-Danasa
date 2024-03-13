const historybuyticket = require('../models/HistoryBuyTicket');
const MyDate = require('../models/Date');

class HistoryBuyTicketController {

    // [GET] /buy-ticket-step2
    async index(req, res) {
        const passedVariable = req.session.nameCustomer;
        const userName = req.session.userName;
        var idStart = req.query.start;
        var idEnd = req.query.end;
        if (idStart === undefined) idStart = 0;
        if (idEnd === undefined) idEnd = 0;
        const page = parseInt(req.query.page) || 1;
        const perPage = 5;
        const start = (page - 1) * perPage;
        const end = page * perPage;
        const prev = page === 1 ? false : page - 1;
        const historyModel = new historybuyticket(userName);
        try {
            const historyData = await historyModel.fillIn(idStart, idEnd);
            const lastPage = Math.ceil(historyData.historyList.length / perPage);
            const next = page === lastPage ? false : page + 1;
            if (passedVariable != null) {
                const obj = {
                    title: 'Lịch sử đặt vé xe',
                    infoLogin: passedVariable,
                    historyList: Array.from(historyData.historyList).slice(start, end),
                    listStartProvince: historyData.provincesStartList,
                    listEndProvince: historyData.provincesEndList,
                    current: page,
                    prev: prev,
                    next: next,
                    id_Start: idStart,
                    id_End: idEnd,
                }
                res.render('historybuyticket', obj);
            }
        }
        catch (err) {
            res.render('historybuyticket', {
                title: 'Lịch sử đặt vé',
                infoLogin: passedVariable,
                message: 'Bạn chưa đặt vé nào!',
                current: 1
            });
        }
    }
}

module.exports = new HistoryBuyTicketController;