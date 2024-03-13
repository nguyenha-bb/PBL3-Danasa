const customer = require('../models/InforCustomer');
const account = require('../models/Account');

class LoginController {

    // [GET] /home
    async index(req, res) {
        const passedVariable = req.session.nameCustomer;
        if (passedVariable != null) {
            const username = new account(req.session.userName);
            const inforCustomer = await username.fillInfo();

            const obj = {
                title: 'Thông tin cá nhân',
                infoLogin: passedVariable,
                name: inforCustomer.name,
                email: inforCustomer.email,
                phoneNumber: inforCustomer.phoneNumber,
            }
            res.render('updateinfo', obj);
        }
    }

    //[POST] /updateinfo/success
    async update(req, res) {
        try {
            const passedVariable = req.session.nameCustomer;
            const accountUser = new account(req.session.userName);
            const idUser = await accountUser.getIdAccount();
            const idCus = idUser;

            const { name, email, sdt } = req.body;
            const customerInfo = new customer();
            const infoCus = await customerInfo.getInfoByIdCustomer(idUser);

            try {
                await customerInfo.checkExistedPhonenumber(sdt, infoCus.phoneNumber);
            }
            catch (err) {
                res.render('updateinfo', {
                    message: 'Số điện thoại đã tồn tại!',
                    title: 'Thông tin cá nhân',
                    infoLogin: passedVariable,
                    name: name,
                    email: email,
                    phoneNumber: sdt,
                    failure: "Cập nhật không thành công!"
                })
                return;
            }

            try {
                await customerInfo.checkExistedEmail(email, infoCus.email);
            }
            catch (err) {
                res.render('updateinfo', {
                    message: 'Email đã tồn tại!',
                    title: 'Thông tin cá nhân',
                    infoLogin: passedVariable,
                    name: name,
                    email: email,
                    phoneNumber: sdt,
                    failure: "Cập nhật không thành công!"
                })
                return;
            }

            await customerInfo.update(name, sdt, email, idCus);
            req.session.nameCustomer = name;
            res.render('updateinfo', {
                message: 'Cập nhật thành công!',
                title: 'Thông tin cá nhân',
                infoLogin: name,
                name: name,
                phoneNumber: sdt,
                email: email,
                success: "Cập nhật thành công!"
            });
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = new LoginController;