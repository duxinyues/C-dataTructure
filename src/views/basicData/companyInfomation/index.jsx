/*
 * @Author: 1638877065@qq.com
 * @Date: 2021-05-27 13:49:51
 * @LastEditTime: 2021-07-05 15:55:08
 * @LastEditors: 1638877065@qq.com
 * @Description: 公司信息
 * @FilePath: \cloud-admin\src\views\basicData\companyInfomation\index.jsx
 * 
 */
import { PageHeader, Input, Form, Button, Cascader, message } from "antd";
import { useState, useEffect } from "react";
import { connect } from "react-redux"
import { setAddress } from "../../../actons/action"
import { getAddressInfo, getCompanyInfo, editCompany } from "../../../api/apiModule"
import "./index.css";
const { TextArea } = Input;
function CompanyInfo(props) {
    document.title = "公司信息";
    const [form] = Form.useForm();
    const [addressData, setaddressData] = useState([]);
    const [company, setCompany] = useState({})
    const selectId = []
    useEffect(() => {
        getCompanyData();
        if (props.address) {
            setaddressData([...props.address])
        } else {
            getAddressInfo(localStorage.getItem("access_token"), (res) => {
                setaddressData([...res]);
                props.setAddress(res)
            })
        }
    }, [])
    const onChange = (value) => {
        console.log("选中的", value)
        edit(value, addressData)
    }
    //提交表单
    const onFinish = (value) => {
        // 没有修改地址
        // if (selectId.length == 0) {
        //     selectId.push(company.provinceId)
        //     selectId.push(company.cityId)
        //     selectId.push(company.townId)
        // }
        const param = {
            "abbr": value.abbr,
            "address": selectId.join(","),
            "contactAddress": value.contactAddress,
            "contactInfo": value.contactInfo,
            "id": company.id,
            "logoUrl": "",
            "name": value.name,
            "remark": value.remark
        }

        console.log("====", param)
        editCompany(param, (res) => {
            if (res.code == 200) {
                getCompanyData();
                message.success("保存成功")
                return;
            }
            message.error("保存失败")
        })
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
        console.log("qqqqqq", selectId)
    }
    const getCompanyData = () => {
        getCompanyInfo((res) => {
            console.log(res)
            if (res.code == 200) {
                setCompany(res.data)
                form.setFieldsValue({
                    name: res.data.name,
                    abbr: res.data.abbr,
                    address: res.data.address ? res.data.address.split(" ") : [],
                    contactAddress: res.data.contactAddress,
                    contactInfo: res.data.contactInfo,
                    remark: res.data.remark
                })
            }
        })
    }
    return <div className="right-container">
        <PageHeader
            backIcon={false}
            onBack={() => null}
            title="公司信息"
        />
        <div className="company-content">
            <Form
                layout={"vertical"}
                onFinish={onFinish}
                form={form}
            >
                <Form.Item label="公司名称" name="name" required >
                    <Input value={"fvjdsfskvb"} />
                </Form.Item>
                <Form.Item label="简称" name="abbr">
                    <Input value="盛泽" />
                </Form.Item>
                <Form.Item className="jianjie" label="公司简介" name="remark">
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
                <Form.Item>
                    <Button type="primary" htmlType="submit">保存</Button>
                </Form.Item>
            </Form>
            <div className="company-logo">
                <img src="https://xiyou-knit.oss-cn-beijing.aliyuncs.com/1623735094678.jpeg?OSSAccessKeyId=LTAI5t7rh2JnQ3vEVAkySUN1&Expires=1659748734&Signature=1rFZhF7eG%2FR0%2FTqZzi3oRYnc%2FMo%3D" alt="" srcset="" />
            </div>
        </div>
    </div>
}
const mapStateToProps = (state) => {
    return {
        address: state.addressInfoReducer.address
    }
}
export default connect(mapStateToProps, { setAddress })(CompanyInfo)