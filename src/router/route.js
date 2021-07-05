/*
 * @FileName: 
 * @Author: 1638877065@qq.com
 * @Date: 2021-06-09 23:06:19
 * @LastEditors: 1638877065@qq.com
 * @LastEditTime: 2021-07-05 16:53:55
 * @FilePath: \cloud-admin\src\router\route.js
 * @Description: router路由
 */
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
import StockList from "../views/yarnInventory/stockList"
import InStock from "../views/greigecloth/shipment"
import OutStock from "../views/greigecloth/outStock"
import Stock from "../views/greigecloth/stock"
import InSTockTable from "../views/greigecloth/shipment/inStockTable"
import Order from "../views/production/order"
import CheckClothDetail from "../views/production/checkClothDetail"
import CheckClothWage from "../views/production/checkClothWage"
import ProductionSchedule from "../views/production/productionSchedule"
import UserCenter from "../views/userCenter/user"
import CompanyList from "../views/companyCenter"
import MachineRunning from "../views/production/machineRunning"
import NoFind from "../views/noFind"
export const routes = [{
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
    path: "/dashboard15",
    component: Order
}, // 订单管理
{
    path: "/dashboard16",
    component: ProductionSchedule
}, //  生产进度
{
    path: "/dashboard17",
    component: CheckClothDetail
}, // 查布明细
{
    path: "/dashboard18",
    component: CheckClothWage
}, // 查布工资
{
    path: "/machineRunning",
    component: MachineRunning
},
{
    path: "/dashboard19", // 坯布出库
    component: InStock
},
{
    path: "/dashboard20", //  出库明细
    component: OutStock
},
{
    path: "/dashboard21", //  库存
    component: Stock
}, {
    path: "/dashboard22", //  坯布入库报表
    component: InSTockTable
},
{
    path: "/dashboard23", // 收纱入库
    component: EnterStorage
},
{
    path: "/dashboard24", // 退纱出库
    component: OutStorage
}, {
    path: "/dashboard25", // 出入明细
    component: EnterOutDetail
}, {
    path: "/dashboard26",
    component: StockList // 纱线库存
}, {
    path: "/dashboard31",
    component: UserCenter // 用户管理
}, {
    path: "/companyList",
    component: CompanyList
}, {
    path: "/home",
    component: DataContent
}, {
    path: "/404",
    component: NoFind
}
]