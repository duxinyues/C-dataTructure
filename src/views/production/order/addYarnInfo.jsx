/*
 * @FileName: 
 * @Author: 1638877065@qq.com
 * @Date: 2021-06-10 21:55:30
 * @LastEditors: 1638877065@qq.com
 * @LastEditTime: 2021-06-23 11:03:36
 * @FilePath: \cloud-admin\src\views\production\order\addYarnInfo.jsx
 * @Description: 
 */
import React, { useState, useEffect } from "react";
import { PlusCircleOutlined, MinusCircleOutlined, CloseOutlined } from '@ant-design/icons';
import { message, Input } from "antd";
import { verify_value, arrToObj } from "../../../utils/utils"
function DefaultItem(yarnName, yarnBrandBatch, rate, knitWastage, planWeight) {
    this.yarnName = yarnName;
    this.yarnBrandBatch = yarnBrandBatch;
    this.rate = rate;
    this.knitWastage = knitWastage;
    this.planWeight = planWeight;
}
function AddYarnInfo(props) {
    const [refresh, setRefresh] = useState(false);
    const [tableHead, settableHead] = useState([
        {
            title: '纱支',
            dataIndex: 'yarnName',
        },
        {
            title: '批次',
            dataIndex: 'yarnBrandBatch',
        },
        {
            title: '比例',
            dataIndex: 'rate',
        },
        {
            title: '损耗',
            dataIndex: 'knitWastage',
        },
        {
            title: '计划用量',
            dataIndex: 'planWeight',
        }]); //表头
    const [addIndex, setaddIndex] = useState(2); // 数组新增元素的位置
    const [tableBody, settableBody] = useState([]);
    const [addRow, setaddRow] = useState([1, 2, 3, 4, 5]);
    const [mouseEnterRow, setmouseEnterRow] = useState();
    // const [defaultItem, setDefaultItem] = useState({
    //     yarnName: "yarnName",
    //     yarnBrandBatch: "yarnBrandBatch",
    //     // yarnBrandBatch2 = yarnBrandBatch2,
    //     // yarnBrandBatch3 = yarnBrandBatch3,
    //     // yarnBrandBatch4 = yarnBrandBatch4,
    //     // yarnBrandBatch5 = yarnBrandBatch5,
    //     rate: "rate",
    //     knitWastage: "knitWastage",
    //     planWeight: "planWeight",
    // });
    const [defaultItem, setDefaultItem] = useState(["", "", "", "", ""]);

    // props.saveValue(90); // 向父组件传递参数

    useEffect(() => {
        refresh && setTimeout(() => setRefresh(false))
    }, [refresh])
    // 添加批次
    const addHead = () => {
        const _tableHead = tableHead;
        const _addRow = addRow;
        const _tableBody = [...tableBody];
        const _defaultArr = Object.keys(defaultItem);
        if (addIndex > 5) { message.success("最多只能添加5组纱批"); return; }
        _tableHead.splice(addIndex, 0, {
            title: '批次' + addIndex,
            dataIndex: 'yarnBrandBatch' + addIndex,
        });
        _defaultArr.splice(addIndex, 0, 'yarnBrandBatch' + addIndex)
        console.log(arrToObj(_defaultArr))
        _tableBody.map((item) => {
            for (const key in item) {
                if (key == 'yarnBrandBatch' + addIndex) {
                    item[key] = item.yarnBrandBatch
                }
            }
        })
        _addRow.splice(addIndex, 0, 1)
        setDefaultItem(arrToObj(_defaultArr))
        settableHead(_tableHead);
        setaddRow(_addRow);
        setaddIndex(addIndex + 1);
    }
    // 删除批次
    const subHead = (item, index) => {
        const _tableHead = tableHead;
        const _addRow = addRow;
        const _tableBody = [...tableBody];
        const _defaultArr = Object.keys(defaultItem);
        console.log(_defaultArr)
        _tableHead.splice(addIndex - 1, 1);
        _addRow.splice(addIndex - 1, 1);
        _defaultArr.splice(addIndex - 2, 1);
        settableHead(_tableHead);
        setaddRow(_addRow);

        // settableBody([..._tableBody]);
        setDefaultItem(arrToObj(_defaultArr))
        setRefresh(true);
        if ((addIndex - 1) < 2) {
            setaddIndex(2);
        } else { setaddIndex(addIndex - 1); }

    }
    // 新增行
    const addRowBtn = () => {
        const tableRow = tableBody;
        const _defaultItem = new Object({
            yarnName: "",
            yarnBrandBatch: "",
            rate: "",
            knitWastage: "",
            planWeight: ""
        })
        tableRow.push(_defaultItem);
        settableBody(tableRow);
        setRefresh(true);
    }
    // 鼠标移入行的操作
    const mouseEnter = (index) => {
        setmouseEnterRow(index)
    }

    // 行的删除操作
    const delectedRow = (index) => {
        const _tableBody = [...tableBody];
        _tableBody.splice(index, 1)
        settableBody(_tableBody)
    }
    /**
     * 编辑行的每一列
     * @param {*} index  行的下标
     * @param {*} inds  列的下标
     */
    const editCel = (index, inds, value, name) => {
        console.log("行==", index, "列==", inds, "字段==", name, "值==", value);
        const _tableBody = [...tableBody];
        console.log(_tableBody);
        // 编辑纱支
        if (inds === 0) {
            _tableBody[index].yarnName = value;
        }

        // 编辑批次1
        if (inds === 1) {
            _tableBody[index].yarnBrandBatch = value;
        }
        // 编辑比例
        if (inds === 2) {
            if (!verify_value(value)) return;
            let totalRate = _tableBody.map((item) => {
                console.log(item)
                return item.rate;
            })
            if (totalRate > 100) {
                message.warning("纱比例总和只能等于100%");
                return
            }
            console.log("==", _tableBody[index]);
            console.log(_tableBody[index].rate = value)
            _tableBody[index].rate = value;
            // _tableBody[index].planWeight = (parseFloat(props.weight * value / 100)).toFixed(2);
        }
        // 编辑损耗
        if (inds === 3) {
            if (!verify_value(value)) return;
            _tableBody[index].knitWastage = value;
            console.log(props.weight)
            // console.log(_tableBody[index].rate / 100)
            // console.log(value / 100)
            // const _rate = parseFloat(_tableBody[index].rate / 100);
            // const _loss = parseFloat(value / 100);
            // console.log(parseFloat(props.weight) * _rate * (1 + _loss))
            // _tableBody[index].planWeight = (parseFloat(props.weight) * _rate * (1 + _loss)).toFixed(2);
        }
    }
    return <React.Fragment>
        <span>用料信息<PlusCircleOutlined onClick={addRowBtn} style={{ color: "#2db7f5", marginLeft: "10px" }} /></span>
        <div className="tableHead">
            {
                tableHead.map((item, key) => {
                    if (item.dataIndex === "yarnBrandBatch2" || item.dataIndex === "yarnBrandBatch3" || item.dataIndex === "yarnBrandBatch4" || item.dataIndex === "yarnBrandBatch5") {
                        return <div className="table-td" key={key}>{item.title}<MinusCircleOutlined onClick={() => {
                            subHead(item, key);
                        }} style={{ color: "#2db7f5" }} /></div>
                    }
                    if (item.dataIndex === "yarnBrandBatch") {
                        return <div className="table-td" key={key}>{item.title}
                            {/* <PlusCircleOutlined onClick={addHead} style={{ color: "#2db7f5" }} /> */}
                        </div>
                    } else {
                        return <div className="table-td" key={key}>{item.title}</div>
                    }
                })
            }
        </div>
        <div className="tableBody" onMouseLeave={() => { setmouseEnterRow(-1) }}>
            {
                tableBody.map((items, keys) => {
                    return <div className="table-tr" key={keys} onMouseEnter={() => { mouseEnter(keys) }}>
                        <div className="delect-icon">
                            {mouseEnterRow == keys && <CloseOutlined onClick={() => { delectedRow(keys) }} />}
                        </div>
                        {
                            addRow.map((ites, inds) => {
                                const str = [];
                                Object.keys(items).forEach((key, index) => {
                                    if (inds === index) {
                                        str.push(<div className="table-cel" key={inds}>
                                            {
                                                inds === addRow.length - 1 ? <input name="planWeight" disabled value={items[key]} /> : <Input name={key} onChange={(e) => {
                                                    editCel(keys, inds, e.target.value, e.target.name)
                                                }} />
                                            }
                                        </div>)
                                    }
                                })
                                return str
                            })
                        }
                    </div>
                })
            }
        </div>
    </React.Fragment>
}

export default AddYarnInfo