/*
 * @FileName: 
 * @Author: duxinyue
 * @Date: 2021-04-27 11:40:23
 * @LastEditors: yongyuan at <yongyuan253015@gmail.com>
 * @LastEditTime: 2021-07-17 21:51:11
 * @FilePath: \works_space\src\components\sliderMenu.js
 * @Description: 
 */
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import { menus } from "../config/menu"
function Slider() {
    const renderSubMenu = (item) => {
        return (
            <Menu.SubMenu
                key={item.key}
                title={
                    <span>
                        <span className="nav-text">{item.title}</span>
                    </span>
                }
            >
                {item.subs.map((sub) => (sub.subs ? renderSubMenu(sub) : renderMenuItem(sub)))}
            </Menu.SubMenu>
        );
    }
    const renderMenuItem = (item) => {
        return <Menu.Item key={item.key}>
            <Link to={item.key}>
                <span className="nav-text">{item.title}</span>
            </Link>
        </Menu.Item>
    }
    return  <div >
                {menus.map((item) => {
                                return  <Menu mode="inline" key={item.key} >
                                            {item.subs
                                                ? renderSubMenu(item)
                                                : renderMenuItem(item)}
                                        </Menu>
                            }) 
                }
            </div>
           
};

export default Slider