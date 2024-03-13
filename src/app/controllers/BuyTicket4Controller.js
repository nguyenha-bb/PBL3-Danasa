const schedule = require('../models/Schedule');
const schedulePublic = require('../models/SchedulePublic');
const MyDate = require('../models/Date');
const customer = require('../models/InforCustomer');
const account = require('../models/Account');
const seat = require('../models/Seat');
const ticket = require('../models/Ticket');
const nodemailer = require('nodemailer');


class BuyTicket4Controller {

    // [GET] /buy-ticket-step2
    index(req, res, next) {
        const passedVariable = req.session.nameCustomer;
        const infoCus = req.body;
        // req.session.name = infoCus.fullname;
        // req.session.phoneNumber = infoCus.phonenumber;
        // req.session.email = infoCus.email;
        const idSchedule = req.query.id;
        const totalNumber = req.query.totalNumber;
        const totalPrice = req.query.totalPrice;
        const seats = req.query.seats;
        const confirmedHref = `/buy-ticket-step4/confirm?id=${idSchedule}}`;
        var info;
        if (!req.session.stations) {
            schedulePublic.getStation__Province()
                .then(([stations, provinces]) => {
                    req.session.stations = stations;
                    req.session.provinces = provinces;
                })
                .catch(next);
        }
        schedulePublic.getSchedule(`SELECT * FROM ((danasa.schedules as sch join danasa.directedroutes as dr on idDirectedRoute = iddirectedroutes) join danasa.coachs as s on s.idCoach = sch.idCoach) join danasa.typeofcoachs as tp on s.idType = tp.idType where sch.idSchedule = ${idSchedule}`)
            .then((schedules) => {
                info = schedules[0];
                var time = new MyDate(info.startTime.toString());
                info.start = `${time.toLocaleTimeString()}`;
                info.day = `${time.toLocaleDateString()}`;
                info.startStation = req.session.stations.find(station => station.idStation === info.idStartStation).stationName;
                info.endStation = req.session.stations.find(station => station.idStation === info.idEndStation).stationName;
                info.startProvince = req.session.provinces.find(province => province.idProvince === info.idStartProvince).provinceName;
                info.endProvince = req.session.provinces.find(province => province.idProvince === info.idEndProvince).provinceName;
                res.render('buyticketstep4', {
                    schedule: info,
                    title: 'Đặt vé xe',
                    infoLogin: passedVariable,
                    totalNumber: totalNumber,
                    totalPrice: parseInt(totalPrice).toLocaleString(),
                    seats: seats,
                    infoCus: infoCus,
                    confirmedHref: confirmedHref,
                    idSchedule: idSchedule,
                });
            })
    }

    //[GET]/buy-ticket-step2/:slug
    async show(req, res) {
        res.redirect('./buy-ticket-step3/' + req.query.id);
    }
    async showConfirm(req, res) {
        res.redirect('../buy-ticket-step3/' + req.query.idSchedule);
    }

    async confirm(req, res) {
        const passedVariable = req.session.nameCustomer;
        const idSchedule = req.query.idSchedule;
        try {
            const infoTicket = new ticket();
            const ansInfo = await infoTicket.getInfoTicket(idSchedule);
            var time = new MyDate(ansInfo.startTime.toString());
            ansInfo.start = `${time.toLocaleTimeString()}`;
            ansInfo.day = `${time.toLocaleDateString()}`;
            const [month, day, year] = ansInfo.day.split('/'); // tách chuỗi ngày tháng thành các thành phần
            const formattedDate = `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`; // ghép lại theo định dạng "dd/MM/yyyy"
            ansInfo.startStation = req.session.stations.find(station => station.idStation === ansInfo.idStartStation).stationName;
            ansInfo.endStation = req.session.stations.find(station => station.idStation === ansInfo.idEndStation).stationName;
            ansInfo.startProvince = req.session.provinces.find(province => province.idProvince === ansInfo.idStartProvince).provinceName;
            ansInfo.endProvince = req.session.provinces.find(province => province.idProvince === ansInfo.idEndProvince).provinceName;

            const seatArr = req.body['seat-name'].split(',');
            const soLuong = seatArr.length;
            let check = true;

            for (const st of seatArr) {
                const ac = new account(req.session.userName);
                const idUser = await ac.getIdAccount();
                const confirmedSeat = new seat();
                if (await confirmedSeat.getStatusSeat(st, idSchedule) == 1) {
                    check = false;
                }
                await confirmedSeat.save(st, idSchedule);
                const idSeat = await confirmedSeat.getIdSeat(st, idSchedule);

                const confirmedTicket = new ticket(0, idSchedule, idUser, idSeat, req.body.SDT, req.body.name, req.body.email);
                const checkSeat = await confirmedTicket.check(idSeat, idSchedule);
                if (checkSeat.length === 0) {
                    await confirmedTicket.save();
                }
            }

            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'danasacoach79@gmail.com',
                    pass: 'ttrzxlkyizmuxmoq',
                },
            });

            const mailOptions = {
                from: 'danasacoach79@gmail.com',
                to: req.body.email,
                subject: 'THÔNG BÁO TỪ DANASA COACH',
                html: `
                      <html>
                        <head>
                          <style>
                            body {
                                font-family: Arial, sans-serif;
                                font-size: 14px;
                                color: black;
                            }
                            li, p{
                                color: black;
                            }
                            .center {
                                text-align: center;
                            }
                            .bold {
                                font-weight: bold;
                            }
                            .contact{
                                font-style: italic;
                            }
                            .contact p{
                                margin: 0;
                                line-height: 1.4rem;
                            }
                            .total{
                                font-weight: 600;
                            }
                          </style>
                        </head>
                        <body>
                            <p class="center bold">Chào ${req.body.name},</p>
                            <p>Chúng tôi xin thông báo rằng yêu cầu đặt vé xe của bạn đã được xử lý thành công và bạn đã đặt chỗ thành công
                                trên chuyến xe mà bạn đã chọn.</p>
                        
                            <p>Thông tin chi tiết về chuyến đi của bạn như sau:</p>
                            <ul>
                                <li>Tên chuyến xe: ${ansInfo.startProvince} - ${ansInfo.endProvince}</li>
                                <li>Ngày khởi hành: ${formattedDate}</li>
                                <li>Thời gian khởi hành: ${ansInfo.start}</li>
                                <li>Điểm lên xe: ${ansInfo.startStation}</li>
                                <li>Điểm xuống xe: ${ansInfo.endStation}</li>
                            </ul>
                        
                            <p>Thông tin vé của bạn như sau:</p>
                            <ul>
                                <li>Loại xe: ${ansInfo.typeName}</li>
                                <li>Biển số xe: ${ansInfo.licensePlate}</li>
                                <li>Số lượng vé: ${soLuong} vé</li> 
                                <li>Số ghế: ${seatArr} </li>
                                <li>Giá vé: ${ansInfo.price.toLocaleString()} VNĐ</li>
                                <li class="total">Tổng cộng: ${(soLuong * ansInfo.price).toLocaleString()} VNĐ</li>
                            </ul>
                        
                            <p>Cảm  ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi. Nếu bạn có bất kỳ câu hỏi hoặc yêu cầu gì thêm vui lòng
                                liên hệ với chúng tôi qua email hoặc số điện thoại dưới đây.</p>
                        
                            <div class="contact">
                                <p>Trân trọng,</p>
                                <p>DANASA COACH</p>
                                <p>54 Nguyễn Lương Bằng, Hòa Khánh Bắc, Liên Chiểu, Đà Nẵng</p>
                                <p>danasacoach79@gmail.com</p>
                                <p>076 922 0162</p>
                            </div>
                        </body>
                      </html>
                    `,
            };

            if (check) {
                transporter.sendMail(mailOptions, (error) => {
                    if (error) {
                        console.log(error);
                        res.status(500).send('Lỗi khi gửi email.');
                    } else {
                        console.log(`Email gửi thành công`);
                        res.render('buyticket-confirm', {
                            title: 'Đặt vé xe',
                            infoLogin: passedVariable,
                        });
                    }
                });
            }
            else {
                res.render('buyticket-confirm', {
                    title: 'Đặt vé xe',
                    infoLogin: passedVariable,
                });
            }


        } catch (err) {
            console.log(err);
            res.render('errorPage',{
                title: 'Error'
            });
        }

    }
}

module.exports = new BuyTicket4Controller;