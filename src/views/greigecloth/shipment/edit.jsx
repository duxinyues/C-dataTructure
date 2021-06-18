/*
 * @Author: 1638877065@qq.com
 * @Date: 2021-06-16 10:38:29
 * @LastEditTime: 2021-06-18 13:39:12
 * @LastEditors: 1638877065@qq.com
 * @Description: 出货单编辑
 * @FilePath: \cloud-admin\src\views\greigecloth\shipment\edit.jsx
 * 
 */

import { useEffect, useState } from "react"
import { Table, Input, Select, DatePicker, Form, Row, Modal, Button, Tag, message } from "antd";
import { PlusCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { requestUrl, getNowFormatDate } from "../../../utils/config";
import { saveOrderData, saveSelectData } from "../../../actons/action"
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
function EditEnterStockOrder(props) {
    console.log("编辑出货单===", props);
    const [bizDate, setbizDate] = useState("");   // 日期
    const [remark, setremark] = useState(""); // 备注
    const [address, setaddress] = useState(""); // 收货方地址
    const [form] = Form.useForm();
    const [inventoryData, setinventoryData] = useState([]); // 弹窗库存
    const [modalCurrent, setmodalCurrent] = useState(1);
    const [modalTotal, setmodalTotal] = useState(10);
    const [modalsize, setmodalsize] = useState(10);
    const [barCodeData, setbarCodeData] = useState([]);
    const [selected, setselected] = useState([]); // 选择条码
    const [selectOrderList, setSelectOrderList] = useState([]); // 选中订单列表的ID
    const [visible, setvisible] = useState(false); // 开关弹窗
    const [customer, setcustomer] = useState([{}]); // 获取客户列表
    const [selectOrderData, setselectOrderData] = useState([]); // 选中订单
    const [fabricStockIoDtls, setfabricStockIoDtls] = useState([]);//  每个订单选中的条码信息
    const [barSum, setbarSum] = useState(0); // 选中条码总条数
    const [weightSum, setweightSum] = useState(0);// 选中条码总重量
    const [barcodeIds, setbarcodeIds] = useState();// 选中条码的ID
    const [volQtySum, setvolQtySum] = useState(0);// 选中的条码的卷数总和
    const [customerId, setcustomerId] = useState();// 选中客户的ID
    const [customerName, setcustomerName] = useState("");// 选中客户的名称
    const [stockIoDtls, setStockIoDtls] = useState([]); // 出货单的订单信息;
    useEffect(() => {
        props.data.fabricStockIoDtls.map((item) => {
            item.knitOrderCode = item.orderDto.code;
            item.customerBillCode = item.orderDto.customerBillCode;
            item.greyFabricCode = item.orderDto.greyFabricCode;
            item.fabricType = item.orderDto.fabricType;
            item.yarnInfo = item.orderDto.yarnInfo;
            item.inches = item.orderDto.inches;
            item.customerColor = item.orderDto.customerColor;
            item._volQty = item.volQty;
            item._weight = item.weight;
            item.price = item.orderDto.productPrice;
        })
        setselectOrderData(props.data.fabricStockIoDtls);
        setcustomerId(props.data.customerId)
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

        return () => {
            //组件卸载
            setbarSum(0);
            setselectOrderData([]);
            setfabricStockIoDtls([]);
            props.saveOrderData([]);
            props.saveSelectData({});
        }
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
    const rowSelection_modal = {
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
    const rowSelection_table = {
        selectedRowKeys: selectOrderList,
        onChange: (_selectedRowKeys, _selectedRows) => {
            console.log("_selectedRows=", _selectedRows);
            setSelectOrderList(_selectedRowKeys)
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
        const _stockIoDtls = [...stockIoDtls];
        const _selectOrderData = [...selectOrderData];
        props.selectData._volQty = volQtySum; // 选中条码的总卷数
        props.selectData._weight = weightSum; // 选中条码的总重量
        props.selectData.totalMoney = (props.selectData.price * weightSum).toFixed(2); // 选中条码的总金额
        props.totalOrder.push(props.selectData)
        _stockIoDtls.push({
            "barcodeIds": barcodeIds,
            "cancelIds": "",
            "knitOrderId": props.selectData.knitOrderId,
            "volQty": props.selectData._volQty,
            "weight": props.selectData._weight
        })
        setStockIoDtls(_stockIoDtls)
        props.save({
            "address": address,
            "billStatus": "0",
            "billType": "0",
            "bizDate": bizDate ? bizDate : getNowFormatDate(),
            "code": "",
            "customerId": customerId,
            "fabricStockIoDtls": _stockIoDtls,
            "flag": 0,
            "remark": remark
        })
        _selectOrderData.push(...props.totalOrder)
        setselectOrderData([..._selectOrderData]);
        props.saveOrderData(_selectOrderData)
        // props.saveOrder(selectOrderData)
        setvisible(false);
        setinventoryData();
        setbarCodeData();
        setbarcodeIds();
        setweightSum(0);
        setvolQtySum(0)
        setbarSum(0)
    }
    // 添加订单
    const add = () => {
        setvisible(true)
    }

    const delected = () => {
        const _stockIoDtls = [...stockIoDtls];
        const _fabricStockIoDtls = [];
        const orderList = [...selectOrderData];
        const _selectOrderList = selectOrderList;
        orderList.map((item) => {
            if (_selectOrderList.indexOf(item.id) >= 0) {
                orderList.splice(_selectOrderList.indexOf(item.id), 1);
            }
        })
        console.log(orderList);
        orderList.map((item) => {
            _fabricStockIoDtls.push({
                "barcodeIds": barcodeIds,
                "cancelIds": "",
                "knitOrderId": item.knitOrderId,
                "volQty": volQtySum,
                "weight": weightSum
            });
        });
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
        setselectOrderData([...orderList]);
        props.saveOrderData(orderList)
    }
    // 弹窗表单
    const onFinish = (value) => {
        console.log("表单===", value)
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
        props.saveSelectData(value)
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
                {props.data.billStatus == 0 ? "未审核" : "已审核"}
            </div>
            <div className="detail-basicData">
                <div className="row">
                    <div className="col">
                        <div className="label">入库单号</div>
                        <Input disabled value={props.data.code} />
                    </div>
                    <div className="col">
                        <div className="label13">客户</div>
                        <Input disabled defaultValue={props.data.customerName} />
                    </div>
                    <div className="col">
                        <div className="label">收货方</div>
                        <Input onChange={saveAddress} defaultValue={props.data.address} />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="label12">出货时间</div>
                        <DatePicker onChange={selectDate} locale={locale}
                            defaultValue={moment(props.data.bizDate, "YYYY-MM-DD")} showToday />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="label1">备注</div>
                        <TextArea autoSize={{ minRows: 2, maxRows: 6 }} onChange={saveremark} defaultValue={props.data.remark} />
                    </div>
                </div>
            </div>
            <div className="enter-yarn-table">
                <div className="">
                    <PlusCircleOutlined style={{ fontSize: '20px', marginRight: "10px" }} onClick={add} />
                    <CloseCircleOutlined style={{ fontSize: '20px' }} onClick={delected} />
                </div>
                <Table
                    columns={[
                        { title: "生产单号", width: 130, dataIndex: "knitOrderCode" },
                        { title: "客户单号", width: 130, dataIndex: "customerBillCode" },
                        { title: "坯布编码", width: 130, dataIndex: "greyFabricCode" },
                        { title: "布类", width: 130, dataIndex: "fabricType" },
                        { title: "纱别", width: 130, dataIndex: "yarnInfo" },
                        { title: "针寸", width: 70, dataIndex: "inches" },
                        { title: "客户颜色", width: 70, dataIndex: "customerColor" },
                        { title: "出货卷数", width: 70, dataIndex: "_volQty" },
                        { title: "出货重量", width: 70, dataIndex: "_weight" },
                        { title: "单位", width: 40, render: () => (<span>kg</span>) },
                        { title: "加工单价", width: 70, dataIndex: "price" },
                        { title: "金额", width: 130, dataIndex: "totalMoney", render: (item) => (<span>{Number(item).toFixed(2)}</span>) },
                    ]}
                    dataSource={selectOrderData}
                    rowSelection={rowSelection_table}
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
                        rowSelection={rowSelection_modal}
                        scroll={{ y: 240 }}

                        rowKey={(record, index) => record.id}
                        pagination={false}
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

export default connect(mapStateToProps, { saveOrderData, saveSelectData })(EditEnterStockOrder)