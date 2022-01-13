/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 *
 * @see You can view component api by: https://github.com/ant-design/ant-design-pro-layout
 */
import RightContent from '@/components/GlobalHeader/RightContent';
import SearchMenu from '@/components/SearchMenu';
import Authorized from '@/utils/Authorized';
import ProLayout from '@ant-design/pro-layout';
import { getMatchMenu } from '@umijs/route-utils';
import { Button, Result } from 'antd';
import React, { useMemo, useRef } from 'react';
import { connect, history, Link, useIntl } from 'umi';
import logo from '../assets/pro_logo.svg';
import './BasicLayout.less';

const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);

/** Use Authorized check all menu item */
const menuDataRender = (menuList) =>
  menuList.map((item) => {
    const localItem = {
      ...item,
      children: item.children ? menuDataRender(item.children) : undefined,
    };
    return Authorized.check(item.authority, localItem, null);
  });

const BasicLayout = (props) => {
  const {
    dispatch,
    children,
    settings,
    collapsed,
    location = {
      pathname: '/',
    },
  } = props;
  const menuDataRef = useRef([]);
  /** Init variables */

  const authorized = useMemo(
    () =>
      getMatchMenu(location.pathname || '/', menuDataRef.current).pop() || {
        authority: undefined,
      },
    [location.pathname],
  );

  const handleMenuCollapse = (payload) => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  }; // get children authority

  const { formatMessage } = useIntl();

  return (
    <ProLayout
      logo={collapsed ? null : logo}
      // logo={logo}
      formatMessage={formatMessage}
      {...props}
      {...settings}
      // disableMobile
      /**
       *  Menu
       * */
      siderWidth={300}
      onCollapse={handleMenuCollapse}
      // collapsedButtonRender={false}
      onMenuHeaderClick={() => history.push('/')}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (
          menuItemProps.isUrl ||
          !menuItemProps.path ||
          location.pathname === menuItemProps.path
        ) {
          return defaultDom;
        }
        if (['/upload-config', '/dashboard'].includes(menuItemProps.path))
          return <Link to={menuItemProps.path}>{defaultDom}</Link>;
        return <div>{defaultDom}</div>;
      }}
      menuDataRender={menuDataRender}
      /**
       * Header
       */
      fixedHeader={true}
      headerHeight={70}
      // headerContentRender={({ breadcrumb, matchMenuKeys }) => {
      headerContentRender={() => {
        // return <div className="leftHeader heading-4">{breadcrumb[matchMenuKeys[0]]?.name}</div>;
        return <div className="leftHeader heading-4">SIT Profile Analyzer </div>;
      }}
      rightContentRender={() => <RightContent />}
      postMenuData={(menuData) => {
        menuDataRef.current = menuData || [];
        return menuData || [];
      }}
      menuHeaderRender={(logoImg, _title) => {
        return (
          <>
            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              {logoImg}
              {!collapsed && <SearchMenu />}
            </div>
          </>
        );
      }}
    >
      <Authorized authority={authorized.authority} noMatch={noMatch}>
        <div className="custom-layout">{children}</div>
      </Authorized>
    </ProLayout>
  );
};

export default connect(({ global, settings }) => ({
  collapsed: global.collapsed,
  settings,
}))(BasicLayout);
