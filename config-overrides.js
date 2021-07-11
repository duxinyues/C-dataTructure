/**
    * @description      : 
    * @author           : duxin
    * @group            : 
    * @created          : 11/07/2021 - 16:27:40
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 11/07/2021
    * - Author          : duxin
    * - Modification    : 
**/

const { override, adjustStyleLoaders, fixBabelImports } = require("customize-cra");
// 使用ant-design搭建React+ts项目，可在此重重定义antd全局样式
module.exports = override(
    // ...其他配置...
    adjustStyleLoaders(rule => {
        if (rule.test.toString().includes("scss")) {
            rule.use.push({
                loader: require.resolve("sass-resources-loader"),
                options: {
                    //   resources: "./src/assets/scss/output.scss" //这里是你自己放公共scss变量的路径
                }
            });
        }
    }),
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: 'css',
    })
);