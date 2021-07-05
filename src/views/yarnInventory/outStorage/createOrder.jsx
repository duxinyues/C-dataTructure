import { useEffect, useState, } from "react"
import { Table, Input, Select, DatePicker, Modal, Form, Row, Button, Col, message } from "antd";
import { PlusCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { withRouter } from "react-router-dom";
import { getCustomer, outYarnModalList } from "../../../api/apiModule"
import 'moment/locale/zh-cn';
import moment from "moment"
import locale from 'antd/es/date-picker/locale/zh_CN';
import "../style.css"
const { TextArea } = Input;
const { Option } = Select;
document.title = "新增退纱出库单"
function CreateOutStockOrder(props) {
    console.log(props)
    const [form] = Form.useForm();
    const [customerId, setcustomerId] = useState("");
    const [bizDate, setbizDate] = useState("");
    const [billType, setbillType] = useState(0);
    const [remark, setremark] = useState("");
    const [yarn_stock_detail, setyarn_stock_detail] = useState({});
    const [outDtls, setoutDtls] = useState([]);
    const [stockTypeIndex, setstockTypeIndex] = useState(0);
    const [customer, setcustomer] = useState([]);
    const [selctRowKeys, setselctRowKeys] = useState([]);
    const [selectStock, setSelectStock] = useState([]);
    const [selectoutDtlsRowKeys, setselectoutDtlsRowKeys] = useState([]);
    const [selectoutDtlsRowData, setselectoutDtlsRowData] = useState([]);
    const [visible, setvisible] = useState(false);
    const [records, setRecords] = useState({});
    const [yarnStock, setYarnStock] = useState([])
    useEffect(() => {
        getCustomer((data) => {
            setcustomer(data)
        })
        if (props.data) {
            setyarn_stock_detail(props.data);
            setcustomerId(props.data.customerId);
            setbizDate(props.data.bizDate);
            setbillType(props.data.billType);
            setremark(props.data.remark);
            setoutDtls([...props.data.outDtls])
        }
    }, []);
    //选择订单类型
    const selectStockType = (value) => {
        setstockTypeIndex(value);
        setbillType(value);
        props.save({
            customerId: customerId,
            bizDate: bizDate,
            remark: remark,
            outDtls: outDtls
        })
    }
    // 选择客户
    const selectcustomer = (value) => {
        setcustomerId(value)
        outYarnModalList({
            "customerBillCode": "",
            "customerId": value,
            "page": 1,
            "size": 10
        }, (res) => {
            console.log(res)
            if (res.code === 200) {
                setYarnStock([...res.data.records])
            }
        })
        props.save({
            customerId: value,
            bizDate: bizDate,
            remark: remark,
            outDtls: outDtls
        })
    }
    // 选择入库日期
    const selectDate = (date, dateString) => {
        setbizDate(dateString)
        props.save({
            customerId: customerId,
            bizDate: dateString,
            remark: remark,
            outDtls: outDtls
        })
    }
    // 保存备注
    const saveRemark = ({ target: { value } }) => {
        setremark(value)
        props.save({
            customerId: customerId,
            bizDate: bizDate,
            remark: value,
            outDtls: outDtls
        })
    }
    const enter_yarn_colums = [
        {
            title: '纱支',
            dataIndex: 'yarnName',
        },
        {
            title: '批次',
            dataIndex: 'yarnBrandBatch',
        },
        {
            title: '颜色',
            dataIndex: "colorCode",
        },
        {
            title: '合同号',
            dataIndex: 'customerBillCode',

        }, {
            title: '件数',
            dataIndex: 'pcs',
            render: (pcs) => (<Input defaultValue={pcs} onChange={({ target: { value } }) => {
                changeInput("pcs", value)
            }} />),
            width: 130
        },
        {
            title: '规格',
            dataIndex: 'spec',
            render: (spec) => (<Input defaultValue={spec} onChange={({ target: { value } }) => {
                changeInput("spec", value)
            }} />),
            width: 130
        }, {
            title: '重量',
            dataIndex: 'weight',
            render: (weight) => (<Input defaultValue={weight} onChange={({ target: { value } }) => {
                changeInput("weight", value)
            }} />),
            width: 130
        },
    ];
    const openModal = () => {
        if (!customerId) {
            message.warning("请先选择客户！");
            return;
        }
        setvisible(true)
    }
    const closeModal = () => {
        setvisible(false);
        setselctRowKeys([]);
        setSelectStock([])
    }
    const addYarnOutStock = () => {
        setoutDtls([...selectStock]);
        props.save({
            customerId: customerId,
            bizDate: bizDate,
            remark: remark,
            outDtls: selectStock
        })
        setvisible(false);
    }
    const searchStock = (value) => {
    }
    const rowSelection_table = {
        selectedRowKeys: selctRowKeys,
        onChange: (_selectedRowKeys, _selectedRows) => {
            console.log("_selectedRows", _selectedRows)
            setselctRowKeys(_selectedRowKeys);
            _selectedRows.map((item) => {
                delete item.id
            })
            setSelectStock(_selectedRows);
        },
    };
    const rowoutDtlsSelection = {
        selectedRowKeys: selectoutDtlsRowKeys,
        onChange: (_selectedRowKeys, _selectedRows) => {
            setselectoutDtlsRowKeys(_selectedRowKeys);
            setselectoutDtlsRowData(_selectedRows)
        },
    }
    // 编辑Input
    const changeInput = (inputName, value) => {
        console.log(inputName, value, outDtls)
        const _records = records; // 选中行
        outDtls.map((item) => {
            if (_records.id === item.id) {
                item[inputName] = value
                // if (item.hasOwnProperty("pcs")) {
                //     item.weight = Number(item.pcs) * Number(item.spec)
                // }
            }
        })
        console.log("======759679845", outDtls)
        props.save({
            customerId: customerId,
            bizDate: bizDate,
            remark: remark,
            outDtls: outDtls
        })
    }
    const onDeleteStock = () => {
        const _outDtls = outDtls;
        console.log("selectoutDtlsRowKeys==", selectoutDtlsRowKeys)
        _outDtls.map((item) => {
            const index = selectoutDtlsRowKeys.indexOf(item.id);
            if (index > -1) {
                _outDtls.splice(index, 1)
            }
        })
        setoutDtls([..._outDtls])
        props.save({
            customerId: customerId,
            bizDate: bizDate,
            remark: remark,
            outDtls: _outDtls
        })
    }
    const today = moment();
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
                        <Select onChange={selectcustomer} value={yarn_stock_detail.customerName}>
                            {
                                customer.map((item, key) => (<Option value={item.id} key={key}>{item.name}</Option>))
                            }
                        </Select>
                    </div>
                    <div className="col">
                        <div className="label12">出库日期</div>
                        <DatePicker onChange={selectDate} locale={locale} defaultValue={moment(today)}
                            showToday />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="label1">备注</div>
                        <Input.TextArea autoSize={{ minRows: 2, maxRows: 6 }} onChange={saveRemark} />
                    </div>
                </div>
            </div>
            <div className="enter-yarn-table">
                <div>
                    <PlusCircleOutlined style={{ fontSize: '20px', marginRight: "10px" }} onClick={openModal} />
                    <CloseCircleOutlined style={{ fontSize: '20px' }} onClick={onDeleteStock} />
                </div>
                <Table
                    columns={enter_yarn_colums}
                    dataSource={outDtls}
                    pagination={false}
                    rowSelection={rowoutDtlsSelection}
                    rowKey={(record, index) => record.id}
                    onRow={record => {
                        return {
                            onClick: event => {
                                setRecords(record)
                                console.log("点击了==", record)
                            }, // 点击行
                        };
                    }}
                />
            </div>
        </div>
        <Modal
            title="选择库存"
            visible={visible}
            onCancel={closeModal}
            onOk={addYarnOutStock}
            destroyOnClose
            width={900}
        >
            <Form
                form={form}
                layout="horizontal"
                onFinish={searchStock}
                preserve={false}
                initialValues={{
                    customerId: customerId
                }}
            >
                <Row gutter={24}>
                    <Col span={6}>
                        <Form.Item
                            label="纱支"
                            name="yarnName"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            label="合同号"
                            name="customerBillCode"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            label="批次"
                            name="yarnBrandBatch"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item style={{ marginLeft: "10px" }}>
                            <Button type="primary" htmlType="submit" style={{ height: "26px", display: "flex", alignItems: "center" }}>
                                搜索
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <Table
                columns={[
                    {
                        title: "纱支",
                        dataIndex: "yarnName"
                    },
                    {
                        title: "批次",
                        dataIndex: "yarnBrandBatch"
                    },
                    {
                        title: "合同号",
                        dataIndex: "customerBillCode"
                    },
                    {
                        title: "颜色",
                        dataIndex: "colorCode"
                    }
                ]}
                dataSource={yarnStock}
                rowKey={(record) => record.id}
                rowSelection={rowSelection_table}
                pagination={false}
            />
        </Modal>
    </div>
}

export default withRouter(CreateOutStockOrder)