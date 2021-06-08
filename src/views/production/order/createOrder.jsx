import React, { useImperativeHandle, forwardRef, useState, useEffect, } from "react"
import { Col, Row, Input, Table, DatePicker, Select, message } from "antd";
import { newOrderType, requestUrl, getNowFormatDate } from "../../../utils/config"
import { EditableProTable } from '@ant-design/pro-table';
import 'moment/locale/zh-cn';
import moment from "moment"
const { Option } = Select;
const defaultDataLoom =
    new Array(1).fill(1).map((_, index) => {
        return {
            id: (Date.now() + index).toString(),
            loomId: "",
            volQty: ""
        }
    });

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
    document.title = "新建订单";
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
    const [weight, setweight] = useState();
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
    useImperativeHandle(ref, () => ({
        create: () => {
            if (!customerId) { message.error("请选择客户！"); return; }
            if (!fabricType) { message.error("请选择布类！"); return; }
            if (!inches || !needles) { message.error("请先设置针寸！"); return; }
            if (!type) { message.error("请设置类型！"); return; }
            if (!code) { message.error("请输入客户单号！"); return; }
            if (!materials) { message.error("必须添加用料信息"); return; }
            if (!orderLooms) { message.error("必须添加机台信息"); return; }
            if (!weight) { message.error("请输入订单"); return; }
            materials.map((item) => {
                delete item.id
            })
            orderLooms.map((item) => {
                delete item.id
            })
            const param = {
                "bizDate": bizDate,
                "customerBillCode": code,
                "customerColor": customerColor,
                "customerId": customerId,
                "deliveryDate": deliveryDate,
                "fabricType": fabricType,
                "greyFabricCode": greyFabricCode,

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
                        props.createOrder({
                            msg: "订单添加成功！",
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
            render: () => {
                return null;
            },
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
                        <div className="c-label">客户单号</div>
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

                </Row>
                <Row className="c-row">
                    <Col span={8} className="c-col">
                        <div className="c-label">坯布交期</div>
                        <div className="c-input"><DatePicker onChange={selectDeliveryDate} /></div>
                    </Col>
                    <Col span={8} className="c-col">
                        <div className="c-label c-right">加工单价</div>
                        <div className="c-input"><Input onChange={changeProductPrice} /></div>
                    </Col>
                    <Col span={8} className="c-col">
                        <div className="c-label c-right">订单数量</div>
                        <div className="c-input"><Input onChange={changeweight} /></div>
                    </Col>
                </Row>
                <Row className="c-row">
                    <Col span={16} className="c-col">
                        <div className="c-label">纱长</div>
                        <div className="c-input"><Input onChange={changeYarnLength} /></div>
                    </Col>

                </Row>
                <Row className="c-row">
                    <Col span={16} className="c-col">
                        <div className="c-label">客户颜色</div>
                        <div className="c-input"><Input onChange={changeCustomerColor} /></div>
                    </Col>
                    <Col span={8} className="c-col">
                        <div className="c-label c-right">备注</div>
                        <div className="c-input"><Input onChange={changeRemark} /></div>
                    </Col>
                </Row>
            </div>
            <div className="edit-table">
                <EditableProTable
                    headerTitle="用料要求"
                    columns={columns}
                    rowKey="id"
                    value={materials}
                    onChange={setmaterials}
                    recordCreatorProps={{
                        newRecordType: 'dataSource',
                        record: () => ({
                            id: Date.now(),
                        }),
                    }}
                    editable={{
                        type: 'multiple',
                        editableKeys,
                        actionRender: (row, config, defaultDoms) => {
                            return [defaultDoms.delete];
                        },
                        onValuesChange: (record, recordList) => {
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

CreateOrder = forwardRef(CreateOrder)
export default CreateOrder