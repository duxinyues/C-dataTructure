import React, { useEffect, useState, } from "react"
import { Table, Input, Select, DatePicker, Popconfirm, Form, Typography, Button } from "antd";
import { stockType } from "../../../utils/config";
import { withRouter } from "react-router-dom";
import { getCustomer } from "../../../api/apiModule"
import 'moment/locale/zh-cn';
import moment from "moment"
import locale from 'antd/es/date-picker/locale/zh_CN';
import "../style.css"
const { TextArea } = Input;
const { Option } = Select;
const today = moment();
function CreateEnterStockOrder(props) {
    console.log(props)
    const [form] = Form.useForm();
    const [customerId, setcustomerId] = useState("");
    const [bizDate, setbizDate] = useState("");
    const [billType, setbillType] = useState(0);
    const [remark, setremark] = useState("")
    const [yarn_stock_detail, setyarn_stock_detail] = useState({});
    const [stockTypeIndex, setstockTypeIndex] = useState(0);
    const [customer, setcustomer] = useState([]);
    const [customerBillCode, setcustomerBillCode] = useState();
    const [editingKey, setEditingKey] = useState('');
    const [data, setData] = useState([]);
    useEffect(() => {
        getCustomer((res) => {
            setcustomer(res)
        })
        // 有详情数据，则为编辑状态
        if (props.data) {
            setyarn_stock_detail(props.data);
            setcustomerId(props.data.customerId);
            setbizDate(props.data.bizDate);
            setbillType(props.data.billType);
            setcustomerBillCode(props.data.customerBillCode)
            setremark(props.data.remark);
            if (props.data.inDtls.length > 0) { setData([...props.data.inDtls]) }
        }
    }, []);
    //选择订单类型
    const selectStockType = (value) => {
        setstockTypeIndex(value);
        setbillType(value);
        props.save({
            customerId: customerId,
            bizDate: bizDate,
            billType: value,
            remark: remark,
            customerBillCode: customerBillCode
        })
    }
    // 选择客户
    const selectcustomer = (value) => {
        setcustomerId(value)
        props.save({
            customerId: value,
            bizDate: bizDate,
            billType: billType,
            remark: remark,
            customerBillCode: customerBillCode
        })
    }
    // 选择入库日期
    const selectDate = (date, dateString) => {
        setbizDate(dateString)
        props.save({
            customerId: customerId,
            bizDate: dateString,
            billType: billType,
            remark: remark,
            customerBillCode: customerBillCode
        })
    }
    // 保存备注
    const saveremark = ({ target: { value } }) => {
        setremark(value)
        props.save({
            customerId: customerId,
            bizDate: bizDate,
            billType: billType,
            remark: value,
            customerBillCode: customerBillCode
        })
    }
    // 保存来料单号
    const saveCustomerBillCode = ({ target: { value } }) => {
        setcustomerBillCode(value);
        console.log("908==", value)
        props.save({
            customerId: customerId,
            bizDate: bizDate,
            billType: billType,
            remark: value,
            customerBillCode: value
        })
    }
    const isEditing = (record) => record.key === editingKey;
    const addData = () => {
        const _data = [...data]
        _data.push({
            key: new Date().getTime(),
            yarnName: "",
            yarnBrandBatch: "",
            colorCode: "",
            customerCode: "",
            pcs: "",
            spec: "",
            netWeight: "",
            lackWeight: "",
            totalLackWeight: "",
            weight: ""
        });
        setData(_data);
        props.save({
            customerId: customerId,
            bizDate: bizDate,
            billType: billType,
            remark: remark,
            customerBillCode: customerBillCode,
            inDtls: _data
        })
    }
    const edit = (record) => {
        form.setFieldsValue({
            ...record,
        });
        setEditingKey(record.key);
    };
    const cancel = () => {
        setEditingKey('');
    };
    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => key === item.key);
            if (index > -1) {
                console.log("这是什么", row)
                const item = newData[index];

                row.netWeight = row.pcs * row.spec; // 净重
                row.totalLackWeight = row.pcs * row.lackWeight;//总欠重
                row.weight = row.netWeight - row.totalLackWeight; // 实收净重
                newData.splice(index, 1, { ...item, ...row });
                setData(newData);
                props.save({
                    customerId: customerId,
                    bizDate: bizDate,
                    billType: billType,
                    remark: remark,
                    customerBillCode: customerBillCode,
                    inDtls: newData
                })
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };
    const handleDelete = (key) => {
        const _data = [...data];
        const newData = _data.filter((item) => item.key !== key)
        setData(newData);
        props.save({
            customerId: customerId,
            bizDate: bizDate,
            billType: billType,
            remark: remark,
            customerBillCode: customerBillCode,
            inDtls: newData
        })
    }
    const enter_yarn_colums = [
        {
            title: () => (<span><em style={{ marginRight: "2px" }}>*</em>纱支</span>),
            dataIndex: 'yarnName',
            editable: true,
        },
        {
            title: '批次',
            dataIndex: 'yarnBrandBatch',
            editable: true,
        },
        {
            title: '颜色',
            dataIndex: "colorCode",
            editable: true,
        },
        {
            title: '合同号',
            dataIndex: 'customerCode',
            editable: true,
        }, {
            title: '件数',
            dataIndex: 'pcs',
            editable: true,
        },
        {
            title: '规格',
            dataIndex: 'spec',
            editable: true,
        },
        {
            title: () => (<span><em style={{ marginRight: "2px" }}>*</em>来纱净重</span>),
            dataIndex: 'netWeight',
            editable: true,
        },
        {
            title: '欠重',
            dataIndex: 'lackWeight',
            editable: true,
        },
        {
            title: '总欠重',
            dataIndex: 'totalLackWeight',
            editable: true,
        },
        {
            title: '实收净重',
            dataIndex: 'weight',
            editable: true,
        },
        {
            title: '操作',
            dataIndex: 'operation',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <React.Fragment>
                        <Typography.Link
                            onClick={() => save(record.key)}
                            style={{ marginRight: 8 }}
                        >
                            保存
                        </Typography.Link>
                        <Popconfirm title="要取消保存吗?" onConfirm={cancel}>
                            <Typography.Link>取消</Typography.Link>
                        </Popconfirm>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                            编辑
                        </Typography.Link>
                        <Popconfirm title="确定删除？" onConfirm={() => { handleDelete(record.key) }}>
                            <span style={{ marginLeft: "10px" }} >删除</span>
                        </Popconfirm>
                    </React.Fragment>
                );
            },
        }
    ];
    const mergedColumns = enter_yarn_colums.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: (col.dataIndex === 'pcs' || col.dataIndex === 'spec' || col.dataIndex === 'netWeight' || col.dataIndex === 'lackWeight' || col.dataIndex === 'totalLackWeight' || col.dataIndex === 'weight') ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });
    const EditableCell = ({
        editing,
        dataIndex,
        title,
        inputType,
        record,
        index,
        children,
        ...restProps
    }) => {
        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item
                        name={dataIndex}
                        style={{
                            margin: 0,
                        }}
                    >
                        <Input type={(dataIndex === 'pcs' || dataIndex === 'spec' || dataIndex === 'netWeight' || dataIndex === 'lackWeight' || dataIndex === 'totalLackWeight' || dataIndex === 'weight') ? 'number' : 'text'} />
                    </Form.Item>
                ) : (
                    children
                )}
            </td>
        );
    };
    return <React.Fragment>
        <div className="add-content">
            {/* <div className="detail-title">
                sfidfv
            </div> */}
            <div className="detail-basicData">
                <div className="row">
                    <div className="col">
                        <div className="label">入库单号</div>
                        <Input disabled placeholder="保存自动生成" />
                    </div>
                    <div className="col">
                        <div className="label13">客户</div>
                        <Select onChange={selectcustomer} defaultValue={props.data ? props.data.customerName : ""}>
                            {
                                customer.map((item, key) => (<Option value={item.id} key={key}>{item.name}</Option>))
                            }
                        </Select>
                    </div>
                    <div className="col">
                        <div className="label12">入库日期</div>
                        <DatePicker onChange={selectDate} locale={locale} defaultValue={moment(today)}
                            showToday />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="label11">单据类型</div>
                        <Select onChange={selectStockType} defaultValue={stockType[stockTypeIndex]}>
                            {
                                stockType.map((item, key) => (<Option value={key} key={key}>{item}</Option>))
                            }
                        </Select>
                    </div>
                    <div className="col">
                        <div className="label">来料单号</div>
                        <Input onChange={saveCustomerBillCode} defaultValue={props.data ? props.data.customerBillCode : ""} />
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                        <div className="label1">备注</div>
                        <TextArea autoSize={{ minRows: 2, maxRows: 6 }} defaultValue={props.data ? props.data.remark : ""} onChange={saveremark} />
                    </div>
                </div>
            </div>
            <div className="enter-yarn-table">
                <Button onClick={addData} style={{ marginBottom: "10px" }}>添加</Button>
                <Form form={form} component={false}>
                    <Table
                        components={{
                            body: {
                                cell: EditableCell,
                            },
                        }}
                        columns={mergedColumns}
                        dataSource={data}
                        pagination={false}
                        rowKey={(record, index) => record.id}
                        summary={pageData => {
                            if (pageData.length == 0) return;
                            let pcsTotal = 0;
                            let netWeight = 0;
                            let lackWeight = 0;
                            let totalLackWeight = 0;
                            let weight = 0;
                            pageData.forEach((borrow) => {
                                pcsTotal += Number(borrow.pcs);
                                netWeight += Number(borrow.netWeight);
                                lackWeight += Number(borrow.lackWeight);
                                totalLackWeight += Number(borrow.totalLackWeight);
                                weight += Number(borrow.weight);
                                totalLackWeight += Number(borrow.totalLackWeight)
                            });
                            return (
                                <>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell></Table.Summary.Cell>
                                        <Table.Summary.Cell></Table.Summary.Cell>
                                        <Table.Summary.Cell></Table.Summary.Cell>
                                        <Table.Summary.Cell>合计：</Table.Summary.Cell>
                                        <Table.Summary.Cell>{pcsTotal}</Table.Summary.Cell>
                                        <Table.Summary.Cell></Table.Summary.Cell>
                                        <Table.Summary.Cell>{netWeight}</Table.Summary.Cell>
                                        <Table.Summary.Cell>{lackWeight}</Table.Summary.Cell>
                                        <Table.Summary.Cell>{totalLackWeight}</Table.Summary.Cell>
                                        <Table.Summary.Cell>{weight}</Table.Summary.Cell>
                                    </Table.Summary.Row>
                                </>
                            );
                        }}
                    />
                </Form>
            </div>
        </div>
    </React.Fragment>
}

export default withRouter(CreateEnterStockOrder)