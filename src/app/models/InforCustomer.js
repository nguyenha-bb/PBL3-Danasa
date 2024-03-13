const db = require('../../config/db');

class InforCustomer {
    constructor(idCustomer, phoneNumber, name, email) {
        this.idCustomer = idCustomer;
        this.phoneNumber = phoneNumber;
        this.name = name;
        this.email = email;
    }

    async checkConflict(){
        return new Promise((resolve, reject)=>{
            const query = `SELECT * FROM inforcustomer where phoneNumber = ? OR email = ?`;
            db.query(query, [this.phoneNumber, this.email], (err, results)=>{
                if(err){
                    return reject(err);
                }
                if(results.length > 0){
                    return reject(err); 
                }
                return resolve(results)
            })
        })
    }

    async save() {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO inforcustomer (idCustomer, phoneNumber, name, email) VALUES (?, ?, ?, ?)`;
            db.query(query, [this.idCustomer, this.phoneNumber, this.name, this.email], (err, results) => {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            });
        });
    }

    async update(name, phoneNumber, email, idCustomer) {
        return new Promise((resolve, reject) => {
            var query = `UPDATE inforcustomer SET name = ?, phoneNumber = ?, email = ? WHERE idCustomer = ?`;
            db.query(query, [name, phoneNumber, email, idCustomer], (err, results) => {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            });
        })
    }

    async search() {
        return new Promise((resolve, reject) => {
            var query = `SELECT * FROM inforcustomer WHERE name = ?`;
            db.query(query, [this.name], (err, results) => {
                if (err) {
                    return reject(err);
                }
                return resolve(results[0].idCustomer);
            });
        })
    }

    async getInfoByPhoneNumber(phoneNumber) {
        return new Promise((resolve, reject) => {
            var query = `SELECT * FROM inforcustomer INNER JOIN accounts ON idUser = idCustomer WHERE phoneNumber = ?`;
            db.query(query, [phoneNumber], (err, results) => {
                if (err) {
                    return reject(err);
                }
                if(results.length === 0) {
                    return reject(err);
                }
                return resolve(results[0]);
            });
        })
    }

    async getInfoByIdCustomer(id) {
        return new Promise((resolve, reject) => {
            var query = `SELECT * FROM inforcustomer INNER JOIN accounts ON idUser = idCustomer WHERE idCustomer = ?`;
            db.query(query, [id], (err, results) => {
                if (err) {
                    return reject(err);
                }
                if(results.length === 0) {
                    return reject(err);
                }
                return resolve(results[0]);
            });
        })
    }

    async deleteInfo(phonenumber) {
        return new Promise((resolve, reject) => {
            var query = `DELETE FROM inforcustomer WHERE phoneNumber = ?`;
            db.query(query, [phonenumber], (err, results) => {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            });
        })
    }

    async checkExistedPhonenumber(phonenumber, old) {
        return new Promise(async (resolve, reject) => {
            var query = `select * FROM inforcustomer WHERE phoneNumber = ? AND phoneNumber NOT IN (select phoneNumber from inforcustomer where phoneNumber = ?)`;
            db.query(query, [phonenumber, old], (err, results) => {
                if (err) {
                    return reject(err);
                }
                if(results.length !== 0) return reject(err);
                return resolve(results);
            });
        })
    }

    async checkExistedEmail(email, old) {
        return new Promise(async (resolve, reject) => {
            var query = `select * FROM inforcustomer WHERE phoneNumber = ? AND phoneNumber NOT IN (select phoneNumber from inforcustomer where phoneNumber = ?)`;            db.query(query, [email, old], (err, results) => {
                if (err) {
                    return reject(err);
                }
                if(results.length !== 0) return reject(err);
                return resolve(results);
            });
        })
    }

    async checkPhonenumber(phonenumber) {
        return new Promise(async (resolve, reject) => {
            var query = `select * FROM inforcustomer WHERE phoneNumber = ?`;
            db.query(query, [phonenumber], (err, results) => {
                if (err) {
                    return reject(err);
                }
                if(results.length !== 0) return reject(err);
                return resolve(results);
            });
        })
    }

    async checkEmail(email) {
        return new Promise(async (resolve, reject) => {
            var query = `select * FROM inforcustomer WHERE email = ?`;
            db.query(query, [email], (err, results) => {
                if (err) {
                    return reject(err);
                }
                if(results.length !== 0) return reject(err);
                return resolve(results);
            });
        })
    }
}

module.exports = InforCustomer;