/*
 * @FileName: 
 * @Author: 1638877065@qq.com
 * @Date: 2021-06-10 21:55:30
 * @LastEditors: 1638877065@qq.com
 * @LastEditTime: 2021-06-23 00:48:50
 * @FilePath: \cloud-admin\src\views\production\order\addYarnInfo.jsx
 * @Description: 
 */
import React, { useState, useEffect } from "react";
import { PlusCircleOutlined, MinusCircleOutlined, CloseOutlined } from '@ant-design/icons';
import { message } from "antd";
import { verify_value, arrToObj } from "../../../utils/utils"
function DefaultItem(yarnName, yarnBrandBatch, rate, knitWastage, planWeight) {

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
    const [defaultItem, setDefaultItem] = useState({
        yarnName: "yarnName",
        yarnBrandBatch: "yarnBrandBatch",
        // yarnBrandBatch2 = yarnBrandBatch2,
        // yarnBrandBatch3 = yarnBrandBatch3,
        // yarnBrandBatch4 = yarnBrandBatch4,
        // yarnBrandBatch5 = yarnBrandBatch5,
        rate: "rate",
        knitWastage: "knitWastage",
        planWeight: "planWeight",
    });

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
        const newTableBody = _tableBody.map((item) => {
            item.yarnName = 
            // const _arr = Object.keys(item);
            // _arr.splice(addIndex, 1);
            // return arrToObj(_arr)
            // return arrToObj(_defaultArr)
        })
        settableBody([..._tableBody]);
        console.log(_tableBody)
        setDefaultItem(arrToObj(_defaultArr))
        setRefresh(true);
        if ((addIndex - 1) < 2) {
            setaddIndex(2);
        } else { setaddIndex(addIndex - 1); }

    }
    // 新增行
    const addRowBtn = () => {
        const tableRow = tableBody;
        const _defaultItem = new Object(defaultItem)
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
    const editCel = (index, inds, value) => {
        console.log("行==", index, "列==", inds)
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

        if (tableHead.length === 5) {
            // 编辑比例
            if (inds === 2) {
                if (!verify_value(value)) return;
                _tableBody[index].rate = value;
                _tableBody[index].planWeight = (parseFloat(props.weight) * _tableBody[index].rate / 100).toFixed(2);
            }
            // 编辑损耗
            if (inds === 3) {
                if (!verify_value(value)) return;
                _tableBody[index].knitWastage = value;
                _tableBody[index].planWeight = (parseFloat(props.weight) * _tableBody[index].rate * (1 + value) / 10000).toFixed(2);
            }
        }

        if (tableHead.length === 6) {
            // 编辑比例
            if (inds === 3) {
                _tableBody[index].rate = value;
            }
            // 编辑损耗
            if (inds === 4) {
                _tableBody[index].knitWastage = value;
            }

        }
        if (tableHead.length === 7) {
            // 编辑比例
            if (inds === 4) {
                _tableBody[index].rate = value;
            }
            // 编辑损耗
            if (inds === 5) {
                _tableBody[index].knitWastage = value;
            }

        }
        if (tableHead.length === 8) {
            // 编辑比例
            if (inds === 5) {
                _tableBody[index].rate = value;
            }
            // 编辑损耗
            if (inds === 6) {
                _tableBody[index].knitWastage = value;
            }

        }
        if (tableHead.length === 9) {
            // 编辑比例
            if (inds === 6) {
                _tableBody[index].rate = value;
            }
            // 编辑损耗
            if (inds === 7) {
                _tableBody[index].knitWastage = value;
            }

        }
        // 编辑批次2
        if (inds === 2 && tableHead.length >= 6) {
            _tableBody[index].yarnBrandBatch2 = value;
        }

        // 编辑批次3
        if (inds === 3 && tableHead.length >= 7) {
            _tableBody[index].yarnBrandBatch3 = value;
        }

        // 编辑批次4
        if (inds === 4 && tableHead.length >= 8) {
            _tableBody[index].yarnBrandBatch4 = value;
        }
        // 编辑批次5
        if (inds === 5 && tableHead.length >= 9) {
            _tableBody[index].yarnBrandBatch5 = value;
        }

    }
    return <React.Fragment>
        <span>用料信息<PlusCircleOutlined onClick={addRowBtn} style={{ color: "#2db7f5" }} /></span>
        <div className="tableHead">
            {
                tableHead.map((item, key) => {
                    if (item.dataIndex === "yarnBrandBatch2" || item.dataIndex === "yarnBrandBatch3" || item.dataIndex === "yarnBrandBatch4" || item.dataIndex === "yarnBrandBatch5") {
                        return <div className="table-td" key={key}>{item.title}<MinusCircleOutlined onClick={() => {
                            subHead(item, key);
                        }} style={{ color: "#2db7f5" }} /></div>
                    }
                    if (item.dataIndex === "yarnBrandBatch") {
                        return <div className="table-td" key={key}>{item.title}<PlusCircleOutlined onClick={addHead} style={{ color: "#2db7f5" }} /></div>
                    } else {
                        return <div className="table-td" key={key}>{item.title}</div>
                    }
                })
            }
        </div>
        <div className="tableBody" onMouseLeave={() => { setmouseEnterRow(-1) }}>
            {
                tableBody.map((items, keys) => {
                    // 根据key的大小判断添加多少条数据
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
                                                inds === addRow.length - 1 ? <input name="planWeight" disabled placeholder={keys + "??=" + inds} value={items[key]} /> : <input name={key} defaultValue={items[key]} onChange={(e) => {
                                                    console.log(e.target.name)
                                                    editCel(keys, inds, e.target.value)
                                                }} placeholder={keys + "??=" + inds} />
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