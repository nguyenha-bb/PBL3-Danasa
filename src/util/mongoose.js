module.exports = {
    mutipleMongooseToObject: function(mongooes){
        return mongooes.map(mongooes => mongooes.toObject());
    },
    mongooseToObject: function(mongooes){
        return mongooes ? mongooes.toObject() : mongooes
    }   
}