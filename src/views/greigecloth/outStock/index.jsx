import { useEffect, useState } from "react";
import { Form, Row, DatePicker, Input, Button, Select, Table, Col } from "antd";
import { onlyFormat, getMonthFE } from "../../../utils/config"
import { fabricOut, getCustomer } from "../../../api/apiModule"
import moment from 'moment';
import "./index.css"
const { RangePicker } = DatePicker;
const { Option } = Select;
function OutStock() {
    document.title = "出入明细"
    const [form] = Form.useForm();
    const [date, setDate] = useState([getMonthFE(1), getMonthFE(2)]);
    const [customer, setcustomer] = useState([]);
    const [loading, setloading] = useState(true);
    const [yarnStockIo, setyarnStockIo] = useState([]);
    const [total, settotal] = useState(0);
    const [size, setsize] = useState(10);
    const [current, setcurrent] = useState(1)
    useEffect(() => {
        getCustomer((data) => {
            setcustomer(data)
        });
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
        fabricOut(param, (res) => {
            console.log(res)
            setloading(false);
            if (res.code == 200) {
                if (res.data.records === 0) return;
                setyarnStockIo(res.data.records);
                settotal(res.data.total);
                setsize(res.data.size);
                setcurrent(res.data.current)
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
        // {
        //     title: "#",
        //     dataIndex: 'id',
        //     key: 'id',
        // },
         {
            title: "单号",
            dataIndex: 'code',
            key: 'code',
        }, {
            title: "单据类型",
            dataIndex: 'flag',
            render: (params) => (<span>{params === 0 && "出库"}{params === 1 && "入库"}</span>)
        }, {
            title: "客户",
            dataIndex: 'order',
            render: (params) => (<span>{params ? params.customerName : ""}</span>)
        }, {
            title: "日期",
            dataIndex: 'bizDate',
            key: 'bizDate',
            render: (time) => (<span>{onlyFormat(time, true)}</span>)
        }, {
            title: "状态",
            dataIndex: 'billStatus',
            render: (params) => (<span>{params === 0 && "未审核"}{params === 1 && "已审核"}</span>)
        }, {
            title: "生产单号",
            dataIndex: 'order',
            render: (order) => (<span>{order ? order.code : ""}</span>)
        }, {
            title: "合同号",
            dataIndex: 'order',
            render: (order) => (<span>{order ? order.customerBillCode : ""}</span>)

        }, {
            title: "坯布编码",
            dataIndex: 'order',
            render: (order) => (<span>{order ? order.greyFabricCode : ""}</span>)

        }, {
            title: "布类",
            dataIndex: 'order',
            render: (order) => (<span>{order ? order.fabricType : ""}</span>)
        }, {
            title: "用料信息",
            dataIndex: 'order',
            render: (order) => (<span>{order ? order.yarnInfo : ""}</span>)
        }, {
            title: "机号",
            dataIndex: 'order',
            render: (order) => (<span>{order ? order.loomCode : ""}</span>)
        }, {
            title: "针寸",
            dataIndex: 'order',
            render: (order) => (<span>{order ? order.needles : ""}-{order ? order.inches : ""}</span>)
        }, {
            title: "卷数",
            dataIndex: 'order',
            render: (order) => (<span>{order ? order.totalVolQty : ""}</span>)
        }, {
            title: "重量",
            dataIndex: 'order',
            render: (order) => (<span>{order ? order.totalWeight : ""}</span>)
        }, {
            title: "金额",
            dataIndex: 'order',
            render: (order) => (<span>{order ? order.totalMoney : ""}</span>)
        }, {
            title: "创建人",
            dataIndex: 'creatorName',
        }
    ]
    return <div className="right-container">
        <div className="custom">
            <div className="left">
                <span className="title">出入明细</span>
                <RangePicker onChange={selectDate} defaultValue={[moment(getMonthFE(1), "YYYY-MM-DD"), moment(getMonthFE(2), "YYYY-MM-DD")]} />
            </div>
            {/* <div className="head-bth">
                <Button>打印</Button>
                <Button>导出</Button>
            </div> */}
        </div>
        <div className="inventory-container outStock">
            <div className="search-content">
                <Form form={form} onFinish={onFinish}>
                    <Row gutter={16}>
                        <Col span={4}>
                            <Form.Item
                                name="code"
                                label="单号"
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
                                <Select onChange={selectcustomer} >
                                    {
                                        customer.map((item, key) => (<Option value={item.id} key={key}>{item.name}</Option>))
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="yarnName"
                                label="用料信息"
                                className="col2"
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item
                                name="flag"
                                label="类型"
                                className=" col2"
                            >
                                <Select onChange={selectcustomer}  >
                                    <Option value="1" >入库</Option>
                                    <Option value="0" >出库</Option>
                                </Select>
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
                            <Form.Item
                                name="greyFabricCode"
                                label="坯布编码"
                                className="col11 col2"
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item >
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
                        </Col>
                    </Row>
                </Form>
            </div>
            <Table
                columns={columns}
                loading={loading}
                dataSource={yarnStockIo}
                pagination={pagination}
            />
        </div>
    </div>
}

export default OutStock