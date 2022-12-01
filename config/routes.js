export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/login',
        component: '../layouts/AuthLayout',
        routes: [
          {
            name: 'login',
            path: '/login',
            component: './Login',
          },
        ],
      },
      {
        path: '/',
        component: '../layouts/SecurityLayout',
        routes: [
          {
            path: '/',
            component: '../layouts/BasicLayout',
            authority: ['admin', 'user'],
            routes: [
              {
                path: '/',
                redirect: '/dashboard',
              },
              {
                path: '/dashboard',
                name: 'Dashboard',
                icon: '/assets/icons/dashboard.svg',
                component: './Dashboard',
              },
              {
                path: '/global25',
                name: 'Global Insights',
                icon: '/assets/icons/manage-users.svg',
                component: './Global25',
              },
              {
                path: '/upload-config',
                name: 'Upload configuration file',
                icon: '/assets/icons/add-device.svg',
                component: './UploadConfig',
                authority: ['admin', 'sitEngineer', 'tacEngineer'],
              },
              {
                path: '/automation-workflow',
                name: 'Automation workflow',
                icon: '/assets/icons/add-device.svg',
                component: './AutomationWorkflow',
                hideInMenu: true,
              },
              {
                path: '/configs',
                name: 'Configs',
                icon: '/assets/icons/service-monitor.svg',
                component: './Dashboard',
                hideInMenu: true,
              },
              {
                path: '/internal-sit-profiles',
                name: 'Internal SIT Profiles',
                icon: '/assets/icons/device-controller.svg',
                component: './Dashboard',
                hideInMenu: true,
              },
              {
                path: '/admin',
                name: 'Admin',
                authority: ['admin'],
                icon: '/assets/icons/manage-users.svg',
                routes: [
                  {
                    path: '/admin/upload-template',
                    name: 'Upload Template Insight',
                    component: './Admin/UploadTemplate',
                  },
                ],
              },
              {
                path: '/search',
                name: 'Search Customer',
                icon: '/assets/icons/manage-users.svg',
                component: './SearchPage',
                hideInMenu: true,
              },
              {
                path: '/search-detail',
                name: 'Search Detail',
                icon: '/assets/icons/manage-users.svg',
                component: './SearchDetail',
                hideInMenu: true,
              },
              {
                path: '/search-detail',
                name: 'Search Detail',
                icon: '/assets/icons/manage-users.svg',
                component: './SearchDetail',
                hideInMenu: true,
              },
              {
                component: './404',
              },
            ],
          },
          {
            component: './404',
          },
        ],
      },
    ],
  },
  {
    component: './404',
  },
];
