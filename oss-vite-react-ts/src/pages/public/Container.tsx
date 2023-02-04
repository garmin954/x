import React from 'react'
import { Layout, Menu, Breadcrumb } from "antd";
import AsyncReoute from '@/router'
import AuthMenu from "@/pages/public/AuthMenu";
import { Outlet } from 'react-router-dom';

export default function Container() {
    return (
        <Layout>
            <Layout.Header>
                <div className="logo" />
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']} items={[]} />
            </Layout.Header>
            <Layout>
                <Layout.Sider>
                    <AuthMenu />
                </Layout.Sider>
                <Layout style={{ padding: '0 24px 24px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item>List</Breadcrumb.Item>
                        <Breadcrumb.Item>App</Breadcrumb.Item>
                    </Breadcrumb>
                    <Layout.Content
                        style={{
                            padding: 24,
                            margin: 0,
                            minHeight: 280,
                            backgroundColor: '#fff'
                        }}
                    >
                        <Outlet />
                    </Layout.Content>
                </Layout>
            </Layout>
        </Layout>
    )
}
