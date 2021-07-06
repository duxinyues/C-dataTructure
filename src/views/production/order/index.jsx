import React, { useState, useEffect } from "react";
import { Table, Form, Row, Select, Button, Input, Dropdown, Menu, Spin, Modal, message, Col, DatePicker } from "antd";
import { DownOutlined } from '@ant-design/icons';
import JsBarcode from 'jsbarcode';
import { connect } from "react-redux";
import { orderType, orderSearch, requestUrl, newOrderType, onlyFormat, getNowFormatDate } from "../../../utils/config";
import { createOrder, clearOrderParams, createOrderParams } from "../../../actons/action";
import { createOrders, getLoom, getOrderCustomerDownList, getOrderData, orderStatus, getBarCodes } from "../../../api/apiModule"
import OrderDetail from "./orderDetail";
import CreateOrder from "./createOrder";
import EditOrder from "./edit";
import { getLodop } from '../../../print/LodopFuncs';
import "./style.css"
const { Option } = Select;
document.title = "订单管理";
function Order(props) {
    const [spining, setspining] = useState(true)
    const [columns, setcolumns] = useState();
    const [headType, setheadType] = useState("detail"); //默认展示详情
    const [orderList, setorderList] = useState([]);
    const [searchType, setsearchType] = useState("code");
    const [customer, setcustomer] = useState();
    const [orderDetail, setorderDetail] = useState();
    const [total, settotal] = useState();
    const [current, setcurrent] = useState();
    const [size, setsize] = useState();
    const [billStatus, setbillStatus] = useState(1);
    const [visible, setvisible] = useState(false);
    const [orderLoom, setorderLoom] = useState([]);
    const [clothBatch, setClothBatch] = useState([])
    const [barcode, setbarcode] = useState();
    const [selectClothLoom, setselectClothLoom] = useState();
    const [selectClothYarnBatch, setselectClothYarnBatch] = useState();
    const [seqArr, setseqArr] = useState([]);
    const [selectSeq, setselectSeq] = useState();
    const [companyName, setcompanyName] = useState();
    const [orderParams, setorderParams] = useState({});
    const [inoutValue, setInputValue] = useState("");
    const [form] = Form.useForm();
    useEffect(() => {
        setcolumns([
            {
                title: "生产单号",
                dataIndex: 'code',
            },
            {
                title: "客户",
                dataIndex: "customerName"
            },
            {
                title: "布类",
                dataIndex: "fabricType"
            },
            {
                title: "订单数量",
                dataIndex: "weight"
            },
            {
                title: "状态",
                dataIndex: "billStatus",
                render: (param) => (<span>{param === 1 && "进行中"}{param === 2 && "已完工"}{param === 3 && "作废"}</span>)
            }
        ]);
        getOrderList({
            "page": 1,
            "size": 10,
            "billStatus": ""
        });
        getLoom((res) => {
            if (res.code === 200) {
                setorderLoom([...res.data])
            }
        });
        getOrderCustomerDownList((res) => {
            if (res.code === 200) {
                setcustomer(res.data)
            }
        })
    }, []);
    const add = () => { setheadType("add") }
    const edit = () => {
        setheadType("edit")
    }
    //保存
    const onSave = () => {
        const params = orderParams;
        delete params.orderParams;
        var rate = 0
        params.bizDate = params.bizDate ? params.bizDate : getNowFormatDate();
        console.log("订单信息===", params)
        if (params.techType1 && params.techType2) {
            params.techType = params.techType1 + "-" + params.techType2
        } else {
            if (headType === "edit") {
                params.techType = orderDetail.techType;
            } else {
                params.techType = ""
            }
        }

        if (!params.customerId) {
            if (headType === "edit") {
                setheadType("detail");
                return;
            }
            message.error("请选择客户！");
            return;
        }
        if (!params.fabricType) {
            message.error("请选择布类！");
            return;
        }
        if (!params.inches || !params.needles) {
            message.error("请先设置针寸！");
            return;
        }
        if (!params.type) {
            message.error("请设置类型！");
            return;
        }
        if (!params.orderYarnInfos || params.orderYarnInfos.length === 0) {
            message.error("必须添加用料信息");
            return;
        }

        if (headType === "add") {
            params.orderYarnInfos.map((item) => {
                delete item.id;
            })
        }
        const yarnInfo = params.orderYarnInfos.some((item) => (item.yarnName === ""));
        if (yarnInfo) {
            message.error("请完善用料信息");
            return;
        }

        // 
        params.orderYarnInfos.map((item) => {
            rate += Number(item.rate)
        })
        if (rate < 100 || rate > 100) {
            message.warning("纱比总和需要等于100！");
            return;
        }
        createOrders(params, (res) => {
            console.log(res)
            if (res.code === 200) {
                message.success("保存成功！")
                getOrderList({
                    "page": 1,
                    "size": 10,
                    "billStatus": ""
                })
            } else {
                message.error("保存失败！")
            }
            setorderParams({});
            setheadType("detail");
        })
    }
    //取消创建订单组件
    const cancel = () => {
        getOrderDetail(orderDetail.id)
        setheadType("detail");
        setorderParams({});
    }
    // 取消打印
    const onCancel = () => {
        form.resetFields()
        setvisible(false);
        setselectClothLoom();
        setselectClothYarnBatch();
    }
    // 打印
    const openClothTicket = (value) => {
        const param = {
            "count": value.count,
            "loomId": value.loomId,
            "orderId": orderDetail.id,
            "seq": selectSeq,
            "yarnBrandBatch": selectClothYarnBatch
        }
        fetch(requestUrl + "/api-production/orderBarcode/printBarcode", {
            method: "POST",
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(param)
        })
            .then(res => { return res.json() })
            .then(res => {

                if (res.code === 200) {
                    res.data.map((item) => {
                        getOrderDetail(orderDetail.id)
                        createBarCode(item.barcode, item.seq, value.loomId);
                    })
                }
            })
        form.resetFields()
        setvisible(false);
    }
    const handleBarcode = (r) => {
        setbarcode(r)
    }
    const createBarCode = (value, seq, loomId) => {
        JsBarcode(barcode, value, {
            format: 'CODE128',
            renderer: 'svg',
            width: 2,
            height: 50,
            displayValue: true,
            textAlign: 'center',
            textPosition: 'bottom',
            textMargin: 6,
            fontSize: 14,
            background: '#ffffff',
            lineColor: '#000000',
            margin: 0,
            marginBottom: 0,
        })
        const str = barcode.innerHTML;
        const loomCode = orderLoom.filter((item) => {
            console.log(item);
            console.log(loomId);
            return item.id === loomId
        })[0].code
        let LODOP = getLodop();
        LODOP.PRINT_INIT(""); //打印初始化
        LODOP.SET_LICENSES("", "136D37EB1E2DCC52B2B90A1538277BEA", "", "");
        const strHtml = `<div style="width:50mm;background: #fff;">
        <div class="cloth-circle" style="width: 90px;height: 90px;border: 1px dashed #999;border-radius: 50%; margin: 20px auto;"></div>
        <div style="margin: 0 auto;border:1px solid #999">
         <div style="display:flex;border-bottom: 1px solid #999;width: 100%;height:28px;align-items:center;">
          <p style="width:38px;height:28px;line-height: 28px;text-align: center;font-size: 14px;">客户</p> 
          <p style="height:28px;line-height: 28px;font-size: 14px;padding-left:5px;border-left:1px solid #999;">${orderDetail.customerName}</p>
         </div> 

         <div style="display:flex;border-bottom: 1px solid #999;width: 100%;height:28px;align-items:center;">
          <p style="width:38px;height:28px;line-height: 28px;text-align: center;font-size: 14px;">织厂</p> 
          <p style="height:28px;line-height: 28px;font-size: 14px;padding-left:5px;border-left:1px solid #999;">${companyName}</p>
         </div>

         <div style="display:flex;border-bottom: 1px solid #999;width: 100%;height:28px;align-items:center;">
          <p style="width:38px;height:28px;line-height: 28px;text-align: center;font-size: 14px;">编码</p> 
          <p style="height:28px;line-height: 28px;font-size: 14px;padding-left:5px;border-left:1px solid #999;">${orderDetail.greyFabricCode}</p>
         </div>

        <div style="display:flex;border-bottom: 1px solid #999;width: 100%;height:28px;align-items:center;">
            <p style="width:38px;min-height:28px;line-height: 28px;text-align: center;font-size: 14px;">布类</p> 
            <p style="min-height:28px;line-height: 28px;font-size: 14px;padding-left:5px;border-left:1px solid #999;">${orderDetail.fabricType}</p>
        </div>
        <div style="display:flex;border-bottom: 1px solid #999;width: 100%;height:28px;align-items:center;">
            <p style="width:38px;min-height:28px;line-height: 28px;text-align: center;font-size: 14px;">用料</p> 
            <p style="min-height:28px;line-height: 28px;font-size: 14px;padding-left:5px;border-left:1px solid #999;">${selectClothYarnBatch}</p>
        </div>
        <div style="display:flex;border-bottom: 1px solid #999;width: 100%;height:28px;align-items:center;">
            <p style="border-right:1px solid #999;width:38px;height:28px;line-height: 28px;text-align: center;font-size: 14px;">颜色</p> 
            <p style="height:28px;line-height: 28px;font-size: 14px;padding-left:5px;">${orderDetail.customerColor}</p>
        </div>

         <div style="display:flex;border-bottom: 1px solid #999;width: 100%;height:28px;align-items:center;">
          <p style="border-right:1px solid #999;width:38px;height:28px;line-height: 28px;text-align: center;font-size: 14px;">针寸</p> 
          <p style="width:138px;display:flex;align-items:center;line-height: 28px;font-size: 14px;"><span style="width:50%;text-align: center;">${orderDetail.needles}+${orderDetail.inches}</span><span style="width:50%;border-left:1px solid #999;text-align: center;">${newOrderType[orderDetail.type - 1].name}</span></p>
         </div> 
         <div style="display:flex;border-bottom:1px solid #999;width:100%;height:28px;align-items:center;">
          <p style="border-right:1px solid #999;width:38px;height:28px;line-height: 28px;text-align: center;font-size: 14px;">机号</p> 
          <p  style="display:flex;align-items:center;line-height: 28px;font-size: 14px;" ><span style="width:69px;text-align:center;">${loomCode}</span> <span style="width:40px;border-left:1px solid #999;text-align:center;">匹号</span> <span style="width:32px;text-align:center;border-left:1px solid #999;padding-left:2px">${seq}</span></p>
         </div> 
         <div style="display:flex;width:100%;height:56px;align-items:center;">
          <div style="border-right:1px solid #999;width:108px;">
            <div style="line-height:28px;height:28px;font-size: 14px;display:flex;align-items:center;border-bottom:1px solid #999;">
                <div style="width:38px;height:28px;text-align:center;border-right:1px solid #999;">日期</div> 
                <div style="width:60px;text-align:center;font-size:10px;">${onlyFormat(orderDetail.bizDate, false)}</div>
            </div> 
            <div style="line-height:28px;height:28px;font-size: 14px;display:flex;align-items:center;">
                <div style="width:38px;height:28px;text-align:center;border-right:1px solid #999;">值机</div> 
                <div style="padding-left:5px;"></div>
            </div> 
          </div>
          <div style="display:flex;align-items:center;"><div style="border-right:1px solid #999;width:40px;height:56px;display: flex;justify-content: center;align-items: center;">净重</div> <div style="padding-left:5px;">  </div></div>
         </div> 
         <div class="content-item content-center" style="display:none" >
          <p class="left-side" >备注</p> 
          <p contenteditable="true" class="draw-mark right-side txt-6" >${orderDetail.remark}</p>
         </div>
        </div> 
        <div style="height:120px;text-align:center;">
         <p style="text-align:center;font-size:14px;padding:0;">合同号：${orderDetail.customerBillCode}</p> 
         <p >
         <svg style="margin:0 auto;display:block;text-anchor: middle;width:160px"  height="20px" x="0px" y="0px" viewBox="0 0 0 70" preserveAspectRatio="xMinYMin meet" xmlns="http://www.w3.org/2000/svg" version="1.1" >${str}</svg>
          </p>
        </div> 
       </div>`
        LODOP.SET_PRINT_MODE("PRINT_PAGE_PERCENT", "Full-Page");
        LODOP.ADD_PRINT_HTML(0, 0, "100%", "100%", strHtml);

        // LODOP.PREVIEW(); // 打印预览
        LODOP.PRINT(); // 直接打印
    }
    const openPrint = () => {
        setvisible(true)
    }
    //  获取创建订单组件的状态
    const getCreateOrderState = (value) => {
        console.log("子组件", value)
        setorderParams(value);
    }

    const getValue = ({ target: { value } }) => {
        setInputValue(value)
    }
    // 搜索
    const onFinish = (value) => {
        // setspining(true)
        const param = value;
        if (value.billStatus === "进行中") {
            param.billStatus = 1
        } else {
            param.billStatus = value.billStatus
        }
        delete param.searchType;
        if (searchType === "code") param.code = inoutValue;
        if (searchType === "customerBillCode") { param.customerBillCode = inoutValue }
        if (searchType === "beginTime") { param.beginTime = inoutValue }
        if (searchType === "greyFabricCode") { param.greyFabricCode = inoutValue }
        if (searchType === "customerName") { param.customerName = inoutValue }
        if (searchType === "fabricType") { param.fabricType = inoutValue }
        if (searchType === "needles") { param.needles = inoutValue }
        if (searchType === "inches") { param.inches = inoutValue }
        if (searchType === "totalInches") { param.totalInches = inoutValue }
        if (searchType === "techType") { param.techType = inoutValue }
        if (searchType === "remark") { param.remark = inoutValue }
        if (searchType === "yarnName") { param.yarnName = inoutValue }
        if (searchType === "yarnBrandBatch") { param.yarnBrandBatch = inoutValue }
        if (searchType === "loomId") { param.loomId = inoutValue }
        if (searchType === "barcode") { param.barcode = inoutValue }
        if (searchType === "type") { param.type = inoutValue }

        param.page = 1;
        param.size = 10;

        console.log(searchType)
        console.log("parama===", param)
        getOrderList(param)
    }
    // 选择机台
    const selectLoom = (value) => {
        setInputValue(value)
    }
    // 选择日期
    const selectDate = (date, dateString) => {
        setInputValue(dateString)
    }
    /**
     * 订单列表
     * @param {*} param 
     */
    const getOrderList = (param) => {
        getOrderData(param, (res) => {
            if (res.code === 200) {
                setspining(false);
                if (res.data.records.length === 0) return;
                settotal(res.data.total);
                setsize(res.data.size);
                setcurrent(res.data.current);
                setorderList([...res.data.records]);
                getOrderDetail(res.data.records[0].id);
            }
        })
    }
    // 订单详情
    const getOrderDetail = (id) => {
        getClothBatch(id)
        fetch(requestUrl + "/api-production/order/findById?id=" + id, {
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token")
            },
        })
            .then(res => { return res.json() })
            .then(res => {
                console.log(res)
                if (res.code === 200) {
                    setbillStatus(res.data.billStatus)
                    setorderDetail(res.data);
                    setspining(false);
                    setheadType("detail");
                }
            })
    }
    // 布票批次
    const getClothBatch = (orderId) => {
        fetch(requestUrl + "/api-production/orderBarcode/yarnDownList?orderId=" + orderId, {
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token")
            },
        })
            .then(res => { return res.json() })
            .then(res => {
                if (res.code === 200) {
                    setClothBatch(res.data)
                }
            })
    }
    // 搜索类型
    const selectSearchTyle = (value) => {
        setsearchType(value)
    }
    // 完工
    const completeOrder = () => {
        const _billStatus = "";
        if (OrderDetail.billStatus === 1) {
            _billStatus = 2
        }
        if (OrderDetail.billStatus === 2) {
            _billStatus = 1
        }
        orderStatus(orderDetail.id, _billStatus, (res) => {
            if (res.code === 200) {
                getOrderList({
                    "page": 1,
                    "size": 10,
                });
            }
        })
    }
    //  订单作废
    const orderInvalid = () => {
        if (orderList.length === 0) return;
        if (orderDetail.billStatus !== 1) return;
        orderStatus(orderDetail.id, 3, (res) => {
            if (res.code === 200) {
                getOrderList({
                    "page": 1,
                    "size": 10,
                    "billStatus": ""
                })
            }
        })
    }
    const changeClothLoom = (value) => {
        console.log(value)
        setselectClothLoom(value)
    }
    const changeClothYarnBatch = (value) => {
        setselectClothYarnBatch(value.replace(/\+/g, ","))
        const params = value.replace(/\+/g, ",")
        getseq(params)
    }
    const getseq = (clothYarnBatch) => {
        if (!selectClothLoom || !clothYarnBatch) {
            message.error("请先设置机台或者批次")
            return;
        }
        const arr = [];
        fetch(requestUrl + `/api-production/orderBarcode/findToPrintBarcode?id=${orderDetail.id}&yarnBatch=${clothYarnBatch}&loomId=${selectClothLoom}`, {
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token")
            }
        })
            .then(res => { return res.json() })
            .then(res => {
                console.log(res)
                if (res.code === 200) {
                    setcompanyName(res.data.companyName);
                    for (let index = 1; index <= res.data.seq; index++) {
                        arr.push(index)
                    }
                    console.log(arr)
                    setseqArr(arr.reverse())
                }
            })

    }
    // 起始号
    const changeSeq = (value) => {
        setselectSeq(value)
    }
    const menu = (
        <Menu>
            {/* <Menu.Item key="0">
                复制
            </Menu.Item> */}
            <Menu.Item onClick={orderInvalid}>
                作废
            </Menu.Item>
            {/* <Menu.Item key="2">
                导出
            </Menu.Item>
            <Menu.Item key="3">
                删除
            </Menu.Item>
            <Menu.Item key="4">
                设计布票
            </Menu.Item> */}
        </Menu>
    );

    const layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
    };
    const tailLayout = {
        wrapperCol: { offset: 16, span: 8 },
    };
    return <React.Fragment>
        <Spin spinning={spining}>
            <div className="right-container">
                {headType === "detail" && <div className="custom">
                    <div className="title">
                        单据详情
                    </div>
                    <div className="custom-right">
                        <Button type="primary" onClick={add}>+新建</Button>
                        <Button onClick={edit} disabled={orderList.length === 0 || billStatus === 2 || billStatus === 3}>编辑</Button>
                        <Button onClick={completeOrder} disabled={orderList.length === 0 || billStatus === 3}>{(billStatus === 1 || billStatus === 3) && "完工"}{billStatus === 2 && "反完工"}</Button>
                        {/* <Button disabled={orderList.length == 0}>打印订单</Button> */}
                        <Button onClick={openPrint} disabled={orderList.length === 0}>打印布票</Button>
                        <Dropdown overlay={menu} trigger={['click']}>
                            <div className="drop">
                                更多 &nbsp; <DownOutlined />
                            </div>
                        </Dropdown>
                    </div>
                </div>}
                {(headType === "add" || headType === "edit") && <div className="custom">
                    <div className="title">
                        订单管理
                    </div>
                    <div className="custom-right">
                        <Button key="1" type="primary" onClick={onSave}>保存</Button>
                        <Button key="2" onClick={cancel}>取消</Button>
                    </div>
                </div>}
                <div className="inventory-container">
                    <div className="left">
                        <Form
                            className='header-form'
                            onFinish={onFinish}
                            initialValues={{
                                billStatus: orderType[0].title,
                                searchType: orderSearch[0].title
                            }}
                        >
                            <Row span={24}>
                                <Col span={6}>
                                    <Form.Item name="billStatus" className="billStatus" style={{ marginRight: "10px" }}>
                                        <Select>
                                            {
                                                orderType.map((item) => (<Option value={item.id}>{item.title}</Option>))
                                            }

                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={14}>
                                    <Form.Item name={searchType} className="searchType">
                                        <Input.Group compact>
                                            <Select defaultValue={orderSearch[0].title} style={{ width: "100px" }} className="cu" onChange={selectSearchTyle} >
                                                {
                                                    orderSearch.map((item, key) => (<Option value={item.type} key={key}>{item.title}</Option>))
                                                }
                                            </Select>
                                            {
                                                searchType === "loomId" && <Select style={{ width: "120px", borderRight: "1px solid #ccc" }} onChange={selectLoom}>
                                                    {
                                                        orderLoom.map((item) => (<Option value={item.id}>{item.code}</Option>))
                                                    }
                                                </Select>
                                            }
                                            {
                                                searchType === "beginTime" && <DatePicker onChange={selectDate} style={{}} />
                                            }
                                            {
                                                (searchType !== "loomId" && searchType !== "beginTime") && <Input style={{ width: "120px" }} onChange={getValue} />
                                            }
                                        </Input.Group>
                                    </Form.Item>
                                </Col>
                                <Col span={4}>
                                    <Form.Item>
                                        <Button style={{ height: "26px", display: "flex", alignItems: "center" }} type="primary" htmlType="submit">搜索</Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                        <Table
                            columns={columns}
                            dataSource={orderList}
                            onRow={record => {
                                return {
                                    onClick: () => { getOrderDetail(record.id) },
                                };
                            }}
                            pagination={{
                                total: total,
                                pageSize: size,
                                current: current,
                                onChange: (page, pageSize) => {
                                    getOrderList({
                                        "page": page,
                                        "size": pageSize,
                                        "billStatus": 1
                                    })
                                },
                                showSizeChanger: false,
                                showTotal: () => (`共${total}条`)
                            }}
                            onHeaderRow={(columns, index) => {
                                return {
                                    onClick: () => {
                                        console.log(columns, "===", index)
                                    }, // 点击表头行
                                    onContextMenu: event => {
                                        event.preventDefault();
                                        console.log("右键==", columns)
                                    },
                                };
                            }}
                        />
                    </div>
                    <div className="right">
                        {(headType === "detail") && <OrderDetail orderData={orderDetail} />}
                        {headType === "edit" && <EditOrder editOrder={getCreateOrderState} orderData={orderDetail} />}
                        {headType === "add" && <CreateOrder createOrder={getCreateOrderState} />}
                    </div>
                </div>
            </div>
        </Spin>
        <Modal
            visible={visible}
            title="打印布票"
            okText="打印"
            cancelText="取消"
            footer={false}
            className="openCloth"
            onCancel={onCancel}
        >
            <Form
                {...layout}
                onFinish={openClothTicket}
                initialValues={{
                    template: "默认模板"
                }}
                form={form}
            >
                <Form.Item label="模板" name="template">
                    <Select>
                        <Option value="默认模板">默认模板</Option>
                    </Select>
                </Form.Item>
                <Form.Item label="机号" name="loomId" rules={[{ required: true, message: '请选择机台' }]}>
                    <Select onChange={changeClothLoom}>
                        {
                            orderLoom.map((item, key) => (<Option value={item.id} key={key}>{item.code}</Option>))
                        }
                    </Select>
                </Form.Item>
                <Form.Item label="批次" name="yarnBrandBatch" rules={[{ required: true, message: '请选择批次' }]}>
                    <Select onChange={changeClothYarnBatch}>
                        {
                            clothBatch.map((item, key) => (<Option key={key} value={item.value}>{item.value}</Option>))
                        }
                    </Select>
                </Form.Item>
                <Form.Item label="起始号" name="seq" rules={[{ required: true, message: '请设置起始号' }]}>
                    <Select onChange={changeSeq}>
                        {
                            seqArr.map((item, key) => {
                                return <Option value={key + 1} key={key}>{key + 1}</Option>
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item label="数量" name="count" rules={[{ required: true, message: '请输入打印数量' }]}>
                    <Input />
                </Form.Item>
                <Form.Item  {...tailLayout}>
                    <Button htmlType="submit" type="primary">打印</Button>
                    <Button onClick={onCancel}>取消</Button>
                </Form.Item>
            </Form>

        </Modal>
        <div className="clothSvg"><svg ref={handleBarcode} /></div>
    </React.Fragment >
}
const mapStateToProps = (state) => {
    return {
        orderParams: state.createOrderParam,
        createOrderState: state.createOrderState
    }
}
export default connect(mapStateToProps, { createOrder, clearOrderParams, createOrderParams })(Order);