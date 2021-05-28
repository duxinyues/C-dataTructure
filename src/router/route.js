import CompanyInfo from "../views/basicData/companyInfomation"
import DataContent from "../views/dataContent"
import StaffInfo from "../views/basicData/staffInfomation"
import MachineData from "../views/basicData/machine"
import ClothRecord from "../views/basicData/clothRecord"
import CustomerData from "../views/basicData/customer"
import Supplier from "../views/basicData/supplier"
import EnterStorage from "../views/inventory/enterStorage"
import NoFind from "../views/noFind"
export const routes = [
    {
        path: '/list/search',
        component: CompanyInfo
    }, {
        path: "/basedata/person",
        component: StaffInfo
    }, {
        path: "/dashboard9",
        component: MachineData
    },
    {
        path: "/dashboard10",
        component: ClothRecord
    },
    {
        path: "/dashboard12",
        component: CustomerData
    },
    {
        path: "/dashboard13",
        component: Supplier
    },
    {
        path: "/dashboard23",
        component: EnterStorage
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