import { useEffect, useState } from "react"
import { Table, Input, Select, DatePicker, Form, Row, Modal, Button, Tag, message } from "antd";
import { PlusCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { requestUrl, getNowFormatDate } from "../../../utils/config";
import { SAVE_ORDER, SAVE_SELECTDATA } from "../../../actons/type";
import {saveOrderData,saveSelectData}  from "../../../actons/action"
import { connect } from "react-redux";
import 'moment/locale/zh-cn';
import moment from "moment"
import locale from 'antd/es/date-picker/locale/zh_CN';
import "../../yarnInventory/style.css"
const { TextArea } = Input;
const { Option } = Select;
document.title = "新增入库单";
const day = (timeStamp) => {
    if (!timeStamp) return;
    var date = new Date(timeStamp);
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return M + D;
};
function CreateEnterStockOrder(props) {
    const [bizDate, setbizDate] = useState("");
    const [remark, setremark] = useState("");
    const [address, setaddress] = useState("");
    const [form] = Form.useForm();
    const [inventoryData, setinventoryData] = useState([]); // 弹窗库存
    const [modalCurrent, setmodalCurrent] = useState(1);
    const [modalTotal, setmodalTotal] = useState(10);
    const [modalsize, setmodalsize] = useState(10);
    const [barCodeData, setbarCodeData] = useState([]);
    const [selected, setselected] = useState([]);
    const [visible, setvisible] = useState(true);
    const [customer, setcustomer] = useState([{}]);
    const [selectOrderData, setselectOrderData] = useState([])
    const [fabricStockIoDtls, setfabricStockIoDtls] = useState([]);
    const [barSum, setbarSum] = useState(0);
    const [weightSum, setweightSum] = useState(0);
    const [barcodeIds, setbarcodeIds] = useState();
    const [volQtySum, setvolQtySum] = useState(0);
    const [customerId, setcustomerId] = useState();
    const [customerName, setcustomerName] = useState("");
    useEffect(() => {
        if (props.data) {
            setbizDate(props.data.bizDate);
            setremark(props.data.remark);
        }
        getCustomer()
        getInventory({
            page: 1,
            size: 10,
            customerId: customerId
        });
    }, []);

    // 选择入库日期
    const selectDate = (date, dateString) => {
        setbizDate(dateString)
        props.save({
            "address": address,
            "billStatus": "0",
            "billType": "0",
            "bizDate": dateString,
            "code": "",
            "customerId": customerId,
            "fabricStockIoDtls": [
                {
                    "barcodeIds": "",
                    "cancelIds": "",
                    "knitOrderId": 0,
                    "volQty": 0,
                    "weight": 0
                }
            ],
            "flag": 0,
            "id": 0,
            "remark": remark
        })
    }
    // 保存备注
    const saveremark = ({ target: { value } }) => {
        setremark(value)
        props.save({
            "address": address,
            "billStatus": "0",
            "billType": "0",
            "bizDate": bizDate ? bizDate : getNowFormatDate(),
            "code": "",
            "customerId": customerId,
            "fabricStockIoDtls": [
                {
                    "barcodeIds": "",
                    "cancelIds": "",
                    "knitOrderId": 0,
                    "volQty": 0,
                    "weight": 0
                }
            ],
            "flag": 0,
            "id": 0,
            "remark": value
        })
    }
    // 保存地址
    const saveAddress = ({ target: { value } }) => {
        setaddress(value);
        props.save({
            "address": value,
            "billStatus": "",
            "billType": "0",
            "bizDate": bizDate ? bizDate : getNowFormatDate(),
            "code": "",
            "customerId": customerId,
            "fabricStockIoDtls": [
                {
                    "barcodeIds": "",
                    "cancelIds": "",
                    "knitOrderId": 0,
                    "volQty": 0,
                    "weight": 0
                }
            ],
            "flag": 0,
            "remark": remark
        })
    }
    const today = moment();
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
                if (res.code === 200) {
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
                if (res.code == 200) {
                    setmodalCurrent(res.data.current);
                    setinventoryData(res.data.records);
                    setmodalTotal(res.data.total);
                    setmodalsize(res.data.size);
                    setbarCodeData([])
                }
            })
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
        const _fabricStockIoDtls = [...fabricStockIoDtls];
        if (_selected.indexOf(record.id) >= 0) {
            _selected.splice(_selected.indexOf(record.id), 1);
            _fabricStockIoDtls.splice(_fabricStockIoDtls.indexOf(record), 1)
        } else {
            _selected.push(record.id);
            _fabricStockIoDtls.push(record)
        }

        let totalWeight = _fabricStockIoDtls.reduce((pre, cur) => {
            return pre + cur.weight
        }, 0)
        const totalVolQty = _fabricStockIoDtls.reduce((pre, cur) => {
            return pre + cur.volQty
        }, 0)
        setweightSum(totalWeight.toFixed(2));
        setvolQtySum(totalVolQty);
        setbarcodeIds(_selected.join(","))
        setselected(_selected);
        setfabricStockIoDtls(_fabricStockIoDtls);
        setbarSum(_fabricStockIoDtls.length);
    }
    const rowSelection = {
        selectedRowKeys: selected,
        onChange: (_selectedRowKeys, _selectedRows) => {
            const ids = _selectedRows.map((item) => {
                return item.id;
            })
            let totalWeight = _selectedRows.reduce((pre, cur) => {
                return pre + cur.weight
            }, 0)
            const totalVolQty = _selectedRows.reduce((pre, cur) => {
                return pre + cur.volQty
            }, 0)
            setweightSum(totalWeight.toFixed(2));
            setvolQtySum(totalVolQty);
            setbarcodeIds(ids.join(","));
            setselected(_selectedRowKeys);
            setfabricStockIoDtls(_selectedRows);
            setbarSum(_selectedRows.length);
        },
    };
    // 条码
    const getBarCode = (param) => {
        setselected([])
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
    const handleOk = () => {
        const _fabricStockIoDtls = [];
        const selectOrderData = props.totalOrder;
        props.selectData._volQty = volQtySum;
        props.selectData._weight = weightSum;
        props.selectData.totalMoney = (props.selectData.price * weightSum).toFixed(2);
        selectOrderData.push(props.selectData)
        selectOrderData.map((item) => {
            _fabricStockIoDtls.push({
                "barcodeIds": barcodeIds,
                "cancelIds": "",
                "knitOrderId": item.knitOrderId,
                "volQty": volQtySum,
                "weight": weightSum
            })
        })
        props.save({
            "address": address,
            "billStatus": "0",
            "billType": "0",
            "bizDate": bizDate ? bizDate : getNowFormatDate(),
            "code": "",
            "customerId": customerId,
            "fabricStockIoDtls": _fabricStockIoDtls,
            "flag": 0,
            "remark": remark
        })
        setselectOrderData([...props.totalOrder]);
        props.saveOrder(selectOrderData)
        setvisible(false);
        setinventoryData();
        setbarCodeData();
        setbarSum(0);
        setweightSum(0)
    }
    const add = () => {
        setvisible(true)
    }
    // 弹窗表单
    const onFinish = (value) => {
        console.log(value)
        if (value.customerId === undefined) { value.customerId = customer[0].id }
        getInventory({ ...value, page: 1, size: 10 })
    }
    // 关闭弹窗
    const closeModal = () => {
        setvisible(false);
        setweightSum(0);
        setbarSum(0);
        setbarcodeIds();
        setinventoryData();
        setbarCodeData();
    }
    const selectOrder = (value) => {
        props.selectOrder(value)
    }
    const selectCustomer = (value) => {
        setcustomerId(value);
        customer.map((item) => {
            if (item.id === value) {
                setcustomerName(item.name)
            }
        })
    }
    return <div className="right">
        <div className="add-content">
            <div className="detail-title">
            </div>
            <div className="detail-basicData">
                <div className="row">
                    <div className="col">
                        <div className="label">入库单号</div>
                        <Input disabled placeholder="保存自动生成" />
                    </div>
                    <div className="col">
                        <div className="label13">客户</div>
                        <Input disabled value={customerName} />
                    </div>
                    <div className="col">
                        <div className="label">收货方</div>
                        <Input onChange={saveAddress} />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="label12">出货时间</div>
                        <DatePicker onChange={selectDate} locale={locale} defaultValue={moment(today)}
                            showToday />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="label1">备注</div>
                        <TextArea autoSize={{ minRows: 2, maxRows: 6 }} onChange={saveremark} />
                    </div>
                </div>
            </div>
            <div className="enter-yarn-table">
                <div className="">
                    <PlusCircleOutlined style={{ fontSize: '20px', marginRight: "10px" }} onClick={add} />
                    <CloseCircleOutlined style={{ fontSize: '20px' }} />
                </div>
                <Table
                    columns={[
                        { title: "生产单号", width: 130, dataIndex: "knitOrderCode" },
                        { title: "客户单号", width: 130, dataIndex: "customerBillCode" },
                        { title: "坯布编码", width: 130, dataIndex: "greyFabricCode" },
                        { title: "布类", width: 130, dataIndex: "fabricType" },
                        { title: "纱别", width: 130, dataIndex: "yarnInfo" },
                        { title: "针寸", width: 70, dataIndex: "inches" },
                        { title: "客户颜色", width: 70, dataIndex: "customerCode" },
                        { title: "出货卷数", width: 70, dataIndex: "_volQty" },
                        { title: "出货重量", width: 70, dataIndex: "_weight" },
                        { title: "单位", width: 40, render: () => (<span>kg</span>) },
                        { title: "加工单价", width: 70, dataIndex: "price" },
                        { title: "金额", width: 130, dataIndex: "totalMoney" },
                    ]}
                    dataSource={selectOrderData}
                    rowSelection={rowSelection}
                    pagination={false}
                    rowKey={(record) => record.id}
                />
            </div>
        </div>
        <Modal
            className="customModal"
            destroyOnClose
            title="选择条码"
            visible={visible}
            footer={[
                <div className="sum-title">
                    {
                        barSum > 0 && <p><span>已选{barSum}条</span> <span>共{weightSum}kg</span> <Tag color="green">清空</Tag></p>
                    }
                </div>,
                <div className="right">
                    <Button key="submit" type="primary" onClick={handleOk} >
                        添加
                    </Button>
                    <Button onClick={closeModal}>
                        取消
                    </Button>
                </div>,
            ]}
            onCancel={closeModal}
            width={1500}
        >
            <Form
                form={form}
                layout="horizontal"
                onFinish={onFinish}
                preserve={false}
                initialValues={{
                    customerId: customerId
                }}
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
                        <Select style={{ width: "100px" }} disabled={customerId} onChange={selectCustomer}>
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
                                    selectOrder(record)
                                    getBarCode({ orderId: record.knitOrderId, loomId: record.loomId })
                                },
                            };
                        }}
                        rowKey={(record, index) => record.id}
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
                        rowKey={(record, index) => record.id}
                        pagination={ false }
                    />
                </div>
            </div>
        </Modal>
    </div>
}
const mapStateToProps = (state) => {
    console.log(state)
    return {
        totalOrder: state.selectOrderDataReducer.selectOrderData || [],
        selectData: state.selectDataReducer.selectData
    }
}
const mapDispatchToProps = dispatch => {
    return {
        saveOrder: (value) => {
            dispatch({ type: SAVE_ORDER, payload: value })
        },
        selectOrder: (value) => {
            dispatch({ type: SAVE_SELECTDATA, payload: value })
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateEnterStockOrder)