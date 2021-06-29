import React from "react"
import { withRouter } from "react-router-dom"
import { Statistic, Table } from "antd";
// import { Chart, Path, Interval, Tooltip } from 'bizcharts';
import Charts from "./monthOutStock"
import "./index.css";
function DataContent(props) {
    document.title = "首页"
    console.log(props)
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
            title: "序号"
        },
        {
            title: "生产单号"
        },
        {
            title: "客户"
        },
        {
            title: "下单日期"
        },
        {
            title: "交期"
        },
        {
            title: "布类"
        },
        {
            title: "订单数量"
        },
        {
            title: "状态"
        }
    ]
    return <div className="right-container" style={{ background: "transparent" }}>
        <div className="home" >
            <div className="basic-head">
                <div className="basic-item">
                    <div className="center">
                        <Statistic title="当月产量" value={1000} />
                        <div className="scale">
                            <span>周环比67%</span>
                            <span>日环比 0%</span>
                        </div>
                    </div>
                    <div className="yesterday-output">
                        昨日产量：0
                    </div>
                </div>
                <div className="basic-item">
                    <div className="center">
                        <Statistic title="当月出布" value={117} />
                        <div className="scale">
                            <Charts />
                        </div>
                    </div>
                    <div className="yesterday-output">
                        昨日出布：0
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
                        <Statistic title="坯布库存" value="124,105.82" />
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
                        织厂100000703 1,732 条 43,986.42 kg
                    </div>
                </div>
            </div>
            <div className="basic-table">
                <div className="left">
                    订单列表
                    <Table
                        className="order-list"
                        columns={columns}
                        dataSource={[]}
                    />
                </div>
                <div className="right">
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
                </div>
            </div>
        </div>
    </div>
}

export default withRouter(DataContent)