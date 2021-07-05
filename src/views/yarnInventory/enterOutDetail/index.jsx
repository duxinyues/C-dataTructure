import { useEffect, useState } from "react";
import { Form, Row, Col, DatePicker, Input, Button, Select, Table, message } from "antd";
import { requestUrl, onlyFormat } from "../../../utils/config"
import { getCustomer, getYarnStockIoDetail } from "../../../api/apiModule"
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
        getCustomer((res) => {
            setcustomer(res)
        });
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
        getYarnStockIoDetail(param, (res) => {
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
            title: "库存单号",
            dataIndex: 'code',
            key: 'code',
        }, {
            title: "类型",
            dataIndex: 'flag',
            render: (billType) => (<span>{billType === 1 && "入库"}{billType === 0 && "出库"}</span>)
        }, {
            title: "日期",
            dataIndex: 'bizDate',
            key: 'bizDate',
            render: (time) => (<span>{onlyFormat(time, false)}</span>)
        }, {
            title: "客户",
            dataIndex: 'customerName',
        }, {
            title: "纱支",
            dataIndex: 'yarnName',
        }, {
            title: "批次",
            dataIndex: 'yarnBrandBatch',
        }, {
            title: "颜色",
            dataIndex: 'colorCode',
        }, {
            title: "件数",
            dataIndex: 'pcs',
        }, {
            title: "规格",
            dataIndex: 'spec',
        }, {
            title: "欠重",
            dataIndex: 'lackWeight',
        }, {
            title: "总欠重",
            dataIndex: "totalLackWeight"
        }, {
            title: "净重",
            dataIndex: 'netWeight',
        }, {
            title: "实收净重",
            dataIndex: 'weight',
        }, {
            title: "合同号",
            dataIndex: 'customerBillCode',
        }, {
            title: "备注",
            dataIndex: 'remark',
        }, {
            title: "状态",
            dataIndex: 'billStatus',
            render: (billStatus) => (<span>{billStatus === 0 && "未审核"}{billStatus === 1 && "已审核"}</span>)
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
                        <Col span={5}>
                            <Form.Item
                                name="code"
                                label="库存单号"
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="yarnName"
                                label="纱支"
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <Form.Item
                                name="billType"
                                label="类型"
                                className="col2"
                            >
                                <Select>
                                    <Option value="0">出库</Option>
                                    <Option value="1">入库</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="yarnBrandBatch"
                                label="批次"
                                className="col2"
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <Form.Item
                                name="customerId"
                                label="客户"
                                className="col2"
                            >
                                <Select onChange={selectcustomer}  >
                                    {
                                        customer.map((item, key) => (<Option value={item.id} key={key}>{item.name}</Option>))
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="customerBillCode"
                                label="合同号"
                                className="col2"
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={9}>
                            <Form.Item
                                name="date"
                                label="日期"
                                className="col2"
                            >
                                <RangePicker onChange={selectDate} />
                            </Form.Item>
                            <Form.Item>
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
                rowKey={(record, index) => record.id}
            />
        </div>
    </div>
}

export default EnterOutDetail