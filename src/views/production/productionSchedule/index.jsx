import React, { useEffect, useState } from "react";
import { PageHeader, Button, Table, Form, Input, Row, DatePicker, Select, Col } from "antd";
import { productionSchedule, getCustomer } from "../../../api/apiModule";
import { onlyFormat } from "../../../utils/config"
import "./style.css"
const { Option } = Select;
const { RangePicker } = DatePicker;
function ProductionSchedule() {
    document.title = "生产进度";
    const [schedule, setschedule] = useState([]);
    const [customer, setcustomer] = useState([]);
    const [total, settotal] = useState(0);
    const [current, setcurrent] = useState(1);
    const [szie, setszie] = useState(10);
    const [form] = Form.useForm()
    const columns = [
        // { title: "#", dataIndex: "id" },
        { title: "生产单号", dataIndex: "knitOrderCode" },
        { title: "客户", dataIndex: "customerName" },
        { title: "合同号", dataIndex: "customerBillCode" },
        { title: "坯布编码", dataIndex: "greyFabricCode" },
        { title: "布类", dataIndex: "fabricType" },
        { title: "针寸", dataIndex: "needles" },
        { title: "纱支", dataIndex: "yarnInfo" },
        { title: "订单数量", dataIndex: "weight" },
        { title: "昨日产量", dataIndex: "outputToday" },
        { title: "机号", dataIndex: "loomId" },
        { title: "库存重量", dataIndex: "stockWeight" },
        { title: "出货重量", dataIndex: "outStockWeight" },
        { title: "欠织重量", dataIndex: "unwovenWeight" }
    ]
    useEffect(() => {
        listData({ page: 1, size: 10 })
        getCustomer((res) => {
            setcustomer([...res])
        })
    }, [])
    const onFinish = (value) => {
        console.log(value)
        value.page = 1;
        value.size = 10;
        listData(value)
    }
    const listData = (value) => {
        productionSchedule(value, (res) => {
            if (res.code === 200) {
                setschedule([...res.data.records]);
                settotal(res.data.total);
                setcurrent(res.data.current);
                setszie(res.data.size)
            }
        })
    }
    const selectDate = (date, dateString) => {
        console.log(dateString)
    }
    const pagination = {
        total: total,
        pageSize: szie,
        current: current,
        onChange: (page, pageSize) => {
            setcurrent(page);
            setszie(pageSize);
            listData({ page: page, size: pageSize })
        },
        showSizeChanger: false,
        showTotal: () => (`共${total}条`)
    }
    return <React.Fragment>
        <div className="right-container">
            <PageHeader className="productionSchedule">
                <div className="pageTitle">
                    <span>生产进度</span>
                    {/* <div className="tabs">
                        <div className="tabs-item">全部</div>
                        <div className="tabs-item">进行中</div>
                        <div className="tabs-item">未审核</div>
                        <div className="tabs-item">已完工</div>
                        <div className="tabs-item">已作废</div>
                    </div> */}
                </div>
                <div>
                    {/* <Button style={{ marginRight: "10px" }}>打印</Button>
                    <Button>导出</Button> */}
                </div>
            </PageHeader>
            <div className="search-content production">
                <Form form={form} onFinish={onFinish} >
                    <Row gutter={24}>
                        <Col span={4} >
                            <Form.Item
                                name="knitOrderCode"
                                label="单号"
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="inches"
                                label="寸数"
                            >
                                <Input />
                            </Form.Item>

                        </Col>
                        <Col span={4}>
                            <Form.Item
                                name="customerId"
                                label="客户"
                            >
                                <Select >
                                    {
                                        customer.map((item) => (<Option value={item.id}>{item.name}</Option>))
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="needles"
                                label="针数"
                            >
                                <Input />
                            </Form.Item>


                        </Col>
                        <Col span={4}>
                            <Form.Item
                                name="fabricType"
                                label="布类"
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="yarnInfo"
                                label="纱支"
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item
                                name="customerBillCode"
                                label="合同号"
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="greyFabricCode"
                                label="坯布编码"
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item></Form.Item>
                            <Form.Item >
                                <Button type="primary" htmlType="submit">
                                    搜索
                                </Button>
                                <Button
                                    style={{ margin: '0 8px' }}
                                    onClick={() => {
                                        form.resetFields();
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
                dataSource={schedule}
                pagination={pagination}
            />
        </div>
    </React.Fragment>
}

export default ProductionSchedule