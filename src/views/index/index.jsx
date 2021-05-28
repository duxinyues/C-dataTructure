import React, { Component } from 'react';
import zhCN from 'antd/es/locale/zh_CN';
import { Layout, ConfigProvider } from 'antd';
import ContentMain from '../../components/ContentMain';
import SiderNav from '../../components/SiderNav';
import Avatar from '../Avatar'
import './index.css';
const { Header, Content } = Layout;
export default function Index() {
    return (
        <Layout>
            <ConfigProvider locale={zhCN}>
                <SiderNav />
                <Layout>
                    <Header style={{ background: '#fff', padding: 0, textAlign: "right" }} >
                        <Avatar />
                    </Header>
                    <Content style={{ margin: '16px' }}>
                        <ContentMain />
                    </Content>
                </Layout>
            </ConfigProvider>
        </Layout>
    );
}