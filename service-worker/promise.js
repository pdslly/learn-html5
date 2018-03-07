const fs = require('fs')

var files = ['index.html', 'sw.js']

Promise.all(
    files.map(function (path) {
        return new Promise(function (resolve, reject) {
            fs.readFile(path, function (err, data) {
                if (err) return reject(err)
                resolve({data, path})
            })
        })
    })
).then(function (res) {
    console.log(res)
})