const Station = require("../models/Station");
class EditStationController {
    index(req, res) {
        const id = req.params.id;
        new Station().getInfoStationById(id)
            .then((station)=>{
                res.render('admin-suaBen',{
                    title: 'Sửa bến xe',
                    station: station,
                })
            })
            .catch(err => {
                console.error(err);
                res.render('errorPage',{
                  title: 'Error'
                });
              });    
    }
    edit(req, res) {
        const id = req.params.id;
        const nameStation = req.body["namestation"];
        var check = true;
        new Station().getAllStationByIdStation(id)
            .then((stations) => {
                for (var x of stations) {
                    if (x.idStation == id) continue;
                    if (x.stationName == nameStation) {
                        check = false;
                        break;
                    }
                }
                //success
                return new Promise(function (resolve, reject) {
                    if (check) return resolve();
                    else return reject();
                })
            })
            .then(() => {
                new Station().editStation(id, nameStation)
            })
            .then(() => {
                req.flash('success', 'Cập nhật thành công!');
                res.redirect('/admin/list-station');
            })
            .catch(err => {
                if (!check) res.redirect(`/admin/edit-station/${id}/fail`);
                else {
                    console.error(err);
                    res.render('errorPage',{
                        title: 'Error'
                      });
                }
            })
    }
    fail(req, res) {
        const id = req.params.id;
        new Station().getInfoStationById(id)
            .then((station)=>{
                res.render('admin-suaBen',{
                    title: 'Sửa bến xe',
                    station: station,
                    message: 'Tên bến xe đã tồn tại',
                    failure: "Cập nhật không thành công!",
                })
            })
            .catch(err => {
                console.error(err);
                res.render('errorPage',{
                  title: 'Error'
                });
              });    
    }
}
module.exports = new EditStationController;