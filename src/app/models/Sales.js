const db = require('../../config/db');
const province = require('./Province')

class Sales {
    async totalSales() {
        return new Promise((resolve, reject) => {
            const total = `SELECT COUNT(idTicket) FROM tickets INNER JOIN schedules ON tickets.idSchedule = schedules.idSchedule`;
            db.query(total, (err, results) => {
                if (err) {
                    return reject(err);
                }
                else if (results.length === 0) {
                    return reject(new Error('No data found'));
                }
                return resolve((parseInt(results[0]['COUNT(idTicket)'])).toLocaleString('en-US'));
            })
        })
    }

    async totalSales_year() {
        return new Promise((resolve, reject) => {
            const total = `SELECT COUNT(idTicket) FROM tickets INNER JOIN schedules ON tickets.idSchedule = schedules.idSchedule WHERE YEAR(startTime) = YEAR(CURDATE())`;
            db.query(total, (err, results) => {
                if (err) {
                    return reject(err);
                }
                else if (results.length === 0) {
                    return reject(new Error('No data found for this year'));
                }
                return resolve((parseInt(results[0]['COUNT(idTicket)'])).toLocaleString('en-US'));
            })
        })
    }

    async totalSales_yearPrevious() {
        return new Promise((resolve, reject) => {
            const total = `SELECT COUNT(idTicket) FROM tickets INNER JOIN schedules ON tickets.idSchedule = schedules.idSchedule WHERE YEAR(startTime) = (YEAR(CURDATE()) - 1)`;
            db.query(total, (err, results) => {
                if (err) {
                    return reject(err);
                }
                else if (results.length === 0) {
                    return reject(new Error('No data found for this year'));
                }
                return resolve((parseInt(results[0]['COUNT(idTicket)'])).toLocaleString('en-US'));
            })
        })
    }

    /*---------------*/
    async totalSales_quarter() {
        return new Promise((resolve, reject) => {
            const total = `SELECT COUNT(idTicket) FROM tickets INNER JOIN schedules ON tickets.idSchedule = schedules.idSchedule WHERE QUARTER(startTime) = QUARTER(CURDATE()) AND YEAR(startTime) = YEAR(CURDATE())`;
            db.query(total, (err, results) => {
                if (err) {
                    return reject(err);
                }
                else if (results.length === 0) {
                    return reject(new Error('No data found for this quarter'));
                }
                return resolve((parseInt(results[0]['COUNT(idTicket)'])).toLocaleString('en-US'));
            })
        })
    }

    async totalSales_quarterPrevious() {
        return new Promise((resolve, reject) => {
            const total = `SELECT COUNT(idTicket) FROM tickets INNER JOIN schedules ON tickets.idSchedule = schedules.idSchedule WHERE QUARTER(startTime) = (QUARTER(CURDATE()) - 1)  AND YEAR(startTime) = YEAR(CURDATE())`;
            db.query(total, (err, results) => {
                if (err) {
                    return reject(err);
                }
                else if (results.length === 0) {
                    return reject(new Error('No data found for this quarter'));
                }
                return resolve((parseInt(results[0]['COUNT(idTicket)'])).toLocaleString('en-US'));
            })
        })
    }

    /*---------------*/
    async totalSales_month() {
        return new Promise((resolve, reject) => {
            const total = `SELECT COUNT(idTicket) FROM tickets INNER JOIN schedules ON tickets.idSchedule = schedules.idSchedule WHERE MONTH(startTime) = MONTH(CURDATE()) AND YEAR(startTime) = YEAR(CURDATE())`;
            db.query(total, (err, results) => {
                if (err) {
                    return reject(err);
                }
                else if (results.length === 0) {
                    return reject(new Error('No data found for this month'));
                }
                return resolve((parseInt(results[0]['COUNT(idTicket)'])).toLocaleString('en-US'));
            })
        })
    }

    async totalSales_monthPrevious() {
        return new Promise((resolve, reject) => {
            const total = `SELECT COUNT(idTicket) FROM tickets INNER JOIN schedules ON tickets.idSchedule = schedules.idSchedule WHERE MONTH(startTime) = (MONTH(CURDATE()) - 1) AND YEAR(startTime) = YEAR(CURDATE())`;
            db.query(total, (err, results) => {
                if (err) {
                    return reject(err);
                }
                else if (results.length === 0) {
                    return reject(new Error('No data found for this month'));
                }
                return resolve((parseInt(results[0]['COUNT(idTicket)'])).toLocaleString('en-US'));
            })
        })
    }

    /*---------------*/
    async totalSales_quarter_arranged() {
        return new Promise((resolve, reject) => {
            const sales_quarter_arranged = `SELECT LEAST(idFirstProvince, idSecondProvince) AS province1,
                                            GREATEST(idFirstProvince, idSecondProvince) AS province2,
                                            COUNT(idTicket) AS totalTicket
                                            FROM tickets
                                            INNER JOIN schedules ON tickets.idSchedule = schedules.idSchedule
                                            INNER JOIN directedroutes ON directedroutes.iddirectedroutes = schedules.idDirectedRoute
                                            INNER JOIN routes ON routes.idRoute = directedroutes.idRoute
                                            WHERE quarter(startTime) = quarter(CURDATE()) AND YEAR(startTime) = YEAR(CURDATE())
                                            GROUP BY province1, province2
                                            ORDER BY totalTicket desc
                                            LIMIT 1`;
            db.query(sales_quarter_arranged, async (err, results) => {
                if (err) {
                    return reject(err);
                }
                else if (results.length === 0) {
                    return resolve(null);
                }
                const provinces = new province();
                return resolve({
                    firstProvince: await provinces.getNameProvinceByID(results[0].province1),
                    secondProvince: await provinces.getNameProvinceByID(results[0].province2),
                    sum: results[0].totalTicket
                });
            })
        })
    }

    /*---------------*/
    async totalSales_month_arranged() {
        return new Promise((resolve, reject) => {
            const sales_month_arranged = `SELECT LEAST(idFirstProvince, idSecondProvince) AS province1,
                                            GREATEST(idFirstProvince, idSecondProvince) AS province2,
                                            COUNT(idTicket) AS totalTicket FROM tickets
                                            INNER JOIN schedules ON tickets.idSchedule = schedules.idSchedule
                                            INNER JOIN directedroutes ON directedroutes.iddirectedroutes = schedules.idDirectedRoute
                                            INNER JOIN routes ON routes.idRoute = directedroutes.idRoute
                                            WHERE MONTH(startTime) = MONTH(CURDATE()) AND YEAR(startTime) = YEAR(CURDATE())
                                            GROUP BY province1, province2
                                            ORDER BY totalTicket desc
                                            LIMIT 1`;
            db.query(sales_month_arranged, async (err, results) => {
                if (err) {
                    return reject(err);
                }
                else if (results.length === 0) {
                    return resolve(null);
                }
                const provinces = new province();
                return resolve({
                    firstProvince: await provinces.getNameProvinceByID(results[0].province1),
                    secondProvince: await provinces.getNameProvinceByID(results[0].province2),
                    sum: results[0].totalTicket
                });
            })
        })
    }

    /*---------------*/

    async listSales_quarter_arranged(idSort) {
        return new Promise((resolve, reject) => {
            var sales_quarter_arranged = `SELECT LEAST(idFirstProvince, idSecondProvince) AS province1,
                                        GREATEST(idFirstProvince, idSecondProvince) AS province2,
                                        COUNT(idTicket) AS totalTicket
                                        FROM tickets
                                        INNER JOIN schedules ON tickets.idSchedule = schedules.idSchedule
                                        INNER JOIN directedroutes ON directedroutes.iddirectedroutes = schedules.idDirectedRoute
                                        INNER JOIN routes ON routes.idRoute = directedroutes.idRoute
                                        WHERE quarter(startTime) = quarter(CURDATE()) AND YEAR(startTime) = YEAR(CURDATE())
                                        GROUP BY province1, province2`
            if (idSort === "1") sales_quarter_arranged += ` ORDER BY totalTicket desc`
            else if (idSort === "2") sales_quarter_arranged += ` ORDER BY totalTicket ASC`
            db.query(sales_quarter_arranged, async (err, results) => {
                if (err) {
                    return reject(err);
                }
                else if (results.length === 0) {
                    return resolve(null);
                }
                const provinces = new province();
                const promises = results.map(async (salesItem, index) => {
                    var STT = index + 1;
                    const firstProvincePromise = provinces.getNameProvinceByID(salesItem.province1);
                    const secondProvincePromise = provinces.getNameProvinceByID(salesItem.province2);
                    const [firstProvince, secondProvince] = await Promise.all([firstProvincePromise, secondProvincePromise]);
                    return {
                        STT: STT,
                        firstProvince: firstProvince,
                        secondProvince: secondProvince,
                        totalTicket: parseInt(salesItem.totalTicket).toLocaleString('en-US'),
                    };
                });
                const sales = await Promise.all(promises);
                return resolve(sales);
            })
        })
    }

    /*---------------*/
    async listSales_month_arranged(idSort) {
        return new Promise((resolve, reject) => {
            var sales_month_arranged = `SELECT LEAST(idFirstProvince, idSecondProvince) AS province1,
                                        GREATEST(idFirstProvince, idSecondProvince) AS province2,
                                        COUNT(idTicket) AS totalTicket FROM tickets
                                        INNER JOIN schedules ON tickets.idSchedule = schedules.idSchedule
                                        INNER JOIN directedroutes ON directedroutes.iddirectedroutes = schedules.idDirectedRoute
                                        INNER JOIN routes ON routes.idRoute = directedroutes.idRoute
                                        WHERE MONTH(startTime) = MONTH(CURDATE()) AND YEAR(startTime) = YEAR(CURDATE())
                                        GROUP BY province1, province2`
            if (idSort === "1") sales_month_arranged += ` ORDER BY totalTicket desc`
            else if (idSort === "2") sales_month_arranged += ` ORDER BY totalTicket ASC`
            try{
                db.query(sales_month_arranged, async (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    else if (results.length === 0) {
                        return resolve(null);
                    }
                    const provinces = new province();
                    const promises = results.map(async (salesItem, index) => {
                        var STT = index + 1;
                        const firstProvincePromise = provinces.getNameProvinceByID(salesItem.province1);
                        const secondProvincePromise = provinces.getNameProvinceByID(salesItem.province2);
                        const [firstProvince, secondProvince] = await Promise.all([firstProvincePromise, secondProvincePromise]);
                        return {
                            STT: STT,
                            firstProvince_month: firstProvince,
                            secondProvince_month: secondProvince,
                            totalTicket_month: parseInt(salesItem.totalTicket).toLocaleString('en-US'),
                        };
                    });
                    const sales = await Promise.all(promises);
                    return resolve(sales);
                })

            }
            catch{
                console.log(err)
            }
        })
    }
}

module.exports = Sales