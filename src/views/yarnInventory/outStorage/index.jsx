import { useState, useEffect } from "react"
import { Table, Button, message } from "antd";
import { onlyFormat, getNowFormatDate } from "../../../utils/config";
import { yarnOutStock, yarnOutStockDetail, addYarnOutStock, changeYarnOutStockStatus } from "../../../api/apiModule"
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
    const [loading, seloading] = useState(true);
    const [current, setcurrent] = useState(1);
    const [size, setsize] = useState(10)
    const data = {
        page: 1,
        size: 10,
    }
    useEffect(() => {
        getData(data)
    }, [])

    //  退纱出库
    const getData = (param) => {
        yarnOutStock(param, (res) => {
            console.log(res)
            seloading(false)
            if (res.code == 200 && res.data.records.length > 0) {
                setcurrent(res.data.current);
                setsize(res.data.size);
                setleftData(res.data.records);
                setleftTotal(res.data.total);
                setSelectId(res.data.records[0].id)
                getYarnStockDetail(res.data.records[0].id)
            }
        })
    }
    // 出库单明细
    const getYarnStockDetail = (id) => {
        yarnOutStockDetail(id, (res) => {
            console.log("出库单详情", res)
            if (res.code == 200) {
                setyarn_stock_detail(res.data);
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
        // 添加退纱出库单
        orderData.billType = 0; // 订单类型
        if (orderData.bizDate == "") orderData.bizDate = getNowFormatDate()
        console.log("获取子组件的参数==", orderData);
        orderData.outDtls.map((item) => {
            item.customerCode = item.customerBillCode
        })
        if (detailType === "edit") {
            orderData.id = yarn_stock_detail.id
        }
        addYarnOutStock(orderData, (res) => {
            if (res.code == 200) {
                getData(data);
                setdetailType("detail")
            }
        })
    }
    //  获取子组件参数
    const save = (value) => {
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
    // 审核
    const onAudit = () => {
        const status = yarn_stock_detail.billStatus === 1 ? 0 : 1
        changeYarnOutStockStatus(yarn_stock_detail.id, status, (res) => {
            console.log(res)
            if (res.code === 200) {
                getData(data)
                yarn_stock_detail.billStatus === 1 ? message.success("反审核成功！") : message.success("审核成功！");
                return;
            }
            yarn_stock_detail.billStatus === 1 ? message.error("反审核失败")
                : message.error("审核失败");
        })
    }
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
            <div className="title">退纱出库</div>
            <div className="custom-right">
                <Button type="primary" onClick={add}>
                    +新增
                </Button>
                <Button disabled={leftData.length === 0} onClick={() => { setdetailType("edit") }}>
                    编辑
                </Button>
            </div>
        </div>}
        {
            (detailType == "add" || detailType == "edit") && <div className="custom">
                <div className="title">退纱出库</div>
                <div className="custom-right"><Button type="primary" onClick={onSave}>
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
            {detailType === "detail" && <Detail data={yarn_stock_detail} onAudit={onAudit} />}
            {detailType === "add" && <CreateOrder save={save} />}
            {detailType === "edit" && <CreateOrder data={yarn_stock_detail} save={save} />}
        </div>
    </div>
}

export default withRouter(OutStorage)