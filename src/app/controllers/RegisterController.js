const Account = require('../models/Account');
const customer = require('../models/InforCustomer');
class RegisterController {

    // [GET] /home
    index(req, res) {
        const obj = {
            title: 'Đăng ký',
            infoLogin: 'Đăng nhập', 
        }
        res.render('register', obj);
    }
    
    async checkUser(req,res,next){
        const { username, password, phonenumber, fullname, email } = req.body;
        const infoCus = new customer();
        try {
            await infoCus.checkPhonenumber(phonenumber);
        }
        catch(err) {
            res.render('register', {
                title: 'Đăng ký',
                infoLogin: "Đăng nhập",
                message: "Số điện thoại đã tồn tại",
                failure: "Đăng ký không thành công!",
            });
            return;
        }

        try {
            await infoCus.checkEmail(email);
        }
        catch(err) {
            res.render('register', {
                title: 'Đăng ký',
                infoLogin: "Đăng nhập",
                message: "Email đã tồn tại",
                failure: "Đăng ký không thành công!",
            });
            return;
        }

        try {
            const account = new Account(username, password);
            console.log(password)
            const saveAcc = await account.save();

            const inforCustomer = new customer(saveAcc, phonenumber, fullname, email);
            const saveCus = await inforCustomer.save()

            req.session.userName = req.body.fullname;
            res.render('register', {
                title: 'Đăng ký',
                infoLogin: "Đăng nhập",
                message: "Đăng ký thành công",
                success: "Đăng ký thành công!",
            });
        } catch (err) {
            res.render('register', {
                title: 'Đăng ký',
                infoLogin: "Đăng nhập",
                message: "Tên tài khoản đã tồn tại",
                failure: "Đăng ký không thành công!",
            });
        }
    }
}

module.exports = new RegisterController;