import React, { useState, useEffect, useRef } from "react";
import { PageHeader, Table, Form, Row, Select, Button, Input, Dropdown, Menu, Spin } from "antd";
import { DownOutlined } from '@ant-design/icons';
import { orderType, orderSearch, requestUrl, } from "../../../utils/config"
import OrderDetail from "./orderDetail";
import CreateOrder from "./createOrder";
import EditOrder from "./edit";
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
    const [orderDetail, setorderDetail] = useState()
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

    //  获取创建订单组件的状态
    const getCreateOrderState = (value) => {
        console.log(value);
        if (value.state === "detail") {
            getOrderList({
                "page": 1,
                "size": 10,
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
                    setorderList(res.data.records);
                    getOrderDetail(res.data.records[1].id);
                }
            })
    }
    const getOrderDetail = (id) => {
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

                }
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
    return <React.Fragment>
        <Spin spinning={spining}>
            <div className="right-container">
                {headType === "detail" && <PageHeader className="custom" title="订单管理" extra={[
                    <Button key="3" type="primary" onClick={add}>+新建</Button>,
                    <Button key="2" onClick={edit}>编辑</Button>,
                    <Button key="1">完工</Button>,
                    <Button key="4">订单</Button>,
                    <Button key="5">布票</Button>,
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
                                // searchType: orderSearch[0]
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
                                    {/* {searchType === "customerName" && <Select style={{ width: "125px" }}>
                                    {
                                        customer.map((item, key) => {
                                            console.log(item)
                                            return (<Option value={item.id} >{item.neme}</Option>)
                                        })
                                    }

                                </Select>}
                                {searchType === "type" && <Select >
                                    <Option value="1">开幅</Option>
                                    <Option value="2">抽针</Option>
                                    <Option value="3">圆筒</Option>
                                </Select>} */}
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
                        />
                    </div>
                    <div className="right">
                        {headType === "detail" && <OrderDetail orderData={orderDetail} />}
                        {headType === "edit" && <EditOrder ref={childRef} editOrder={getCreateOrderState} />}
                        {headType === "add" && <CreateOrder createOrder={getCreateOrderState} ref={childRef} />}
                    </div>
                </div>
            </div>
        </Spin>
    </React.Fragment>
}

export default Order;