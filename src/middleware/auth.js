const account = require('../app/models/Account');

module.exports.authCus = async function(req, res, next) {
    if(!req.session.userName) {
        res.redirect('/login');
        return;
    }

    try {
        const adminAcc = new account();
        await adminAcc.getAdminAcc(req.session.userName);
        req.session.destroy();
        res.redirect('/login');
        return;
    } 
    catch(err) {
        // console.log(err);
    }

    try {
        const cusAcc = new account();
        await cusAcc.getCusAcc(req.session.userName);
        next();
    }
    catch(err) {
        res.redirect('/login');
    }
}

module.exports.authAdmin = async function(req, res, next) {
    if(!req.session.userName) {
        res.redirect('/login');
        return;
    }

    try {
        const cusAcc = new account();
        await cusAcc.getCusAcc(req.session.userName);
        req.session.destroy();
        res.redirect('/login');
        return;
    } 
    catch(err) {
        // console.log(err);
    }
    
    try {
        const adminAcc = new account();
        await adminAcc.getAdminAcc(req.session.userName);
        next();
    }
    catch(err) {
        res.redirect('/login');
    }
}