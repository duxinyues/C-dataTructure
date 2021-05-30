import { useState, useEffect } from "react"
import { Table, PageHeader, Button, Input, Tag, Select, Typography } from "antd";
import { onlyFormat, requestUrl, stockType } from "../../../utils/config";
import { withRouter } from "react-router-dom";
import { createHashHistory } from "history";
import "../style.css"

const history = createHashHistory();
const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;
document.title = "新增入库单"
function CreateEnterStockOrder(props) {
    console.log(props)
    const [yarn_stock_detail, setyarn_stock_detail] = useState({});
    const data = {
        page: 1,
        size: 10,
        companyId: 1
    }

    useEffect(() => {
    }, [])
    
    // 入库单明细
    const getYarnStockDetail = (id) => {
        fetch(requestUrl + "/api-stock/yarnStockIo/findYarnStockInById?id=" + id, {
            method: "GET",
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token"),
                "Content-Type": "application/json"
            },
        })
            .then(res => { return res.json() })
            .then((res) => {
                console.log("入库单详情", res)
                if (res.code == 200) {
                    setyarn_stock_detail(res.data)
                }
            })
    }
    // 新增订单
    const createOrder = ()=>{
        history.goBack()
    }
   
    const enter_yarn_colums = [
        {
            title: '纱别',
            dataIndex: 'yarnName',
            key: 'yarnName',
        },
        {
            title: '纱牌/纱批',
            dataIndex: 'yarnBrandBatch',
            key: 'yarnBrandBatch',
        },
        {
            title: '色号',
            dataIndex: "colorCode",
            key: "colorCode",
        },
        {
            title: '客户单号',
            dataIndex: 'customerCode',
            key: 'customerCode',
        }, {
            title: '件数',
            dataIndex: 'pcs',
            key: 'pcs',
        },
        {
            title: '规格',
            dataIndex: 'spec',
            key: 'spec',
        },
        {
            title: '来纱净重',
            dataIndex: 'netWeight',
            key: 'netWeight',
        },
        {
            title: '欠重',
            dataIndex: 'lackWeight',
            key: 'lackWeight',
        },
        {
            title: '总欠重',
            dataIndex: 'totalLackWeight',
            key: 'totalLackWeight',
        },
        {
            title: '实收净重',
            dataIndex: 'weight',
            key: 'weight',
        }
    ];
   
    return <div className="right-container">
        <PageHeader
            title="新增入库单"
            extra={[
                <Button onClick={createOrder}>
                    保存
                </Button>,
                <Button >
                    取消
                </Button>,
            ]}
        />
        <div className="inventory-container">
            <div className="add-content">
                <div className="detail-title">
                    创建：2021-05-24
                </div>
                <div className="detail-basicData">
                    <div className="row">
                        <div className="col">
                            <div className="label">入库单号</div>
                            <Input value={yarn_stock_detail.customerBillCode} />
                        </div>
                        <div className="col">
                            <div className="label">客户</div>
                            <Input  value={yarn_stock_detail.customerName} />
                        </div>
                        <div className="col">
                            <div className="label">入库日期</div>
                            <Input value={onlyFormat(yarn_stock_detail.bizDate, false)} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className="label11">单据类型</div>
                            <Select value={stockType[yarn_stock_detail.billType]}  >
                                {
                                    stockType.map((item, key) => (<Option value={key} key={key}>{item}</Option>))
                                }

                            </Select>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className="label1">备注</div>
                            <TextArea  autoSize={{ minRows: 2, maxRows: 6 }} value={yarn_stock_detail.remark} />
                        </div>
                    </div>
                </div>
                <div className="enter-yarn-table">
                    <Table
                        columns={enter_yarn_colums}
                        dataSource={yarn_stock_detail.inDtls}
                        pagination={false}
                        summary={pageData => {
                            if (pageData.length == 0) return;
                            let pcsTotal = 0;
                            let netWeight = 0;
                            let lackWeight = 0;
                            let totalLackWeight = 0;
                            let weight = 0;
                            pageData.forEach(({ borrow, repayment }) => {
                                pcsTotal += borrow.pcs;
                                netWeight += borrow.netWeight;
                                lackWeight += borrow.lackWeight;
                                totalLackWeight += borrow.totalLackWeight;
                                weight += borrow.weight;
                                totalLackWeight += borrow.totalLackWeight
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
            </div>
        </div>
    </div>
}

export default withRouter(CreateEnterStockOrder)