import React, { useImperativeHandle, forwardRef, useState, useEffect, } from "react"
import { Col, Row, Input, Table, DatePicker, Select, message } from "antd";
import { newOrderType, requestUrl, getNowFormatDate } from "../../../utils/config"
import { EditableProTable } from '@ant-design/pro-table';
import { createOrderParams } from "../../../actons/action"
import { connect } from "react-redux"
import EditCloth from './clothTable'
import 'moment/locale/zh-cn';
import moment from "moment"
const { Option } = Select;
const defaultData = new Array(1).fill(1).map((_, index) => {
    return {
        id: (Date.now() + index).toString(),
        yarnName: "",
        yarnBrandBatch: "",
        rate: "",
        knitWastage: '',
        planWeight: ""
    };
});

let CreateOrder = (props, ref) => {
    // console.log("订单字段==", props)
    document.title = "新建订单";
    const _createOrderParam = props.createOrderParam;
    const today = moment();
    const [customer, setcustomer] = useState([{ id: 1, name: "111" }]);
    const [clothType, setclothType] = useState([]);
    const [materials, setmaterials] = useState(() => defaultData); //用料要求
    const [editableKeys, setEditableRowKeys] = useState(() =>
        defaultData.map((item) => item.id));
    const [editableKeysloom, setEditableRowKeysloom] = useState();
    const [bizDate, setbizDate] = useState(getNowFormatDate())
    const [customerId, setcustomerId] = useState();
    const [fabricType, setfabricType] = useState();
    const [code, setcode] = useState();
    const [greyFabricCode, setgreyFabricCode] = useState();
    const [techType1, settechType1] = useState()
    const [techType2, settechType2] = useState();
    const [inches, setinches] = useState();
    const [needles, setneedles] = useState();
    const [totalInches, settotalInches] = useState();
    const [type, settype] = useState();
    const [deliveryDate, setdeliveryDate] = useState();
    const [productPrice, setproductPrice] = useState();
    const [weight, setweight] = useState(0); // 订单数量
    const [yarnLength, setyarnLength] = useState();
    const [customerColor, setcustomerColor] = useState();
    const [remark, setremark] = useState();
    const [loom, setloom] = useState();
    const [orderLooms, setorderLooms] = useState()
    useEffect(() => {
        getcustomer();
        getClothType();
        getLoom();
    }, [])
    // 选择日期
    const selectDate = (date, dateString) => {
        _createOrderParam.bizDate = dateString;
        props.createOrderParams({ ..._createOrderParam });
    }
    // 交布日期
    const selectDeliveryDate = (date, dateString) => {
        _createOrderParam.deliveryDate = dateString;
        props.createOrderParams({ ..._createOrderParam });
    }
    // 选择客户
    const selectCustomer = (value) => {
        _createOrderParam.customerId = value;
        props.createOrderParams({ ..._createOrderParam })
    }
    const selectClothType = (value) => {
        _createOrderParam.fabricType = value;
        props.createOrderParams({ ..._createOrderParam });
    }
    // 合同编号
    const onchangeCode = ({ target: { value } }) => {
        _createOrderParam.customerBillCode = value;
        props.createOrderParams({ ..._createOrderParam });
    }
    // 坯布编码
    const changeGreyFabricCode = ({ target: { value } }) => {
        _createOrderParam.greyFabricCode = value;
        props.createOrderParams({ ..._createOrderParam });
    }
    // 规格
    const changeTechType1 = ({ target: { value } }) => {
        _createOrderParam.techType = _createOrderParam.techType ? value + _createOrderParam.techType : value;
        props.createOrderParams({ ..._createOrderParam });
    }
    const changeTechType2 = ({ target: { value } }) => {
        _createOrderParam.techType = _createOrderParam.techType ? _createOrderParam.techType + value : "-" + value;
        props.createOrderParams({ ..._createOrderParam });
    }
    //针
    const changeInches = ({ target: { value } }) => {
        _createOrderParam.inches = value;
        props.createOrderParams({ ..._createOrderParam });
    }
    // 寸
    const changeneedles = ({ target: { value } }) => {
        _createOrderParam.needles = value;
        props.createOrderParams({ ..._createOrderParam });
    }
    // 总针数
    const changeTotalInches = ({ target: { value } }) => {
        _createOrderParam.totalInches = value;
        props.createOrderParams({ ..._createOrderParam });
    }
    // 类型
    const changeType = (value) => {
        _createOrderParam.type = value;
        props.createOrderParams({ ..._createOrderParam });
    }
    // 加工单价
    const changeProductPrice = ({ target: { value } }) => {
        _createOrderParam.productPrice = value;
        props.createOrderParams({ ..._createOrderParam });
    }
    // 订单数量
    const changeweight = ({ target: { value } }) => {
        setweight(value);
        _createOrderParam.weight = value;
        props.createOrderParams({ ..._createOrderParam });
    }
    // 纱长
    const changeYarnLength = ({ target: { value } }) => {
        _createOrderParam.yarnLength = value;
        props.createOrderParams({ ..._createOrderParam });
    }
    // 工艺要求
    const changeCustomerColor = ({ target: { value } }) => {
        _createOrderParam.customerColor = value;
        props.createOrderParams({ ..._createOrderParam });
    }
    // 备注
    const changeRemark = ({ target: { value } }) => {
        _createOrderParam.remark = value;
        props.createOrderParams({ ..._createOrderParam });
    }
    // 每匹重量
    const changetareWeight = ({ target: { value } }) => {
        _createOrderParam.tareWeight = value;
        props.createOrderParams({ ..._createOrderParam });
    }
    // 纸管重量
    const changeunitWeight = ({ target: { value } }) => {
        _createOrderParam.tareWeight = value;
        props.createOrderParams({ ..._createOrderParam });
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

    const loomColumns = [
        {
            title: '机号',
            key: 'loomId',
            dataIndex: 'loomId',
            valueType: 'select',
            valueEnum: loom
        },
        {
            title: "卷数",
            dataIndex: "volQty",
        }, {
            title: '操作',
            valueType: 'option',
            render: () => {
                return null;
            },
        },
    ]
    return <React.Fragment>
        <div className="detail-title">
            新建订单
        </div>
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
                        <div className="c-label">合同编号</div>
                        <div className="c-input"><Input onChange={onchangeCode} /></div>
                    </Col>
                    <Col span={8} className="c-col">
                        <div className="c-label c-right">坯布编码</div>
                        <div className="c-input"><Input onChange={changeGreyFabricCode} /></div>
                    </Col>
                    <Col span={8} className="c-col">
                        <div className="c-label c-right"><em>*</em>布类</div>
                        <div className="c-input"><Select onChange={selectClothType}>
                            {clothType.map((item, key) => (<Option value={item} key={key}>{item}</Option>))}
                        </Select></div>
                    </Col>
                </Row>
                <Row className="c-row">
                    <Col span={8} className="c-col spec">
                        <div className="c-label">成品规格</div>
                        <div className="c-input"><Input placeholder="布封" onChange={changeTechType1} />-<Input placeholder="克重" onChange={changeTechType2} /></div>
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
                    <Col span={8} className="c-col">
                        <div className="c-label c-right">颜色</div>
                        <div className="c-input"><Input onChange={changeCustomerColor} /></div>
                    </Col>
                    <Col span={8} className="c-col">
                        <div className="c-label c-right">每匹重量</div>
                        <div className="c-input"><Input onChange={changetareWeight} /></div>
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
                        <div className="c-input"><Input onChange={changeweight} /></div>
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
            <div className="edit-table">
                <EditCloth weight={weight} />
            </div>
            <div>
                <div className="clothing">
                    <span>布票信息</span>
                </div>
                <div className="clothing-data">
                    <div className="clothing-left">
                        <EditableProTable
                            columns={loomColumns}
                            rowKey="id"
                            value={orderLooms}
                            onChange={setorderLooms}
                            recordCreatorProps={{
                                newRecordType: 'dataSource',
                                record: () => ({
                                    id: Date.now(),
                                }),
                            }}
                            editable={{
                                type: 'multiple',
                                editableKeysloom,
                                actionRender: (row, config, defaultDoms) => {
                                    return [defaultDoms.delete];
                                },
                                onValuesChange: (record, recordList) => {
                                    console.log("编辑行数据==", recordList)
                                    setorderLooms(recordList)
                                },
                                onChange: setEditableRowKeysloom,
                            }}
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
const mapStateToProps = (state) => {
    console.log("创建订单=", state)
    return {
        createOrderParam: state.createOrderParam
    }
}
export default connect(mapStateToProps, { createOrderParams })(CreateOrder)