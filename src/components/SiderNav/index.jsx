import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { connect } from "react-redux";
import { requestUrl } from "../../utils/config";
import { USER_INFO } from "../../actons/type";
import './index.css';
const { Sider } = Layout;
const { SubMenu } = Menu;
function SiderNav(props) {
    console.log("Nav==", props)
    const [collapsed, setcollapsed] = useState(false);
    const [menus, setmenus] = useState([])
    useEffect(() => {
        fetch(requestUrl + "/api-user/user/findById?id=1", {
            method: "POST",
            headers: {
                "Authorization": "bearer " + localStorage.getItem("access_token")
            },
        }).then(res => {
            return res.json()
        }).then((res) => {
            if (res.code == 200) {
                console.log("菜单==", res)
                setmenus(res.data.menus);
                props.userData(res.data)
            }
        }).catch((err) => {
            console.log(err)
        })
    }, [])
    const renderMenus = (menu,key) => {
        if (menu.children) {
            return <SubMenu key={key} title={
                <span>
                    <span>{menu.name}</span>
                </span>}>
                {
                    menu.children.map((item,key) => {
                        return renderMenus(item,key)
                    })
                }
            </SubMenu>
        } else {
            return <Menu.Item key={menu.id}>
                <Link to={menu.path}>
                    <span className="navTitle">
                        {menu.name}
                    </span>
                </Link>
            </Menu.Item>
        }
    }
    return (
        <Sider
            breakpoint="lg"
            collapsedWidth="80"
            onBreakpoint={broken => {
                console.log(broken);
            }}
            onCollapse={(collapsed, type) => {
                console.log(collapsed, type);
            }}
        >
            <div className="logoIcon">
                {/* <img src={Logo} alt="system" className="Icon" /> */}
                <span className="title">logo</span>
            </div>
            <Menu
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1', 'sub2']}
                mode="inline"
                theme="dark"
                collapsed={collapsed.toString()}
            >
                {
                    menus.map((item, key) => {
                        return renderMenus(item, key)
                    })
                }
            </Menu>
        </Sider>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        userData: (item) => {
            dispatch({
                type: USER_INFO,
                userData: item
            })
        }
    }
}
export default connect(null, mapDispatchToProps)(SiderNav)