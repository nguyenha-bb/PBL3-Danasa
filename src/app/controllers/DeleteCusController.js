const account = require('../models/Account');
const customer = require('../models/InforCustomer');
class DeleteCusController {

    // [GET] /home
    index(req, res) {
        res.render('admin-xoaTK', {title: 'Xóa tài khoản'});
        // else {
        //     const obj = {
        //         infoLogin: 'Đăng nhập', 
        //     }
        //     res.render('home', obj);
        // }
    }

    // [GET] /delete-cus/:id
    async indexDetail(req, res) {
        try {
            const idCus = req.params.id;
            const cus = new customer();
            const infoCus = await cus.getInfoByIdCustomer(Number(idCus));
            res.render('admin-xoaTK', {
                username: infoCus.userName,
                name: infoCus.name,
                phonenumber: infoCus.phoneNumber,
                email: infoCus.email,
                title: 'Xóa tài khoản'
            });
        }
        catch(err) {
            res.render('errorPage', {
                title: 'Error',
            });
        }
    }

    deleteCus(req, res) {

    }

    // [GET] /delete-cus/search/:slug
    async loadData(req, res) {
        try {
            const phoneNumber = req.body.phonenumber;
            const cus = new customer();
            const infocus = await cus.getInfoByPhoneNumber(phoneNumber);
            res.render('admin-xoaTK', {
                username: infocus.userName,
                name: infocus.name,
                phonenumber: infocus.phoneNumber,
                email: infocus.email,
                title: 'Xóa tài khoản'
            });
        }
        catch(err) {
            // console.log("Lỗi server");
            res.render('admin-xoaTK', {
                title: 'Xóa tài khoản',
                message: 'Không tồn tại tài khoản!',
                failure: "Oops...Có lỗi xảy ra!",
            })
        }
    }

    async delete(req, res) {
        try {
            const phonenumber = req.body.phonenumber;
            const cus = new customer();
            const infocus = await cus.getInfoByPhoneNumber(phonenumber);
            const username = infocus.userName;
            const acc = new account();
            // await cus.deleteInfo(phonenumber);
            await acc.deleteAccount(username);
            req.flash('success', 'Xóa thành công!');
            res.redirect('/admin/list-cus');
        }
        catch(err) {
            res.render('errorPage', {
                title: 'Error',
            });
        }

    }

    
}

module.exports = new DeleteCusController;
