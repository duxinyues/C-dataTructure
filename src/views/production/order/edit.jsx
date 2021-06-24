import React, { useState, useEffect, } from "react"
import { Col, Row, Input, Table, DatePicker, Select, message } from "antd";
import { newOrderType, requestUrl, onlyFormat } from "../../../utils/config"
import { createOrderParams } from "../../../actons/action"
import { connect } from "react-redux"
import EditCloth from "./clothTable";
import EditBarcode from "./editBarcode";
import 'moment/locale/zh-cn';
import moment from "moment"
const { Option } = Select;
let EditOrder = (props, ref) => {
    document.title = "编辑订单";
    const _createOrderParam = props.orderData;
    const defaultData = props.orderData.orderYarnInfos;
    const [customer, setcustomer] = useState([{ id: 1, name: "111" }]);
    const [clothType, setclothType] = useState([]);
    const [weight, setweight] = useState(props.orderData.weight);
    const [barCode, setbarCode] = useState([]);
    const [loomData, setloomData] = useState([])
    const yarnBrandBatch = props.orderData.orderYarnInfos.map((item) => {
        return item.yarnBrandBatch;
    })
    _createOrderParam.code = props.orderData.code;
    useEffect(() => {
        getcustomer();
        getClothType();
        getLoom();
        getBarCodes()
    }, [props.orderData])

    const getBarCodes = () => {
        fetch(requestUrl + "/api-production/order/findLoomDetailByOrderId?id=" + props.orderData.id + "&yarnBatch=" + yarnBrandBatch.join(","), {
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token")
            },
        })
            .then(res => { return res.json() })
            .then(res => {
                setloomData(res.data);
                setbarCode(res.data[0])
            })
    }
    // 选择日期
    const selectDate = (date, dateString) => {
        _createOrderParam.bizDate = dateString;
        props.editOrder(_createOrderParam);
        props.createOrderParams(_createOrderParam);
    }
    //交货期
    const selectDeliveryDate = (date, dateString) => {
        _createOrderParam.deliveryDate = dateString;
        props.editOrder(_createOrderParam);
        props.createOrderParams(_createOrderParam);
    }
    // 选择客户
    const selectCustomer = (value) => {
        _createOrderParam.customerId = value;
        props.editOrder(_createOrderParam);
        props.createOrderParams(_createOrderParam);
    }
    const selectClothType = (value) => {
        _createOrderParam.fabricType = value;
        props.editOrder(_createOrderParam);
        props.createOrderParams(_createOrderParam);
    }
    const onchangeCode = ({ target: { value } }) => {
        _createOrderParam.customerBillCode = value;
        props.editOrder(_createOrderParam);
        props.createOrderParams(_createOrderParam);
    }
    const changeGreyFabricCode = ({ target: { value } }) => {
        _createOrderParam.greyFabricCode = value;
        props.editOrder(_createOrderParam);
        props.createOrderParams(_createOrderParam);
    }
    const changeTechType1 = ({ target: { value } }) => {
        _createOrderParam.techType1 = value;
        props.editOrder(_createOrderParam);
        props.createOrderParams(_createOrderParam);
    }
    const changeTechType2 = ({ target: { value } }) => {
        _createOrderParam.techType2 = value;
        props.editOrder(_createOrderParam);
        props.createOrderParams(_createOrderParam);
    }
    const changeInches = ({ target: { value } }) => {
        _createOrderParam.inches = value;
        props.editOrder(_createOrderParam);
        props.createOrderParams(_createOrderParam);
    }
    const changeneedles = ({ target: { value } }) => {
        _createOrderParam.needles = value;
        props.editOrder(_createOrderParam);
        props.createOrderParams(_createOrderParam);
    }
    const changeTotalInches = ({ target: { value } }) => {
        _createOrderParam.totalInches = value;
        props.editOrder(_createOrderParam);
        props.createOrderParams(_createOrderParam);
    }
    const changeType = (value) => {
        _createOrderParam.type = value;
        props.editOrder(_createOrderParam);
        props.createOrderParams(_createOrderParam);
    }
    const changeProductPrice = ({ target: { value } }) => {
        _createOrderParam.productPrice = value;
        props.editOrder(_createOrderParam);
        props.createOrderParams(_createOrderParam);
    }
    const changeweight = ({ target: { value } }) => {
        _createOrderParam.weight = value;
        props.editOrder(_createOrderParam);
        props.createOrderParams(_createOrderParam);
    }
    const changeYarnLength = ({ target: { value } }) => {
        _createOrderParam.yarnLength = value;
        props.editOrder(_createOrderParam);
        props.createOrderParams(_createOrderParam);
    }
    const changeCustomerColor = ({ target: { value } }) => {
        _createOrderParam.customerColor = value;
        props.editOrder(_createOrderParam);
        props.createOrderParams(_createOrderParam);
    }
    const changeRemark = ({ target: { value } }) => {
        _createOrderParam.remark = value;
        props.editOrder(_createOrderParam);
        props.createOrderParams(_createOrderParam);
    }
    // 布类型
    const getClothType = () => {
        fetch(requestUrl + "/api-production/order/getFabricTypeDownList", {
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token"),
            }
        })
            .then(res => { return res.json() })
            .then(res => {
                if (res.code === 200) {
                    setclothType(res.data)
                }
            })
    }
    const getcustomer = () => {
        fetch(requestUrl + "/api-production/order/getCustomerDownList", {
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token"),
            }
        })
            .then(res => { return res.json() })
            .then(res => {
                console.log(res)
                if (res.code === 200) {
                    setcustomer(res.data)
                }
            })
    }
    const getLoom = () => {
        fetch(requestUrl + "/api-production/order/getLoomDownList", {
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token"),
            }
        })
            .then(res => { return res.json() })
            .then(res => {
                console.log(res)
            })
    }
    const onAddCloth = (params) => {
        console.log("编辑用料==", params)
        _createOrderParam.orderYarnInfos = params;
        props.editOrder(_createOrderParam);
    }

    const editCode = (params) => {
        console.log("编辑条码==", params)
        const _barcode = barCode;
        _barcode.barcodes = params
        loomData.map((item)=>{
            item.id = _barcode.id
        })
        _createOrderParam.orderLooms = loomData;
        props.editOrder(_createOrderParam);
    }
    return <React.Fragment>
        <div className="detail-title">
            新建订单
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
                        <div className="c-input">
                            <DatePicker onChange={selectDate} defaultValue={moment(props.orderData.bizDate)} />
                        </div>
                    </Col>
                    <Col span={8} className="c-col">
                        <div className="c-label c-right"><em>*</em>客户</div>
                        <div className="c-input"><Select onChange={selectCustomer} defaultValue={props.orderData.customerId}>
                            {customer.map((item, key) => (<Option value={item.id} key={key}>{item.name}</Option>))}
                        </Select></div>
                    </Col>
                </Row>
                <Row className="c-row">
                    <Col span={8} className="c-col">
                        <div className="c-label">客户单号</div>
                        <div className="c-input"><Input onChange={onchangeCode} defaultValue={props.orderData.customerBillCode} /></div>
                    </Col>
                    <Col span={8} className="c-col">
                        <div className="c-label c-right">坯布编码</div>
                        <div className="c-input"><Input onChange={changeGreyFabricCode} defaultValue={props.orderData.greyFabricCode} /></div>
                    </Col>
                    <Col span={8} className="c-col">
                        <div className="c-label c-right"><em>*</em>布类</div>
                        <div className="c-input"><Select onChange={selectClothType} defaultValue={props.orderData.fabricType}>
                            {clothType.map((item, key) => (<Option value={item} key={key}>{item}</Option>))}
                        </Select></div>
                    </Col>
                </Row>
                <Row className="c-row">
                    <Col span={8} className="c-col spec">
                        <div className="c-label">成品规格</div>
                        <div className="c-input"><Input placeholder="布封" onChange={changeTechType1} defaultValue={props.orderData.techType.split("-")[0]} />-<Input placeholder="克重" onChange={changeTechType2} defaultValue={props.orderData.techType.split("-")[1]} /></div>
                    </Col>
                    <Col span={8} className="c-col spec">
                        <div className="c-label c-right"><em>*</em>针寸</div>
                        <div className="c-input"><Input placeholder="针数" onChange={changeInches} defaultValue={props.orderData.needles} />-<Input placeholder="寸数" onChange={changeneedles} defaultValue={props.orderData.inches} /></div>
                    </Col>
                    <Col span={8} className="c-col">
                        <div className="c-label c-right">总针数</div>
                        <div className="c-input"><Input onChange={changeTotalInches} defaultValue={props.orderData.totalInches} /></div>
                    </Col>
                </Row>
                <Row className="c-row">
                    <Col span={8} className="c-col">
                        <div className="c-label"><em>*</em>类型</div>
                        <div className="c-input">
                            <Select onChange={changeType} defaultValue={props.orderData.type}>
                                {
                                    newOrderType.map((item, key) => (<Option value={item.key} key={key}>{item.name}</Option>))
                                }
                            </Select>
                        </div>
                    </Col>
                    <Col span={8} className="c-col">
                        <div className="c-label c-right">工艺要求</div>
                        <div className="c-input"><Input onChange={changeCustomerColor} defaultValue={props.orderData.customerColor} /></div>
                    </Col>
                    <Col span={8} className="c-col">
                        <div className="c-label c-right">要求匹重</div>
                        <div className="c-input"><Input defaultValue={props.orderData.unitWeight} /></div>
                    </Col>
                </Row>
                <Row className="c-row">
                    <Col span={8} className="c-col">
                        <div className="c-label">坯布交期</div>
                        <div className="c-input"><DatePicker onChange={selectDeliveryDate} defaultValue={moment(props.orderData.deliveryDate)} /></div>
                    </Col>
                    <Col span={8} className="c-col">
                        <div className="c-label c-right">加工单价</div>
                        <div className="c-input"><Input onChange={changeProductPrice} defaultValue={props.orderData.productPrice} /></div>
                    </Col>
                    <Col span={8} className="c-col">
                        <div className="c-label c-right">订单数量</div>
                        <div className="c-input"><Input onChange={changeweight} defaultValue={props.orderData.weight} /></div>
                    </Col>
                </Row>
                <Row className="c-row">
                    <Col span={16} className="c-col">
                        <div className="c-label">纱长</div>
                        <div className="c-input"><Input onChange={changeYarnLength} defaultValue={props.orderData.yarnLength} /></div>
                    </Col>
                    <Col span={8} className="c-col">
                        <div className="c-label c-right">纸管重量</div>
                        <div className="c-input"><Input onChange={changeweight} defaultValue={props.orderData.tareWeight} /></div>
                    </Col>
                </Row>
                <Row className="c-row">
                    <Col span={24} className="c-col">
                        <div className="c-label">备注</div>
                        <div className="c-input"><Input onChange={changeRemark} defaultValue={props.orderData.remark} /></div>
                    </Col>
                </Row>
            </div>
            <div className="edit-table">
                <EditCloth data={defaultData} onAddCloth={onAddCloth} weight={weight} />
            </div>
            <div>
                <div className="clothing">
                    布票信息
                </div>
                <div className="clothing-data">
                    <div className="clothing-left" style={{ width: "150px" }}>
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
                                        setbarCode(record)
                                    },
                                };
                            }}
                        />
                    </div>
                    <div className="clothing-right">
                        <EditBarcode editCode={editCode} data={barCode.barcodes} />
                    </div>
                </div>
            </div>
        </div>
    </React.Fragment>
}

const mapStateToProps = (state) => {
    return {
        createOrderParam: state.createOrderParam
    }
}
export default connect(mapStateToProps, { createOrderParams })(EditOrder)