class ContactController{

    // [GET] /contact
    index(req, res){
        const passedVariable = req.session.nameCustomer;
        if(passedVariable != null) {
            const obj = {
                title: 'Liên hệ',
                infoLogin: passedVariable, 
            }
            res.render('contact', obj);
        } else {
            const obj = {
                title: 'Liên hệ',
                infoLogin: 'Đăng nhập', 
            }
            res.render('contact', obj);
        }
    }

    //[GET]/buy-ticket-step2/:slug
    show(req, res){
        res.send('Detail');
    }
}

module.exports = new ContactController;