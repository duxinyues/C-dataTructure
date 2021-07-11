/*
 * @Author       : duxinyue
 * @Date         : 2021-04-28 11:02:51
 * @LastEditors  : duxinyue
 * @LastEditTime : 2021-04-28 14:10:23
 * @FilePath     : \app1\src\components\pages\editor\editor.js
 */
import React from 'react'
// 引入编辑器组件
import BraftEditor from 'braft-editor'

import CodeHighlighter from "braft-extensions/dist/code-highlighter"
// 引入编辑器样式
import 'braft-editor/dist/index.css'
import 'braft-extensions/dist/code-highlighter.css'
import "../../../style/css/style.css"
BraftEditor.use(CodeHighlighter({
  includeEditors: ['editor-with-code-highlighter'],
}))
export default class Editor extends React.Component {
  state = {
    editorState: BraftEditor.createEditorState(),
    defualtContent: "<div></div>"
  }
  async componentDidMount() {
    // 假设此处从服务端获取html格式的编辑器内容
    // const htmlContent = await fetchEditorContent()
    // 使用BraftEditor.createEditorState将html字符串转换为编辑器需要的editorStat
    const sss = BraftEditor.createEditorState("");
    console.log(sss)
    this.setState({
      editorState: BraftEditor.createEditorState()
    })
  }

  submitContent = async () => {
    // 在编辑器获得焦点时按下ctrl+s会执行此方法
    // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
    // const htmlContent = this.state.editorState.toHTML();
    // this.setState({
    //   defualtContent:htmlContent
    // })
  }

  handleEditorChange = (editorState) => {
      console.log(56789)
    const htmlContent = editorState.toHTML();
    console.log(htmlContent)
    this.setState({
      editorState,
      defualtContent: htmlContent
    })
  }

  render() {
    const { editorState, defualtContent } = this.state;
    return (
      <div className="editor-content">
        <div className="my-component">
          <BraftEditor
          className="yyyy"
            value={editorState}
            onChange={this.handleEditorChange}
            onSave={this.submitContent}
          />
        </div>
        <div className="review"  dangerouslySetInnerHTML = {{ __html:defualtContent }}></div>
      </div>
    )
  }
}