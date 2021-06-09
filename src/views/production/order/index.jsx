import React, { useState, useEffect, useRef } from "react";
import { PageHeader, Table, Form, Row, Select, Button, Input, Dropdown, Menu, Spin, Modal, message } from "antd";
import { DownOutlined } from '@ant-design/icons';
import JsBarcode from 'jsbarcode';
import Barcode from "./Barcode";
import { orderType, orderSearch, requestUrl,newOrderType } from "../../../utils/config"
import OrderDetail from "./orderDetail";
import CreateOrder from "./createOrder";
import EditOrder from "./edit";
import { getLodop } from '../../../print/LodopFuncs';
import "./style.css"
const { Option } = Select;

document.title = "订单管理";
function Order() {

    const [spining, setspining] = useState(true)
    const [columns, setcolumns] = useState();
    const [headType, setheadType] = useState(); //默认展示详情
    const [orderList, setorderList] = useState();
    const [searchValue, setsearchValue] = useState("code");
    const [searchType, setsearchType] = useState();
    const [customer, setcustomer] = useState();
    const [orderDetail, setorderDetail] = useState();
    const [total, settotal] = useState();
    const [current, setcurrent] = useState();
    const [size, setsize] = useState();
    const [loomData, setloomData] = useState();
    const [billStatus, setbillStatus] = useState(3);
    const [btnTex, setbtnTex] = useState("完工");
    const [visible, setvisible] = useState(false);
    const [orderLoom, setorderLoom] = useState([]);
    const [clothBatch, setClothBatch] = useState([])
    const [barcode, setbarcode] = useState();
    const [selectClothLoom, setselectClothLoom] = useState();
    const [selectClothYarnBatch, setselectClothYarnBatch] = useState();
    const [seq, setseq] = useState(1);
    const [seqArr, setseqArr] = useState([]);
    const [selectSeq, setselectSeq] = useState();
    const [companyName, setcompanyName] = useState()
    const childRef = useRef();

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
            }
        ]);
        getCustomer()
        getOrderList({
            "page": 1,
            "size": 10,
            "billStatus": 1
        })

    }, []);


    const add = () => { setheadType("add") }
    const edit = () => {
        setheadType("edit")
    }
    //保存
    const onSave = () => {
        if (headType === "add") {
            childRef.current.create();
        }
        if (headType === "edit") {
            childRef.current.edit();
        }
    }
    const onCancel = () => {
        setvisible(false)
    }
    // 打印
    const openClothTicket = (value) => {
        console.log(value)
        const param = {
            "count": value.count,
            "loomId": value.loomId,
            "orderId": orderDetail.id,
            "seq": selectSeq,
            "yarnBrandBatch": selectClothYarnBatch
        }
        console.log(param)
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
                console.log(res);
                if(res.code===200){
                    res.data.map((item)=>{
                        createBarCode(item.barcode)
                    })
                }
            })
    }
    const handleBarcode = (r) => {
        setbarcode(r)
    }
    const createBarCode = (value) => {
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
        let LODOP = getLodop();
        LODOP.PRINT_INIT("react使用打印插件CLodop");  //打印初始化
        const strHtml = `<div style="width:65mm;background: #fff;border: 1px solid #999;">
        <div class="cloth-circle" style="width: 90px;height: 90px;border: 1px dashed #999;border-radius: 50%; margin: 20px auto;"></div>
        <div style="width: 239px; margin: 0 auto;border:1px solid #999">
         <div style="display:flex;border-bottom: 1px solid #999;width: 100%;height:28px;align-items:center;">
          <p style="width:38px;height:28px;line-height: 28px;text-align: center;font-size: 14px;">客户</p> 
          <p style="width:200px;height:28px;line-height: 28px;font-size: 14px;padding-left:5px;border-left:1px solid #999;">${orderDetail.customerName}</p>
         </div> 

         <div style="display:flex;border-bottom: 1px solid #999;width: 100%;height:28px;align-items:center;">
          <p style="width:38px;height:28px;line-height: 28px;text-align: center;font-size: 14px;">织厂</p> 
          <p style="width:200px;height:28px;line-height: 28px;font-size: 14px;padding-left:5px;border-left:1px solid #999;">${companyName}</p>
         </div>

         <div style="display:flex;border-bottom: 1px solid #999;width: 100%;height:28px;align-items:center;">
          <p style="width:38px;height:28px;line-height: 28px;text-align: center;font-size: 14px;">编码</p> 
          <p style="width:200px;height:28px;line-height: 28px;font-size: 14px;padding-left:5px;border-left:1px solid #999;">${orderDetail.greyFabricCode}</p>
         </div>

        <div style="display:flex;border-bottom: 1px solid #999;width: 100%;height:28px;align-items:center;">
            <p style="width:38px;min-height:28px;line-height: 28px;text-align: center;font-size: 14px;">布类</p> 
            <p style="width:200px;min-height:28px;line-height: 28px;font-size: 14px;padding-left:5px;border-left:1px solid #999;">${orderDetail.fabricType}</p>
        </div>
      
        <div style="display:flex;border-bottom: 1px solid #999;width: 100%;height:28px;align-items:center;">
            <p style="width:38px;line-height: 28px;text-align: center;font-size: 14px;">用料</p> 
            <p style="width:200px;line-height: 20px;font-size: 14px;padding-left:5px;word-break:break-all;border-left:1px solid #999;">${selectClothYarnBatch}</p>
        </div>
        
        <div style="display:flex;border-bottom: 1px solid #999;width: 100%;height:28px;align-items:center;">
            <p style="border-right:1px solid #999;width:38px;height:28px;line-height: 28px;text-align: center;font-size: 14px;">颜色</p> 
            <p style="width:200px;height:28px;line-height: 28px;font-size: 14px;padding-left:5px;">${orderDetail.customerColor}</p>
        </div>

         <div style="display:flex;border-bottom: 1px solid #999;width: 100%;height:28px;align-items:center;">
          <p style="border-right:1px solid #999;width:38px;height:28px;line-height: 28px;text-align: center;font-size: 14px;">针寸</p> 
          <p style="display:flex;align-items:center;width:200px;line-height: 28px;font-size: 14px;"><span style="width:50%;text-align: center;">${orderDetail.needles}+${orderDetail.inches}</span><span style="width:50%;border-left:1px solid #999;text-align: center;">${newOrderType[orderDetail.type]}</span></p>
         </div> 
         <div style="display:flex;border-bottom:1px solid #999;width:100%;height:28px;align-items:center;">
          <p style="border-right:1px solid #999;width:38px;height:28px;line-height: 28px;text-align: center;font-size: 14px;">机号</p> 
          <p  style="display:flex;align-items:center;width:200px;line-height: 28px;font-size: 14px;" ><span style="width:50%;text-align:center;">${selectClothLoom}</span> <span style="width:38px;border-left:1px solid #999;text-align:center;">疋号</span> <span style="width:calc(50% - 39px);text-align:center;border-left:1px solid #999">11</span></p>
         </div> 
         <div style="display:flex;width:100%;height:56px;align-items:center;">
          <div style="border-right:1px solid #999;width:139px;">
            <div style="line-height:28px;height:28px;font-size: 14px;display:flex;align-items:center;border-bottom:1px solid #999;"><div style="width:38px;height:28px;text-align:center;border-right:1px solid #999;">日期</div> <div style="padding-left:5px;">2021-06-09</div></div> 
            <div style="line-height:28px;height:28px;font-size: 14px;display:flex;align-items:center;"><div style="width:38px;height:28px;text-align:center;border-right:1px solid #999;">值机</div> <div style="padding-left:5px;">值机员</div></div> 
          </div>
          <div style="display:flex;align-items:center;"><div style="border-right:1px solid #999;width:38px;height:56px;text-align:center;line-height:56px;">净重</div> <div style="padding-left:5px;">999kg</div></div>
         </div> 
         <div class="content-item content-center" style="display:none" >
          <p class="left-side" >备注</p> 
          <p contenteditable="true" class="draw-mark right-side txt-6" ></p>
         </div>
        </div> 
        <div style="height:100px;">
         <p style="text-align:center;font-size:14px;">合同号：dfdj54353465</p> 
         <p >
         <svg  width="60mm" height="40px" x="0px" y="0px" viewBox="0 0 334 70" xmlns="http://www.w3.org/2000/svg" version="1.1" style="margin:0 auto;display:block;">${str}</svg>
          </p>
        </div> 
       </div>`
        LODOP.ADD_PRINT_HTML(10, 55, "100%", "100%", strHtml);
        LODOP.PREVIEW();
    }
    const openPrint = () => {
        setvisible(true)
    }
    //  获取创建订单组件的状态
    const getCreateOrderState = (value) => {
        console.log(value);
        if (value.state === "detail") {
            getOrderList({
                "page": current,
                "size": size,
                "billStatus": 1
            })
        }
        setheadType(value.state);
    }
    const cancel = () => {
        setheadType("detail");
    }
    const onFinish = (value) => {
        setspining(true)
        const param = value;
        if (value.billStatus === "进行中") {
            param.billStatus = 1
        } else {
            param.billStatus = value.billStatus
        }
        delete param.searchType;

        if (value.code === "undefined") param.code = "";
        param.page = 1;
        param.size = 10;
        console.log(param);
        getOrderList(param)
    }
    const getOrderList = (param) => {
        fetch(requestUrl + "/api-production/order/findAll", {
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
                    if (res.data.records.length === 0) return;
                    settotal(res.data.total);
                    setsize(res.data.size);
                    setcurrent(res.data.current);
                    setorderList(res.data.records);
                    getOrderDetail(res.data.records[0].id);
                }
            })
    }
    const getOrderDetail = (id) => {
        getLoom(id);
        getClothBatch(id)
        fetch(requestUrl + "/api-production/order/findById?id=" + id, {
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token")
            },
        })
            .then(res => { return res.json() })
            .then(res => {
                console.log("订单详情=", res)
                if (res.code === 200) {

                    setorderDetail(res.data);
                    setspining(false);
                    setheadType("detail");
                    const yarnBrandBatch = res.data.orderYarnInfos.map((item) => {
                        return item.yarnBrandBatch
                    });
                    console.log("yarnBrandBatch", yarnBrandBatch)
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
                console.log(res)
                if (res.code === 200) {
                    setClothBatch(res.data)
                }
            })
    }
    // 
    const getClothInfo = (orderId, loomId, yarnBatch) => {
        fetch(requestUrl + "/api-production/orderBarcode/findToPrintBarcode?id=" + orderId + "&loomId=" + loomId + "&yarnBatch" + yarnBatch, {
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token")
            }
        })
            .then(res => { return res.json() })
            .then(res => {
                console.log(res)
            })
    }
    const getCustomer = () => {
        fetch(requestUrl + "/api-production/order/getCustomerDownList", {
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token")
            },
        })
            .then(res => { return res.json() })
            .then(res => {
                console.log(res)
                if (res.code === 200) {

                    setcustomer(res.data)
                }
            })
    }
    const selectSearchTyle = (value) => {
        console.log(value);
        setsearchValue(value);
        if (value === "customerName") {
            setsearchType("customerName")

        }

        if (value === "type") {
            setsearchType("type")
        }

    }
    const completeOrder = () => {
        const _billStatus = billStatus
        fetch(requestUrl + "/api-production/order/updateBillStatus?id=" + orderDetail.id + "&billStatus=" + _billStatus, {
            method: "POST",
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token")
            }
        })
            .then(res => { return res.json() })
            .then(res => {
                console.log(res)
                if (res.code == 200) {
                    if (billStatus == 3) {
                        setbillStatus(1);
                        setbtnTex("反完工")
                    }
                    if (billStatus == 1) {
                        setbillStatus(3);
                        setbtnTex("完工")
                    }
                }
            })
    }
    const getLoom = (orderId) => {
        fetch(requestUrl + "/api-production/orderBarcode/loomDownList?orderId=" + orderId, {
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token")
            }
        })
            .then(res => { return res.json() })
            .then(res => {
                console.log(res);
                if (res.code === 200) {
                    setorderLoom(res.data)
                }
            })
    }
    const changeClothLoom = (value) => {
        console.log(value)
        setselectClothLoom(value)
    }
    const changeClothYarnBatch = (value) => {
        setselectClothYarnBatch(value)
    }
    const getseq = () => {
        console.log("selectClothLoom==", selectClothLoom)
        console.log("selectClothYarnBatch==", selectClothYarnBatch)
        if (!selectClothLoom || !selectClothYarnBatch) {
            message.error("请先设置机台或者批次")
            return;
        }
        fetch(requestUrl + `/api-production/orderBarcode/findToPrintBarcode?id=${orderDetail.id}&yarnBatch=${selectClothYarnBatch}&loomId=${selectClothLoom}`, {
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token")
            }
        })
            .then(res => { return res.json() })
            .then(res => {
                console.log(res)
                if (res.code === 200) {
                    setseq(res.data.seq)
                    setcompanyName(res.data.companyName);
//                     companyName: "1354354"
// customerName: "姓名5"
// fabricType: "dfvdf43"
// id: 1
// inches: 1
// needles: 2
// seq: 1
// type: 1
                }
            })
        const arr = [];
        for (let index = 1; index <= seq; index++) {
            arr.push(index)
        }
        setseqArr(arr)
    }
    const changeSeq = (value) => {
        console.log("起始号==", value)
        setselectSeq(value)
    }
    const menu = (
        <Menu>
            <Menu.Item key="0">
                复制
            </Menu.Item>
            <Menu.Item key="1">
                作废
            </Menu.Item>
            <Menu.Item key="2">
                导出
            </Menu.Item>
            <Menu.Item key="3">
                删除
            </Menu.Item>
            <Menu.Item key="4">
                设计布票
            </Menu.Item>
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
                {headType === "detail" && <PageHeader className="custom" title="订单管理" extra={[
                    <Button key="3" type="primary" onClick={add}>+新建</Button>,
                    <Button key="2" onClick={edit}>编辑</Button>,
                    <Button key="1" onClick={completeOrder}>{btnTex}</Button>,
                    <Button key="4">订单</Button>,
                    <Button key="5" onClick={openPrint}>布票</Button>,
                    <Dropdown overlay={menu} trigger={['click']}>
                        <div className="drop">
                            更多 &nbsp; <DownOutlined />
                        </div>
                    </Dropdown>,

                ]} />}
                {(headType === "add" || headType === "edit") && <PageHeader title="订单管理" extra={[
                    <Button key="1" type="primary" onClick={onSave}>保存</Button>,
                    <Button key="2" onClick={cancel}>取消</Button>,
                ]} />}
                <div className="inventory-container">

                    <div className="left">
                        <Form
                            className='header-form'
                            onFinish={onFinish}
                            initialValues={{
                                billStatus: orderType[0].title,
                            }}
                        >
                            <Row>
                                <Form.Item name="billStatus" style={{ marginRight: "10px" }}>
                                    <Select>
                                        <Option value="1">进行中</Option>
                                        <Option value="2">未审核</Option>
                                        <Option value="3">已完工</Option>
                                        <Option value="4">已作废</Option>
                                    </Select>
                                </Form.Item>
                                <div>
                                    <Form.Item name="searchType">
                                        <Select className="cu" onChange={selectSearchTyle} defaultValue={orderSearch[0].title}>
                                            {
                                                orderSearch.map((item, key) => (<Option value={item.type} key={key}>{item.title}</Option>))
                                            }
                                        </Select>
                                    </Form.Item>

                                </div>
                                <Form.Item name={searchValue}>
                                    <Input />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">搜索</Button>
                                </Form.Item>
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
                        />
                    </div>
                    <div className="right">
                        {headType === "detail" && <OrderDetail orderData={orderDetail} loomData={loomData} />}
                        {headType === "edit" && <EditOrder ref={childRef} editOrder={getCreateOrderState} orderData={orderDetail} loomData={loomData} />}
                        {headType === "add" && <CreateOrder createOrder={getCreateOrderState} ref={childRef} />}
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
            >
                <Form.Item label="模板" name="template">
                    <Select defaultValue="默认模板">
                        <Option value="默认模板">默认模板</Option>
                    </Select>
                </Form.Item>
                <Form.Item label="机号" name="loomId" rules={[{ required: true, message: '请选择机台' }]}>
                    <Select onChange={changeClothLoom}>
                        {
                            orderLoom.map((item, key) => (<Option value={item.loomId} key={key}>{item.loomCode}</Option>))
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
                    <Select onFocus={getseq} onChange={changeSeq}>
                        {
                            seqArr.map((item, key) => {
                                console.log(item)
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
    </React.Fragment>
}

export default Order;