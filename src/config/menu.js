/*
 * @Author       : duxinyue
 * @Date         : 2021-04-27 11:33:02
 * @LastEditors: yongyuan at <yongyuan253015@gmail.com>
 * @LastEditTime: 2021-07-17 21:47:53
 * @FilePath: \works_space\src\config\menu.js
 */
export const menus = [
    // 菜单相关路由
    { key: '/app/dashboard/index', title: '首页', icon: 'mobile', component: 'Home' },
    { key: '/app/editor', title: '富文本', icon: 'mobile', component: 'Editor' },
    {
        key: '#',
        title: '菜单',
        icon: 'scan',
        subs: [
            {
                key: '/app/ebgsjd/ui',
                title: '菜单1',
                icon: 'scan',
                component: 'Menue1',
            }
        ]
    },
    { key: '/app/editor32', title: '富文本23', icon: 'mobile', component: 'Menue1' },

]