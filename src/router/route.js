import CompanyInfo from "../views/basicData/companyInfomation"
import DataContent from "../views/dataContent"
import StaffInfo from "../views/basicData/staffInfomation"
import MachineData from "../views/basicData/machine"
import ClothRecord from "../views/basicData/clothRecord"
import CustomerData from "../views/basicData/customer"
import Supplier from "../views/basicData/supplier"
import EnterStorage from "../views/yarnInventory/enterStorage"
import OutStorage from "../views/yarnInventory/outStorage"
import EnterOutDetail from "../views/yarnInventory/enterOutDetail"
import NoFind from "../views/noFind"
export const routes = [
    {
        path: '/list/search', // 公司信息
        component: CompanyInfo
    }, {
        path: "/basedata/person", // 员工信息
        component: StaffInfo
    }, {
        path: "/dashboard9", // 机台资料
        component: MachineData
    },
    {
        path: "/dashboard10", // 验纱记录
        component: ClothRecord
    },
    {
        path: "/dashboard12", // 客户信息
        component: CustomerData
    },
    {
        path: "/dashboard13", // 供应商
        component: Supplier
    },
    {
        path: "/dashboard23", // 收纱入库
        component: EnterStorage
    },
    {
        path: "/dashboard24",  // 退纱出库
        component: OutStorage
    }, {
        path: "/dashboard25", // 出入明细
        component: EnterOutDetail
    },
    {
        path: "/home",
        component: DataContent
    },
    {
        path: "/404",
        component: NoFind
    }
]