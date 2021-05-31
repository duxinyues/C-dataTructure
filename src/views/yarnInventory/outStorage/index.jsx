import { useState, useEffect, useRef } from "react"
import { Table, PageHeader, Button, Tag } from "antd";
import { onlyFormat, requestUrl } from "../../../utils/config";
import { withRouter } from "react-router-dom";
import Detail from "./detail";
import CreateOrder from "./createOrder";
import "../style.css"

document.title = "退纱出库"
function OutStorage(props) {
    console.log(props)
    const [leftData, setleftData] = useState([]);
    const [leftTotal, setleftTotal] = useState(0);
    const [yarn_stock_detail, setyarn_stock_detail] = useState({});
    const [selectId, setSelectId] = useState(0);
    const [detailType, setdetailType] = useState("detail"); // 用户操作类型
    const [orderData, setorderData] = useState(); // 编辑入库单的字段
    const [loading, seloading] = useState(true)
    const data = {
        page: 1,
        size: 10,
    }
    useEffect(() => {
        getData(data)
    }, [])

    //  退纱出库
    const getData = (param) => {
        fetch(requestUrl + "/api-stock/yarnStockIo/findYarnStockOutList", {
            method: "POST",
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(param)
        })
            .then(res => { return res.json() })
            .then((res) => {
                console.log(res)
                seloading(false)
                if (res.code == 200 && res.data.records.length > 0) {
                    setleftData(res.data.records);
                    setleftTotal(res.data.total);
                    setSelectId(res.data.records[0].id)
                    getYarnStockDetail(res.data.records[0].id)
                }
            })
    }
    // 出库单明细
    const getYarnStockDetail = (id) => {
        fetch(requestUrl + "/api-stock/yarnStockIo/findYarnStockOutById?id=" + id, {
            method: "GET",
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token"),
                "Content-Type": "application/json"
            },
        })
            .then(res => { return res.json() })
            .then((res) => {
                console.log("出库单详情", res)
                if (res.code == 200) {
                    setyarn_stock_detail(res.data)
                }
            })
    }
    // 
    const add = () => {
        setdetailType("add")
    }
    const cancel = () => {
        setdetailType("detail")
    }
    // 保存
    const onSave = () => {
        seloading(true)
        // 添加出库单
        orderData.outDtls = [
            {
                "colorCode": "12",
                "customerCode": "25435",
                "inCheckDtls": [
                    {
                        "grossWeight": 0,
                        "lackWeight": 0,
                        "spec": 0,
                        "tareWeight": 0,
                        "weight": 0
                    }
                ],
                "lackWeight": 0,
                "netWeight": 0,
                "pcs": 0,
                "spec": 0,
                "totalLackWeight": 0,
                "weight": 0,
                "yarnBrandBatch": "4654",
                "yarnName": "测试名称"
            }
        ]
        orderData.billType = 0
        console.log("获取子组件的参数==", orderData)
        fetch(requestUrl + "/api-stock/yarnStockIo/outSaveOrModify", {
            method: "POST",
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(orderData)
        })
            .then(res => { return res.json() })
            .then(res => {
                console.log(res)
                if (res.code == 200) {
                    getData(data);
                    setdetailType("detail")
                }
            })
    }
    //  获取子组件参数
    const save = (value) => {
        console.log("子组件===", value)
        setorderData(value)
    }
    const columns = [
        {
            title: '入库单号',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: '客户',
            dataIndex: 'customerName',
            key: 'customerName',
        },
        {
            title: '日期',
            dataIndex: "bizDate",
            key: "bizDate",
            render: (beginTime) => (<span>{onlyFormat(beginTime, false)}</span>)
        },
        {
            title: '状态',
            dataIndex: 'billStatus',
            key: 'billStatus',
            render: (billStatus) => (<div>{billStatus == 1 ? <span color="green">已审核</span> : <span color="magenta">未审核</span>}</div>)
        }
    ];
    const pagination = {
        total: leftTotal,
    }
    return <div className="right-container">
        {detailType == "detail" && <PageHeader
            title="退纱出库"
            extra={[
                <Button type="primary" onClick={add}>
                    +新增
                </Button>,
                <Button disabled>
                    编辑
                </Button>,
            ]}
        />}
        {
            (detailType == "add" || detailType == "edit") && <PageHeader
                title="退纱出库"
                extra={[
                    <Button type="primary" onClick={onSave}>
                        保存
                    </Button>,
                    <Button onClick={cancel}>
                        取消
                    </Button>,
                ]}
            />
        }
        <div className="inventory-container">
            <div className="left">
                <Table
                    loading={loading}
                    columns={columns}
                    dataSource={leftData}
                    pagination={pagination}
                    onRow={record => {
                        return {
                            onClick: () => {
                                getYarnStockDetail(record.id)
                            },
                        };
                    }}
                />
            </div>
            {detailType == "detail" && <Detail data={yarn_stock_detail} />}
            {detailType == "add" && <CreateOrder save={save} />}
            {detailType == "edit" && <CreateOrder data={yarn_stock_detail} save={save} />}
        </div>
    </div>
}

export default withRouter(OutStorage)