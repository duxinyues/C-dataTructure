import React, { useState, useEffect,useRef } from "react";
import { PageHeader, Table, Form, Row, Select, Button, Input, Dropdown, Menu } from "antd";
import { DownOutlined } from '@ant-design/icons';
import { orderType, orderSearch } from "../../../utils/config"
import OrderDetail from "./orderDetail";
import CreateOrder from "./createOrder";
import "./style.css"
const { Option } = Select;

document.title = "订单管理";
function Order() {
    const [columns, setcolumns] = useState();
    const [headType, setheadType] = useState("detail"); //默认展示详情
    const childRef = useRef();
    useEffect(() => {
        setcolumns([
            {
                title: "生产单号"
            },
            {
                title: "客户"
            },
            {
                title: "布类"
            },
            {
                title: "订单数量"
            }
        ]);
    }, []);


    const add = () => { setheadType("add") }
    const cancel = () => {
        setheadType("detail");
    }
    const onFinish = (value) => {
        console.log("搜素框===", value)
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
        <div className="right-container">
            {headType === "detail" && <PageHeader className="custom" title="订单管理" extra={[
                <Button key="3" type="primary" onClick={add}>+新建</Button>,
                <Button key="2">编辑</Button>,
                <Button key="1">完工</Button>,
                <Button key="4">订单</Button>,
                <Button key="5">布票</Button>,
                <Dropdown overlay={menu} trigger={['click']}>
                    <div className="drop">
                        更多 &nbsp; <DownOutlined />
                    </div>
                </Dropdown>,

            ]} />}
            {headType === "add" && <PageHeader title="订单管理" extra={[
                <Button key="1" type="primary" >保存</Button>,
                <Button key="2" onClick={cancel}>取消</Button>,
            ]} />}
            <div className="inventory-container">
                <div className="left">
                    <Form
                        className='header-form'
                        onFinish={onFinish}
                        initialValues={{
                            type: orderType[1],
                            name: orderSearch[0]
                        }}
                    >
                        <Row>
                            <Form.Item name="type" style={{ marginRight: "10px" }}>
                                <Select>
                                    {
                                        orderType.map((item, key) => (<Option value={item} key={key}>{item}</Option>))
                                    }
                                </Select>
                            </Form.Item>
                            <div>
                                <Form.Item name="name">
                                    <Select className="cu">
                                        {
                                            orderSearch.map((item, key) => (<Option value={item} key={key}>{item}</Option>))
                                        }
                                    </Select>
                                </Form.Item>

                            </div>
                            <Form.Item name="name000">
                                <Input className="au" />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">搜索</Button>
                            </Form.Item>
                        </Row>
                    </Form>
                    <Table
                        columns={columns}
                    />
                </div>
                <div className="right">
                    {headType === "detail" && <OrderDetail />}
                    {headType === "add" && <CreateOrder add={add} type={headType} ref={childRef} />}
                </div>
            </div>
        </div>
    </React.Fragment>
}

export default Order;