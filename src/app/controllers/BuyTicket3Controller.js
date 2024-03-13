const customer = require('../models/InforCustomer');
const account = require('../models/Account');
const seat = require('../models/Seat');
const ticket = require('../models/Ticket');
const schedule = require('../models/Schedule');
const schedulePublic = require('../models/SchedulePublic');

class BuyTicket3Controller{

    // [GET] /buy-ticket-step2
    async index(req, res){
        try {
            const passedVariable = req.session.nameCustomer;
            const username = req.session.userName;
            const cus = new account(username);
            const infoCus = await cus.fillInfo();
            const idSchedule = Number(req.params.slug);
            const seats = new seat();
            const listSeat = await seats.getListSeat(idSchedule);
            const sublength = listSeat.length / 2;
            const firstArr = Array.from(listSeat).slice(0, sublength / 2);
            const secondArr = Array.from(listSeat).slice(sublength / 2, sublength);
            const thirdArr = Array.from(listSeat).slice(sublength, sublength + sublength / 2);
            const fourthArr = Array.from(listSeat).slice(sublength + sublength / 2, listSeat.length);
            // console.log(firstArr);
            // console.log(secondArr);
            // console.log(thirdArr);
            // console.log(fourthArr);
            var priceSchedule;
            schedulePublic.getSchedule(`select * from schedules where idSchedule = ${idSchedule}`)
            .then(schedule => {
                priceSchedule = schedule[0].price;
                res.render('buyticketstep3', {
                    title: 'Đặt vé xe',
                    infoLogin: passedVariable,
                    number: listSeat.length,
                    firstArr: firstArr,
                    secondArr: secondArr,
                    thirdArr: thirdArr,
                    fourthArr: fourthArr,
                    // priceSchedule: priceSchedule,
                    priceSchedule: priceSchedule,
                    infoCus: infoCus,
                });
            })
        }
        catch(err) {
            console.log(err);
            res.render('errorPage',{
                title: 'Error'
            });
        }
    }

    //[GET]/buy-ticket-step2/:slug
    show(req, res){
        const passedVariable = req.session.nameCustomer;
        res.render('buyticketstep3', {
            title: 'Đặt vé xe',
            infoLogin: passedVariable,
        });
    }
}

module.exports = new BuyTicket3Controller;