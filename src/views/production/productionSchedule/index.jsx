import React from "react";
import { PageHeader, Button } from "antd";
import "./style.css"
function ProductionSchedule() {
    document.title = "生产进度";
    return <React.Fragment>
        <div className="right-container">
            <PageHeader className="productionSchedule">
                <div className="pageTitle">
                    <span>生产进度</span>
                    <div className="tabs">
                        <div className="tabs-item">全部</div>
                        <div className="tabs-item">进行中</div>
                        <div className="tabs-item">未审核</div>
                        <div className="tabs-item">已完工</div>
                        <div className="tabs-item">已作废</div>
                    </div>
                </div>
                <div>
                    <Button>打印</Button>
                    <Button>导出</Button>
                </div>
            </PageHeader>
        </div>
    </React.Fragment>
}

export default ProductionSchedule