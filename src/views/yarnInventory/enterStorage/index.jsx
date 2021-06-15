import { useState, useEffect, useRef } from "react"
import { Table, PageHeader, Button, Modal } from "antd";
import { onlyFormat, requestUrl, getNowFormatDate } from "../../../utils/config";
import { withRouter } from "react-router-dom";
import OrderDetail from "./orderDetail";
import CreateOrder from "./createOrder";
import "../style.css"

document.title = "收纱入库";
const { confirm } = Modal;
function EnterStorage(props) {
    const [leftData, setleftData] = useState([]);
    const [leftTotal, setleftTotal] = useState(0);
    const [yarn_stock_detail, setyarn_stock_detail] = useState({});
    const [selectId, setSelectId] = useState(0);
    const [detailType, setdetailType] = useState("detail"); // 用户操作类型
    const [orderData, setorderData] = useState(); // 编辑入库单的字段
    const [loading, setloading] = useState(true);
    const [size, setSize] = useState(10);
    const [current, setcurrent] = useState(1);
    const data = {
        page: 1,
        size: 10,
    }
    useEffect(() => {
        getData(data)
    }, [])

    //  收纱入库
    const getData = (param) => {
        fetch(requestUrl + "/api-stock/yarnStockIo/findYarnStockInList", {
            method: "POST",
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(param)
        })
            .then(res => { return res.json() })
            .then((res) => {
                console.log("收纱入库==", res)
                if (res.code == 200) {
                    setloading(false);

                    setleftData(res.data.records);
                    setleftTotal(res.data.total);
                    setSize(res.data.size);
                    setcurrent(res.data.current);
                    setSelectId(res.data.records[0].id)
                    getYarnStockDetail(res.data.records[0].id)
                }
            })
    }
    // 入库单明细
    const getYarnStockDetail = (id) => {
        fetch(requestUrl + "/api-stock/yarnStockIo/findYarnStockInById?id=" + id, {
            method: "GET",
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token"),
                "Content-Type": "application/json"
            },
        })
            .then(res => { return res.json() })
            .then((res) => {
                console.log("入库单详情", res)
                if (res.code == 200) {
                    setyarn_stock_detail(res.data)
                }
            })
    }
    // 新增
    const add = () => {
        setdetailType("add")
    }
    const edit = () => {
        setdetailType("edit")
    }
    const cancel = () => {
        setdetailType("detail")
    }
    // 保存
    const onSave = () => {
        if (!orderData) return;
        // 添加入库单
        orderData.inDtls = [
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
        setloading(true)
        if (detailType == "add") { }
        if (detailType == "edit") {
            orderData.id = yarn_stock_detail.id;
        }

        if (orderData.bizDate == "") orderData.bizDate = getNowFormatDate();
        console.log("新增或者编辑的表单字段==", orderData)
        fetch(requestUrl + "/api-stock/yarnStockIo/inSaveOrModify", {
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
                    setdetailType("detail");
                }
            })
    }
    //  获取子组件参数
    const save = (value) => {
        setorderData(value)
    }
    // 删除
    const delect = () => {
        confirm({
            content: '确定要删除该条数据',
            onOk() {
                console.log('OK');
                delectRequest(yarn_stock_detail.id)
            },
            onCancel() { },
        });
    }
    const delectRequest = (id) => {
        fetch(requestUrl + "/api-stock/yarnStockIo/removeInById?id=" + id, {
            method: "POST",
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token"),
            },
        })
            .then(res => { return res.json() })
            .then(res => {
                // 删除成功，刷新列表
                if (res.code == 200) {
                    getData(data)
                }
            })
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
        pageSize: size,
        current: current,
        onChange: (page, pageSize) => {
            getData({
                page: page,
                size: pageSize,
            })
        },
        showSizeChanger: false,
        showTotal: () => (`共${leftTotal}条`)
    }
    return <div className="right-container">
        {detailType === "detail" && <div className="custom">
            <div className="title">
                收纱入库
            </div>
            <div className="custom-right">
                <Button type="primary" onClick={add}>
                    +新增
                </Button>
                <Button onClick={edit}>
                    编辑
                </Button>
                <Button onClick={delect}>
                    删除
                </Button>
                <Button >
                    订单
                </Button>
                <Button disabled >
                    抽磅
                </Button>
            </div>
        </div>}
        {
            (detailType === "add" || detailType === "edit") && <div className="custom">
                <div className="title">
                    收纱入库
                </div>
                <div className="custom-right">
                    <Button type="primary" onClick={onSave}>
                        保存
                    </Button>
                    <Button onClick={cancel}>
                        取消
                    </Button>
                </div>
            </div>
        }
        <div className="inventory-container">
            <div className="left">
                <Table
                    loading={loading}
                    columns={columns}
                    dataSource={leftData}
                    pagination={pagination}
                    rowKey={(record, index) => record.id}
                    onRow={record => {
                        return {
                            onClick: () => {
                                getYarnStockDetail(record.id)
                            },
                        };
                    }}
                />
            </div>
            <div className="right">
                {detailType === "detail" && <OrderDetail data={yarn_stock_detail} />}
                {detailType === "add" && <CreateOrder save={save} />}
                {detailType === "edit" && <CreateOrder data={yarn_stock_detail} save={save} />}
            </div>
        </div>
    </div>
}

export default withRouter(EnterStorage)