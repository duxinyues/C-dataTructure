import React, { Component } from 'react';
import { Layout } from 'antd';
import ContentMain from '../../components/ContentMain';
import SiderNav from '../../components/SiderNav';
import Avatar from '../Avatar'
import './index.css';
const { Header, Content, Footer } = Layout;
export default class Index extends Component {
    render() {
        return (
            <Layout>
                <SiderNav />
                <Layout>
                    <Header style={{ background: '#fff', padding: 0, textAlign: "right" }} >
                        <Avatar />
                    </Header>
                    <Content style={{ margin: '16px' }}>
                        <ContentMain />
                    </Content>
                </Layout>
            </Layout>
        );
    }
}