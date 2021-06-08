import React, { useImperativeHandle, forwardRef, useState, useEffect, } from "react"
import { Col, Row, Input, Table, DatePicker, Select, message } from "antd";
import { newOrderType, requestUrl } from "../../../utils/config"
import { EditableProTable } from '@ant-design/pro-table';
import EditLoom  from "./editLoom"
import 'moment/locale/zh-cn';
import moment from "moment"
const { Option } = Select;
let EditOrder = (props, ref) => {
    console.log("订单数据===", props);
    document.title = "编辑订单";
    const defaultData = props.orderData.orderYarnInfos;
    const defaultLoomData = props.loomData;
    const [customer, setcustomer] = useState([{ id: 1, name: "111" }]);
    const [clothType, setclothType] = useState([]);
    const [materials, setmaterials] = useState(defaultData); //用料要求
    const [editableKeys, setEditableRowKeys] = useState(() =>
        defaultData.map((item) => item.id));
    const [editableKeysloom, setEditableRowKeysloom] = useState(() =>
    defaultData.map((item) => item.id));
    const [bizDate, setbizDate] = useState(props.orderData.bizDate)
    const [customerId, setcustomerId] = useState(props.orderData.customerId);
    const [fabricType, setfabricType] = useState(props.orderData.fabricType);
    const [code, setcode] = useState(props.orderData.code);
    const [greyFabricCode, setgreyFabricCode] = useState(props.orderData.greyFabricCode);
    const [techType1, settechType1] = useState(props.orderData.techType.split("-")[0])
    const [techType2, settechType2] = useState(props.orderData.techType.split("-")[1]);
    const [inches, setinches] = useState(props.orderData.inches);
    const [needles, setneedles] = useState(props.orderData.needles);
    const [totalInches, settotalInches] = useState(props.orderData.totalInches);
    const [type, settype] = useState(props.orderData.type);
    const [deliveryDate, setdeliveryDate] = useState(props.orderData.deliveryDate);
    const [productPrice, setproductPrice] = useState(props.orderData.productPrice);
    const [weight, setweight] = useState(props.orderData.weight);
    const [yarnLength, setyarnLength] = useState(props.orderData.yarnLength);
    const [customerColor, setcustomerColor] = useState(props.orderData.customerColor);
    const [remark, setremark] = useState(props.orderData.remark);
    const [loom, setloom] = useState();
    const [orderLooms, setorderLooms] = useState(defaultLoomData)
    useEffect(() => {
        getcustomer();
        getClothType();
        getLoom();
    }, [])
    useImperativeHandle(ref, () => ({
        edit: () => {
            console.log("add 用料信息==");
            if (!customerId) { message.error("请选择客户！"); return; }
            if (!fabricType) { message.error("请选择布类！"); return; }
            if (!inches || !needles) { message.error("请先设置针寸！"); return; }
            if (!type) { message.error("请设置类型！"); return; }
            if (!code) { message.error("请输入客户单号！"); return; }
            if (!materials) { message.error("必须添加用料信息"); return; }
            if (!orderLooms) { message.error("必须添加机台信息"); return; }
            orderLooms.map((item) => {
                item.volQty = 0
            })
            const param = {
                "bizDate": bizDate,
                "customerBillCode": code,
                "customerColor": customerColor,
                "customerId": customerId,
                "deliveryDate": deliveryDate,
                "fabricType": fabricType,
                "greyFabricCode": greyFabricCode,
                "id": props.orderData.id,
                "inches": inches,
                "needles": needles,
                "orderLooms": orderLooms,
                "orderYarnInfos": materials,
                "productPrice": productPrice,
                "remark": remark,
                "techType": techType1 ? techType1 : "" + "-" + techType2 ? techType2 : "",
                "totalInches": totalInches,
                "type": type,
                "weight": weight,
                "yarnLength": yarnLength
            }
            console.log("订单参数==", param);
            fetch(requestUrl + "/api-production/order/saveOrModify", {
                method: "POST",
                headers: {
                    "Authorization": "bearer " + localStorage.getItem("access_token"),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(param)
            })
                .then(res => { return res.json() })
                .then(res => {
                    console.log(res)
                    if (res.code === 200) {
                        props.editOrder({
                            msg: "订单编辑成功！",
                            state: "detail"
                        })
                    }
                })
        }
    }));
    // 选择日期
    const selectDate = (date, dateString) => {
        console.log(dateString);
        setbizDate(dateString)
    }
    const selectDeliveryDate = (date, dateString) => {
        console.log("交货日期==", dateString)
        setdeliveryDate(dateString)
    }
    // 选择客户
    const selectCustomer = (value) => {
        console.log(value);
        setcustomerId(value);
    }
    const selectClothType = (value) => {
        console.log(value);
        setfabricType(value)
    }
    const onchangeCode = ({ target: { value } }) => {
        console.log(value);
        setcode(value)
    }
    const changeGreyFabricCode = ({ target: { value } }) => {
        setgreyFabricCode(value)
    }
    const changeTechType1 = ({ target: { value } }) => {
        settechType1(value)
    }
    const changeTechType2 = ({ target: { value } }) => {
        settechType2(value)
    }
    const changeInches = ({ target: { value } }) => {
        setinches(value)
    }
    const changeneedles = ({ target: { value } }) => {
        setneedles(value)
    }
    const changeTotalInches = ({ target: { value } }) => {
        settotalInches(value)
    }
    const changeType = (value) => {
        settype(value)
    }
    const changeProductPrice = ({ target: { value } }) => {
        setproductPrice(value)
    }
    const changeweight = ({ target: { value } }) => {
        setweight(value)
    }
    const changeYarnLength = ({ target: { value } }) => {
        setyarnLength(value)
    }
    const changeCustomerColor = ({ target: { value } }) => {
        setcustomerColor(value)
    }
    const changeRemark = ({ target: { value } }) => {
        setremark(value)
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
                res.data.map((item) => {
                    item.text = item.code
                })
               
                setloom(res.data)
            })
    }
    const columns = [
        {
            title: '纱别',
            dataIndex: 'yarnName',
        },
        {
            title: '纱牌/纱批',
            dataIndex: 'yarnBrandBatch',
        },
        {
            title: '纱比%',
            dataIndex: 'rate',
        },
        {
            title: '织损%',
            dataIndex: 'knitWastage',
        },
        {
            title: '计划用量',
            dataIndex: 'planWeight',
        },
        {
            title: '操作',
            valueType: 'option',
            width: 250,
            render: () => (<span>删除</span>),
        },]
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
            dataIndex: "volQty"
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

                </Row>
                <Row className="c-row">
                    <Col span={16} className="c-col">
                        <div className="c-label">客户颜色</div>
                        <div className="c-input"><Input onChange={changeCustomerColor} defaultValue={props.orderData.customerColor} /></div>
                    </Col>
                    <Col span={8} className="c-col">
                        <div className="c-label c-right">备注</div>
                        <div className="c-input"><Input onChange={changeRemark} defaultValue={props.orderData.remark} /></div>
                    </Col>
                </Row>
            </div>
            <div className="edit-table">
                <EditableProTable
                    headerTitle="用料要求"
                    columns={columns}
                    rowKey="id"
                    value={materials}
                    onChange={(value) => {
                        console.log("====", value)
                        // setmaterials(value);
                    }}
                    recordCreatorProps={{
                        newRecordType: 'dataSource',
                        
                    }}
                    editable={{
                        type: 'multiple',
                        editableKeys,
                        actionRender: (row, config, defaultDoms) => {
                            return [defaultDoms.delete];
                        },
                        onValuesChange: (record, recordList) => {
                            console.log("编辑行数据==", recordList)
                            setmaterials(recordList);
                        },
                        onChange: setEditableRowKeys,
                    }}
                />

            </div>
            <div>
                <div className="clothing">
                    <span>布票信息</span>
                </div>
                <div className="clothing-data">
                    <div className="clothing-left">
                        {/* <EditLoom loomData={orderLooms} loom={loom}/> */}
                        <EditableProTable
                            columns={loomColumns}
                            rowKey="id"
                            value={orderLooms}
                            onChange={(value) => {
                                console.log("====", value)
                            }}
                            recordCreatorProps={{
                                newRecordType: 'dataSource',
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

EditOrder = forwardRef(EditOrder)
export default EditOrder