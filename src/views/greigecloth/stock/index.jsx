import { useEffect, useState } from "react";
import { PageHeader, Form, Row, Input, Button, Select, Table } from "antd";
import { requestUrl } from "../../../utils/config"
const { Option } = Select;
function Stock() {
    document.title = "库存"
    const [form] = Form.useForm();
    const [customer, setcustomer] = useState([]);
    const [loading, setloading] = useState(true);
    const [yarnStockIo, setyarnStockIo] = useState([]);
    const [total, settotal] = useState(0);
    const [size, setsize] = useState(10);
    const [current, setcurrent] = useState(1)
    useEffect(() => {
        getCustomer();
        getData({ page: 1, size: 10 })
    }, [])
    const onFinish = (value) => {
        const param = {
            page: 1,
            size: 10,
            customerBillCode: value.customerBillCode ? value.customerBillCode : "",
            customerId: value.customerId ? value.customerId : "",
            fabricType: value.fabricType ? value.fabricType : "",
            greyFabricCode: value.greyFabricCode ? value.greyFabricCode : "",
            knitOrderCode: value.knitOrderCode ? value.knitOrderCode : "",
            loomId: value.loomId ? value.loomId : "",
            needles: value.needles ? value.needles : "",
            yarnInfo: value.yarnInfo ? value.yarnInfo : "",
        }

        console.log("查询表单字段", param)
        getData(param)
    }

    //获取坯布库存
    const getData = (param) => {
        fetch(requestUrl + "/api-stock/fabricStock/findAll", {
            method: "POST",
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(param)
        })
            .then(res => { return res.json() })
            .then(res => {
                console.log("坯布库存", res)
                if (res.code == 200) {
                    setloading(false);
                    setyarnStockIo(res.data.page.records);
                    settotal(res.data.page.total);
                    setsize(res.data.page.size);
                    setcurrent(res.data.page.current)
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
                console.log("客户==", res)
                if (res.code == 200) {
                    setcustomer(res.data)
                }
            })
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
            title: "生产单号",
            dataIndex: 'knitOrderCode',
        }, {
            title: "客户单号",
            dataIndex: 'customerBillCode',

        }, {
            title: "客户",
            dataIndex: 'customerName',
        }, {
            title: "坯布编码",
            dataIndex: 'greyFabricCode',
        }, {
            title: "布类",
            dataIndex: 'fabricType',
        }, {
            title: "用料信息",
            dataIndex: 'yarnInfo',
        }, {
            title: "机号",
            dataIndex: 'loomCode',

        }, {
            title: "客户颜色",
            dataIndex: 'customerCode',
        }, {
            title: "卷数",
            dataIndex: 'volQty',
        }, {
            title: "重量",
            dataIndex: 'weight',
        }, {
            title: "针寸",
            dataIndex: 'inches',
        }, {
            title: "规格"
        }
    ]
    return <div className="right-container">
        <PageHeader
            title="坯布库存"
            extra={[
                <Button>
                    打印
                </Button>,
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
                            name="knitOrderCode"
                            label="生产单号"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="customerBillCode"
                            label="合同号"
                            className="col2"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="customerId"
                            label="客户"
                            className="col2"
                        >
                            <Select style={{ width: "175px" }}>
                                {
                                    customer.map((item, key) => (<Option value={item.id} key={key}>{item.name}</Option>))
                                }
                            </Select>
                        </Form.Item>
                    </Row>
                    <Row gutter={24}>
                        <Form.Item
                            name="greyFabricCode"
                            label="坯布编码"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="fabricType"
                            label="布类"
                            className="col2"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="needles"
                            label="针数"
                            className="col2"
                        >
                            <Input />
                        </Form.Item>
                    </Row>
                    <Row gutter={24}>
                        <Form.Item
                            name="yarnInfo"
                            label="用料信息"
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

export default Stock