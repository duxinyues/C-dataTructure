import { useState, useEffect } from "react"
import { Table, PageHeader, Button, Modal, Form, Input, Row, Select, Radio } from "antd";
import { onlyFormat, requestUrl } from "../../../utils/config";
import { withRouter } from "react-router-dom";
import OrderDetail from "./orderDetail";
import CreateOrder from "./createOrder";
import "../../yarnInventory/style.css"
import "./style.css"
const { confirm } = Modal;
const { Option } = Select;
document.title = "坯布出货";
const day = (timeStamp) => {
    if (!timeStamp) return;
    var date = new Date(timeStamp);
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return M + D;
};
function InStock(props) {
    const [disabled, setdisabled] = useState(false);
    const [leftData, setleftData] = useState([]);
    const [leftTotal, setleftTotal] = useState(0);
    const [current, setcurrent] = useState(1);
    const [size, setsize] = useState(10);
    const [yarn_stock_detail, setyarn_stock_detail] = useState({});
    const [selectId, setSelectId] = useState(0);
    const [detailType, setdetailType] = useState("detail"); // 用户操作类型
    const [orderData, setorderData] = useState(); // 编辑入库单的字段
    const [loading, setloading] = useState(true);
    const [visible, setvisible] = useState(false);
    const [customer, setcustomer] = useState([]);
    const [form] = Form.useForm();
    const [inventoryData, setinventoryData] = useState([]);
    const [modalCurrent, setmodalCurrent] = useState(1);
    const [modalTotal, setmodalTotal] = useState(10);
    const [modalsize, setmodalsize] = useState(10);
    const [barCodeData, setbarCodeData] = useState([]);
    const [selected, setselected] = useState([]);
    const data = {
        page: 1,
        size: 10,
    }
    useEffect(() => {
        getData(data);
        getCustomer()
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
                console.log(res)
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
                if (res.code == 200) {
                    setyarn_stock_detail(res.data)
                }
            })
    }
    // 新增
    const add = () => {
        setvisible(true);
        getInventory({ page: 1, size: 10 })
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
        orderData.fabricStockIoDtls = []
        setloading(true)
        orderData.id = yarn_stock_detail.id;
        console.log("新增或者编辑的表单字段==", orderData)
        return;
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
                if (res.code == 200) {
                    getData(data);
                    setdetailType("detail");
                }
            })
    }
    //  获取子组件参数
    const save = (value) => {
        console.log("这是子组件传递的参数==", value)
        setorderData(value)
    }
    const selectcustomer = () => {

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
        fetch(requestUrl + "/api-stock/fabricStockIo/deleteById?id=" + id, {
            method: "POST",
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token"),
            },
        })
            .then(res => { return res.json() })
            .then(res => {
                console.log(res)
            })
    }

    const handleOk = () => {

    }
    // 弹窗表单
    const onFinish = (value) => {
        console.log(value)
        getInventory({ ...value, page: 1, size: 10 })
    }
    // 关闭弹窗
    const closeModal = () => {
        setvisible(false)
    }
    // 获取客户列表
    const getCustomer = () => {
        fetch(requestUrl + "/api-stock/stockCommon/findCustomerDown", {
            method: "POST",
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token")
            },
        })
            .then(res => { return res.json() })
            .then(res => {
                console.log(res)
                if (res.code == 200) {
                    setcustomer(res.data)
                }
            })
    }
    // 查询库存
    const getInventory = (param) => {
        fetch(requestUrl + "/api-stock/fabricStockIo/findAllstock", {
            method: "POST",
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(param)
        })
            .then(res => { return res.json() })
            .then(res => {
                console.log(res)
                if (res.code == 200) {
                    setmodalCurrent(res.data.current);
                    setinventoryData(res.data.records);
                    setmodalTotal(res.data.total);
                    setmodalsize(res.data.size);
                }
            })
    }
    // 条码
    const getBarCode = (param) => {
        fetch(requestUrl + "/api-stock/fabricStockIo/findBarcodeByLoomId?orderId=" + param.orderId + "&loomId=" + param.loomId, {
            method: "POST",
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token")
            },
        })
            .then(res => { return res.json() })
            .then(res => {
                console.log(res)
                if (res.code == 200) {
                    setbarCodeData(res.data)
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

    const modalPagination = {
        total: modalTotal,
        pageSize: modalsize,
        current: modalCurrent,
        onChange: (page, pageSize) => {
            getInventory({
                page: page,
                size: pageSize,
            })
        },
        showSizeChanger: false,
        showTotal: () => (`共${modalTotal}条`)
    }
    const selectRow = (record) => {
        const _selected = [...selected];
        if (_selected.indexOf(record.id) >= 0) {
            _selected.splice(_selected.indexOf(record.id), 1);
        } else {
            _selected.push(record.id);
        }
        setselected(_selected)
    }
    const rowSelection = {
        selectedRowKeys: selected,
        onChange: (_selectedRowKeys, _selectedRows) => {
            console.log(_selectedRowKeys);
            console.log(_selectedRows);
            setselected(_selectedRowKeys)
        },
    };
    return <div className="right-container">
        {detailType == "detail" && <PageHeader
            title="坯布出货"
            extra={[
                <Button type="primary" onClick={add}>
                    +新增
                </Button>,
                <Button disabled={disabled} onClick={edit}>
                    编辑
                </Button>,
                <Button disabled={disabled} onClick={delect}>
                    删除
                </Button>,
                <Button disabled={disabled}>
                    导出
                </Button>,
            ]}
        />}
        {
            (detailType == "add" || detailType == "edit") && <PageHeader
                title="坯布出货"
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
            {detailType == "detail" && <OrderDetail data={yarn_stock_detail} />}
            {detailType == "add" && <CreateOrder save={save} />}
            {detailType == "edit" && <CreateOrder data={yarn_stock_detail} save={save} />}
        </div>

        <Modal
            className="customModal"
            destroyOnClose
            title="选择条码"
            visible={visible}
            footer={[
                <Button key="submit" type="primary" onClick={handleOk} >
                    添加
                </Button>,
                <Button onClick={closeModal}>
                    取消
                </Button>
            ]}
            onCancel={closeModal}
            width={1500}
        >
            <Form
                form={form}
                layout="horizontal"
                onFinish={onFinish}
                preserve={false}
            >
                <Row gutter={24}>
                    <Form.Item
                        name="knitOrderCode"
                        label="生产单号"
                        style={{ marginLeft: "10px" }}
                    >
                        <Input style={{ width: "100px" }} />
                    </Form.Item>
                    <Form.Item
                        name="customerId"
                        label="客户"
                        style={{ marginLeft: "10px" }}
                    >
                        <Select onChange={selectcustomer} style={{ width: "100px" }}>
                            {
                                customer.map((item, key) => (<Option value={item.id} key={key}>{item.name}</Option>))
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="customerBillCode"
                        label="客户单号"
                        style={{ marginLeft: "10px" }}
                    >
                        <Input style={{ width: "100px" }} />
                    </Form.Item>
                    <Form.Item
                        name="greyFabricCode"
                        label="坯布编码"
                        style={{ marginLeft: "10px" }}
                    >
                        <Input style={{ width: "100px" }} />
                    </Form.Item>
                    <Form.Item
                        name="fabricType"
                        label="布类"
                        style={{ marginLeft: "10px" }}
                    >
                        <Input style={{ width: "100px" }} />
                    </Form.Item>
                    <Form.Item
                        name="yarnBrandBatch"
                        label="纱牌纱批"
                        style={{ marginLeft: "10px" }}
                    >
                        <Input style={{ width: "100px" }} />
                    </Form.Item>
                    <Form.Item style={{ marginLeft: "10px" }}>
                        <Button type="primary" htmlType="submit">
                            搜索
                        </Button>
                    </Form.Item>
                </Row>
            </Form>
            <div className="modal-content">
                <div className="left">
                    <Table
                        columns={[
                            { title: "生产单号", dataIndex: "knitOrderCode" },
                            { title: "客户", dataIndex: "customerName" },
                            { title: "机台", dataIndex: "loomCode" },
                            { title: "客户单号", dataIndex: "customerBillCode" },
                            { title: "坯布编码", dataIndex: "greyFabricCode" },
                            { title: "布类", dataIndex: "fabricType" },
                            { title: "卷数", dataIndex: "volQty" },
                            { title: "重量", dataIndex: "weight" }
                        ]}
                        dataSource={inventoryData}
                        pagination={modalPagination}
                        onRow={record => {
                            return {
                                onClick: () => {
                                    console.log("选中的数据==", record)
                                    getBarCode({ orderId: record.knitOrderId, loomId: record.loomId })
                                },
                            };
                        }}
                        rowKey={(record,index)=>record.id}F
                    />
                </div>
                <div className="right">
                    <Table
                        columns={[
                            { title: "条码", dataIndex: "barcode" },
                            { title: "疋号", dataIndex: "seq" },
                            { title: "入库重量", dataIndex: "weight" },
                            { title: "入库日期", dataIndex: "inStockTime", render: (time) => (<span>{day(time)}</span>) },
                            { title: "查布记录", dataIndex: "" }
                        ]}
                        dataSource={barCodeData}
                        rowSelection={rowSelection}
                        scroll={{ y: 240 }}
                        onRow={(record) => ({
                            onClick: () => {
                                selectRow(record);
                            },
                        })}
                        rowKey={(record,index)=>record.id}
                    />
                </div>
            </div>
        </Modal>
    </div>
}

export default withRouter(InStock)