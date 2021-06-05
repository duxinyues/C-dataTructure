import React from "react"
import { Col, Row, Input, Tabs, Table } from "antd";
const { TabPane } = Tabs;
function OrderDetail() {
    document.title = "订单管理"
    return <React.Fragment>
        <div className="detail-title">
            标题
        </div>
        <div className="detail-content">
            <div className="basic-data">
                <Row className="c-row">
                    <Col span={8} className="c-col">
                        <div className="c-label">生产单号</div>
                        <div className="c-input"><Input disabled /></div>
                    </Col>
                    <Col span={8} className="c-col">
                        <div className="c-label c-right">订单日期</div>
                        <div className="c-input"><Input disabled /></div>
                    </Col>
                    <Col span={8} className="c-col">
                        <div className="c-label c-right">客户</div>
                        <div className="c-input"><Input disabled /></div>
                    </Col>
                </Row>
                <Row className="c-row">
                    <Col span={8} className="c-col">
                        <div className="c-label">客户单号</div>
                        <div className="c-input"><Input disabled /></div>
                    </Col>
                    <Col span={8} className="c-col">
                        <div className="c-label c-right">坯布编码</div>
                        <div className="c-input"><Input disabled /></div>
                    </Col>
                    <Col span={8} className="c-col">
                        <div className="c-label c-right">布类</div>
                        <div className="c-input"><Input disabled /></div>
                    </Col>
                </Row>
                <Row className="c-row">
                    <Col span={8} className="c-col">
                        <div className="c-label">成品规格</div>
                        <div className="c-input"><Input disabled /></div>
                    </Col>
                    <Col span={8} className="c-col">
                        <div className="c-label c-right">针寸</div>
                        <div className="c-input"><Input disabled /></div>
                    </Col>
                    <Col span={8} className="c-col">
                        <div className="c-label c-right">总针数</div>
                        <div className="c-input"><Input disabled /></div>
                    </Col>
                </Row>
                <Row className="c-row">
                    <Col span={8} className="c-col">
                        <div className="c-label">类型</div>
                        <div className="c-input"><Input disabled /></div>
                    </Col>
                    <Col span={8} className="c-col">
                        <div className="c-label c-right">工艺要求</div>
                        <div className="c-input"><Input disabled /></div>
                    </Col>
                    <Col span={8} className="c-col">
                        <div className="c-label c-right">要求疋重</div>
                        <div className="c-input"><Input disabled /></div>
                    </Col>
                </Row>
                <Row className="c-row">
                    <Col span={8} className="c-col">
                        <div className="c-label">坯布交期</div>
                        <div className="c-input"><Input disabled /></div>
                    </Col>
                    <Col span={8} className="c-col">
                        <div className="c-label c-right">加工单价</div>
                        <div className="c-input"><Input disabled /></div>
                    </Col>
                    <Col span={8} className="c-col">
                        <div className="c-label c-right">订单数量</div>
                        <div className="c-input"><Input disabled /></div>
                    </Col>
                </Row>
                <Row className="c-row">
                    <Col span={16} className="c-col">
                        <div className="c-label">纱长</div>
                        <div className="c-input"><Input disabled /></div>
                    </Col>
                    <Col span={8} className="c-col">
                        <div className="c-label c-right">磅布去皮</div>
                        <div className="c-input"><Input disabled /></div>
                    </Col>
                </Row>
                <Row className="c-row">
                    <Col span={16} className="c-col">
                        <div className="c-label">客户颜色</div>
                        <div className="c-input"><Input disabled /></div>
                    </Col>
                    <Col span={8} className="c-col">
                        <div className="c-label c-right">备注</div>
                        <div className="c-input"><Input disabled /></div>
                    </Col>
                </Row>
                <Row>
                    <Col span={24} className="c-col">
                        <div className="c-label">注意事项</div>
                        <div className="c-input"><Input disabled /></div>
                    </Col>

                </Row>
            </div>
            <div>
                <Tabs defaultActiveKey="1" >
                    <TabPane tab="用料要求" key="1">
                        <Table
                            columns={[
                                { title: "纱别" },
                                { title: "纱牌/纱批" },
                                { title: "纱比%" },
                                { title: "织损%" },
                                { title: "计划用量" },
                            ]}
                        />
                    </TabPane>
                    <TabPane tab="查看收纱" key="2">
                        <Table
                            columns={[
                                { title: "生产单号" },
                                { title: "客户单号" },
                                { title: "布类" },
                                { title: "纱别" },
                                { title: "纱牌/纱批" },
                                { title: "纱比%" },
                                { title: "织损%" },
                                { title: "已织重量" },
                                { title: "用纱数量" },
                                { title: "库存数量" }
                            ]}
                        />
                    </TabPane>
                </Tabs>
            </div>
            <div>
                <div className="clothing">
                    布票信息
                </div>
                <div className="clothing-data">
                    <div className="clothing-left">
                        <Table
                            columns={[
                                { title: "机台" },
                                { title: "卷数" },
                            ]}
                        />
                    </div>
                    <div className="clothing-right">
                        <Table
                            columns={[
                                { title: "条码" },
                                { title: "疋号" },
                                { title: "入库重量" },
                                { title: "入库时间" },
                                { title: "出库时间" },
                                { title: "纱牌/纱批" },
                                { title: "查布记录" }
                            ]}
                        />
                    </div>
                </div>
            </div>
        </div>
    </React.Fragment>
}

export default OrderDetail