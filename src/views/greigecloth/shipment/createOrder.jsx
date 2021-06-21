/*
 * @Author: 1638877065@qq.com
 * @Date: 2021-05-31 23:45:05
 * @LastEditTime: 2021-06-21 19:28:48
 * @LastEditors: 1638877065@qq.com
 * @Description: 坯布出货单【新增组件】
 * @FilePath: \cloud-admin\src\views\greigecloth\shipment\createOrder.jsx
 * 
 */
import { useEffect, useState } from "react"
import { Table, Input, Select, DatePicker, Form, Row, Modal, Button, Tag, message } from "antd";
import { PlusCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { requestUrl, getNowFormatDate, day } from "../../../utils/config";
import { saveOrderData, saveSelectData } from "../../../actons/action"
import { connect } from "react-redux";
import 'moment/locale/zh-cn';
import moment from "moment"
import locale from 'antd/es/date-picker/locale/zh_CN';
import "../../yarnInventory/style.css";
import OpenBarcode from "./openBarcode";
const { TextArea } = Input;
const { Option } = Select;
document.title = "新增出库单";

function CreateEnterStockOrder(props) {
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
    const [visible, setvisible] = useState(true); // 开关弹窗
    const [customer, setcustomer] = useState([{}]); // 获取客户列表
    const [selectOrderData, setselectOrderData] = useState([]); // 选中订单
    const [fabricStockIoDtls, setfabricStockIoDtls] = useState([]);//  每个订单选中的条码信息
    const [barSum, setbarSum] = useState(0); // 选中条码总条数
    const [weightSum, setweightSum] = useState(0);// 选中条码总重量
    const [barcodeIds, setbarcodeIds] = useState();// 选中条码的ID
    const [volQtySum, setvolQtySum] = useState(0);// 选中的条码的卷数总和
    const [customerId, setcustomerId] = useState();// 选中客户的ID
    const [customerName, setcustomerName] = useState("");// 选中客户的名称
    const [stockIoDtls, setStockIoDtls] = useState([]); // 出货单的订单信息
    const [isOpenBarcode, setIsOpenBarcode] = useState(false);
    const [editOrder, setEditOrder] = useState([])
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
            "fabricStockIoDtls": stockIoDtls,
            "flag": 0,
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
            "fabricStockIoDtls": stockIoDtls,
            "flag": 0,
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
            "fabricStockIoDtls": stockIoDtls,
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
    const rowSelection_modal = {
        selectedRowKeys: selected,
        onChange: (_selectedRowKeys, _selectedRows) => {
            console.log(_selectedRows)
            const ids = _selectedRows.map((item) => {
                return item.id;
            })
            let totalWeight = _selectedRows.reduce((pre, cur) => {
                return pre + cur.weight
            }, 0)
            setweightSum(totalWeight.toFixed(2));
            setvolQtySum(_selectedRows.length);
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
        setselected([]);
        const _stockIoDtls = stockIoDtls.map((item) => { return item.barcodeIds }).join(",");
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
                    const noSelect = [];
                    if (stockIoDtls.length === 0) {
                        setbarCodeData(res.data);
                        return;
                    }
                    res.data.map((item) => {
                        console.log(_stockIoDtls.indexOf(item.id))
                        if (_stockIoDtls.indexOf(item.id) < 0) noSelect.push(item);
                    })
                    setbarCodeData(noSelect)
                }
            })
    }
    const handleOk = () => {
        const _stockIoDtls = [...stockIoDtls];
        const selectOrderData = props.totalOrder;
        props.selectData._volQty = volQtySum; // 选中条码的总卷数
        props.selectData._weight = weightSum; // 选中条码的总重量
        props.selectData.totalMoney = (props.selectData.price * weightSum).toFixed(2); // 选中条码的总金额
        props.selectData.barcodeList = fabricStockIoDtls;
        // 去重
        if (selectOrderData.length === 0) {
            selectOrderData.push(props.selectData);
        } else {
            selectOrderData.map((item) => {
                if (item.knitOrderCode === props.selectData.knitOrderCode) {
                    item.barcodeList = [...item.barcodeList, ...props.selectData.barcodeList]
                    item._volQty = Number(item._volQty) + Number(props.selectData._volQty);
                    item._weight = Number(item._weight) + Number(props.selectData._weight);
                    item.totalMoney = (Number(item.totalMoney) + props.selectData.price * weightSum);
                } else {
                    selectOrderData.push(props.selectData);
                }
            })
        }
        _stockIoDtls.push({
            "barcodeIds": barcodeIds,
            "cancelIds": "",
            "knitOrderId": props.selectData.knitOrderId,
            "volQty": props.selectData._volQty,
            "weight": props.selectData._weight
        })
        setStockIoDtls(_stockIoDtls);
        setselectOrderData([...selectOrderData]);
        props.saveOrderData([...selectOrderData])
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
        const orderList = selectOrderData;
        const _stockIoDtls = stockIoDtls;
        const _selectOrderList = selectOrderList;
        orderList.map((item) => {
            if (_selectOrderList.indexOf(item.id) >= 0) {
                orderList.splice(_selectOrderList.indexOf(item.id), 1);
            }
        })
        setStockIoDtls(_stockIoDtls);
        props.save({
            "address": address,
            "billStatus": "0",
            "billType": "0",
            "bizDate": bizDate ? bizDate : getNowFormatDate(),
            "code": "",
            "customerId": customerId,
            "fabricStockIoDtls": stockIoDtls,
            "flag": 0,
            "remark": remark
        })
        setselectOrderData([...orderList]);
        props.saveOrderData(orderList)
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

    // 展开所选的条码
    const openBarcode = (param) => {
        setIsOpenBarcode(true);
        setEditOrder(param);
        setfabricStockIoDtls(param.barcodeList)
    }

    /**
     * 子组件编辑所选条码后，返回的数据
     * @param {*} value 
     */
    const editSelectBarcode = (value) => {
        console.log("=====", selectOrderData);
        console.log("????", editOrder);
        const _stockIoDtls = [...stockIoDtls];
        // 取消的条码
        const cancelIds = value.data.map((item) => {
            return item.id
        })
        const barcodeList = editOrder.barcodeList.filter((item) => cancelIds.indexOf(item.id) < 0)
        const barcodeIds = barcodeList.map((item) => {
            return item.id
        })
        console.log("重新选择的条码==", barcodeIds)
        // 取消条码数量
        const cancelW = value.data.reduce((pre, cur) => {
            return pre + cur.weight
        }, 0)

        selectOrderData.map((item, index) => {
            console.log(item);
            if (item.id === editOrder.id) {
                item._volQty = barcodeIds.length;
                item._weight = Number(item._weight) - cancelW;
                item.barcodeList = barcodeList;
                item.totalMoney = (item.price * item._weight).toFixed(2)
                _stockIoDtls[index].barcodeIds = barcodeIds.join(",");
                _stockIoDtls[index]._volQty = barcodeIds.length;
                _stockIoDtls[index]._weight = Number(item._weight);
            }
        })
        setIsOpenBarcode(value.open);
        props.save({
            "address": address,
            "billStatus": "0",
            "billType": "0",
            "bizDate": bizDate ? bizDate : getNowFormatDate(),
            "customerId": customerId,
            "fabricStockIoDtls": _stockIoDtls,
            "flag": 0,
            "remark": remark
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
                        { title: "客户颜色", width: 70, dataIndex: "customerCode" },
                        {
                            title: "出货卷数", width: 70, dataIndex: "_volQty", render: (item, index) => (<span onClick={() => {
                                openBarcode(index)
                            }} style={{ color: "blue", cursor: "pointer" }}>{item}</span>)
                        },
                        { title: "出货重量", width: 70, dataIndex: "_weight" },
                        { title: "单位", width: 40, render: () => (<span>kg</span>) },
                        { title: "加工单价", width: 70, dataIndex: "price" },
                        { title: "金额", width: 130, dataIndex: "totalMoney" },
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
                        barSum > 0 && <p><span>已选{barSum}条</span> <span>共{weightSum}kg</span></p>
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
                        <Select style={{ width: "100px" }} disabled={selectOrderData.length > 0} onChange={selectCustomer}>
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
                                    selectOrder(record);
                                    getBarCode({ orderId: record.knitOrderId, loomId: record.loomId });
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
        {isOpenBarcode && <OpenBarcode editSelectBarcode={editSelectBarcode} isOpen={isOpenBarcode} data={fabricStockIoDtls} />}
    </div>
}
const mapStateToProps = (state) => {
    console.log(state)
    return {
        totalOrder: state.selectOrderDataReducer.selectOrderData || [],
        selectData: state.selectDataReducer.selectData
    }
}

export default connect(mapStateToProps, { saveOrderData, saveSelectData })(CreateEnterStockOrder)