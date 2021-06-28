import { requestUrl } from "../utils/config"
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
export const resetPassword = (params, callback) => {
    fetch(requestUrl + `/api-user/user/modifyPassword?id=${params.id}&oldPassword=${params.oldPassword}&newPassword=${params.newPassword}`, {
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
        callback(res)
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