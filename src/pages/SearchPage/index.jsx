import PageLoading from '@/components/PageLoading';
import { SEARCH_CASE } from '@/utils/constant';
import { PageContainer } from '@ant-design/pro-layout';
import queryString from 'query-string';
import React, { useEffect } from 'react';
import { connect, history, Link } from 'umi';
import styles from './index.less';

const SearchPage = (props) => {
  const { loading, searchResult, dispatch } = props;
  const {
    location: {
      query: { q = '' },
    },
  } = history;
  useEffect(() => {
    dispatch({
      type: 'search/search',
      payload: { q },
    });
  }, [q]);

  const _renderLink = ({ type, data }) => {
    let title = '';
    const link = `/search-detail?${queryString.stringify({ type, data: JSON.stringify(data) })}`;
    switch (type) {
      case SEARCH_CASE.SEARCH_CASE_1:
        title = `Customer: ${data}`;
        break;
      case SEARCH_CASE.SEARCH_CASE_2:
        title = `Features: ${data.join(' and ')}`;
        break;
      case SEARCH_CASE.SEARCH_CASE_3:
        title = `Customer: ${data.customer} + Features: ${data.features.join(' and ')}`;
        break;
      case SEARCH_CASE.SEARCH_CASE_4:
        if (data.length === 1) {
          title = `Features negation: !${data[0]}`;
        } else {
          title = `Features negation: !(${data.join(' and ')})`;
        }
        break;
      case SEARCH_CASE.SEARCH_CASE_5:
        title = `Features: ${data.join(' xor ')}`;
        break;
      case SEARCH_CASE.SEARCH_CASE_6:
        title = `Scale search: ${data
          .map(({ name = '', value = 0, operator = '' }) => `${name} ${operator} ${value}`)
          .join(' and ')}`;
        break;
      case SEARCH_CASE.SEARCH_CASE_7:
        title = `Feature and feature count: ${data.features.join(' and ')} and ${data.conditions
          .map(({ name = '', value = 0, operator = '' }) => `${name} ${operator} ${value}`)
          .join(' and ')}`;
        break;
      default:
        break;
    }
    return (
      <div style={{ marginTop: '10px' }}>
        <Link to={link}>{title}</Link>
      </div>
    );
  };

  if (loading) {
    return <PageLoading />;
  }
  if (searchResult.length === 0) {
    return (
      <PageContainer>
        <div
          className={`card ${styles.searchPage__customerList}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '200px',
          }}
        >
          <h2 style={{ color: 'gray', fontWeight: 'bold' }}>Keyword {q} did not match any data</h2>
        </div>
      </PageContainer>
    );
  }
  return (
    <PageContainer>
      <div className={`card`}>
        <p>
          About {searchResult.length} results for keyword {q}
        </p>
        <div>{searchResult.map((item) => _renderLink(item))}</div>
      </div>
    </PageContainer>
  );
};

export default connect(({ loading, search: { searchResult = [] } }) => ({
  loading: loading.effects['search/search'],
  searchResult,
}))(React.memo(SearchPage));
