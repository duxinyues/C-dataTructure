import { useState, useEffect } from "react"
import { Table, Input, Select, Tag } from "antd";
import { onlyFormat, stockType, stockOutType } from "../../../utils/config";
import { withRouter } from "react-router-dom";
import "../style.css"

const { TextArea } = Input;
const { Option } = Select;
function Detail(props) {
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
        },
        {
            title: '纱牌/纱批',
            dataIndex: 'yarnBrandBatch',
            key: 'yarnBrandBatch',
        },
        {
            title: "纱属性"
        },
        {
            title: "缸号"
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
            title: '重量',
            dataIndex: 'weight',
            key: 'weight',
        }
    ];


    return <div className="right">
        <div className="detail-title">
            <Tag>反审核</Tag>
        </div>
        <div className="detail-basicData">
            <div className="row">
                <div className="col">
                    <div className="label">出库单号</div>
                    <Input disabled={disable} value={props.data.code} />
                </div>
                <div className="col">
                    <div className="label">客户</div>
                    <Input disabled={disable} value={props.data.customerName} />
                </div>
                <div className="col">
                    <div className="label">出库日期</div>
                    <Input disabled={disable} value={onlyFormat(props.data.bizDate, false)} />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="label11">单据类型</div>
                    <Select disabled={disable} value={stockOutType[props.data.billType]}  >
                        {
                            stockOutType.map((item, key) => (<Option value={key} key={key}>{item}</Option>))
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
                dataSource={props.data.outDtls}
                pagination={false}
            />
        </div>
    </div>
}

export default withRouter(Detail)