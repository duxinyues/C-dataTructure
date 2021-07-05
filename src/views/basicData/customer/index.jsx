/*
 * @Author: 1638877065@qq.com
 * @Date: 2021-05-27 13:49:51
 * @LastEditTime: 2021-06-29 11:51:54
 * @LastEditors: 1638877065@qq.com
 * @Description: 客户
 * @FilePath: \cloud-admin\src\views\basicData\customer\index.jsx
 * 
 */
import { useState, useEffect } from "react";
import { PageHeader, Table, Modal, Button, Form, Input, message, Cascader } from "antd";
import { onlyFormat } from "../../../utils/config";
import { setAddress } from "../../../actons/action"
import { getCustomerList, addEditCustomer, delectCustomer, disableCustomer, getAddressInfo } from "../../../api/apiModule"
import { connect } from "react-redux"
const { confirm } = Modal;
const layout = {
    labelCol: {
        span: 4,
    },
    wrapperCol: {
        span: 20,
    },
};
function CustomerData(props) {
    document.title = "客户";
    const [data, setdata] = useState([]);
    const [loading, setloading] = useState(true);
    const [visible, setvisible] = useState(false);
    const [editType, seteditType] = useState(0);
    const [selectRecord, setselectRecord] = useState();
    const [addressData, setaddressData] = useState([]);
    const [size, setSize] = useState(10);
    const [current, setCurrent] = useState(1);
    const [total, setTotal] = useState(0);
    const [rowId, setRowId] = useState(0);
    const [form] = Form.useForm();
    const selectId = []
    useEffect(() => {
        getClothData(1, 10);
        if (props.address) {
            setaddressData([...props.address])
        } else {
            getAddressInfo(localStorage.getItem("access_token"), (res) => {
                setaddressData([...res]);
                props.setAddress(res);
            })
        }
    }, [])

    const modalClick = async (param, type) => {
        await form.setFieldsValue({
            name: param.name,
            abbr: param.abbr,
            contactPhone: param.contactPhone,
            address: param.address ? param.address.split(" ") : "",
            detailAddress: param.detailAddress,
            tareWeight: param.tareWeight,
            weightDecimal: param.weightDecimal
        });
        setselectRecord(param);
        setvisible(true);
        seteditType(type);
    };
    const onCancel = () => {
        setselectRecord(false);
        setvisible(false)
    }
    const handleOk = async (param) => {
        console.log("表单数据")
        const value = await form.validateFields();
        let data;
        if (editType == 2) {
            // 新增
            data = {
                "abbr": value.abbr,
                "address": selectId.join(","),
                "contactInfo": value.contactInfo,
                "detailAddress": value.detailAddress,
                "name": value.name,
                "tareWeight": value.tareWeight,
                "weightDecimal": value.weightDecimal
            }
        } else {
            edit(value.address, addressData)
            data = {
                "abbr": value.abbr,
                "address": selectId.join(","),
                "contactInfo": value.contactInfo,
                "detailAddress": value.detailAddress,
                "name": value.name,
                "tareWeight": value.tareWeight,
                "weightDecimal": value.weightDecimal,
                "id": selectRecord.id
            }
        }
        addEditCustomer(data, (res) => {
            setvisible(false)
            if (res.code == 200) {
                getClothData(1, 10);
                message.success("保存成功")
                return;
            }
            message.error("保存失败")
        })
    }
    const savaAdd = async () => {
        const value = await form.validateFields();
        addEditCustomer({
            "abbr": value.abbr,
            "address": selectId.join(","),
            "contactInfo": value.contactInfo,
            "detailAddress": value.detailAddress,
            "name": value.name,
            "tareWeight": value.tareWeight,
            "weightDecimal": value.weightDecimal
        }, (res) => {
            if (res.code == 200) {
                getClothData(1, 10);
                message.success("保存成功");
                form.resetFields();
                return;
            }
            message.error("保存失败")
        })
    }
    const delect = (param) => {
        confirm({
            title: "确认删除？",
            okText: "确定",
            cancelText: "取消",
            onCancel() { },
            onOk() {
                delectCustomer(param.id, (res) => {
                    if (res.code == 200) {
                        message.success("删除成功！");
                        getClothData(1, 10)
                        return;
                    }
                    message.error("删除失败！")
                })
            }
        })

    }
    // 禁用
    const disable = (param) => {
        const usedStatus = param.usedStatus == 1 ? 2 : 1;
        disableCustomer(param.id, usedStatus, (res) => {
            if (res.code == 200) {
                getClothData(1, 10)
                param.usedStatus == 1 ? message.success("禁用成功！") : message.success("启用成功！");
                return;
            }
            param.usedStatus == 1 ? message.error("禁用失败！") : message.success("启用失败！");
        })
    }
    // 获取列表数据
    const getClothData = (page, size) => {
        getCustomerList(page, size, (res) => {
            if (res.code == 200) {
                setloading(false)
                setSize(res.data.size);
                setTotal(res.data.total);
                setCurrent(res.data.current)
                setdata(res.data.records);
            }
        })
    }
    // 选择地址
    const onChange = (value) => {
        edit(value, addressData)
    }
    // 编辑选中的地址信息
    const edit = (selectAddr, addressData) => {
        addressData.map((item) => {
            if (selectAddr.indexOf(item.name) > -1) {
                selectId.push(item.id);
                if (item.children) {
                    edit(selectAddr, item.children)
                }
            }
        })
    }
    // 设置列表选中的class名称
    const setRowClassName = (record) => {
        return record.id === rowId ? 'clickRowStyl' : '';
    }
    // 列表行的点击事件
    const onClickRow = (record) => {
        setRowId(record.id)
    }
    const columns = [
        {
            title: '#',
            dataIndex: 'id',
        },
        {
            title: '编码',
            dataIndex: 'code',
        },
        {
            title: '公司名称',
            dataIndex: 'name',
        },
        {
            title: '简称',
            dataIndex: 'abbr',
        }, {
            title: '小数位',
            dataIndex: 'weightDecimal',
        }, {
            title: '加重',
            dataIndex: 'tareWeight',
        }, {
            title: '省市区',
            dataIndex: 'address',
            width: 200,
        },
        {
            title: '详细地址',
            dataIndex: 'detailAddress',
        }, {
            title: '联系方式',
            dataIndex: 'contactInfo',
        }, {
            title: '更新时间',
            dataIndex: 'updateTime',
            width: 200,
            render: (time) => (<span>{onlyFormat(time, true)}</span>)
        },
        {
            title: '操作',
            dataIndex: 'tags',
            width: 200,
            render: (tags, record) => {
                return <div className="tag-content">
                    <span onClick={() => { modalClick(record, 1) }}>编辑</span>
                    <span onClick={() => { delect(record) }}>删除</span>
                    <span onClick={() => { disable(record) }}>{record.usedStatus == 1 ? "禁用" : "启用"} </span>
                </div>
            },
        },
    ]
    const pagination = {
        total: total,
        pageSize: size,
        current: current,
        onChange: (page, pageSize) => {
            setCurrent(page);
            setSize(pageSize);
            getClothData(page, pageSize);
        },
        showSizeChanger: true,
        showTotal: () => (`共${total}条`)
    }
    return <div className="right-container">
        <PageHeader
            title="客户"
            extra={[
                <Button key="1" type="primary" onClick={() => { modalClick({}, 2) }}>
                    新增
                </Button>,
            ]} />
        <Table
            loading={loading}
            columns={columns}
            dataSource={data}
            rowKey={record => record.id}
            pagination={pagination}
            rowClassName={(record) => {
                return setRowClassName(record)
            }}
            onRow={record => {
                return {
                    onClick: event => { onClickRow(record) },
                };
            }}
        />
        <Modal
            className="customModal loom"
            destroyOnClose={true}
            title={editType == 1 ? "编辑客户" : "新建客户"}
            visible={visible}
            footer={[
                <span className="modalFooterBtn" onClick={savaAdd}>保存并新增</span>,
                <Button key="submit" type="primary" onClick={handleOk} >
                    保存
                </Button>,
                <Button onClick={onCancel}>
                    取消
                </Button>
            ]}
            onCancel={onCancel}
        >
            <Form
                {...layout}
                form={form}
                layout="horizontal"
                name="form_in_modal"
                onFinish={handleOk}
                preserve={false}
            >
                <Form.Item label="公司名称" name="name" rules={[{ required: true, message: '请输入名称!' }]}>
                    <Input placeholder="名称" />
                </Form.Item>
                <Form.Item label="简称" name="abbr">
                    <Input placeholder="简称" />
                </Form.Item>
                <Form.Item label="地址" name="address" >
                    <Cascader
                        options={addressData}
                        onChange={onChange}
                        placeholder="公司地址"
                    />
                </Form.Item>
                <Form.Item label="详细地址" name="detailAddress" >
                    <Input placeholder="详细地址" />
                </Form.Item>
                <Form.Item label="联系方式" name="contactInfo" >
                    <Input placeholder="联系方式" />
                </Form.Item>
                <Form.Item label="重量" name="tareWeight" >
                    <Input placeholder="重量" />
                </Form.Item>
                <Form.Item label="小数位" name="weightDecimal">
                    <Input placeholder="小数位" />
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
export default connect(mapStateToProps, { setAddress })(CustomerData)