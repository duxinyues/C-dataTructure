import { useState, useEffect, useRef } from "react"
import { Table, Button, Modal, Select, Spin, message } from "antd";
import { onlyFormat, requestUrl } from "../../../utils/config";
import { saveOrderData, saveSelectData } from "../../../actons/action";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import OrderDetail from "./orderDetail";
import CreateOrder from "./createOrder";
import DeliveryOrder from "./deliveryOrder"
import EditEnterStockOrder from "./edit"
import "../../yarnInventory/style.css"
import "./style.css"
const { confirm } = Modal;
const { Option } = Select;
document.title = "坯布出货";

function InStock(props) {
    console.log(props)
    const childRef = useRef();
    const [spinning, setspinning] = useState(true);
    const [disabled, setdisabled] = useState(false);
    const [leftData, setleftData] = useState([]);
    const [leftTotal, setleftTotal] = useState(0);
    const [current, setcurrent] = useState(1);
    const [size, setsize] = useState(10);
    const [yarn_stock_detail, setyarn_stock_detail] = useState({}); //
    const [selectId, setSelectId] = useState(0);
    const [detailType, setdetailType] = useState("detail");
    const [orderData, setorderData] = useState({});
    const [loading, setloading] = useState(true);
    const [outStockOrder, setOutStockOrder] = useState(false);
    const [deliveryOrder, setDeliveryOrder] = useState({});
    const data = {
        page: 1,
        size: 10,
    }
    useEffect(() => {
        getData(data);
    }, [])

    //  坯布出货
    const getData = (param) => {
        fetch(requestUrl + "/api-stock/fabricStockIo/findAll", {
            method: "POST",
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(param)
        })
            .then(res => { return res.json() })
            .then((res) => {
                console.log("坯布列表===", res)
                if (res.code == 200) {
                    setloading(false)
                    if (res.data.total == 0) {
                        setdisabled(true);
                        return;
                    }
                    setsize(res.data.size);
                    setcurrent(res.data.current);
                    setleftData(res.data.records);
                    setleftTotal(res.data.total);
                    setSelectId(res.data.records[0].id)
                    getYarnStockDetail(res.data.records[0].id)
                }
            })
    }
    // 坯布出货详情
    const getYarnStockDetail = (id) => {
        fetch(requestUrl + "/api-stock/fabricStockIo/findById?id=" + id, {
            method: "POST",
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token"),
            },
        })
            .then(res => { return res.json() })
            .then((res) => {
                console.log("坯布出货单详情", res)
                if (res.code === 200) {
                    setspinning(false);
                    setyarn_stock_detail(res.data)
                }
            })
    }
    // 新增
    const add = () => {
        setdetailType("add");

    }
    const edit = () => {
        setdetailType("edit")
    }
    const cancel = () => {
        setdetailType("detail")
    }
    // 细码
    const openOutStockOrder = () => {
        fetch(requestUrl + "/api-stock/fabricStockIo/printOutBoundBill?id=" + selectId, {
            method: "POST",
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token"),
            },
        })
            .then(res => { return res.json() })
            .then(res => {
                console.log("出货单==", res)
                if (res.code === 200) {

                    setDeliveryOrder(res.data);
                    setOutStockOrder(true);
                }
            })
    }
    // 保存
    const onSave = () => {
        if (!orderData) return;
        if (!orderData.customerId) {
            message.warning("请先选择客户！");
            return;
        }
        console.log("新增或者编辑的表单字段==", orderData)
        fetch(requestUrl + "/api-stock/fabricStockIo/saveOrModify", {
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
                if (res.code === 200) {
                    getData(data);
                    setdetailType("detail");
                }
            })
        props.saveOrderData();
        props.saveSelectData()
    }
    //  获取子组件参数
    const save = (value) => {
        console.log("子组件===", value)
        setorderData(value)
    }

    // 审核后更新列表
    const update = () => {
        setspinning(true);
        getData({ page: current, size: size });
    }
    const delect = () => {
        confirm({
            title: '确定删除出货单并将对应的条码取消出库？',
            okText: '确定',
            cancelText: '取消',
            onOk() {
                console.log('OK');
                delectRequest(selectId)
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    const delectRequest = (id) => {
        setspinning(true)
        fetch(requestUrl + "/api-stock/fabricStockIo/deleteById?id=" + id, {
            method: "POST",
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token"),
            },
        })
            .then(res => { return res.json() })
            .then(res => {
                console.log(res)
                if (res.code === 200) {
                    getData({ page: current, size: size })
                }
            })
    }
    const columns = [
        {
            title: '出库单号',
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
        showSizeChanger: true,
        showTotal: () => (`共${leftTotal}条`)
    }
    const modalState = (value) => {
        console.log(value);
        setOutStockOrder(value)
    }
    return <div className="right-container">
        {detailType === "detail" && <div className="custom">
            <div className="title">坯布出货</div>
            <div className="custom-right">
                <Button type="primary" onClick={add}>
                    +新增
                </Button>
                <Button disabled={disabled} onClick={edit}>
                    编辑
                </Button>
                <Button disabled={disabled} onClick={delect}>
                    删除
                </Button>
                <Button disabled={disabled}>
                    导出
                </Button>
                <Button onClick={openOutStockOrder}>
                    细码
                </Button>
            </div>
        </div>}
        {
            (detailType === "add" || detailType === "edit") && <div className="custom">
                <div className="title">坯布出货</div>
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
                                setSelectId(record.id);
                                getYarnStockDetail(record.id);
                            },
                        };
                    }}
                />
            </div>
            <Spin spinning={spinning}>
                {detailType === "detail" && <OrderDetail data={yarn_stock_detail} update={update} />}
                {detailType === "edit" && <EditEnterStockOrder save={save} data={yarn_stock_detail} />}
                {detailType === "add" && <CreateOrder save={save} ref={childRef} />}
            </Spin>
        </div>

        {outStockOrder && <DeliveryOrder deliveryOrder={deliveryOrder} modalState={modalState} />}
    </div>
}
const mapStateToProps = (state) => {
    return state
}
export default connect(mapStateToProps, { saveOrderData, saveSelectData })(withRouter(InStock))