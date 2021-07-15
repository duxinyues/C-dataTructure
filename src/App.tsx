/*
 * @Author: yongyuan at <yongyuan253015@gmail.com>
 * @Date: 2021-07-14 23:56:38
 * @LastEditTime: 2021-07-15 23:27:41
 * @LastEditors: yongyuan at <yongyuan253015@gmail.com>
 * @Description: 
 * @FilePath: \works_space\src\App.tsx
 * 
 */

import React, { useState, useEffect } from 'react';
import { Layout, notification } from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
} from '@ant-design/icons';
import SiderCustom from "./components/sliderMenu";
const { Header, Sider, Content } = Layout;

function App() {
    const [collapsed, setcollapsed] = useState(false);
    const toggle = () => {
        setcollapsed(!collapsed)
    };
    return <Layout>
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
                右侧区域
                {/* <ContentRouter auth="auth" /> */}
            </Content>
        </Layout>
    </Layout>
}

export default App