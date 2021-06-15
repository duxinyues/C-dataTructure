import { useEffect, useState } from "react";
import { PageHeader, Form, Row, DatePicker, Input, Button, Select, Table, message } from "antd";
import { requestUrl, onlyFormat } from "../../../utils/config"
const { RangePicker } = DatePicker;
const { Option } = Select;
function EnterOutDetail() {
    document.title = "出入明细"
    const [form] = Form.useForm();
    const [date, setDate] = useState();
    const [customer, setcustomer] = useState([]);
    const [loading, setloading] = useState(true);
    const [yarnStockIo, setyarnStockIo] = useState([]);
    const [total, settotal] = useState(0);
    const [size, setsize] = useState(10);
    const [current, setcurrent] = useState(1)
    // const yarnStockIo =[]
    useEffect(() => {
        getCustomer();
        getData({ page: 1, size: 10 })
    }, [])
    const onFinish = (value) => {
        console.log(value)
        const param = {
            "beginTime": date ? date[0] : "",
            "billType": value.billType,
            "code": value.code,
            "customerBillCode": value.customerBillCode,
            "customerId": value.customerId,
            "endTime": date ? date[1] : "",
            "page": 1,
            "size": 10,
            "yarnBrandBatch": value.yarnBrandBatch,
            "yarnName": value.yarnName
        }

        console.log("查询表单字段", param)
        getData(param)
    }
    const selectDate = (date, dateString) => {
        setDate(dateString)
    }
    //获取出入明细列表
    const getData = (param) => {
        fetch(requestUrl + "/api-stock/yarnStockIo/findAll", {
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
                    setcurrent(res.data.current);
                    return;
                }

                message.error(res.msg)
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
            title: "出入库单号",
            dataIndex: 'code',
            key: 'code',
        }, {
            title: "类型",
            dataIndex: 'billType',
            key: 'billType',

        }, {
            title: "日期",
            dataIndex: 'bizDate',
            key: 'bizDate',
            render: (time) => (<span>{onlyFormat(time, false)}</span>)
        }, {
            title: "客户",
            dataIndex: 'customerName',
            key: 'customerName',
        }, {
            title: "纱别",
            dataIndex: 'yarnName',
            key: 'yarnName',
        }, {
            title: "纱牌/纱批",
            dataIndex: 'yarnBrandBatch',
            key: 'yarnBrandBatch',
        }, {
            title: "色号",
            dataIndex: 'colorCode',
            key: 'colorCode',

        }, {
            title: "缸号",
            dataIndex: '',
            key: '',
        }, {
            title: "件数",
            dataIndex: 'pcs',
            key: 'pcs',
        }, {
            title: "规格",
            dataIndex: 'spec',
            key: 'spec',
        }, {
            title: "欠重",
            dataIndex: 'lackWeight',
            key: 'lackWeight',
        }, {
            title: "总欠重"
        }, {
            title: "毛重"
        }, {
            title: "净重",
            dataIndex: 'netWeight',
            key: 'netWeight',
        }, {
            title: "客户单号",
            dataIndex: 'customerBillCode',
            key: 'customerBillCode',
        }, {
            title: "备注",
            dataIndex: 'remark',
            key: 'remark',
        }, {
            title: "状态",
            dataIndex: 'billStatus',
            key: 'billStatus',
        },
    ]
    return <div className="right-container">
        <div className="custom">
            <div className="title">
                出入明细
            </div>
            <div className="custom-right">
                <Button>
                    打印
                </Button>
                <Button >
                    导出
                </Button>
            </div>
        </div>
        <div className="inventory-container" style={{ flexDirection: "column" }}>
            <div className="search-content">
                <Form form={form} onFinish={onFinish}>
                    <Row gutter={24}>
                        <Form.Item
                            name="code"
                            label="出入库单号"
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
                            name="date"
                            label="日期"
                            className="col11 col2"
                        >
                            <RangePicker onChange={selectDate} />
                        </Form.Item>
                        <Form.Item
                            name="yarnName"
                            label="纱别"
                            className="col11 col2"
                        >
                            <Input />
                        </Form.Item>
                    </Row>
                    <Row gutter={24}>
                        <Form.Item
                            name="yarnBrandBatch"
                            label="纱牌/纱批"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="customerBillCode"
                            label="客户单号"
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
            <Table
                columns={columns}
                loading={loading}
                dataSource={yarnStockIo}
                pagination={pagination}
                rowKey={(record, index) => record.id}
            />
        </div>
    </div>
}

export default EnterOutDetail