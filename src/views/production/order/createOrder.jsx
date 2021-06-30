import React, { useState, useEffect, } from "react"
import { Col, Row, Input, DatePicker, Select, message, AutoComplete } from "antd";
import { newOrderType, requestUrl, r } from "../../../utils/config";
import { createOrderParams } from "../../../actons/action";
import { getClothType } from "../../../api/apiModule"
import { connect } from "react-redux";
import EditCloth from './clothTable';
import EditLoom from "./loomTable";
import 'moment/locale/zh-cn';
import moment from "moment";
const { Option } = Select;
function CreateOrder(props) {
    document.title = "新建订单";
    const _createOrderParam = props.createOrderParam;
    const today = moment();
    const [customer, setcustomer] = useState([{ id: 1, name: "111" }]);
    const [clothType, setclothType] = useState([]);
    const [weight, setweight] = useState(0); // 订单数量
    const [loom, setloom] = useState();
    useEffect(() => {
        getcustomer();
        getClothType((res) => {
            if (res.code === 200) {
                setclothType(res.data)
            }
        })
        getLoom();
    }, [])
    // 选择日期
    const selectDate = (date, dateString) => {
        _createOrderParam.bizDate = dateString;
        props.createOrder(_createOrderParam);
        props.createOrderParams(_createOrderParam);
    }
    // 交布日期
    const selectDeliveryDate = (date, dateString) => {
        _createOrderParam.deliveryDate = dateString;
        props.createOrderParams(_createOrderParam);
        props.createOrder(_createOrderParam);
    }
    // 选择客户
    const selectCustomer = (value) => {
        _createOrderParam.customerId = value;
        props.createOrderParams(_createOrderParam);
        props.createOrder(_createOrderParam);
    }
    const selectClothType = (value) => {
        console.log(value)
        _createOrderParam.fabricType = value;
        props.createOrderParams(_createOrderParam);
        props.createOrder(_createOrderParam);
    }
    // 合同编号
    const onchangeCode = ({ target: { value } }) => {
        _createOrderParam.customerBillCode = value;
        props.createOrderParams(_createOrderParam);
        props.createOrder(_createOrderParam);
    }
    // 坯布编码
    const changeGreyFabricCode = ({ target: { value } }) => {
        _createOrderParam.greyFabricCode = value;
        props.createOrderParams(_createOrderParam);
        props.createOrder(_createOrderParam);
    }
    // 规格
    const changeTechType1 = ({ target: { value } }) => {
        _createOrderParam.techType1 = value;
        props.createOrderParams(_createOrderParam);
        props.createOrder(_createOrderParam);
    }
    const changeTechType2 = ({ target: { value } }) => {
        _createOrderParam.techType2 = value;
        props.createOrderParams(_createOrderParam);
        props.createOrder(_createOrderParam);
    }
    //针
    const changeInches = ({ target: { value } }) => {
        if (!r.test(value)) {
            message.warning("请输入正整数！");
            return;
        }
        _createOrderParam.inches = value;
        props.createOrderParams(_createOrderParam);
        props.createOrder(_createOrderParam);
    }
    // 寸
    const changeneedles = ({ target: { value } }) => {
        if (!r.test(value)) {
            message.warning("请输入正整数！");
            return;
        }
        _createOrderParam.needles = value;
        props.createOrderParams(_createOrderParam);
        props.createOrder(_createOrderParam);
    }
    // 总针数
    const changeTotalInches = ({ target: { value } }) => {
        if (!r.test(value)) {
            message.warning("请输入正整数！");
            return;
        }
        _createOrderParam.totalInches = value;
        props.createOrderParams(_createOrderParam);
        props.createOrder(_createOrderParam);
    }
    // 类型
    const changeType = (value) => {
        _createOrderParam.type = value;
        props.createOrderParams(_createOrderParam);
        props.createOrder(_createOrderParam);
    }
    // 加工单价
    const changeProductPrice = ({ target: { value } }) => {
        _createOrderParam.productPrice = value;
        props.createOrderParams(_createOrderParam);
        props.createOrder(_createOrderParam);
    }
    // 订单数量
    const changeweight = ({ target: { value } }) => {
        setweight(value);
        _createOrderParam.weight = value;
        props.createOrderParams(_createOrderParam);
        props.createOrder(_createOrderParam);
    }
    // 纱长
    const changeYarnLength = ({ target: { value } }) => {
        _createOrderParam.yarnLength = value;
        props.createOrderParams(_createOrderParam);
        props.createOrder(_createOrderParam);
    }
    // 工艺要求
    const changeCustomerColor = ({ target: { value } }) => {
        _createOrderParam.customerColor = value;
        props.createOrderParams(_createOrderParam);
        props.createOrder(_createOrderParam);
    }
    // 备注
    const changeRemark = ({ target: { value } }) => {
        _createOrderParam.remark = value;
        props.createOrderParams(_createOrderParam);
        props.createOrder(_createOrderParam);
    }
    // 每匹重量
    const changetareWeight = ({ target: { value } }) => {
        _createOrderParam.unitWeight = value;
        props.createOrderParams(_createOrderParam);
        props.createOrder(_createOrderParam);
    }
    // 纸管重量
    const changeunitWeight = ({ target: { value } }) => {
        _createOrderParam.tareWeight = value;
        props.createOrderParams(_createOrderParam);
        props.createOrder(_createOrderParam);
    }
    const onAddCloth = (value) => {
        _createOrderParam.orderYarnInfos = value;
        props.createOrder(_createOrderParam);
    }
    const onAddLoom = (value) => {
        _createOrderParam.orderLooms = value;
        props.createOrder(_createOrderParam);
    }

    const getcustomer = () => {
        fetch(requestUrl + "/api-production/order/getCustomerDownList", {
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token"),
            }
        })
            .then(res => { return res.json() })
            .then(res => {
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
                res.data.map((item) => {
                    item.text = item.code
                })
                setloom(res.data)
            })
    }
    return <React.Fragment>
        {/* <div className="detail-title">
            新建订单
        </div> */}
        <div className="detail-content">
            <div className="basic-data">
                <Row className="c-row">
                    <Col span={8} className="c-col">
                        <div className="c-label">生产单号</div>
                        <div className="c-input"><Input disabled placeholder="保存自动生成..." /></div>
                    </Col>
                    <Col span={8} className="c-col">
                        <div className="c-label c-right">订单日期</div>
                        <div className="c-input">
                            <DatePicker onChange={selectDate} defaultValue={moment(today)} />
                        </div>
                    </Col>
                    <Col span={8} className="c-col">
                        <div className="c-label c-right"><em>*</em>客户</div>
                        <div className="c-input"><Select onChange={selectCustomer}>
                            {customer.map((item, key) => (<Option value={item.id} key={key}>{item.name}</Option>))}
                        </Select></div>
                    </Col>
                </Row>
                <Row className="c-row">
                    <Col span={8} className="c-col">
                        <div className="c-label"><em>*</em>合同号</div>
                        <div className="c-input"><Input onChange={onchangeCode} /></div>
                    </Col>
                    <Col span={8} className="c-col">
                        <div className="c-label c-right">坯布编码</div>
                        <div className="c-input"><Input onChange={changeGreyFabricCode} /></div>
                    </Col>
                    <Col span={8} className="c-col">
                        <div className="c-label c-right"><em>*</em>布类</div>
                        <div className="c-input">
                            <AutoComplete
                                style={{ height: "26px" }}
                                onChange={selectClothType}
                            >
                                {clothType.map((email) => (
                                    <Option key={email} value={email}>
                                        {email}
                                    </Option>
                                ))}
                            </AutoComplete>
                        </div>
                    </Col>
                </Row>
                <Row className="c-row">
                    <Col span={8} className="c-col">
                        <div className="c-label"><em>*</em>类型</div>
                        <div className="c-input">
                            <Select onChange={changeType}>
                                {
                                    newOrderType.map((item, key) => (<Option value={item.key} key={key}>{item.name}</Option>))
                                }
                            </Select>
                        </div>
                    </Col>

                    <Col span={8} className="c-col spec">
                        <div className="c-label c-right"><em>*</em>针寸</div>
                        <div className="c-input"><Input placeholder="针数" onChange={changeInches} />-<Input placeholder="寸数" onChange={changeneedles} /></div>
                    </Col>
                    <Col span={8} className="c-col">
                        <div className="c-label c-right">总针数</div>
                        <div className="c-input"><Input onChange={changeTotalInches} /></div>
                    </Col>
                </Row>
                <Row className="c-row">
                    <Col span={8} className="c-col spec">
                        <div className="c-label">成品规格</div>
                        <div className="c-input"><Input placeholder="布封" onChange={changeTechType1} />-<Input placeholder="克重" onChange={changeTechType2} /></div>
                    </Col>
                    <Col span={8} className="c-col">
                        <div className="c-label c-right">颜色</div>
                        <div className="c-input"><Input onChange={changeCustomerColor} /></div>
                    </Col>
                    <Col span={8} className="c-col">
                        <div className="c-label c-right">每匹重量</div>
                        <div className="c-input"><Input onChange={changetareWeight} type="number" /></div>
                    </Col>
                </Row>
                <Row className="c-row">
                    <Col span={8} className="c-col">
                        <div className="c-label">订单交期</div>
                        <div className="c-input"><DatePicker onChange={selectDeliveryDate} /></div>
                    </Col>
                    <Col span={8} className="c-col">
                        <div className="c-label c-right">加工单价</div>
                        <div className="c-input"><Input onChange={changeProductPrice} /></div>
                    </Col>
                    <Col span={8} className="c-col">
                        <div className="c-label c-right"><em>*</em>订单数量</div>
                        <div className="c-input"><Input onChange={changeweight} type="number" /></div>
                    </Col>
                </Row>
                <Row className="c-row">
                    <Col span={16} className="c-col">
                        <div className="c-label">纱长</div>
                        <div className="c-input"><Input onChange={changeYarnLength} /></div>
                    </Col>
                    <Col span={8} className="c-col">
                        <div className="c-label c-right">纸管重量</div>
                        <div className="c-input"><Input onChange={changeunitWeight} /></div>
                    </Col>
                </Row>
                <Row className="c-row">
                    <Col span={24} className="c-col">
                        <div className="c-label">备注</div>
                        <div className="c-input"><Input onChange={changeRemark} /></div>
                    </Col>
                </Row>
            </div>
            <div className="edit-table" style={{ marginTop: "20px" }}>
                <EditCloth onAddCloth={onAddCloth} weight={weight} data={[]} />
            </div>
            <div style={{ marginTop: "20px" }}>
                <EditLoom onAddLoom={onAddLoom} data={loom} />
            </div>
        </div>
    </React.Fragment>
}
const mapStateToProps = (state) => {
    return {
        createOrderParam: state.createOrderParam
    }
}
export default connect(mapStateToProps, { createOrderParams })(CreateOrder)