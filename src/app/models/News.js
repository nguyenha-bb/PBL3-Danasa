const db = require('../../config/db');

class News {
    constructor(idNews, titleNews, contentNews, urlImg) {
        this.idNews = idNews;
        this.titleNews = titleNews;
        this.contentNews = contentNews;
        this.urlImg = urlImg;
    }

    async loadNews() {
        return new Promise((resolve, reject) => {
            const checkQuery = `SELECT * FROM news`;
            db.query(checkQuery, (err, results) => {
                if (err) {
                    return reject(err);
                }
                if(results.length === 0) {
                    return reject(err);
                }
                else {
                    const news = results.map(newsItem => {
                        return {
                            idNews: newsItem.idNews,
                            titleNews: newsItem.titleNews,
                            contentNews: newsItem.contentNews,
                            urlImg: `/img/${newsItem.urlImg}`
                        };
                    });
                    return resolve(news);
                }
            });
        });
    }

    async countNews() {
        return new Promise((resolve, reject) => {
            const maxID = `SELECT MAX(idNews) FROM news`;
            db.query(maxID, (err, results) => {
                if (err) {
                    return reject(err);
                }
                if(results.length === 0) {
                    return reject(err);
                }
                else {
                    return resolve(results[0]['MAX(idNews)'] + 1);
                }
            });
        });
    }

    async createNews() {
        return new Promise((resolve, reject) => {
            const createQuery = `INSERT INTO news (idNews, titleNews, contentNews, urlImg) VALUES (?, ?, ?, ?)`;
            db.query(createQuery, [this.idNews, this.titleNews, this.contentNews, this.urlImg], (err, results) => {
                if (err) {
                    return reject(err);
                }
                return resolve(results[0]);
            })
        })
    }

    async searchNews() {
        return new Promise((resolve, reject) => {
            const searchQuery = `SELECT * FROM news WHERE idNews = ?`;
            db.query(searchQuery, [Number(this.idNews)], (err, results) => {
                if (err) {
                    return reject(err);
                }
                if(results.length === 0) {
                    return reject(err);
                }
                console.log(results[0])
                return resolve(results[0]);
            })
        })
    }

    async deleteNews() {
        return new Promise((resolve, reject) => {
            const deleteQuery = `DELETE FROM news where idNews = ?`;
            db.query(deleteQuery, [Number(this.idNews)], (err, results) => {
                if (err) {
                    return reject(err);
                }
                if(results.length === 0) {
                    return reject(err);
                }
                return resolve(results[0]);
            })
        })
    }

    async editNews() {
        return new Promise((resolve, reject) => {
            const editQuery = `UPDATE news SET titleNews = ?, contentNews = ?, urlImg = ? WHERE idNews = ?`;
            db.query(editQuery, [this.titleNews, this.contentNews, this.urlImg, this.idNews], (err, results) => {
                if (err) {
                    return reject(err);
                }
                if(results.length === 0) {
                    return reject(err);
                }
                return resolve(results);
            })
        })
    }
}

module.exports = News;
