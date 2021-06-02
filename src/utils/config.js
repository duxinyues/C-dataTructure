// export const requestUrl = "http://8.135.107.120:8000";
export const requestUrl = "http://192.168.0.14:8000";
export const onlyFormat = (timeStamp, type) => {
    if(!timeStamp)return;
    var date = new Date(timeStamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    if (type) return Y + M + D + " " + h + m + s;
    return Y + M + D
};


// 入库单类型
export const stockType = ["采购入库", "调拨入库", "退料入库", "加工入库", "其他入库"]
// 出库单据类型
export const stockOutType = ["调拨出库", "销售出库", "退纱出库"]



//获取今天日期，格式YYYY-MM-DD
export function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
  }
