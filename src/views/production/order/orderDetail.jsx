import React, { useState, useEffect } from "react"
import { Col, Row, Input, Tabs, Table } from "antd";
import { newOrderType, onlyFormat } from "../../../utils/config";
import { getBarCodes } from "../../../api/apiModule"
const { TabPane } = Tabs;
function OrderDetail(props) {
    document.title = "订单管理";
    const [barCode, setbarCode] = useState([]);
    const [loomData, setloomData] = useState();
    const [yarnInfoData, setyarnInfoData] = useState([])
    const yarnBrandBatch = props.orderData ? props.orderData.orderYarnInfos.map((item) => {
        return item.yarnBrandBatch;
    }) : []
    useEffect(() => {
        if (props.orderData) {
            setyarnInfoData(props.orderData.orderYarnInfos);
            getBarCodes(props.orderData.id, yarnBrandBatch.join(","), (res) => {
                if (res.data.length === 0) {
                    setloomData([]);
                    setbarCode([]);
                    return;
                }
                setloomData(res.data);
                setbarCode(res.data[0].barcodes)
            });
        }
    }, [props.orderData])
    return <React.Fragment>
        {/* <div className="detail-title">
            标题
        </div> */}
        <div className="detail-content">
            <div className="basic-data">
                <Row className="c-row">
                    <Col span={8} className="c-col">
                        <div className="c-label">生产单号</div>
                        <div className="c-input"><Input disabled value={props.orderData ? props.orderData.code : ""} /></div>
                    </Col>
                    <Col span={8} className="c-col">
                        <div className="c-label c-right">订单日期</div>
                        <div className="c-input"><Input disabled value={props.orderData ? onlyFormat(props.orderData.bizDate, false) : ""} /></div>
                    </Col>
                    <Col span={8} className="c-col">
                        <div className="c-label c-right">客户</div>
                        <div className="c-input"><Input disabled value={props.orderData ? props.orderData.customerName : ""} /></div>
                    </Col>
                </Row>
                <Row className="c-row">
                    <Col span={8} className="c-col">
                        <div className="c-label">合同号</div>
                        <div className="c-input"><Input disabled value={props.orderData ? props.orderData.customerBillCode : ""} /></div>
                    </Col>
                    <Col span={8} className="c-col">
                        <div className="c-label c-right">坯布编码</div>
                        <div className="c-input"><Input disabled value={props.orderData ? props.orderData.greyFabricCode : ""} /></div>
                    </Col>
                    <Col span={8} className="c-col">
                        <div className="c-label c-right">布类</div>
                        <div className="c-input"><Input disabled value={props.orderData ? props.orderData.fabricType : ""} /></div>
                    </Col>
                </Row>
                <Row className="c-row">
                    <Col span={8} className="c-col">
                        <div className="c-label">类型</div>
                        <div className="c-input"><Input disabled value={props.orderData ? newOrderType[props.orderData.type - 1].name : ""} /></div>
                    </Col>

                    <Col span={8} className="c-col">
                        <div className="c-label c-right">针寸</div>
                        <div className="c-input"><Input disabled value={props.orderData ? props.orderData.needles + "-" + props.orderData.inches : ""} /></div>
                    </Col>
                    <Col span={8} className="c-col">
                        <div className="c-label c-right">总针数</div>
                        <div className="c-input"><Input disabled value={props.orderData ? props.orderData.totalInches : ""} /></div>
                    </Col>
                </Row>
                <Row className="c-row">
                    <Col span={8} className="c-col">
                        <div className="c-label">成品规格</div>
                        <div className="c-input"><Input disabled value={props.orderData ? props.orderData.techType : ""} /></div>
                    </Col>
                    <Col span={8} className="c-col">
                        <div className="c-label c-right">颜色</div>
                        <div className="c-input"><Input disabled value={props.orderData ? props.orderData.customerColor : ""} /></div>
                    </Col>

                    <Col span={8} className="c-col">
                        <div className="c-label c-right">每匹重量</div>
                        <div className="c-input"><Input disabled value={props.orderData ? props.orderData.unitWeight : ""} /></div>
                    </Col>

                </Row>
                <Row className="c-row">
                    <Col span={8} className="c-col">
                        <div className="c-label ">订单交期</div>
                        <div className="c-input"><Input disabled value={props.orderData ? onlyFormat(props.orderData.deliveryDate, false) : ""} /></div>
                    </Col>
                    <Col span={8} className="c-col">
                        <div className="c-label c-right">加工单价</div>
                        <div className="c-input"><Input disabled value={props.orderData ? props.orderData.productPrice : ""} /></div>
                    </Col>
                    <Col span={8} className="c-col">
                        <div className="c-label c-right">订单数量</div>
                        <div className="c-input"><Input disabled value={props.orderData ? props.orderData.weight : ""} /></div>
                    </Col>
                </Row>
                <Row className="c-row">
                    <Col span={16} className="c-col">
                        <div className="c-label">纱长</div>
                        <div className="c-input"><Input disabled value={props.orderData ? props.orderData.yarnLength : ""} /></div>
                    </Col>
                    <Col span={8} className="c-col">
                        <div className="c-label c-right">纸管重量</div>
                        <div className="c-input"><Input disabled value={props.orderData ? props.orderData.tareWeight : ""} /></div>
                    </Col>
                </Row>
                <Row className="c-row">
                    <Col span={24} className="c-col">
                        <div className="c-label">备注</div>
                        <div className="c-input"><Input disabled value={props.orderData ? props.orderData.remark : ""} /></div>
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
                            dataSource={props.orderData ? yarnInfoData : []}
                        />
                    </TabPane>
                    <TabPane tab="收料明细" key="2">
                        <Table
                            columns={[
                                { title: "生产单号" },
                                { title: "合同号" },
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
                <div className="clothing" style={{ color: "#1890FF", marginTop: "21px", marginBottom: "9px" }}>
                    布票信息
                </div>
                <div className="clothing-data">
                    <div className="clothing-left" style={{ width: "125px" }}>
                        <Table
                            columns={[
                                { title: "机号", dataIndex: "loomCode" },
                                { title: "匹数", dataIndex: "volQty" },
                            ]}
                            dataSource={props.orderData ? loomData : []}
                            pagination={false}
                            onRow={record => {
                                return {
                                    onClick: () => {
                                        setbarCode(record.barcodes)
                                    },
                                };
                            }}
                        />
                    </div>
                    <div className="clothing-right" style={{ width: "calc(100% - 125px)" }}>
                        <Table
                            columns={[
                                { title: "条码", dataIndex: "barcode" },
                                { title: "匹号", dataIndex: "seq" },
                                { title: "入库重量", dataIndex: "weight" },
                                { title: "入库时间", dataIndex: "inStockTime", render: (time) => (<span>{onlyFormat(time, true)}</span>) },
                                { title: "出库时间", dataIndex: "outStockTime", render: (time) => (<span>{onlyFormat(time, true)}</span>) },
                                { title: "查布记录", dataIndex: "flawInfo" },
                                { title: "查布员", dataIndex: "qcName" },
                                { title: "值机工", dataIndex: "weaverName" }
                            ]}
                            pagination={false}
                            dataSource={barCode}
                            style={{ height: "250px", overflowY: "scroll" }}
                        />
                    </div>
                </div>
            </div>
        </div>
    </React.Fragment>
}

export default OrderDetail