import React, { useEffect, useState } from "react";
import { PageHeader, Button, Table, Form, Input, Row, DatePicker, Select, Col } from "antd";
import { checkClothDetail, getPerson, getLoom } from "../../../api/apiModule"
import { onlyFormat } from "../../../utils/config"
import "../productionSchedule/style.css"
const { Option } = Select;
const { RangePicker } = DatePicker;
function ProductionSchedule() {
    document.title = "查布明细";
    const [checkClothList, setcheckClothList] = useState([]);
    const [total, settotal] = useState(0);
    const [current, setcurrent] = useState(1);
    const [szie, setszie] = useState(10);
    const [form] = Form.useForm()
    const columns = [
        { title: "条码", dataIndex: "barcode" },
        { title: "查布日期", dataIndex: "inStockTime", render: (time) => (<span>{onlyFormat(time, true)}</span>) },
        { title: "班次", dataIndex: "shift", render: (param) => (<span>{param === 1 && "白班"}{param === 2 && "晚班"}</span>) },
        { title: "查布员", dataIndex: "qcName" },
        { title: "值机工", dataIndex: "weaverName" },
        { title: "机号", dataIndex: "loomCode" },
        { title: "匹号", dataIndex: "seq" },
        { title: "入库重量", dataIndex: "weight" },
        { title: "查布记录", dataIndex: "flawInfo" },
        { title: "生产单号", dataIndex: "knitOrderCode" },
        { title: "坯布编码", dataIndex: "greyFabricCode" },
        { title: "布类", dataIndex: "fabricType" },
        { title: "针寸", dataIndex: "needles" },
        { title: "用料信息", dataIndex: "yarnInfo" }
    ]
    const [checkClothData, setcheckClothData] = useState([]);
    const [runMachinePerson, setrunMachinePerson] = useState([]);
    const [loom, setloom] = useState([])
    useEffect(() => {
        listData({ page: 1, size: 10 });
        getPerson((res) => {
            if (res.code == 200) {
                const _checkClothData = [];
                const _runMachinePerson = [];
                res.data.map((item) => {
                    if (item.position === 1) { _checkClothData.push(item) }
                    if (item.position === 2) { _runMachinePerson.push(item) }
                })
                setcheckClothData(_checkClothData);
                setrunMachinePerson(_runMachinePerson);
            }
        })
        getLoom((res) => {
            setloom([...res.data])
        })
    }, [])
    const onFinish = (value) => {
        console.log(value)
        value.page = 1;
        value.size = 10;
        listData(value)
    }
    const listData = (value) => {
        checkClothDetail(value, (res) => {
            console.log(res)
            if (res.code === 200) {
                setcheckClothList([...res.data.records]);
                settotal(res.data.total);
                setcurrent(res.data.current);
                setszie(res.data.size)
            }
        })
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
                    <span>查布明细</span>
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
                                name="qcId"
                                label="查布员"
                            >
                                <Select>
                                    {
                                        checkClothData.map((item) => (<Option value={item.id}>{item.name}</Option>))
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="customerBillCode"
                                label="合同号"
                            >
                                <Input />
                            </Form.Item>

                        </Col>
                        <Col span={4}>
                            <Form.Item
                                name="shift"
                                label="班次"
                            >
                                <Select >
                                    <Option value="1">白班</Option>
                                    <Option value="2">晚班</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="greyFabricCode"
                                label="坯布编码"
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item
                                name="loomId"
                                label="机号"
                            >
                                <Select>
                                    {
                                        loom.map((item) => (<Option value={item.id}>{item.code}</Option>))
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="fabricType"
                                label="布类"
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item
                                name="weaverId"
                                label="值机工"
                            >
                                <Select>
                                    {
                                        runMachinePerson.map((item) => (<Option value={item.id}>{item.name}</Option>))
                                    }
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="yarnInfo"
                                label="用料信息"
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
                dataSource={checkClothList}
                pagination={pagination}
            />
        </div>
    </React.Fragment>
}

export default ProductionSchedule