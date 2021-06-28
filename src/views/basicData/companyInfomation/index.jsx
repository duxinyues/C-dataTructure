/*
 * @Author: 1638877065@qq.com
 * @Date: 2021-05-27 13:49:51
 * @LastEditTime: 2021-06-28 20:15:27
 * @LastEditors: 1638877065@qq.com
 * @Description: 公司信息
 * @FilePath: \cloud-admin\src\views\basicData\companyInfomation\index.jsx
 * 
 */
import { PageHeader, Input, Form, Button, Cascader, message } from "antd";
import { useState, useEffect } from "react";
import { requestUrl } from "../../../utils/config"
import "./index.css";
const { TextArea } = Input;
function CompanyInfo() {
    document.title = "公司信息";
    const [form] = Form.useForm();
    const [addressData, setaddressData] = useState([]);

    const [company, setCompany] = useState({})
    const selectId = []
    useEffect(() => {
        getCompanyData();
        getData()
    }, [])
    const onChange = (value) => {
        console.log("选中的", value)
        edit(value, addressData)
    }
    //提交表单
    const onFinish = (value) => {
        // 没有修改地址
        if (selectId.length == 0) {
            console.log(selectId);
            selectId.push(company.provinceId)
            selectId.push(company.cityId)
            selectId.push(company.townId)
        }
        const param = {
            "abbr": value.abbr,
            "address": selectId.join(","),
            "contactAddress": value.contactAddress,
            "contactPhone": value.contactPhone,
            "id": company.id,
            "logoUrl": "",
            "name": value.name,
            "remark": value.remark
        }

        console.log(JSON.stringify(param))
        fetch(requestUrl + "/api-basedata/company/saveOrModify", {
            method: "POST",
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(param)
        })
            .then((res) => { return res.json() })
            .then((res) => {
                if (res.code == 200) {
                    getCompanyData();
                    message.success("保存成功")
                    return;
                }
                message.success("保存失败")
            })
    }

    const getData = () => {
        fetch(requestUrl + "/api-basedata/address/findAll", {
            method: "GET",
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token")
            },
        })
            .then((res) => { return res.json() })
            .then((res) => {
                console.log("地址信息", res)
                // addressMap(res.data)
                setaddressData(res.data)
            })
    }
    // 整理地址信息
    const addressMap = (data) => {
        data.map((item) => {
            item.value = item.name;
            item.label = item.name;
            if (item.subAddress) {
                item.children = item.subAddress;
                addressMap(item.children)
            }
        })
        return data
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
    const getCompanyData = () => {
        fetch(requestUrl + "/api-basedata/company/findById", {
            method: "POST",
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token")
            },
        })
            .then(res => { return res.json() })
            .then((res) => {
                console.log(res)
                if (res.code == 200) {
                    setCompany(res.data)
                    form.setFieldsValue({
                        name: res.data.name,
                        abbr: res.data.abbr,
                        // address: res.data.address.split(" "),
                        contactAddress: res.data.contactAddress,
                        contactPhone: res.data.contactPhone,
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
                <Form.Item label="公司简介" name="remark">
                    <Input.TextArea rows={4} autoSize />
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
                <Form.Item label="联系电话" name="contactPhone">
                    <Input value="10086" type="number" />
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

export default CompanyInfo