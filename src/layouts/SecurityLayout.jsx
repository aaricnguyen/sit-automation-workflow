// import { PageLoading } from '@ant-design/pro-layout';
import React from 'react';
import {
  connect,
  // Redirect
} from 'umi';
import { getToken } from '../utils/token';

class SecurityLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
    };
  }

  componentDidMount() {
    this.setState({
      isReady: true,
    });
    const token = getToken();
    const { dispatch } = this.props;

    if (dispatch && token) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
  }

  render() {
    const { children } = this.props;
    // const { isReady } = this.state;
    // const { children, loading, currentUser } = this.props;
    // // const isLogin = currentUser && currentUser.sub;
    // const isLogin = currentUser && currentUser.username;

    // if ((!isLogin && loading) || !isReady) {
    //   return <PageLoading />;
    // }

    // if (!isLogin && window.location.pathname !== '/login') {
    //   return <Redirect to="/login" />;
    // }

    return children;
  }
}

export default connect(({ user, loading }) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
}))(SecurityLayout);
