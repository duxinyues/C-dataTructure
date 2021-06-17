import { useEffect, useState } from "react"
import { Table, Input, Tag, } from "antd";
import { onlyFormat, requestUrl } from "../../../utils/config";
import { withRouter } from "react-router-dom";
import "../../yarnInventory/style.css"
const { TextArea } = Input;
function OrderDetail(props) {
    console.log(props)
    document.title = "坯布出货";
    const enter_yarn_colums = [
        {
            title: '#',
            dataIndex: 'id',
            key: 'id',
            width: 70
        },
        {
            title: '生产单号',
            dataIndex: 'orderDto',
            key: 'orderDto',
            render: (item) => (<span>{item.code ? item.code : ""}</span>),
            width: 130
        },
        {
            title: '客户单号',
            dataIndex: 'orderDto',
            key: 'orderDto',
            render: (item) => (<span>{item.customerBillCode ? item.customerBillCode : ""}</span>),
            width: 130
        },
        {
            title: '坯布编码',
            dataIndex: 'orderDto',
            key: 'orderDto',
            render: (item) => (<span>{item.greyFabricCode ? item.greyFabricCode : ""}</span>),
            width: 130
        },
        {
            title: '布类',
            dataIndex: 'orderDto',
            key: 'orderDto',
            render: (item) => (<span>{item.fabricType ? item.fabricType : ""}</span>),
            width: 130
        },
        {
            title: '纱别',
            dataIndex: 'orderDto',
            key: 'orderDto',
            render: (item) => (<span>{item.yarnName ? item.yarnName : ""}</span>),
            width: 130
        },
        {
            title: '针寸',
            dataIndex: 'orderDto',
            key: 'orderDto',
            render: (item) => (<span>{item.inches ? item.inches : ""}</span>),
            width: 70
        },
        {
            title: '客户颜色',
            dataIndex: 'orderDto',
            key: 'orderDto',
            render: (item) => (<span>{item.customerColor ? item.customerColor : ""}</span>),
            width: 70
        },
        {
            title: '出货卷数',
            dataIndex: 'volQty',
            key: 'volQty',
            width: 70
        },
        {
            title: '出货重量',
            dataIndex: 'weight',
            width: 70
        },
        {
            title: '单位',
            width: 40,
            render: () => (<span>kg</span>)
        },
        {
            title: '加工单价',
            dataIndex: 'orderDto',
            key: 'orderDto',
            render: (item) => (<span>{item.productPrice}</span>),
            width: 70
        },
        {
            title: '金额',
            dataIndex: 'totalMoney',
            width: 130,
            // render: (item) => (<span>{item.toFixed(2)}</span>)
        }
    ];
    useEffect(() => {
       
    }, [])
    const audit = () => {
        console.log(props);
        const status = props.data.billStatus === 0 ? 1 : 0
        fetch(requestUrl + "/api-stock/fabricStockIo/updateStatus?id=" + props.data.id + "&status=" + status, {
            method: "POST",
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token"),
            }
        })
            .then(res => { return res.json() })
            .then(res => {
                if (res.code === 200) {
                    props.update()
                }
            })
    }
    return <div className="right">
        <div className="detail-title">
            {props.data.billStatus === 0 && <span style={{ marginRight: "10px" }}>未审核</span>}
            {props.data.billStatus === 1 && <span style={{ marginRight: "10px" }}>已审核</span>}
            <Tag onClick={audit}>{props.data.billStatus === 1 ? "反审核" : "审核"}</Tag>
        </div>
        <div className="detail-basicData">
            <div className="row">
                <div className="col">
                    <div className="label">出库单号</div>
                    <Input disabled value={props.data.code} />
                </div>
                <div className="col">
                    <div className="label">客户</div>
                    <Input disabled value={props.data.customerName} />
                </div>
                <div className="col">
                    <div className="label">收货方</div>
                    <Input disabled value={props.data.address} />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="label">出库时间</div>
                    <Input disabled value={onlyFormat(props.data.bizDate, false)} />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="label1">备注</div>
                    <TextArea disabled autoSize={{ minRows: 2, maxRows: 6 }} value={props.data.remark} />
                </div>
            </div>
        </div>
        <div className="enter-yarn-table">
            <Table
                columns={enter_yarn_colums}
                dataSource={props.data.fabricStockIoDtls}
                pagination={false}
                rowKey={(record, index) => record.id}
            />
        </div>
    </div>
}

export default withRouter(OrderDetail)