// export const requestUrl = "http://8.135.107.120:8000";
export const requestUrl = "http://192.168.2.75:8000";
export const onlyFormat = (timeStamp, type) => {
  if (!timeStamp) return;
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

/**
 * 获取当月的收尾日期
 * @param {*} type 为1，返回第一天；为2,返回第二天
 */
export function getMonthFE(type) {
  var nowDate = new Date();
  var cloneNowDate = new Date();
  var fullYear = nowDate.getFullYear();
  var month = nowDate.getMonth() + 1; // getMonth 方法返回 0-11，代表1-12月
  var endOfMonth = new Date(fullYear, month, 0).getDate(); // 获取本月最后一天
  function getFullDate(targetDate) {
    var D, y, m, d;
    if (targetDate) {
      D = new Date(targetDate);
      y = D.getFullYear();
      m = D.getMonth() + 1;
      d = D.getDate();
    } else {
      y = fullYear;
      m = month;
      d = cloneNowDate.setDate(1);
    }
    m = m > 9 ? m : '0' + m;
    d = d > 9 ? d : '0' + d;
    return y + '-' + m + '-' + d;
  };
  var endDate = getFullDate(cloneNowDate.setDate(endOfMonth));//当月最后一天
  var starDate = getFullDate(cloneNowDate.setDate(1));//当月第一天

  if (type == 1) { return starDate }
  return endDate
}
