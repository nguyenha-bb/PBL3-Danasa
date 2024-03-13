const Station = require("../models/Station");
class DeleteStationController{
    index(req,res){
        const id = req.params.id;
        new Station().getInfoStationById(id)
            .then((station)=>{
                res.render('admin-xoaBen',{
                    title: 'Xóa bến xe',
                    station: station,
                })
            })
            .catch(err => {
                console.error(err);
                res.render('errorPage',{
                  title: 'Error',
                })
              })
    }
    delete(req,res){
        const id = req.params.id;
        new Station().deleteStation(id)
            .then(()=>{
                req.flash('success', 'Xóa thành công!');
                res.redirect('/admin/list-station');
            })
            .catch(err => {
                console.error(err);
                res.render('errorPage',{
                    title: 'Error'
                  });
            })
    }
}
module.exports = new DeleteStationController;