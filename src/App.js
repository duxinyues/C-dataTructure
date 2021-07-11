/*
 * @Author       : duxinyue
 * @Date         : 2021-04-27 09:31:03
 * @LastEditors  : duxinyue
 * @LastEditTime : 2021-04-28 10:40:45
 * @FilePath     : \app1\src\App.js
 */
import React, { useState } from "react"
import { Layout } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';
import SiderCustom from "./components/sliderMenu";
import ContentRouter  from "./config/route"
import "./App.css"
const { Header, Sider, Content } = Layout;
function App() {
  const [collapsed, setcollapsed] = useState(false);
  const toggle = () => {
    setcollapsed(!collapsed)
  };
  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <SiderCustom />
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: toggle,
          })}
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,

          }}
        >
          <ContentRouter auth="auth" />
        </Content>
      </Layout>
    </Layout>
  );
}

export default App