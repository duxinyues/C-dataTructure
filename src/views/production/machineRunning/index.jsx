import { useState } from "react"
import { Form, Input, Row, Col, Select, Button } from "antd";
import { testArr, sliceArrFn } from "../../../utils/config"
import "./index.css"
const { Option } = Select
function MachineRunning() {
    document.title = "织机监控";
    const arr = []
    return <div className="right-container">
        <div className="run-title">
            <div className="left">
                <div>织机监控</div>
                <span>运行:5台</span>
                <span>停机:6台</span>
                <span>关机:10台</span>
            </div>
        </div>
        <Form style={{ margin: "10px" }}>
            <Row gutter={24}>
                <Col span="4">
                    <Form.Item label="搜索条件">
                        <Select>
                            <Option value="1">1</Option>
                            <Option value="2">3</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span="4">
                    <Form.Item label="值机工">
                        <Select>
                            <Option value="1">1</Option>
                            <Option value="2">3</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span="4">
                    <Form.Item label="状态">
                        <Select>
                            <Option value="1">1</Option>
                            <Option value="2">3</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span="6">
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ height: "26px", marginRight: "10px", display: "flex", alignItems: "center" }}>搜索</Button>
                        <Button htmlType="reset" style={{ height: "26px", display: "flex", alignItems: "center" }}>清空</Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
        <div className="loom-container">
            {
                testArr.map((item) => {
                    return <div className={`loom-item ${item.status === 1 && "runing"} ${item.status === 2 && "downtime"} ${item.status === 3 && "close-down"} `}>
                        <div className="loom-code">
                            {item.code}
                            <div>
                                <div>{item.name}</div>
                                <div>{item.zhuan}转</div>
                            </div>
                        </div>
                        <div className="bulei">
                            {item.bulei}
                        </div>
                        <div className="bulei">
                            打卡:{item.daka}
                        </div>
                        <div className="bulei">
                            机速:{item.jisu}
                        </div>
                        <div className="bulei">
                            下布条数:{item.tiaoshu}
                        </div>
                        <div className="bulei">
                            停机:{item.tingji1}次
                        </div>
                        <div className="bulei">
                            停机:{item.tingji2}分
                        </div>
                    </div>
                })
            }
        </div>
    </div>
}

export default MachineRunning