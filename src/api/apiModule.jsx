import { requestUrl } from "../utils/config";
import { createBrowserHistory } from "history";
import { message } from "antd";
const history = createBrowserHistory();
/**
 * 登录
 * @param {*} params 
 * @param {*} callback 
 */
export const login = (params, callback) => {
    fetch(requestUrl + `/api-uaa/oauth/token?username=${params.username}&password=${params.password}&grant_type=password&scope=app&client_id=webApp&client_secret=webApp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    }).then((res) => {
        return res.json()
    }).then((res) => {
        callback(res)
    }).catch((err) => console.log(err))
}
/**
 * 地址信息
 * @param {*} token 
 * @param {*} callback 
 */
export const getAddressInfo = (token, callback) => {
    fetch(requestUrl + "/api-basedata/address/findAll", {
        method: "GET",
        headers: {
            "Authorization": "bearer " + token
        },
    })
        .then((res) => { return res.json() })
        .then((res) => {
            addressMap(res.data)
            callback(res.data)
        })
}
// 整理地址信息
const addressMap = (data) => {
    data.map((item) => {
        item.value = item.name;
        item.label = item.name;
        if (item.subAddress) {
            item.children = item.subAddress;
            addressMap(item.children)
        }
    })
    return data
}
/**
 * 当月产量
 * @param {*} callback 
 */
export const monthProduction = (callback) => {
    fetch(requestUrl + `/api-production/index/countBarcode`, {
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token")
        }
    })
        .then((res) => { return res.json() })
        .then((res) => {
            callback(res)
        })
}
/**
 * 库存统计
 * @param {*} callback 
 */
export const totalStock = (callback) => {
    fetch(requestUrl + `/api-production/index/countStock`, {
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token")
        }
    })
        .then((res) => { return res.json() })
        .then((res) => {
            callback(res)
        })
}
/**
 * 首页订单
 * @param {*} callback 
 */
export const homeOrder = (callback) => {
    fetch(requestUrl + `/api-production/index/countOrder`, {
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token")
        }
    })
        .then((res) => { return res.json() })
        .then((res) => {
            callback(res)
        })
}
/**
 * 用户列表
 * @param {*} param 
 * @param {*} callback 
 */
export const getUserList = (param, callback) => {
    fetch(requestUrl + `/api-user/user/findAll`, {
        method: "POST",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token"),
            "Content-Type": "application/json"
        },
        body: JSON.stringify(param)
    })
        .then((res) => { return res.json() })
        .then((res) => {
            callback(res)
        })
}
/**
 * 重置密码
 * @param {*} params 
 * @param {*} callback 
 */
export const resetPassword = (id, callback) => {
    fetch(requestUrl + `/api-user/user/resetPassword?id=${id}`, {
        method: "POST",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token")
        }
    })
        .then((res) => { return res.json() })
        .then((res) => {
            callback(res)
        })
}
export const changePassword = (params, callback) => {
    fetch(requestUrl + `/api-user/user/modifyPassword?id=${params.id}&newPassword=${params.newPassword}&oldPassword=${params.oldPassword}`, {
        method: "POST",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token")
        }
    })
        .then((res) => { return res.json() })
        .then((res) => {
            callback(res)
        })
}
/**
 * 添加或者编辑用户
 * @param {*} params 
 * @param {*} callback 
 */
export const addAndEditUser = (params, callback) => {
    fetch(requestUrl + `/api-user/user/saveOrModify`, {
        method: "POST",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token"),
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    })
        .then((res) => { return res.json() })
        .then((res) => {
            callback(res)
        })
}
/**
 * 删除用户
 * @param {*} userId 
 * @param {*} callback 
 */
export const delectUser = (userId, callback) => {
    fetch(requestUrl + `/api-user/user/remove?id=${userId}`, {
        method: "POST",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token")
        },
    })
        .then(res => { return res.json() })
        .then(res => {
            callback(res)
        })
}
/**
 *  禁用用户
 * @param {*} userId  用户id
 * @param {*} enabled 是否禁用
 * @param {*} callback 
 */
export const disbaleUser = (userId, enabled, callback) => {
    fetch(requestUrl + `/api-user/user/modifyEnabled?id=${userId}&enabled=${enabled}`, {
        method: "POST",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token")
        },
    })
        .then(res => { return res.json() })
        .then((res) => {
            callback(res)
        })
}
/**
 * 角色列表
 * @param {*} callback 
 */
export const getRoles = (callback) => {
    fetch(requestUrl + "/api-user/role/findAll", {
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token")
        }
    })
        .then(res => { return res.json() })
        .then(res => {
            if (res.code === 200) {
                callback(res.data)
            }
        })
}
/**
 * 切换公司
 * @param {*} companyId 
 * @param {*} userId 
 * @param {*} callback 
 */
export const switchConpany = (companyId, userId, callback) => {
    fetch(requestUrl + "/api-user/user/modifyAdminCompany?companyId=" + companyId + "&id=" + userId, {
        method: "POST",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token"),
        }
    })
        .then(res => { return res.json() })
        .then(res => {
            callback(res)
        })
}

/**
 *  获取下拉框公司数据
 * @param {*} callback 
 */
export const getCompanyList = (callback) => {
    fetch(requestUrl + "/api-user/user/findCompanyDown", {
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token"),
        }
    })
        .then(res => { return res.json() })
        .then(res => {
            if (res.code === 200) {
                callback(res.data)
            }
        })
}
/**
 * 生产进度
 * @param {*} params 
 * @param {*} callback 
 */
export const productionSchedule = (params, callback) => {
    fetch(requestUrl + "/api-production/process/findAll", {
        method: "POST",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token"),
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    })
        .then(res => { return res.json() })
        .then(res => {
            callback(res)
        })
}
/**
 * 获取下拉框客户列表
 */
export const getCustomer = (callback) => {
    fetch(requestUrl + "/api-stock/stockCommon/findCustomerDown", {
        method: "POST",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token")
        },
    })
        .then(res => { return res.json() })
        .then(res => {
            if (res.code === 200) {
                callback(res.data)
            }
        })
}
/**
 * 客户列表
 * @param {*} page 
 * @param {*} size 
 * @param {*} callback 
 */
export const getCustomerList = (page, size, callback) => {
    fetch(requestUrl + `/api-basedata/customer/findAll?page=${page}&size=${size}`, {
        method: "POST",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token")
        },
    })
        .then(res => { return res.json() })
        .then(res => {
            callback(res)
        })
}
/**
 * 编辑、新增客户
 * @param {*} params 
 * @param {*} callback 
 */
export const addEditCustomer = (params, callback) => {
    fetch(requestUrl + `/api-basedata/customer/saveOrModify`, {
        method: "POST",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token"),
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    })
        .then((res) => { return res.json() })
        .then((res) => {
            callback(res)
        })
}
/**
 * 删除客户
 * @param {*} id 
 * @param {*} callback 
 */
export const delectCustomer = (id, callback) => {
    fetch(requestUrl + `/api-basedata/customer/delete?id=${id}`, {
        method: "POST",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token"),
            "Content-Type": "application/json"
        },
    })
        .then(res => { return res.json() })
        .then(res => {
            callback(res)
        })
}
/**
 * 客户禁用
 * @param {} id 
 * @param {*} status 
 * @param {*} callback 
 */
export const disableCustomer = (id, status, callback) => {
    fetch(requestUrl + `/api-basedata/customer/modifyEnabled?id=${id}&enabled=${status}`, {
        method: "POST",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token")
        },
    })
        .then(res => { return res.json() })
        .then((res) => {
            callback(res);
        })
}
/**
 * 查布明细
 * @param {*} params 
 * @param {*} callback 
 */
export const checkClothDetail = (params, callback) => {
    fetch(requestUrl + "/api-production/QCDetail/findAll", {
        method: "POST",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token"),
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    })
        .then(res => { return res.json() })
        .then(res => {
            if (res.code === 200) {
                callback(res)
            }
        })
}
/**
 * 下拉框员工
 * @param {*} callback 
 */
export const getPerson = (callback) => {
    fetch(requestUrl + `/api-production/orderBarcode/personDownList`, {
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token"),
        }
    })
        .then((res) => { return res.json() })
        .then((res) => {
            callback(res)
        })
}
/**
 * 下拉框机台数据
 * @param {*} callback 
 */
export const getLoom = (callback) => {
    fetch(requestUrl + "/api-production/order/getLoomDownList", {
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token"),
        }
    })
        .then(res => { return res.json() })
        .then(res => {
            callback(res)
        })
}

/**
 * 创建订单
 * @param {*} params 
 * @param {*} callback 
 */
export const createOrders = (params, callback) => {
    fetch(requestUrl + "/api-production/order/saveOrModify", {
        method: "POST",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token"),
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    })
        .then(res => { return res.json() })
        .then(res => {
            callback(res)
        })
}
/**
 * 获取订单条码
 */
export const getBarCodes = (orderId, yarnBrandBatch, callback) => {
    fetch(requestUrl + "/api-production/order/findLoomDetailByOrderId?id=" + orderId + "&yarnBatch=" + yarnBrandBatch, {
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token")
        },
    })
        .then(res => { return res.json() })
        .then(res => {
            callback(res)
        })
}
/**
 * 打印条码
 * @param {*} params 
 * @param {*} callbacl 
 */
export const printBarCode = (params, callback) => {
    fetch(requestUrl + "/api-production/orderBarcode/printBarcode", {
        method: "POST",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token"),
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    })
        .then(res => { return res.json() })
        .then(res => {
            callback(res)
        })
}
/**
 * 订单详情
 * @param {*} orderId 
 * @param {*} callback 
 */
export const onOrderDetail = (orderId, callback) => {
    fetch(requestUrl + "/api-production/order/findById?id=" + orderId, {
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token")
        },
    })
        .then(res => { return res.json() })
        .then(res => {
            callback(res)
        })
}
/**
 * 布票批次，下拉框数据
 * @param {*} id 
 * @param {*} callback 
 */
export const onClothBatch = (id, callback) => {
    fetch(requestUrl + "/api-production/orderBarcode/yarnDownList?orderId=" + id, {
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token")
        },
    })
        .then(res => { return res.json() })
        .then(res => {
            callback(res)
        })
}
/**
 * 条码起始号【匹号】
 * @param {*} orderId 
 * @param {*} yarnBatch 
 * @param {*} loom 
 */
export const onSeq = (orderId, yarnBatch, loom,) => {
    // fetch(requestUrl + `/api-production/orderBarcode/findToPrintBarcode?id=${orderDetail.id}&yarnBatch=${clothYarnBatch}&loomId=${selectClothLoom}`, {
    //     headers: {
    //         "Authorization": "bearer " + localStorage.getItem("access_token")
    //     }
    // })
    //     .then(res => { return res.json() })
    //     .then(res => {
            
    //     })
}
/**
 * 获取用户信息
 * @param {*} callback 
 */
export const getUserInfo = (callback) => {
    fetch(requestUrl + "/api-user/user/findById", {
        method: "POST",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token")
        },
    }).then(res => {
        return res.json()
    }).then((res) => {
        callback(res);
    }).catch((err) => { })
}

/**
 * 新增、修改机台
 */

export const addAndEditLoom = (params, callback) => {
    fetch(requestUrl + "/api-basedata/loom/saveOrModify", {
        method: "POST",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token"),
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    })
        .then((res) => { return res.json() })
        .then((res) => {
            callback(res)
        })
}
/**
 * 机台禁用、启用
 * @param {*} id 
 * @param {*} status 
 * @param {*} callback 
 */
export const disableLoom = (id, status, callback) => {
    fetch(requestUrl + `/api-basedata/loom/modifyEnabled?id=${id}&enabled=${status}`, {
        method: "POST",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token")
        },
    })
        .then(res => { return res.json() })
        .then(res => {
            callback(res)
        })
}
/**
 * 删除机台
 * @param {*} id 
 * @param {*} callback 
 */
export const delectLoom = (id, callback) => {
    fetch(requestUrl + "/api-basedata/loom/delete?id=" + id, {
        method: "POST",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token")
        },
    })
        .then(res => { return res.json() })
        .then(res => {
            callback(res)
        })
}
/**
 * 机台列表
 * @param {*} page 
 * @param {*} size 
 * @param {*} callback 
 */
export const getLoomList = (page, size, callback) => {
    fetch(requestUrl + `/api-basedata/loom/findAll?companyId=1&page=${page}&size=${size}`, {
        method: "POST",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token")
        },
    })
        .then(res => { return res.json() })
        .then(res => {
            callback(res)
        })
}
/**
 * 新增、编辑验布
 */
export const addAndEditClothRecord = (params, callback) => {
    fetch(requestUrl + `/api-basedata/clothInspection/saveOrModify`, {
        method: "POST",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token"),
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    })
        .then((res) => { return res.json() })
        .then((res) => {
            callback(res);
        })
}
/**
 *  删除验布
 * @param {*} id 
 * @param {*} callback 
 */
export const delectCloth = (id, callback) => {
    fetch(requestUrl + `/api-basedata/clothInspection/delete?id=${id}`, {
        method: "POST",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token")
        },
    })
        .then(res => { return res.json() })
        .then(res => {
            callback(res)
        })
}
/**
 * 禁用验布
 * @param {*} id 
 * @param {*} status 
 * @param {*} callback 
 */
export const disableCloth = (id, status, callback) => {
    fetch(requestUrl + `/api-basedata/clothInspection/modifyEnabled?id=${id}&enabled=${status}`, {
        method: "POST",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token")
        },
    })
        .then(res => { return res.json() })
        .then((res) => {
            callback(res)
        })
}
/**
 * 验布记录列表
 * @param {*} page 
 * @param {*} size 
 * @param {*} callback 
 */
export const getClothList = (page, size, callback) => {
    fetch(requestUrl + `/api-basedata/clothInspection/findAll?page=${page}&size=${size}`, {
        method: "POST",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token"),
            "Content-Type": "application/json"
        },
    })
        .then(res => { return res.json() })
        .then(res => {
            callback(res)
        })
}
/**
 * 新增、编辑员工
 * @param {*} params 
 * @param {*} callback 
 */
export const addEditParson = (params, callback) => {
    fetch(requestUrl + "/api-basedata/person/saveOrModify", {
        method: "POST",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token"),
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    }).then((res) => { return res.json() })
        .then(res => {
            callback(res)
        })
}
/**
 * 删除员工
 * @param {} id 
 * @param {*} callback 
 */
export const delectParson = (id, callback) => {
    fetch(requestUrl + "/api-basedata/person/delete?id=" + id, {
        method: "POST",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token"),
            "Content-Type": "application/json"
        },
    })
        .then((res) => { return res.json() })
        .then((res) => {
            callback(res)
        })
}
/**
 * 禁用员工
 * @param {} id 
 * @param {*} status 
 * @param {*} callback 
 */
export const disablePerson = (id, status, callback) => {
    fetch(requestUrl + "/api-basedata/person/modifyEnabled?id=" + id + "&enabled=" + status, {
        method: "POST",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token"),
            "Content-Type": "application/json"
        },
    })
        .then((res) => { return res.json() })
        .then((res) => {
            callback(res)
        })
}
/**
 * 员工列表
 * @param {*} page 
 * @param {*} size 
 * @param {*} callback 
 */
export const getPersonList = (page, size, callback) => {
    fetch(requestUrl + `/api-basedata/person/findAll?companyId=1&page=${page}&size=${size}`, {
        method: "POST",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token"),
        }
    })
        .then((res) => { return res.json() })
        .then((res) => {
            callback(res)
        })
}
/**
 * 供应商新增、编辑
 * @param {*} params 
 * @param {*} callback 
 */
export const addEditSupplier = (params, callback) => {
    fetch(requestUrl + `/api-basedata/supplier/saveOrModify`, {
        method: "POST",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token"),
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    })
        .then((res) => { return res.json() })
        .then((res) => {
            callback(res)
        })
}
/**
 * 删除供应商
 * @param {} id 
 * @param {*} callback 
 */
export const delectSupplier = (id, callback) => {
    fetch(requestUrl + `/api-basedata/supplier/delete?id=${id}`, {
        method: "POST",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token")
        },
    })
        .then(res => { return res.json() })
        .then(res => {
            callback(res)
        })
}
/**
 * 供应商 禁用
 * @param {*} id 
 * @param {*} status 
 * @param {*} callback 
 */
export const disableSupplier = (id, status, callback) => {
    fetch(requestUrl + `/api-basedata/supplier/modifyEnabled?id=${id}&enabled=${status}`, {
        method: "POST",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token")
        },
    })
        .then(res => { return res.json() })
        .then((res) => {
            callback(res)
        })
}
/**
 * 供应商列表
 * @param {*} page 
 * @param {*} size 
 * @param {*} callback 
 */
export const getSupplier = (page, size, callback) => {
    fetch(requestUrl + `/api-basedata/supplier/findAll?page=${page}&size=${size}`, {
        method: "POST",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token")
        },
    })
        .then(res => { return res.json() })
        .then(res => {
            callback(res)
        })
}
/**
 * 公司信息
 * @param {*} callback 
 */
export const getCompanyInfo = (callback) => {
    fetch(requestUrl + "/api-basedata/company/findById", {
        method: "POST",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token")
        },
    })
        .then(res => { return res.json() })
        .then((res) => {
            callback(res)
        })
}
/**
 * 公司列表
 * @param {*} params 
 * @param {*} callback 
 */
export const companyList = (params, callback) => {
    fetch(requestUrl + "/api-basedata/company/findAll?size=" + params.size + "&page=" + params.page, {
        method: "POST",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token")
        },
    })
        .then(res => { return res.json() })
        .then((res) => {
            callback(res)
        })
}
/**
 * 编辑公司
 * @param {*} params 
 * @param {*} callback 
 */
export const editCompany = (params, callback) => {
    fetch(requestUrl + "/api-basedata/company/saveOrModify", {
        method: "POST",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token"),
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    })
        .then((res) => { return res.json() })
        .then((res) => {
            callback(res)
        })
}
/**
 * 织厂禁用
 * @param {*} id 
 * @param {*} callback 
 */
export const disableCompany = (id, enabled, callback) => {
    fetch(requestUrl + "/api-basedata/company/modifyEnabled?id=" + id + "&enabled=" + enabled, {
        method: "POST",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token"),
        },
    })
        .then((res) => { return res.json() })
        .then((res) => {
            callback(res)
        })
}
/**
 * 删除织厂信息
 * @param {*} id 
 * @param {*} callback 
 */
export const deletedCompany = (id, callback) => {
    fetch(requestUrl + "/api-basedata/company/delete?id=" + id, {
        method: "POST",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token"),
        },
    })
        .then((res) => { return res.json() })
        .then((res) => {
            callback(res)
        })
}

/**
 * 订单下拉框客户列表
 * @param {*} callback 
 */
export const getOrderCustomerDownList = (callback) => {
    fetch(requestUrl + "/api-production/order/getCustomerDownList", {
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token")
        },
    })
        .then(res => { return res.json() })
        .then(res => {
            callback(res)
        })
}
/**
 * 订单列表
 * @param {*} params 
 * @param {*} callback 
 */
export const getOrderData = (params, callback) => {
    fetch(requestUrl + "/api-production/order/findAll", {
        method: "POST",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token"),
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    })
        .then(res => { return res.json() })
        .then(res => {
            callback(res)
        })
}
/**
 * 订单状态
 * @param {*} id 
 * @param {*} status 
 * @param {*} callback 
 */
export const orderStatus = (id, status, callback) => {
    fetch(requestUrl + "/api-production/order/updateBillStatus?id=" + id + "&billStatus=" + status, {
        method: "POST",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token")
        }
    })
        .then(res => { return res.json() })
        .then(res => {
            callback(res)
        })
}
/**
 * 条码
 * @param {*} orderId 
 * @param {*} yarnBrandBatch 
 * @param {*} callback 
 */
export const barCodes = (orderId, yarnBrandBatch, callback) => {
    fetch(requestUrl + "/api-production/order/findLoomDetailByOrderId?id=" + orderId + "&yarnBatch=" + yarnBrandBatch, {
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token")
        },
    })
        .then(res => { return res.json() })
        .then(res => {
            callback(res)
        })
}
/**
 * 布类
 * @param {*} callback 
 */
export const getClothType = (callback) => {
    fetch(requestUrl + "/api-production/order/getFabricTypeDownList", {
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token"),
        }
    })
        .then(res => { return res.json() })
        .then(res => {
            callback(res)
        })
}
/**
 * 坯布出货单列表
 * @param {*} params 
 * @param {*} callback 
 */
export const fabricIoOrder = (params, callback) => {
    fetch(requestUrl + "/api-stock/fabricStockIo/findAll", {
        method: "POST",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token"),
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    })
        .then(res => { return res.json() })
        .then((res) => {
            callback(res)
        })
}
export const checkYarn = (orderId, callback) => {
    fetch(requestUrl + "/api-production/order/findYarnDetail?orderId=" + orderId, {
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token"),
        },
    })
        .then(res => { return res.json() })
        .then(res => {
            callback(res)
        })
}
/**
 * 出货明细
 * @param {*} params 
 * @param {*} callback 
 */
export const fabricOut = (params, callback) => {
    fetch(requestUrl + "/api-stock/fabricStockIo/findAllDetail", {
        method: "POST",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token"),
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    })
        .then(res => { return res.json() })
        .then(res => {
            callback(res)
        })
}
/**
 * 入库报表
 * @param {*} params 
 * @param {*} callback 
 */
export const fabricStatement = (params, callback) => {
    fetch(requestUrl + "/api-stock/fabricStockByDay/findAll", {
        method: "POST",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token"),
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    })
        .then(res => { return res.json() })
        .then(res => {
            callback(res)
        })
}
/**
 * 坯布库存
 * @param {*} params 
 * @param {*} callback 
 */
export const getFabricStock = (params, callback) => {
    fetch(requestUrl + "/api-stock/fabricStock/findAll", {
        method: "POST",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token"),
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    })
        .then(res => { return res.json() })
        .then(res => {
            callback(res)
        })
}
/**
 * 纱线入库
 * @param {*} params 
 * @param {*} callback 
 */
export const yarnStockIn = (params, callback) => {
    fetch(requestUrl + "/api-stock/yarnStockIo/findYarnStockInList", {
        method: "POST",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token"),
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    })
        .then(res => { return res.json() })
        .then((res) => {
            callback(res)
        })
}
/**
 * 纱线入库明细
 * @param {*} id 
 * @param {*} callback 
 */
export const yarnStockDetail = (id, callback) => {
    fetch(requestUrl + "/api-stock/yarnStockIo/findYarnStockInById?id=" + id, {
        method: "GET",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token"),
        },
    })
        .then(res => { return res.json() })
        .then((res) => {
            callback(res)
        })
}
/**
 * 添加收纱入库单
 * @param {*} params 
 * @param {*} callback 
 */
export const addYarnStock = (params, callback) => {
    fetch(requestUrl + "/api-stock/yarnStockIo/inSaveOrModify", {
        method: "POST",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token"),
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    })
        .then(res => { return res.json() })
        .then(res => {
            callback(res)
        })
}
/**
 * 收纱入库审核,退纱出库审核
 * @param {*} id 
 * @param {*} status 
 * @param {*} callback 
 */
export const changeYarnOutStockStatus = (id, status, callback) => {
    fetch(requestUrl + "/api-stock/yarnStockIo/modifyStatus?id=" + id + "&status=" + status, {
        method: "POST",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token"),
            "Content-Type": "application/json"
        },
    })
        .then(res => { return res.json() })
        .then(res => {
            callback(res);
        })
}
/**
 * 删除纱线入库单
 * @param {*} id 
 */
export const deleteYarn = (id, callback) => {
    fetch(requestUrl + "/api-stock/yarnStockIo/removeInById?id=" + id, {
        method: "POST",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token"),
        },
    })
        .then(res => { return res.json() })
        .then(res => {
            callback(res)
        })
}
/**
 * 退纱出库列表
 * @param {*} params 
 * @param {*} callback 
 */
export const yarnOutStock = (params, callback) => {
    fetch(requestUrl + "/api-stock/yarnStockIo/findYarnStockOutList", {
        method: "POST",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token"),
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    })
        .then(res => { return res.json() })
        .then((res) => {
            callback(res);
        })
}
/**
 * 退纱出库详情
 * @param {*} id 
 * @param {*} callback 
 */
export const yarnOutStockDetail = (id, callback) => {
    fetch(requestUrl + "/api-stock/yarnStockIo/findYarnStockOutById?id=" + id, {
        method: "GET",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token"),
            "Content-Type": "application/json"
        },
    })
        .then(res => { return res.json() })
        .then((res) => {
            callback(res)
        })
}
/**
 * 退纱出库————新增、修改
 * @param {*} params 
 * @param {*} callback 
 */
export const addYarnOutStock = (params, callback) => {
    fetch(requestUrl + "/api-stock/yarnStockIo/outSaveOrModify", {
        method: "POST",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token"),
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    })
        .then(res => { return res.json() })
        .then(res => {
            callback(res);
        })
}

/**
 * 退纱出库弹窗库存数据
 * @param {*} params 
 * @param {*} callback 
 */
export const outYarnModalList = (params, callback) => {
    fetch(requestUrl + "/api-stock/yarnStockIo/findAllYarnStock", {
        method: "POST",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token"),
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    })
        .then(res => { return res.json() })
        .then(res => {
            callback(res);
        })
}
/**
 * 纱线库存
 * @param {*} params 
 * @param {*} callback 
 */
export const yarnStock = (params, callback) => {
    fetch(requestUrl + "/api-stock/yarnStock/findAll", {
        method: "POST",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token"),
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    })
        .then(res => { return res.json() })
        .then(res => {
            callback(res);
        })
}

export const getYarnStockIoDetail = (params, callback) => {
    fetch(requestUrl + "/api-stock/yarnStockIo/findAll", {
        method: "POST",
        headers: {
            "Authorization": "bearer " + localStorage.getItem("access_token"),
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    })
        .then(res => { return res.json() })
        .then(res => {
            callback(res)
        })
}