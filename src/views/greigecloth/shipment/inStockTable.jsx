import { useEffect, useState } from "react";
import { PageHeader, Form, Row, DatePicker, Input, Button, Select, Table } from "antd";
import { requestUrl, getMonthFE } from "../../../utils/config";
import moment from 'moment';
const { RangePicker } = DatePicker;
const { Option } = Select;

function InSTockTable() {
    document.title = "入库报表"
    const [form] = Form.useForm();
    const [date, setDate] = useState([getMonthFE(1), getMonthFE(2)]);
    const [customer, setcustomer] = useState([]);
    const [loading, setloading] = useState(true);
    const [yarnStockIo, setyarnStockIo] = useState([]);
    const [total, settotal] = useState(0);
    const [size, setsize] = useState(10);
    const [current, setcurrent] = useState(1);
    const [type, settype] = useState("order");// 设置查询维度
    const [columns, setcolumns] = useState([]);
    const [loom, setloom] = useState([]);
    useEffect(() => {
        getCustomer();
        getLoom();
        getData({ page: 1, size: 10, type: type, beginTime: date[0], endTime: date[1] });
        setcolumns([
            {
                title: "#",
                dataIndex: 'id',
                key: 'id',
            }, {
                title: "生产单号",
                dataIndex: 'code',
                key: 'code',
            }, {
                title: "客户",
                dataIndex: 'customerName',
                key: 'customerName',

            }, {
                title: "客户单号",
                dataIndex: 'customerBillCode',
                key: 'customerBillCode',
            }, {
                title: "坯布编码",
                dataIndex: 'greyFabricCode',
                key: 'greyFabricCode',
            }, {
                title: "布类",
                dataIndex: 'fabricType',
                key: 'fabricType',
            }, {
                title: "纱别",
                dataIndex: 'yarnName',
                key: 'yarnName',
            }, {
                title: "订单数量",
                dataIndex: 'orderWeight',
                key: 'orderWeight',

            }, {
                title: "卷数",
                dataIndex: 'volQty',
            }, {
                title: "入库重量",
                dataIndex: 'inWeight',
                key: 'inWeight',
            }, {
                title: "单位",
                render: () => (<span>kg</span>)
            }, {
                title: "单价",
                dataIndex: 'productPrice',
                key: 'productPrice',
            }, {
                title: "金额",
                dataIndex: "amount"
            }, {
                title: "针寸",
                dataIndex: "inches"
            }, {
                title: "成品规格	",
                dataIndex: 'techType',
            }, {
                title: "客户颜色",
                dataIndex: 'customerColor',
            }, {
                title: "状态",
                dataIndex: 'billStatus',
                key: 'billStatus',
            },
        ])
    }, [])
    const onFinish = (value) => {
        console.log(value)
        const param = {
            "beginTime": date[0],
            "endTime": date[1],
            "page": 1,
            "size": 10,
            ...value
        }

        console.log("查询表单字段", param)
        getData(param)
    }
    // 选择日期
    const selectDate = (date, dateString) => {
        setDate(dateString);
        getData({ page: 1, size: 10, type: type, beginTime: dateString[0], endTime: dateString[1] });
    }
    //获取出入明细列表
    const getData = (param) => {
        fetch(requestUrl + "/api-stock/fabricStockByDay/findAll", {
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
    // 获取机台列表
    const getLoom = () => {
        fetch(requestUrl + "/api-stock/stockCommon/findLoomDown", {
            method: "POST",
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token")
            },
        })
            .then(res => { return res.json() })
            .then(res => {
                console.log("机台数据==", res)
                if (res.code == 200) {
                    setloom(res.data)
                }
            })
    }
    // 设置维度
    const selectType = (value) => {
        console.log(value)
        settype(value);
        getData({ page: 1, size: 10, type: value, beginTime: date[0], endTime: date[1] });
        if (value == "order") {
            setcolumns([
                {
                    title: "#",
                    dataIndex: 'id',
                    key: 'id',
                }, {
                    title: "生产单号",
                    dataIndex: 'code',
                    key: 'code',
                }, {
                    title: "客户",
                    dataIndex: 'customerName',
                    key: 'customerName',

                }, {
                    title: "客户单号",
                    dataIndex: 'customerBillCode',
                    key: 'customerBillCode',
                }, {
                    title: "坯布编码",
                    dataIndex: 'greyFabricCode',
                    key: 'greyFabricCode',
                }, {
                    title: "布类",
                    dataIndex: 'fabricType',
                    key: 'fabricType',
                }, {
                    title: "纱别",
                    dataIndex: 'yarnName',
                    key: 'yarnName',
                }, {
                    title: "订单数量",
                    dataIndex: 'orderWeight',
                    key: 'orderWeight',

                }, {
                    title: "卷数",
                    dataIndex: 'volQty',
                }, {
                    title: "入库重量",
                    dataIndex: 'inWeight',
                    key: 'inWeight',
                }, {
                    title: "单位",
                    render: () => (<span>kg</span>)
                }, {
                    title: "单价",
                    dataIndex: 'productPrice',
                    key: 'productPrice',
                }, {
                    title: "金额",
                    dataIndex: "amount"
                }, {
                    title: "针寸",
                    dataIndex: "inches"
                }, {
                    title: "成品规格	",
                    dataIndex: 'techType',
                }, {
                    title: "客户颜色",
                    dataIndex: 'customerColor',
                }, {
                    title: "状态",
                    dataIndex: 'billStatus',
                    key: 'billStatus',
                },
            ])
        }

        if (value == "fabric") {
            setcolumns([
                {
                    title: "#",
                    dataIndex: 'id',
                    key: 'id',
                }, {
                    title: "坯布编码",
                    dataIndex: 'greyFabricCode',
                    key: 'greyFabricCode',
                }, {
                    title: "布类",
                    dataIndex: 'fabricType',
                    key: 'fabricType',
                }, {
                    title: "纱别",
                    dataIndex: 'yarnName',
                    key: 'yarnName',
                }, {
                    title: "卷数",
                    dataIndex: 'volQty',
                }, {
                    title: "入库重量",
                    dataIndex: 'inWeight',
                    key: 'inWeight',
                }, {
                    title: "单位",
                    render: () => (<span>kg</span>)
                }, {
                    title: "单价",
                    dataIndex: 'productPrice',
                    key: 'productPrice',
                }, {
                    title: "金额",
                    dataIndex: "amount"
                }
            ])
        }
        if (value == "customer") {
            setcolumns([
                {
                    title: "#",
                    dataIndex: 'id',
                    key: 'id',
                }, {
                    title: "客户",
                    dataIndex: 'customerName',
                    key: 'customerName',

                }, {
                    title: "卷数",
                    dataIndex: 'volQty',
                }, {
                    title: "入库重量",
                    dataIndex: 'inWeight',
                    key: 'inWeight',
                }, {
                    title: "单位",
                    render: () => (<span>kg</span>)
                }, {
                    title: "金额",
                    dataIndex: "amount"
                }
            ])
        }

        if (value == "loom") {
            setcolumns([
                {
                    title: "#",
                    dataIndex: 'id',
                    key: 'id',
                }, {
                    title: "机号",
                    dataIndex: 'loomCode',
                    key: 'loomCode',

                }, {
                    title: "卷数",
                    dataIndex: 'volQty',
                }, {
                    title: "入库重量",
                    dataIndex: 'inWeight',
                    key: 'inWeight',
                }, {
                    title: "单位",
                    render: () => (<span>kg</span>)
                }, {
                    title: "金额",
                    dataIndex: "amount"
                }
            ])
        }
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
    return <div className="right-container">
        <PageHeader>
            <div className="left">
                <span className="title">入库报表</span>
                <RangePicker onChange={selectDate} defaultValue={[moment(getMonthFE(1), "YYYY-MM-DD"), moment(getMonthFE(2), "YYYY-MM-DD")]} />
            </div>
            <div className="head-bth">
                <Button>
                    打印
                </Button>
                <Button >
                    导出
                </Button>
            </div>
        </PageHeader>
        <div className="inventory-container">
            <div className="search-content">
                <Form
                    form={form}
                    onFinish={onFinish}
                    initialValues={{
                        type: type
                    }}
                >
                    <Row gutter={24}>
                        <Form.Item
                            name="type"
                            label="查询维度"
                            className="col2"
                        >
                            <Select onChange={selectType} style={{ width: "175px" }}>
                                <Option value="order">订单</Option>
                                <Option value="fabric">布类</Option>
                                <Option value="customer">客户</Option>
                                <Option value="loom">机号</Option>
                            </Select>
                        </Form.Item>
                        {
                            type == "order" && <>
                                <Form.Item
                                    name="code"
                                    label="生产单号"
                                    className="col2"
                                >
                                    <Input />
                                </Form.Item> <Form.Item
                                    name="customerBillCode"
                                    label="客户单号"
                                    className="col2"
                                >
                                    <Input />
                                </Form.Item>
                            </>
                        }
                        {
                            type == "fabric" && <>
                                <Form.Item
                                    name="greyFabricCode"
                                    label="坯布编码"
                                    className="col2"
                                >
                                    <Input />
                                </Form.Item> <Form.Item
                                    name="fabricType"
                                    label="布类"
                                    className="col2"
                                >
                                    <Input />
                                </Form.Item>
                            </>
                        }
                        {
                            type == "customer" && <>
                                <Form.Item
                                    name="customerId"
                                    label="客户"
                                    className="col2"
                                >
                                    <Select style={{ width: "175px" }}>
                                        {
                                            customer.map((item, key) => {
                                                return <Option value={item.id} key={key}>{item.name}</Option>
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                            </>
                        }
                        {
                            type == "loom" && <>
                                <Form.Item
                                    name="loomId"
                                    label="机台"
                                    className="col2"
                                >
                                    <Select style={{ width: "175px" }}>
                                        {
                                            loom.map((item, key) => {
                                                return <Option value={item.id} key={key}>{item.code}</Option>
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                            </>
                        }
                        <Form.Item style={{ marginLeft: "60px" }}>
                            <Button type="primary" htmlType="submit">
                                搜索
                            </Button>
                            <Button
                                style={{ margin: '0 8px' }}
                                onClick={() => {
                                    form.resetFields();
                                    getData({ page: 1, size: 10, type: "order" });
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
            rowKey={(record, index) => record.id}
        />
    </div>
}

export default InSTockTable