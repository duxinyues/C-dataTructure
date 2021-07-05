import { useEffect, useState } from "react";
import { Form, Row, Input, Button, Select, Table, Col } from "antd";
import { getCustomer, getFabricStock } from "../../../api/apiModule"
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
        getCustomer((res) => {
            setcustomer(res)
        });
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
        getFabricStock(param, (res) => {
            console.log("坯布库存", res)
            setloading(false);
            if (res.code == 200) {
                res.data.page.records.map((item) => {
                    item.zc = item.needles + "-" + item.inches
                })
                setyarnStockIo(res.data.page.records);
                settotal(res.data.page.total);
                setsize(res.data.page.size);
                setcurrent(res.data.page.current)
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
        // {
        //     title: "#",
        //     dataIndex: 'id',
        //     key: 'id',
        // },
         {
            title: "生产单号",
            dataIndex: 'knitOrderCode',
        }, {
            title: "合同号",
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
            title: "颜色",
            dataIndex: 'colorCode',
        }, {
            title: "条数",
            dataIndex: 'volQty',
        }, {
            title: "重量",
            dataIndex: 'weight',
        }, {
            title: "针寸",
            dataIndex: 'zc',
        }, {
            title: "成品规格"
        }
    ]
    return <div className="right-container">
        <div className="custom">
            <div className="title">
                坯布库存
            </div>
            <div className="custom-right">
                {/* <Button>
                    打印
                </Button>
                <Button >
                    导出
                </Button> */}
            </div>
        </div>

        <div className="inventory-container" style={{ flexDirection: "column" }}>
            <div className="search-content">
                <Form form={form} onFinish={onFinish}>
                    <Row gutter={24}>
                        <Col span={4}>
                            <Form.Item
                                name="knitOrderCode"
                                label="生产单号"
                                className="col2"
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="greyFabricCode"
                                label="坯布编码"
                                className="col2"
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item
                                name="customerBillCode"
                                label="合同号"
                                className="col2"
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
                        </Col>
                        <Col span={4}>
                            <Form.Item
                                name="customerId"
                                label="客户"
                                className="col2"
                            >
                                <Select>
                                    {
                                        customer.map((item, key) => (<Option value={item.id} key={key}>{item.name}</Option>))
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="needles"
                                label="针数"
                                className="col2"
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item
                                name="yarnInfo"
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
                        </Col>
                        <Col span={4}>
                            <Form.Item></Form.Item>
                            <Form.Item>
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
                        </Col>
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

export default Stock