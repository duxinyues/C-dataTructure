import React from "react";
import { PageHeader, Button, Table, Form, Input, Row, DatePicker } from "antd";
import "./style.css"
const { RangePicker } = DatePicker;
function ProductionSchedule() {
    document.title = "生产进度";
    const [form] = Form.useForm()
    const columns = [
        { title: "#", dataIndex: "id" },
        { title: "生产单号", dataIndex: "id" },
        { title: "客户", dataIndex: "id" },
        { title: "客户单号", dataIndex: "id" },
        { title: "布类", dataIndex: "id" },
        { title: "纱别", dataIndex: "id" },
        { title: "订单数量", dataIndex: "id" },
        { title: "今日产量", dataIndex: "id" },
        { title: "机号", dataIndex: "id" },
        { title: "库存重量", dataIndex: "id" },
        { title: "出货重量", dataIndex: "id" },
        { title: "欠织重量", dataIndex: "id" },
        { title: "更新时间", dataIndex: "id" },
        { title: "针寸", dataIndex: "id" },
        { title: "成品规格", dataIndex: "id" },
        { title: "客户颜色", dataIndex: "id" }
    ]
    const onFinish = (value) => {
        console.log(value)
    }
    const selectDate = (date, dateString) => {
        console.log(dateString)
    }
    return <React.Fragment>
        <div className="right-container">
            <PageHeader className="productionSchedule">
                <div className="pageTitle">
                    <span>生产进度</span>
                    <div className="tabs">
                        <div className="tabs-item">全部</div>
                        <div className="tabs-item">进行中</div>
                        <div className="tabs-item">未审核</div>
                        <div className="tabs-item">已完工</div>
                        <div className="tabs-item">已作废</div>
                    </div>
                </div>
                <div>
                    <Button style={{ marginRight: "10px" }}>打印</Button>
                    <Button>导出</Button>
                </div>
            </PageHeader>
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
                            name="greyFabricCode"
                            label="客户"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="fabricType"
                            label="布类"
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="yarnName"
                            label="针数"
                        >
                            <Input />
                        </Form.Item>
                    </Row>
                    <Row gutter={24}>
                        <Form.Item
                            name="loomId"
                            label="寸数"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="loomId"
                            label="更新时间"
                            className="update"
                        >
                            <RangePicker onChange={selectDate} />
                        </Form.Item>
                        <Form.Item style={{ marginLeft: "60px" }}>
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
                    </Row>
                </Form>
            </div>
            <Table
                columns={columns}
            />
        </div>
    </React.Fragment>
}

export default ProductionSchedule