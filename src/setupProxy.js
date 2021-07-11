/**
    * @description      : 接口代理
    * @author           : duxin
    * @group            : 
    * @created          : 11/07/2021 - 16:21:40
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 11/07/2021
    * - Author          : duxin
    * - Modification    : 
**/

const proxy = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(proxy('/public', {
        target: "yourHost",
        secure: false,
        changeOrigin: true,
        pathRewrite: {
            "^/public": "/"
        }
    }))
}
