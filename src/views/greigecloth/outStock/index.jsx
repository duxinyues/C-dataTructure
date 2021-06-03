import { useEffect, useState, useRef } from "react";
import ReactToPrint from "react-to-print";
import { PageHeader, Form, Row, DatePicker, Input, Button, Select, Table } from "antd";
import { requestUrl, onlyFormat, getMonthFE } from "../../../utils/config"
import moment from 'moment';
import "./index.css"
const { RangePicker } = DatePicker;
const { Option } = Select;
function OutStock() {
    document.title = "出货明细"
    const [form] = Form.useForm();
    const [date, setDate] = useState([getMonthFE(1), getMonthFE(2)]);
    const [customer, setcustomer] = useState([]);
    const [loading, setloading] = useState(true);
    const [yarnStockIo, setyarnStockIo] = useState([]);
    const [total, settotal] = useState(0);
    const [size, setsize] = useState(10);
    const [current, setcurrent] = useState(1)
    useEffect(() => {
        getCustomer();
        getData({ page: 1, size: 10, beginTime: date[0], endTime: date[1] })
    }, [])
    const onFinish = (value) => {
        console.log(value)
        const param = {
            page: 1,
            size: 10,
            beginTime: date[0],
            endTime: date[1],
            code: value.code ? value.code : "",
            customerId: value.customerId ? value.customerId : "",
            fabricType: value.fabricType ? value.fabricType : "",
            flag: value.flag ? value.flag : "",
            greyFabricCode: value.greyFabricCode ? value.greyFabricCode : "",
            loomId: value.loomId ? value.loomId : "",
            yarnName: value.yarnName ? value.yarnName : "",
        }

        console.log("查询表单字段", param)
        getData(param)
    }
    const selectDate = (date, dateString) => {
        setDate(dateString)
    }
    //获取出入明细列表
    const getData = (param) => {
        fetch(requestUrl + "/api-stock/fabricStockIo/findAllDetail", {
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
                    setloading(false);
                    setyarnStockIo(res.data.records);
                    settotal(res.data.total);
                    setsize(res.data.size);
                    setcurrent(res.data.current)
                }
            })
    }
    // 获取客户列表
    const getCustomer = () => {
        fetch(requestUrl + "/api-stock/stockCommon/findCustomerDown?companyId=1", {
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
    // 选择客户
    const selectcustomer = (value) => {
        console.log(value)
    }
    const pagination = {
        total: total,
        pageSize: size,
        current: current,
        onChange: (page, pageSize) => {
            setcurrent(page);
            setsize(pageSize);
            getData({ page: page, size: pageSize });
        },
        showSizeChanger: true,
        showTotal: () => (`共${total}条`)
    }
    const columns = [
        {
            title: "#",
            dataIndex: 'id',
            key: 'id',
        }, {
            title: "单号",
            dataIndex: 'code',
            key: 'code',
        }, {
            title: "单据类型",
            dataIndex: 'billType',
            key: 'billType',

        }, {
            title: "客户",
            dataIndex: 'customerId',
            key: 'customerId',
        }, {
            title: "日期",
            dataIndex: 'bizDate',
            key: 'bizDate',
            render: (time) => (<span>{onlyFormat(time, true)}</span>)
        }, {
            title: "状态",
            dataIndex: 'billStatus',
            key: 'billStatus',
        }, {
            title: "生产单号",
            dataIndex: 'knitOrderId',
            key: 'knitOrderId',
        }, {
            title: "客户单号",
            dataIndex: 'colorCode',
            key: 'colorCode',

        }, {
            title: "坯布编码",
            dataIndex: '',
            key: '',
        }, {
            title: "布类",
            dataIndex: 'pcs',
            key: 'pcs',
        }, {
            title: "用料信息",
            dataIndex: 'spec',
            key: 'spec',
        }, {
            title: "机号",
            dataIndex: 'lackWeight',
            key: 'lackWeight',
        }, {
            title: "针寸"
        }, {
            title: "卷数",
            dataIndex: "volQty"
        }, {
            title: "重量",
            dataIndex: 'netWeight',
            key: 'netWeight',
        }, {
            title: "金额",
            dataIndex: 'customerBillCode',
            key: 'customerBillCode',
        }, {
            title: "创建人",
            dataIndex: 'creatorName',
            key: 'creatorName',
        }
    ]
    const componentRef = useRef();
    return <div className="right-container">
        <PageHeader>
            <div className="left">
                <span className="title">出库明细</span>
                <RangePicker onChange={selectDate} defaultValue={[moment(getMonthFE(1), "YYYY-MM-DD"), moment(getMonthFE(2), "YYYY-MM-DD")]} />
            </div>
            <div className="head-bth">
                <ReactToPrint
                    trigger={() => <Button>打印</Button>}
                    content={() => componentRef.current}
                />

                <Button>导出</Button>
            </div>
        </PageHeader>
        <div className="inventory-container">
            <div className="search-content">
                <Form form={form} onFinish={onFinish}>
                    <Row gutter={24}>
                        <Form.Item
                            name="code"
                            label="单号"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="customerId"
                            label="客户"
                            className="col2"
                        >
                            <Select onChange={selectcustomer} style={{ minWidth: "175px" }} >
                                {
                                    customer.map((item, key) => (<Option value={item.id} key={key}>{item.name}</Option>))
                                }
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="greyFabricCode"
                            label="坯布编码"
                            className="col11 col2"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="flag"
                            label="类型"
                            className="col11 col2"
                        >
                            <Select onChange={selectcustomer} style={{ minWidth: "175px" }} >
                                <Option value="0" >入库</Option>
                                <Option value="1" >出库</Option>
                            </Select>
                        </Form.Item>
                    </Row>
                    <Row gutter={24}>
                        <Form.Item
                            name="fabricType"
                            label="布类"
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="yarnName"
                            label="用料信息"
                            className="col2"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="loomId"
                            label="机号"
                            className="col2"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item style={{ marginLeft: "60px" }}>
                            <Button type="primary" htmlType="submit">
                                搜索
                            </Button>
                            <Button
                                style={{ margin: '0 8px' }}
                                onClick={() => {
                                    form.resetFields();
                                    getData({ page: 1, size: 10 });
                                    setDate([]);
                                }}
                            >
                                清空
                            </Button>
                        </Form.Item>
                    </Row>
                </Form>
            </div>

        </div>
        <Table
            columns={columns}
            loading={loading}
            dataSource={yarnStockIo}
            pagination={pagination}
        />
    </div>
}

export default OutStock