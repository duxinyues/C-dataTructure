import React, { useState, useEffect } from "react"
import { Table, PageHeader, Button, Input, Tag, Select, Typography } from "antd";
import { onlyFormat, requestUrl, stockType } from "../../../utils/config";
import { withRouter } from "react-router-dom";
import "../style.css"

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;
document.title = "收纱入库"
function OrderDetail(props) {
    console.log(props)
    const [disable, setdisable] = useState(true);
    const [yarn_stock_detail, setyarn_stock_detail] = useState({});
    const data = {
        page: 1,
        size: 10,
        companyId: 1
    }

    useEffect(() => {
        setyarn_stock_detail(props.data)
    }, [])

    const enter_yarn_colums = [
        {
            title: '纱别',
            dataIndex: 'yarnName',
            key: 'yarnName',
            width:125
        },
        {
            title: '纱牌/纱批',
            dataIndex: 'yarnBrandBatch',
            key: 'yarnBrandBatch',
            width:125
        },
        {
            title: '色号',
            dataIndex: "colorCode",
            key: "colorCode",
            width:125
        },
        {
            title: '客户单号',
            dataIndex: 'customerCode',
            key: 'customerCode',
            width:125
        }, {
            title: '件数',
            dataIndex: 'pcs',
            key: 'pcs',
            width:125
        },
        {
            title: '规格',
            dataIndex: 'spec',
            key: 'spec',
            width:125
        },
        {
            title: '来纱净重',
            dataIndex: 'netWeight',
            key: 'netWeight',
            width:125
        },
        {
            title: '欠重',
            dataIndex: 'lackWeight',
            key: 'lackWeight',
            width:125
        },
        {
            title: '总欠重',
            dataIndex: 'totalLackWeight',
            key: 'totalLackWeight',
            width:125
        },
        {
            title: '实收净重',
            dataIndex: 'weight',
            key: 'weight',
            width:125
        }
    ];


    return <React.Fragment>
        <div className="detail-title">
            {/* 创建：2021-05-24 */}
            <Tag>审核</Tag>
        </div>
        <div className="detail-basicData">
            <div className="row">
                <div className="col">
                    <div className="label">入库单号</div>
                    <Input disabled={disable} value={props.data.code} />
                </div>
                <div className="col">
                    <div className="label">客户</div>
                    <Input disabled={disable} value={props.data.customerName} />
                </div>
                <div className="col">
                    <div className="label">入库日期</div>
                    <Input disabled={disable} value={onlyFormat(props.data.bizDate, false)} />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="label11">单据类型</div>
                    <Select disabled={disable} value={stockType[props.data.billType]}  >
                        {
                            stockType.map((item, key) => (<Option value={key} key={key}>{item}</Option>))
                        }

                    </Select>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="label1">备注</div>
                    <TextArea disabled={disable} autoSize={{ minRows: 2, maxRows: 6 }} value={props.data.remark} />
                </div>
            </div>
        </div>
        <div className="enter-yarn-table">
            <Table
                columns={enter_yarn_colums}
                dataSource={props.data.inDtls}
                pagination={false}
                rowKey={(record, index) => record.id}
                summary={pageData => {
                    if (pageData.length == 0) return;
                    let pcsTotal = 0;
                    let netWeight = 0;
                    let lackWeight = 0;
                    let totalLackWeight = 0;
                    let weight = 0;
                    pageData.forEach((item) => {
                        pcsTotal += item.pcs;
                        netWeight += item.netWeight;
                        lackWeight += item.lackWeight;
                        totalLackWeight += item.totalLackWeight;
                        weight += item.weight;
                        totalLackWeight += item.totalLackWeight
                    });
                    return (
                        <>
                            <Table.Summary.Row>
                                <Table.Summary.Cell></Table.Summary.Cell>
                                <Table.Summary.Cell></Table.Summary.Cell>
                                <Table.Summary.Cell></Table.Summary.Cell>
                                <Table.Summary.Cell>合计：</Table.Summary.Cell>
                                <Table.Summary.Cell>{pcsTotal}</Table.Summary.Cell>
                                <Table.Summary.Cell></Table.Summary.Cell>
                                <Table.Summary.Cell>{netWeight}</Table.Summary.Cell>
                                <Table.Summary.Cell>{lackWeight}</Table.Summary.Cell>
                                <Table.Summary.Cell>{totalLackWeight}</Table.Summary.Cell>
                                <Table.Summary.Cell>{weight}</Table.Summary.Cell>
                            </Table.Summary.Row>
                        </>
                    );
                }}
            />
        </div>
    </React.Fragment>
}

export default withRouter(OrderDetail)