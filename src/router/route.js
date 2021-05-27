import CompanyInfo from "../views/companyInfomation"
import DataContent from "../views/dataContent"
import StaffInfo from "../views/staffInfomation"
import MachineData from "../views/machine"
import ClothRecord from "../views/clothRecord"
import CustomerData from "../views/customer"
import Supplier from "../views/supplier"
import NoMatch   from "../views/noMatch"
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
        path: "/home",
        component: DataContent
    },
    {
        path: "/404",
        component:NoMatch
    }
]