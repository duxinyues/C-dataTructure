import { useEffect, useState } from "react";
import { PageHeader, Form, Row, DatePicker, Input, Button, Select, Table } from "antd";
import { requestUrl } from "../../../utils/config"
const { RangePicker } = DatePicker;
const { Option } = Select;
function StockList() {
    document.title = "库存"
    const [form] = Form.useForm();
    const [customer, setcustomer] = useState([]);
    const [loading, setloading] = useState(true);
    const [yarnStockIo, setyarnStockIo] = useState();
    const [total, settotal] = useState(0);
    const [current, setcurrent] = useState(1);
    const [size, setsize] = useState(10);
    useEffect(() => {
        getCustomer();
        getData({ page: 1, size: 10 })
    }, [])
    const onFinish = (value) => {
        console.log(value)
        const param = {
            "customerBillCode": value.customerBillCode,
            "customerId": value.customerId,
            "page": 1,
            "size": 10,
            "yarnBrandBatch": value.yarnBrandBatch,
            "yarnName": value.yarnName
        }

        console.log("查询表单字段", param)
        getData(param)
    }

    //获取库存列表
    const getData = (param) => {
        fetch(requestUrl + "/api-stock/yarnStock/findAll", {
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
                    settotal(res.data.total);
                    setcurrent(res.data.current);
                    setsize(res.data.size);
                    setloading(false);
                    setyarnStockIo(res.data.records)
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

    const columns = [
        {
            title: "#",
            dataIndex: 'id',
            key: 'id'
        },
        {
            title: "客户",
            dataIndex: 'customerName',
            key: 'customerName'

        }, {
            title: "纱别",
            dataIndex: 'yarnName',
            key: 'yarnName'
        }, {
            title: "纱牌/纱批",
            dataIndex: 'yarnBrandBatch',
            key: 'yarnBrandBatch'
        }, {
            title: "色号",
            dataIndex: 'colorCode',
            key: 'colorCode'
        }, {
            title: "缸号"
        }, {
            title: "客户单号",
            dataIndex: 'inWeight',
            key: 'inWeight'
        }, {
            title: "收纱",
            dataIndex: 'inWeight',
            key: 'inWeight'
        }, {
            title: "用纱",
            dataIndex: 'usedWeight',
            key: 'usedWeight'
        }, {
            title: "退纱",
            dataIndex: 'returnWeight',
            key: 'returnWeight'
        }, {
            title: "库存",
            dataIndex: 'stockWeight',
            key: 'stockWeight'
        }, {
            title: "更新时间",
            dataIndex: 'updateTime',
            key: 'updateTime'
        }
    ]
    const pagination = {
        total: total,
        pageSize: size,
        current: current,
        onChange: (page, pageSize) => {
            getData({ page: page, size: pageSize })
        },
        showSizeChanger: true,
        showTotal: () => (`共${total}条`)
    }
    return <div className="right-container">
        <PageHeader
            title="库存"
            extra={[
                <Button >
                    导出
                </Button>,
            ]}
        />
        <div className="inventory-container">
            <div className="search-content">
                <Form form={form} onFinish={onFinish}>
                    <Row gutter={24}>
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
                            className="col2"
                            name="yarnBrandBatch"
                            label="纱牌/纱批"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="yarnName"
                            label="纱别"
                            className="col2"
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
                                onClick={() => { form.resetFields(); }}
                            >
                                清空
                            </Button>
                        </Form.Item>
                    </Row>
                </Form>
            </div>

        </div>
        <Table
            pagination={pagination}
            columns={columns}
            loading={loading}
            dataSource={yarnStockIo}
            rowKey={(record, index) => record.id}
        />
    </div>
}

export default StockList