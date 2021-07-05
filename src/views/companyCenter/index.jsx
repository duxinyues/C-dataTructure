import React, { useState, useEffect } from "react"
import { Table, PageHeader, Button, Form, Modal, Input, Cascader, message } from "antd";
import { connect } from "react-redux"
import { companyList, editCompany, getAddressInfo, disableCompany, deletedCompany } from "../../api/apiModule";
import { setAddress } from "../../actons/action"
import "./index.css"
const { TextArea } = Input
const { confirm } = Modal
function CompanyList(props) {
    const [list, setlist] = useState([]);
    const [modalType, setmodalType] = useState();
    const [visible, setvisible] = useState(false);
    const [addressData, setaddressData] = useState([]);
    const [selectCompany, setselectCompany] = useState();
    const [total, settotal] = useState(0);
    const [current, setCurrent] = useState(1);
    const [size, setSize] = useState(10)
    const [form] = Form.useForm();
    const selectId = [];
    useEffect(() => {
        getCompanyData({ size: 10, page: 1 });
        if (props.address) {
            setaddressData([...props.address])
        } else {
            getAddressInfo(localStorage.getItem("access_token"), (res) => {
                setaddressData([...res]);
                props.setAddress(res)
            })
        }
    }, [])
    const getCompanyData = (params) => {
        companyList(params, (res) => {
            if (res.code === 200) {
                setCurrent(res.data.current);
                settotal(res.data.total);
                setSize(res.data.size);
                setlist([...res.data.records])
            }
        })
    }
    const add = () => {
        setvisible(true);
        setmodalType("add")
    }
    const edit = (records) => {
        setselectCompany(records)
        setvisible(true);
        setmodalType("edit");
        form.setFieldsValue({
            name: records.name,
            abbr: records.abbr,
            address: records.address ? records.address.split(" ") : [],
            contactAddress: records.contactAddress,
            contactInfo: records.contactInfo,
            remark: records.remark
        })
    }
    const onCancel = () => {
        setvisible(false);
        form.resetFields()
    }
    const submit = async () => {
        const value = await form.validateFields();
        value.address = selectId.join(",");
        if (modalType === 'edit') {
            value.id = selectCompany.id
        }
        editCompany(value, (res) => {
            console.log(res)
            form.resetFields()
            if (res.code === 200) {
                getCompanyData({ size: 10, page: 1 });
                message.success("保存成功！");
                setvisible(false);
                setmodalType();
                return;
            }
            message.error(res.msg);
        })
    }
    const onChange = (value) => {
        console.log("选中的", value)
        editAddress(value, addressData)
    }
    // 编辑选中的地址信息
    const editAddress = (selectAddr, _addressData) => {
        _addressData.map((item) => {
            if (selectAddr.indexOf(item.name) > -1) {
                selectId.push(item.id);
                if (item.children) {
                    editAddress(selectAddr, item.children)
                }
            }
        })
    }
    const onDisable = (params) => {
        const status = params.usedStatus === 1 ? 2 : 1
        disableCompany(params.id, status, (res) => {
            if (res.code === 200) {
                getCompanyData({ size: 10, page: 1 });
                return;
            }
            message.error("操作失败")
        })
    }
    const onDeleted = (records) => {
        confirm({
            title: '确认删除？',
            okText: "确定",
            cancelText: "取消",
            onOk() {
                deletedCompany(records.id, (res) => {
                    if (res.code == 200) {
                        message.success("删除成功！");
                        getCompanyData({ size: 10, page: 1 });
                        return;
                    }
                    message.error("删除失败！")
                })
            },
            onCancel() { },
        });
    }
    const pagination = {
        total: total,
        pageSize: size,
        current: current,
        onChange: (page, pageSize) => {
            setCurrent(page);
            setSize(pageSize);
            getCompanyData({ size: pageSize, page: page });
        },
        showSizeChanger: false,
        showTotal: () => (`共${total}条`)
    }
    const columns = [
        // { title: "#", dataIndex: "id" },
        { title: "编码", dataIndex: "code" },
        { title: "公司名称", dataIndex: "name" },
        { title: "简称", dataIndex: "abbr" },
        { title: "省市区", dataIndex: "address" },
        { title: "详细地址", dataIndex: "contactAddress" },
        { title: "联系方式", dataIndex: "contactInfo" },
        { title: "更新时间", dataIndex: "updateTime" },
        { title: "操作", render: (records, index) => (<React.Fragment><span className="option-btn" onClick={() => { edit(records) }}>编辑</span><span className="option-btn" onClick={() => { onDeleted(records) }}>删除</span><span className="option-btn" onClick={() => { onDisable(records) }}>{records.usedStatus === 1 && "禁用"}{records.usedStatus === 2 && "启用"}</span></React.Fragment>) }]
    return <div className="right-container">
        <PageHeader
            title="织厂"
            extra={[
                <Button key="1" type="primary" onClick={add}>
                    新建
                </Button>,
            ]} />
        <Table
            columns={columns}
            dataSource={list}
            pagination={pagination}
        />
        <Modal
            title={modalType === "add" ? "新增" : "编辑"}
            visible={visible}
            onCancel={onCancel}
            onOk={submit}
            cancelText="取消"
            okText="保存"
        >
            <Form
                form={form}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
            >
                <Form.Item
                    name="name"
                    label="公司名称"
                    rules={[{ required: true, message: "请输入公司名称" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="abbr"
                    label="简称"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    className="jianjie"
                    name="remark"
                    label="公司简介"
                >
                    <TextArea />
                </Form.Item>
                <Form.Item
                    name="address"
                    label="省市区"
                >
                    <Cascader
                        options={addressData}
                        onChange={onChange}
                        placeholder="公司地址"
                    />
                </Form.Item>
                <Form.Item label="详细地址" name="contactAddress">
                    <Input />
                </Form.Item>
                <Form.Item label="联系方式" name="contactInfo">
                    <Input value="" />
                </Form.Item>
            </Form>
        </Modal>
    </div>
}
const mapStateToProps = (state) => {
    return {
        address: state.addressInfoReducer.address
    }
}
export default connect(mapStateToProps, { setAddress })(CompanyList)
