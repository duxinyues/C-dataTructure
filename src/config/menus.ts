export const menus = [
    // 菜单相关路由
    { key: '/app/dashboard/index', title: '首页', icon: 'mobile', component: 'Home' },
    { key: '/app/editor', title: '富文本', icon: 'mobile', component: 'Editor' },
    {
        key: '/app/ui',
        title: '菜单',
        icon: 'scan',
        component: 'Menue1'
    },
    {
        key: '/app/charts',
        title: '图表',
        icon: 'scan',
        subs: []
    }
]