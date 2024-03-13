const statistics = require('../models/Statistics');
class StatisticsController {

    // [GET] /home
    async index(req, res) {
        try {
            const doanhthu = new statistics();
            const totalStatisticsYear = await doanhthu.totalStatisctics_year();
            var curYear = parseInt(totalStatisticsYear.replace(/,/g, ""));
            const totalStatisticsYear_Previous = await doanhthu.totalStatisctics_yearPrevious();
            var prevYear = parseInt(totalStatisticsYear_Previous.replace(/,/g, ""));
            if (isNaN(curYear)) curYear = 0;

            var trendIcon_updown_year;
            if (await (curYear - prevYear) / (prevYear) < 0) {
                trendIcon_updown_year = 'fa-caret-down'
            }
            else {
                trendIcon_updown_year = 'fa-caret-up'
            }

            const totalStatisticQuarter = await doanhthu.totalStatisctics_quarter();
            var curQuarter = parseInt(totalStatisticQuarter.replace(/,/g, ""))
            const totalStatisticsQuarter_Previous = await doanhthu.totalStatisctics_quarterPrevious();
            var prevQuarter = parseInt(totalStatisticsQuarter_Previous.replace(/,/g, ""));

            if (isNaN(curQuarter)) curQuarter = 0;
            var trendIcon_updown_quarter;
            if (await (curQuarter - prevQuarter) / (prevQuarter) < 0) {
                trendIcon_updown_quarter = 'fa-caret-down'
            }
            else {
                trendIcon_updown_quarter = 'fa-caret-up'
            }

            const totalStatisticMonth = await doanhthu.totalStatisctics_month();
            var curMonth = parseInt(totalStatisticMonth.replace(/,/g, ""))
            const totalStatisticsMonth_Previous = await doanhthu.totalStatisctics_monthPrevious();
            var prevMonth = parseInt(totalStatisticsMonth_Previous.replace(/,/g, ""));
            if (isNaN(curMonth)) curMonth = 0;

            var trendIcon_updown_month;
            if (await (curMonth - prevMonth) / (prevMonth) < 0) {
                trendIcon_updown_month = 'fa-caret-down'
            }
            else {
                trendIcon_updown_month = 'fa-caret-up'
            }

            const arrange_quarter = await doanhthu.totalStatistics_quarter_arranged();
            const arrange_month = await doanhthu.totalStatistics_month_arranged();

            
            const obj = {
                title: 'Thống kê doanh thu',
                total: await doanhthu.totalStatisctics() === "NaN" ? 0 : await doanhthu.totalStatisctics(),

                total_year: await doanhthu.totalStatisctics_year() === "NaN"   ? "0" : await doanhthu.totalStatisctics_year(),
                statisticsRate_year: (isNaN(prevYear)) ? 0 : Math.abs(await (curYear - prevYear) / (prevYear)).toFixed(2),
                trendIcon_year: trendIcon_updown_year,

                total_quarter: await doanhthu.totalStatisctics_quarter() === "NaN" ? "0" : await doanhthu.totalStatisctics_quarter(),
                statisticsRate_quarter: isNaN(prevQuarter) ? "0" : Math.abs(await (curQuarter - prevQuarter) / (prevQuarter)).toFixed(2),
                trendIcon_quarter: trendIcon_updown_quarter,

                total_month: await doanhthu.totalStatisctics_month() === "NaN" ? "0" : await doanhthu.totalStatisctics_month(),
                statisticsRate_month: isNaN(prevMonth) ? "0" : await Math.abs((curMonth - prevMonth) / (prevMonth)).toFixed(2),
                trendIcon_month: trendIcon_updown_month,

                firstProvince: arrange_quarter !== null ? arrange_quarter.firstProvince : "-",
                secondProvince: arrange_quarter !== null ? arrange_quarter.secondProvince : '-',
                totalPrice: arrange_quarter !== null ? (parseInt(arrange_quarter.sum)).toLocaleString('en-US') : '0',

                firstProvince_month: arrange_month !== null ? arrange_month.firstProvince : "-",
                secondProvince_month: arrange_month !== null ? arrange_month.secondProvince : '-',
                totalPrice_month: arrange_month !== null ? (parseInt(arrange_month.sum)).toLocaleString('en-US') : '0',
            }
            res.render('admin-TKDT', obj);
        }
        catch (err) {
            res.render('admin-TKDT', { title: 'Thống kê doanh thu', })
        }
    }
}

module.exports = new StatisticsController;
