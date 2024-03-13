class errorController{
    error(req,res){
        res.render('errorPage',{
            title: 'Error'
        })
    }
}
module.exports = new errorController;