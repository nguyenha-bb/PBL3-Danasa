const db = require('../../config/db');
const province = require('../models/Province')

class Statistics {
    async totalStatisctics() {
        return new Promise((resolve, reject) => {
            const total = `SELECT SUM(price) FROM tickets INNER JOIN schedules ON tickets.idSchedule = schedules.idSchedule`;
            db.query(total, (err, results) => {
                if (err) {
                    return reject(err);
                }
                else if (results.length === 0) {
                    return reject(new Error('No data found'));
                }
                return resolve((parseInt(results[0]['SUM(price)'])).toLocaleString('en-US'));
            })
        })
    }

    async totalStatisctics_year() {
        return new Promise((resolve, reject) => {
            const total = `SELECT SUM(price) FROM tickets INNER JOIN schedules ON tickets.idSchedule = schedules.idSchedule WHERE YEAR(startTime) = YEAR(CURDATE())`;
            db.query(total, (err, results) => {
                if (err) {
                    return reject(err);
                }
                else if (results.length === 0) {
                    return reject(new Error('No data found for this year'));
                }
                return resolve((parseInt(results[0]['SUM(price)'])).toLocaleString('en-US'));
            })
        })
    }

    async totalStatisctics_yearPrevious() {
        return new Promise((resolve, reject) => {
            const total = `SELECT SUM(price) FROM tickets INNER JOIN schedules ON tickets.idSchedule = schedules.idSchedule WHERE YEAR(startTime) = (YEAR(CURDATE()) - 1)`;
            db.query(total, (err, results) => {
                if (err) {
                    return reject(err);
                }
                else if (results.length === 0) {
                    return reject(new Error('No data found for this year'));
                }
                return resolve((parseInt(results[0]['SUM(price)'])).toLocaleString('en-US'));
            })
        })
    }

    /*---------------*/
    async totalStatisctics_quarter() {
        return new Promise((resolve, reject) => {
            const total = `SELECT SUM(price) FROM tickets INNER JOIN schedules ON tickets.idSchedule = schedules.idSchedule WHERE QUARTER(startTime) = QUARTER(CURDATE()) AND YEAR(startTime) = YEAR(CURDATE())`;
            db.query(total, (err, results) => {
                if (err) {
                    return reject(err);
                }
                else if (results.length === 0) {
                    return reject(new Error('No data found for this quarter'));
                }
                return resolve((parseInt(results[0]['SUM(price)'])).toLocaleString('en-US'));
            })
        })
    }

    async totalStatisctics_quarterPrevious() {
        return new Promise((resolve, reject) => {
            const total = `SELECT SUM(price) FROM tickets INNER JOIN schedules ON tickets.idSchedule = schedules.idSchedule WHERE QUARTER(startTime) = (QUARTER(CURDATE()) - 1) AND YEAR(startTime) = YEAR(CURDATE())`;
            db.query(total, (err, results) => {
                if (err) {
                    return reject(err);
                }
                else if (results.length === 0) {
                    return reject(new Error('No data found for this quarter'));
                }
                return resolve((parseInt(results[0]['SUM(price)'])).toLocaleString('en-US'));
            })
        })
    }

    /*---------------*/
    async totalStatisctics_month() {
        return new Promise((resolve, reject) => {
            const total = `SELECT SUM(price) FROM tickets INNER JOIN schedules ON tickets.idSchedule = schedules.idSchedule WHERE MONTH(startTime) = MONTH(CURDATE()) AND YEAR(startTime) = YEAR(CURDATE())`;
            db.query(total, (err, results) => {
                if (err) {
                    return reject(err);
                }
                else if (results.length === 0) {
                    return reject(new Error('No data found for this month'));
                }
                return resolve((parseInt(results[0]['SUM(price)'])).toLocaleString('en-US'));
            })
        })
    }

    async totalStatisctics_monthPrevious() {
        return new Promise((resolve, reject) => {
            const total = `SELECT SUM(price) FROM tickets INNER JOIN schedules ON tickets.idSchedule = schedules.idSchedule WHERE MONTH(startTime) = (MONTH(CURDATE()) - 1) AND YEAR(startTime) = YEAR(CURDATE())`;
            db.query(total, (err, results) => {
                if (err) {
                    return reject(err);
                }
                else if (results.length === 0) {
                    return reject(new Error('No data found for this month'));
                }
                return resolve((parseInt(results[0]['SUM(price)'])).toLocaleString('en-US'));
            })
        })
    }

    /*---------------*/
    async totalStatistics_quarter_arranged() {
        return new Promise((resolve, reject) => {
            const statistic_quarter_arranged = `SELECT LEAST(idFirstProvince, idSecondProvince) AS province1,
                                                GREATEST(idFirstProvince, idSecondProvince) AS province2,
                                                SUM(price) AS totalPrice
                                                FROM tickets
                                                INNER JOIN schedules ON tickets.idSchedule = schedules.idSchedule
                                                INNER JOIN directedroutes ON directedroutes.iddirectedroutes = schedules.idDirectedRoute
                                                INNER JOIN routes ON routes.idRoute = directedroutes.idRoute
                                                WHERE quarter(startTime) = quarter(CURDATE()) AND YEAR(startTime) = YEAR(CURDATE())
                                                GROUP BY province1, province2
                                                ORDER BY totalPrice desc
                                                LIMIT 1`;
            db.query(statistic_quarter_arranged, async (err, results) => {
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
                    sum: results[0].totalPrice
                });
            })
        })
    }

    /*---------------*/
    async totalStatistics_month_arranged() {
        return new Promise((resolve, reject) => {
            const statistic_month_arranged = `SELECT LEAST(idFirstProvince, idSecondProvince) AS province1,
                                                GREATEST(idFirstProvince, idSecondProvince) AS province2,
                                                SUM(price) AS totalPrice FROM tickets
                                                INNER JOIN schedules ON tickets.idSchedule = schedules.idSchedule
                                                INNER JOIN directedroutes ON directedroutes.iddirectedroutes = schedules.idDirectedRoute
                                                INNER JOIN routes ON routes.idRoute = directedroutes.idRoute
                                                WHERE MONTH(startTime) = MONTH(CURDATE()) AND YEAR(startTime) = YEAR(CURDATE())
                                                GROUP BY province1, province2
                                                ORDER BY totalPrice desc
                                                LIMIT 1`;
            db.query(statistic_month_arranged, async (err, results) => {
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
                    sum: results[0].totalPrice
                });
            })
        })
    }

    /*---------------*/
    async listStatistics_quarter_arranged(idSort) {
        return new Promise((resolve, reject) => {
            var statistic_quarter_arranged = `SELECT LEAST(idFirstProvince, idSecondProvince) AS province1,
                                                GREATEST(idFirstProvince, idSecondProvince) AS province2,
                                                SUM(price) AS totalPrice
                                                FROM tickets
                                                INNER JOIN schedules ON tickets.idSchedule = schedules.idSchedule
                                                INNER JOIN directedroutes ON directedroutes.iddirectedroutes = schedules.idDirectedRoute
                                                INNER JOIN routes ON routes.idRoute = directedroutes.idRoute
                                                WHERE quarter(startTime) = quarter(CURDATE()) AND YEAR(startTime) = YEAR(CURDATE())
                                                GROUP BY province1, province2`
            if (idSort === "1") statistic_quarter_arranged += ` ORDER BY totalPrice desc`
            else if (idSort === "2") statistic_quarter_arranged += ` ORDER BY totalPrice ASC`
            db.query(statistic_quarter_arranged, async (err, results) => {
                if (err) {
                    return reject(err);
                } else if (results.length === 0) {
                    return resolve(null);
                }
                const provinces = new province();
                const promises = results.map(async (statisticsItem, index) => {
                    var STT = index + 1;
                    const firstProvincePromise = provinces.getNameProvinceByID(statisticsItem.province1);
                    const secondProvincePromise = provinces.getNameProvinceByID(statisticsItem.province2);
                    const [firstProvince, secondProvince] = await Promise.all([firstProvincePromise, secondProvincePromise]);
                    return {
                        STT: STT,
                        firstProvince: firstProvince,
                        secondProvince: secondProvince,
                        totalPrice: parseInt(statisticsItem.totalPrice).toLocaleString('en-US'),
                    };
                });
                const statistics = await Promise.all(promises);
                return resolve(statistics);
            });
        })
    }

    /*---------------*/
    async listStatistics_month_arranged(idSort) {
        return new Promise((resolve, reject) => {
            var statistic_month_arranged = `SELECT LEAST(idFirstProvince, idSecondProvince) AS province1,
                                            GREATEST(idFirstProvince, idSecondProvince) AS province2,
                                            SUM(price) AS totalPrice FROM tickets
                                            INNER JOIN schedules ON tickets.idSchedule = schedules.idSchedule
                                            INNER JOIN directedroutes ON directedroutes.iddirectedroutes = schedules.idDirectedRoute
                                            INNER JOIN routes ON routes.idRoute = directedroutes.idRoute
                                            WHERE MONTH(startTime) = MONTH(CURDATE()) AND YEAR(startTime) = YEAR(CURDATE())
                                            GROUP BY province1, province2`
            if (idSort === "1") statistic_month_arranged += ` ORDER BY totalPrice desc`
            else if (idSort === "2") statistic_month_arranged += ` ORDER BY totalPrice ASC`
            db.query(statistic_month_arranged, async (err, results) => {
                if (err) {
                    return reject(err);
                } else if (results.length === 0) {
                    return resolve(null);
                }
                const provinces = new province();
                const promises = results.map(async (statisticsItem, index) => {
                    var STT = index + 1;
                    const firstProvincePromise = provinces.getNameProvinceByID(statisticsItem.province1);
                    const secondProvincePromise = provinces.getNameProvinceByID(statisticsItem.province2);
                    const [firstProvince, secondProvince] = await Promise.all([firstProvincePromise, secondProvincePromise]);
                    return {
                        STT: STT,
                        firstProvince_month: firstProvince,
                        secondProvince_month: secondProvince,
                        totalPrice_month: parseInt(statisticsItem.totalPrice).toLocaleString('en-US'),
                    };
                });
                const statistics = await Promise.all(promises);
                return resolve(statistics);
            });
        })
    }
}

module.exports = Statistics
