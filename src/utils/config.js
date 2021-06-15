
export const requestUrl = "http://39.104.13.107:8000";
// export const requestUrl = "http://192.168.2.81:8000";
export const onlyFormat = (timeStamp, type) => {
  if (!timeStamp) return;
  var date = new Date(timeStamp);
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
export const orderType = [{ id: 1, title: "进行中" }, { id: 2, title: "未审核" }, { id: 3, title: "已完工" }, { id: 3, title: "已作废" }]
export const orderSearch = [
  { key: 1, title: "生产单号", type: "code" },
  { key: 2, title: "客户", type: "customerName" },
  { key: 3, title: "合同号", type: "customerBillCode" },
  { key: 4, title: "下单日期", type: "beginTime" },
  { key: 5, title: "坯布编码", type: "greyFabricCode" },
  { key: 6, title: "布类", type: "fabricType" },
  { key: 7, title: "针数", type: "needles" },
  { key: 8, title: "寸数", type: "inches" },
  { key: 8, title: "总针数", type: "totalInches" },
  { key: 8, title: "规格", type: "techType" },
  { key: 8, title: "备注", type: "remark" },
  { key: 8, title: "纱支", type: "yarnName" },
  { key: 8, title: "批次", type: "yarnBrandBatch" },
  { key: 8, title: "机号", type: "loomId" },
  { key: 8, title: "条码", type: "barcode" },
  { key: 8, title: "类型", type: "type" },
]

export const newOrderType = [{ key: 1, name: "开幅" }, { key: 2, name: "抽针" }, { key: 3, name: "圆筒" }]

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
/**
 * 
 * @param {*} array  数组
 * @param {*} num  自定义数组长度
 * @returns 
 */
export function sliceArrFn(array,num) {
  var result = [];
  for (var x = 0; x < Math.ceil(array.length / num); x++) {
    var start = x * num;
    var end = start + num;
    result.push(array.slice(start, end));
  }
  return result;
}

// 数组求和
export const sum = (array) => {
  var sum = 0;
  array.forEach(ele => {
    sum += ele.weight
  });
  return sum;
}


export const  checkPhone=(phone)=>{ 
  if((/^1(3|4|5|6|7|8|9)\d{9}$/.test(phone))){ 
      return true; 
  } 

  return  false;
}