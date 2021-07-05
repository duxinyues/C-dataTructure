import React, { useEffect, useState } from "react"
import { withRouter } from "react-router-dom"
import { Statistic, Table } from "antd";
import { monthProduction, totalStock, homeOrder } from "../../api/apiModule"
import { onlyFormat } from "../../utils/config"
import Charts from "./monthOutStock"
import "./index.css";
function DataContent(props) {
    document.title = "首页"
    const [inMonth, setinMonth] = useState(0);
    const [inYesterday, setinYesterday] = useState(0);
    const [outMonth, setoutMonth] = useState(0);
    const [outYesterday, setoutYesterday] = useState(0);
    const [totalVolQty, settotalVolQty] = useState(0);
    const [totalWeight, settotalWeight] = useState(0)
    const [stockArr, setstockArr] = useState([]);
    const [order, setorder] = useState([])
    const [] = useState()
    useEffect(() => {
        monthProduction((res) => {
            console.log(res)
            if (res.code === 200) {
                setinMonth(res.data.inMonth);
                setinYesterday(res.data.inYesterday);
                setoutMonth(res.data.outMonth);
                setoutYesterday(res.data.outYesterday)
            }
        });
        totalStock((res) => {
            if (res.code === 200) {
                setstockArr([...res.data.list]);
                settotalWeight(res.data.totalWeight);
                settotalVolQty(res.data.totalVolQty);
            }
        })
        homeOrder((res) => {
            if (res.code === 200) {
                setorder([...res.data])
            }
        })
        return () => { }
    }, [])
    const scale = {
        price: {
            min: 0,
            max: 1.5
        },
        year: {
            range: [0.05, 0.95]
        }
    }
    const columns = [
        {
            title: "序号",
            dataIndex: "id"
        },
        {
            title: "生产单号",
            dataIndex: "code"
        },
        {
            title: "客户",
            dataIndex: "customerName"
        },
        {
            title: "下单日期",
            dataIndex: "bizDate",
            render: (time) => (<span>{onlyFormat(time, false)}</span>)
        },
        {
            title: "交期",
            dataIndex: "deliveryDate",
            render: (time) => (<span>{onlyFormat(time, false)}</span>)
        },
        {
            title: "布类",
            dataIndex: "fabricType"
        },
        {
            title: "订单数量",
            dataIndex: "weight"
        },
        {
            title: "状态",
            dataIndex: "billStatus",
            render: (billStatus) => (<span>{billStatus === 1 && "已审核"}{billStatus === 0 && "未审核"}</span>)
        }
    ]
    return <div className="right-container" style={{ background: "transparent" }}>
        <div className="home" >
            <div className="basic-head">
                <div className="basic-item">
                    <div className="center">
                        <Statistic title="当月产量" value={inMonth} />
                        <div className="scale">
                            {/* <span>周环比67%</span>
                            <span>日环比 0%</span> */}
                        </div>
                    </div>
                    <div className="yesterday-output">
                        昨日产量：{inYesterday}
                    </div>
                </div>
                <div className="basic-item">
                    <div className="center">
                        <Statistic title="当月出布" value={outMonth} />
                        <div className="scale">
                            {/* <Charts /> */}
                        </div>
                    </div>
                    <div className="yesterday-output">
                        昨日出布：{outYesterday}
                    </div>
                </div>
                <div className="basic-item">
                    <div className="center">
                        <Statistic title="开机效率" value="未接入MES" />
                        <div className="scale">
                        </div>
                    </div>
                    <div className="yesterday-output">
                        班次效率 - 停机时长 -
                    </div>
                </div>
                <div className="basic-item">
                    <div className="center">
                        <Statistic title="坯布库存" value={totalWeight} />
                        <div className="scale">
                            {/* <Chart height={100} autoFit data={[
                                { year: '1951 年', sales: 100 },
                                { year: '1952 年', sales: 52 },
                                { year: '1956 年', sales: 61 },
                                { year: '1957 年', sales: 45 },
                                { year: '1958 年', sales: 48 },
                                { year: '1959 年', sales: 38 },
                                { year: '1960 年', sales: 38 },
                                { year: '1962 年', sales: 38 },
                            ]} >
                                <Interval position="year*sales" />
                                <Tooltip shared />
                            </Chart> */}
                        </div>

                    </div>
                    <div className="yesterday-output">
                        {totalVolQty}卷 {totalWeight} kg
                    </div>
                </div>
            </div>
            <div className="basic-table">
                <div className="left">
                    <div className="orderTitle">订单列表</div>
                    <Table
                        className="order-list"
                        columns={columns}
                        dataSource={order}
                        pagination={false}
                    />
                </div>
                {/* <div className="right">
                    <div className="system-state">
                        <div className="state-title">最新状态</div>
                        <div className="">
                            <p>6月10日 18:46 开发账户 登录系统</p>
                        </div>
                    </div>
                    <div className="to-do">
                        我的待办
                        <Table columns={[
                            {
                                title: "单号"
                            },
                            {
                                title: "订单日期"
                            },
                            {
                                title: "类型"
                            },
                            {
                                title: "状态"
                            }
                        ]}
                            dataSource={[]}
                        />
                    </div>
                </div> */}
            </div>
        </div>
    </div>
}

export default withRouter(DataContent)