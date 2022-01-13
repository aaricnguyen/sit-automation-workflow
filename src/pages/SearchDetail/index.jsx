import PageLoading from '@/components/PageLoading';
import { SEARCH_CASE } from '@/utils/constant';
import { LeftCircleOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect } from 'react';
import { connect, history } from 'umi';
import ExternalCustomerSearch from './ExternalCustomerSearch';
import FeatureAndCustomerCombination from './FeatureAndCustomerCombination';
import FeatureSearch from './FeatureSearch';
import style from './index.less';
import InternalCustomerSearch from './InternalCustomerSearch';
import ScaleSearch from './ScaleSearch';
import XorFeatureSearch from './XorFeatureSearch';
import NegativeFeatureSearch from './NegativeFeatureSearch';
import FeatureAndFeatureCountSearch from './FeatureAndFeatureCountSearch';

const SearchPage = (props) => {
  const { loading, searchDetail, dispatch } = props;
  const {
    location: {
      query: { data = '', type },
    },
  } = history;

  useEffect(() => {
    dispatch({
      type: 'search/getSearchDataDetail',
      payload: { type, data },
    });
    return () => {
      dispatch({
        type: 'search/save',
        payload: { searchDetail: {} },
      });
    };
  }, [data, type]);

  const _renderDetail = () => {
    switch (type) {
      case SEARCH_CASE.SEARCH_CASE_1:
        if (Number.isNaN(parseInt(JSON.parse(data), 10))) {
          return <InternalCustomerSearch searchDetail={searchDetail} />;
        }
        return <ExternalCustomerSearch searchDetail={searchDetail} />;
      case SEARCH_CASE.SEARCH_CASE_2:
        return <FeatureSearch searchDetail={searchDetail} />;
      case SEARCH_CASE.SEARCH_CASE_3:
        return <FeatureAndCustomerCombination searchDetail={searchDetail} />;
        case SEARCH_CASE.SEARCH_CASE_4:
          return <NegativeFeatureSearch searchDetail={searchDetail} />;
      case SEARCH_CASE.SEARCH_CASE_5:
        return <XorFeatureSearch searchDetail={searchDetail} />;
      case SEARCH_CASE.SEARCH_CASE_6:
        return <ScaleSearch searchDetail={searchDetail} />;
      case SEARCH_CASE.SEARCH_CASE_7:
        return <FeatureAndFeatureCountSearch searchDetail={searchDetail} />;
      default:
        return null;
    }
  };

  if (loading) {
    return <PageLoading />;
  }
  return (
    <PageContainer className={style.searchDetail}>
      <div onClick={() => history.goBack()} className={style.goBack}>
        <LeftCircleOutlined /> Go back
      </div>
      <div>{_renderDetail()}</div>
    </PageContainer>
  );
};

export default connect(({ loading, search: { searchDetail = [] } }) => ({
  loading: loading.effects['search/search'],
  searchDetail,
}))(React.memo(SearchPage));
