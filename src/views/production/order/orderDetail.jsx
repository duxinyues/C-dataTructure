import React, { useState, useEffect } from "react"
import { Col, Row, Input, Tabs, Table } from "antd";
import { newOrderType, requestUrl, onlyFormat } from "../../../utils/config";
const { TabPane } = Tabs;
function OrderDetail(props) {
    console.log(props)
    document.title = "订单管理";
    const [barCode, setbarCode] = useState([]);
    const [loomData, setloomData] = useState();
    const [yarnInfoData, setyarnInfoData] = useState([])
    const yarnBrandBatch = props.orderData.orderYarnInfos.map((item) => {
        return item.yarnBrandBatch;
    })
    useEffect(() => {
        props.orderData.orderYarnInfos.map((item) => {
            console.log("用料信息纱批==", item.yarnBrandBatch.split(","))
        })
        setyarnInfoData(props.orderData.orderYarnInfos)
        getBarCodes();
    }, [])
    console.log("订单纱批=", yarnBrandBatch)
    const getBarCodes = () => {
        fetch(requestUrl + "/api-production/order/findLoomDetialByOrderId?id=" + props.orderData.id + "&yarnBatch=" + yarnBrandBatch.join(","), {
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token")
            },
        })
            .then(res => { return res.json() })
            .then(res => {
                console.log(res)
                setloomData(res.data);
                // setbarCode(res.data[0].barcodes)
            })
    }

    return <React.Fragment>
        <div className="detail-title">
            标题
        </div>
        <div className="detail-content">
            <div className="basic-data">
                <Row className="c-row">
                    <Col span={8} className="c-col">
                        <div className="c-label">生产单号</div>
                        <div className="c-input"><Input disabled value={props.orderData.code} /></div>
                    </Col>
                    <Col span={8} className="c-col">
                        <div className="c-label c-right">订单日期</div>
                        <div className="c-input"><Input disabled value={onlyFormat(props.orderData.bizDate, false)} /></div>
                    </Col>
                    <Col span={8} className="c-col">
                        <div className="c-label c-right">客户</div>
                        <div className="c-input"><Input disabled value={props.orderData.customerName} /></div>
                    </Col>
                </Row>
                <Row className="c-row">
                    <Col span={8} className="c-col">
                        <div className="c-label">客户单号</div>
                        <div className="c-input"><Input disabled value={props.orderData.customerBillCode} /></div>
                    </Col>
                    <Col span={8} className="c-col">
                        <div className="c-label c-right">坯布编码</div>
                        <div className="c-input"><Input disabled value={props.orderData.greyFabricCode} /></div>
                    </Col>
                    <Col span={8} className="c-col">
                        <div className="c-label c-right">布类</div>
                        <div className="c-input"><Input disabled value={props.orderData.fabricType} /></div>
                    </Col>
                </Row>
                <Row className="c-row">
                    <Col span={8} className="c-col">
                        <div className="c-label">成品规格</div>
                        <div className="c-input"><Input disabled value={props.orderData.techType} /></div>
                    </Col>
                    <Col span={8} className="c-col">
                        <div className="c-label c-right">针寸</div>
                        <div className="c-input"><Input disabled value={props.orderData.needles + "-" + props.orderData.inches} /></div>
                    </Col>
                    <Col span={8} className="c-col">
                        <div className="c-label c-right">总针数</div>
                        <div className="c-input"><Input disabled value={props.orderData.totalInches} /></div>
                    </Col>
                </Row>
                <Row className="c-row">
                    <Col span={8} className="c-col">
                        <div className="c-label">类型</div>
                        <div className="c-input"><Input disabled value={newOrderType[props.orderData.type].name} /></div>
                    </Col>
                    <Col span={8} className="c-col">
                        <div className="c-label c-right">坯布交期</div>
                        <div className="c-input"><Input disabled value={onlyFormat(props.orderData.deliveryDate, false)} /></div>
                    </Col>
                    <Col span={8} className="c-col">
                        <div className="c-label c-right">加工单价</div>
                        <div className="c-input"><Input disabled value={props.orderData.productPrice} /></div>
                    </Col>
                </Row>
                <Row className="c-row">
                    <Col span={8} className="c-col">
                        <div className="c-label">订单数量</div>
                        <div className="c-input"><Input disabled value={props.orderData.weight} /></div>
                    </Col>

                </Row>
                <Row className="c-row">
                    <Col span={16} className="c-col">
                        <div className="c-label">纱长</div>
                        <div className="c-input"><Input disabled value={props.orderData.yarnLength} /></div>
                    </Col>

                </Row>
                <Row className="c-row">
                    <Col span={16} className="c-col">
                        <div className="c-label">客户颜色</div>
                        <div className="c-input"><Input disabled value={props.orderData.customerColor} /></div>
                    </Col>
                    <Col span={8} className="c-col">
                        <div className="c-label c-right">备注</div>
                        <div className="c-input"><Input disabled value={props.orderData.remark} /></div>
                    </Col>
                </Row>

            </div>
            <div>
                <Tabs defaultActiveKey="1" >
                    <TabPane tab="用料要求" key="1">
                        <Table
                            pagination={false}
                            columns={[
                                { title: "纱别", dataIndex: "yarnName" },
                                { title: "纱牌/纱批", dataIndex: "yarnBrandBatch" },
                                { title: "纱比%", dataIndex: "rate" },
                                { title: "织损%", dataIndex: "knitWastage" },
                                { title: "计划用量", dataIndex: "planWeight" },
                            ]}
                            dataSource={yarnInfoData}
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
                                { title: "机台", dataIndex: "loomCode" },
                                { title: "卷数", dataIndex: "volQty" },
                            ]}
                            dataSource={loomData}
                            pagination={false}
                            onRow={record => {
                                return {
                                    onClick: () => {
                                        console.log("机台数据==", record.barcodes);
                                        setbarCode(record.barcodes)
                                    },
                                };
                            }}
                        />
                    </div>
                    <div className="clothing-right">
                        <Table
                            columns={[
                                { title: "条码", dataIndex: "barcode" },
                                { title: "疋号", dataIndex: "seq" },
                                { title: "入库重量", dataIndex: "weight" },
                                { title: "入库时间", dataIndex: "inStockTime", render: (time) => (<span>{onlyFormat(time, true)}</span>) },
                                { title: "出库时间", dataIndex: "outStockTime", render: (time) => (<span>{onlyFormat(time, true)}</span>) },
                                { title: "纱牌/纱批", dataIndex: "yarnBrandBatch" },
                                { title: "查布记录", dataIndex: "flawInfo" }
                            ]}
                            pagination={false}
                            dataSource={barCode}
                            scroll={{
                                y: 150
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    </React.Fragment>
}

export default OrderDetail