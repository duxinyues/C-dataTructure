import { useState, useEffect } from "react"
import { Table, PageHeader, Button, Input, Tag, Select, Typography } from "antd";
import { onlyFormat, requestUrl, stockType } from "../../../utils/config"
import "../style.css"

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;
document.title = "收纱入库"
function EnterStorage() {
    const [disable, setdisable] = useState(true);
    const [leftData, setleftData] = useState([]);
    const [leftTotal, setleftTotal] = useState(0)
    const [yarn_stock_detail, setyarn_stock_detail] = useState({})
    const data = {
        page: 1,
        size: 10,
        companyId: 1
    }

    useEffect(() => {
        getData(data)
    }, [])

    //  收纱入库
    const getData = (param) => {
        fetch(requestUrl + "/api-stock/yarnStockIo/findYarnStockInList", {
            method: "POST",
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(param)
        })
            .then(res => { return res.json() })
            .then((res) => {
                if (res.code == 200) {
                    setleftData(res.data.records);
                    setleftTotal(res.data.total);
                    getYarnStockDetail(res.data.records[0].id)
                }
            })
    }
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
    const columns = [
        {
            title: '入库单号',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: '客户',
            dataIndex: 'customerName',
            key: 'customerName',
        },
        {
            title: '日期',
            dataIndex: "bizDate",
            key: "bizDate",
            render: (beginTime) => (<span>{onlyFormat(beginTime, false)}</span>)
        },
        {
            title: '状态',
            dataIndex: 'billStatus',
            key: 'billStatus',
            render: (billStatus) => (<span>{billStatus == 1 ? <Tag color="green">已审核</Tag> : <Tag color="magenta">未审核</Tag>}</span>)
        }
    ];
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
    const enter_yarn_data = [
        {
            newsuttle: 111,
            shortweights: "总欠重",
            shortweight: "欠重",
            suttle: 32,
            specification: "规格",
            number: 1,
            customerNumber: "客户单号",
            colorCode: "1000",
            yarnBatch: 13223,
            yarnType: "纱别"
        },
        {
            newsuttle: 111,
            shortweights: "总欠重",
            shortweight: "欠重",
            suttle: 154,
            specification: "规格",
            number: 2,
            customerNumber: "客户单号",
            colorCode: "1000",
            yarnBatch: 13223,
            yarnType: "纱别"
        }
    ];
    const pagination = {
        total: leftTotal,
        simple: true,
        // pageSize: size,
        // current: current,
        // onChange: (page, pageSize) => {
        //     setCurrent(page);
        //     setsize(pageSize);
        //     getClothData(page, pageSize);
        // },
        // showSizeChanger: true,
        // showTotal: () => (`共${total}条`)
    }
    return <div className="right-container">
        <PageHeader
            title="收纱入库"
            extra={[
                <Button key="1" type="primary">
                    +新增
                </Button>,
                <Button  >
                    编辑
                </Button>,
                <Button >
                    删除
                </Button>,
                <Button >
                    订单
                </Button>,
                <Button disabled >
                    抽磅
                </Button>,
            ]}
        />
        <div className="inventory-container">
            <div className="left">
                <Table
                    columns={columns}
                    dataSource={leftData}
                    pagination={pagination}
                />
            </div>
            <div className="right">
                <div className="detail-title">
                    创建：2021-05-24
                </div>
                <div className="detail-basicData">
                    <div className="row">
                        <div className="col">
                            <div className="label">入库单号</div>
                            <Input disabled={disable} value={yarn_stock_detail.customerBillCode} />
                        </div>
                        <div className="col">
                            <div className="label">客户</div>
                            <Input disabled={disable} value={yarn_stock_detail.customerName} />
                        </div>
                        <div className="col">
                            <div className="label">入库日期</div>
                            <Input disabled={disable} value={onlyFormat(yarn_stock_detail.bizDate, false)} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className="label11">单据类型</div>
                            <Select disabled={disable} value={stockType[yarn_stock_detail.billType]}  >
                                {
                                    stockType.map((item, key) => (<Option value={key} key={key}>{item}</Option>))
                                }

                            </Select>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className="label1">备注</div>
                            <TextArea disabled={disable} autoSize={{ minRows: 2, maxRows: 6 }} value={yarn_stock_detail.remark} />
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

                            // const pcsTotal = pageData.reduce((a, b) => {
                            //     return a.pcs + b.pcs
                            // })
                            // const netWeight = pageData.reduce((a, b) => {
                            //     return a.netWeight + b.netWeight
                            // })
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

export default EnterStorage