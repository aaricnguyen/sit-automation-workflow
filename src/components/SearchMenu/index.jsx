import { SearchOutlined } from '@ant-design/icons';
import { AutoComplete } from 'antd';
import { debounce } from 'lodash';
import React, { useState } from 'react';
import { connect, history } from 'umi';

const featureCount = [
  'up_count',
  'access_ports_count',
  'trunk_ports_count',
  'l3_ports_count',
  'up_tunnel_count',
  'loopback_count',
  'ipv6_ports_count',
  'pim_ports_count',
  'pimv6_ports_count',
  'dot1q_ports_count',
  'policy_map_count',
  'class_map_count',
  'span_count',
  'acl_count',
  'v6acl_count',
  'macacl_count',
  'static_route_count',
  'bfd_count',
  'l2_po_count',
  'l3_po_count',
  'ipv6_count',
  'qos_count',
  'psec_count',
  'dot1x_count',
  'mab_count',
  'webauth_count',
  'svi_count',
  'vrf_count',
  'ospf_count',
  'eigrp_count',
  'bgp_count',
  'rip_count',
  'ospf_peer_count',
  'eigrp_peer_count',
  'rip_peer_count',
  'bgp_peer_count',
  'isis_peer_count',
  'flow_mon_count',
  'flow_rec_count',
  'flow_exp_count',
  'mac',
];

const comparisonOperator = ['<', '>', '!=', '>=', '<='];

const SearchMenu = (props) => {
  const {
    location: {
      query: { q = '' },
    },
  } = history;

  const {
    // loading,
    suggestions,
    dispatch,
  } = props;

  const [keywordSearch, setKeywordSearch] = useState(q);

  const onSelect = (data) => {
    const splitData = data.split(' ');
    if (splitData.length === 1) {
      setKeywordSearch((prev) => {
        const oldSplitData = prev.split(' ');
        if (oldSplitData.length === 1) return data;
        return `${oldSplitData.slice(0, oldSplitData.length - 1).join(' ')} ${data}`;
      });
    } else {
      setKeywordSearch(data);
    }
  };
  const onChange = (data) => {
    let isSyntax = false;
    const splitData = data.split(' ');
    let newSuggestions = [];
    if (splitData.length > 1) {
      const checkData = splitData[splitData.length - 2];
      const keyWord = splitData[splitData.length - 1];
      if (featureCount.includes(checkData)) {
        // comparisonOperator
        isSyntax = true;
        newSuggestions = [...comparisonOperator]
          .filter((item) => item.includes(keyWord))
          .map((item) => ({
            value: `${splitData.slice(0, splitData.length - 1).join(' ')} ${item}`,
          }));
      } else if (comparisonOperator.includes(checkData)) {
        isSyntax = true;
        newSuggestions = [{ value: `${splitData.slice(0, splitData.length - 1).join(' ')} 100` }];
      }
    }

    if (isSyntax) {
      dispatch({
        type: 'search/save',
        payload: {
          suggestions: newSuggestions,
        },
      });
    } else {
      dispatch({
        type: 'search/getSuggestions',
        payload: {
          q: data,
        },
      });
    }
  };

  const handleSearch = (e) => {
    const keyword = e.target.value;
    if (!keyword) return;
    if (e.key === 'key' || e.keyCode === 13) history.push(`/search?q=${keyword.replace("+","%2B")}`);
  };

  return (
    <div style={{ marginTop: '25px' }} onClick={(e) => e.stopPropagation()}>
      {/* <Input suffix={<SearchOutlined />} defaultValue={q} onKeyUp={(e) => handleSearch(e)} style={{ minWidth: 280 }} placeholder="Enter keyword" /> */}
      <AutoComplete
        value={keywordSearch}
        options={suggestions}
        suffix={<SearchOutlined />}
        style={{
          width: 280,
        }}
        onSelect={onSelect}
        onKeyUp={(e) => handleSearch(e)}
        onChange={debounce((data) => onChange(data), 200)}
        placeholder="Enter keyword"
        onSearch={(e) => {
          setKeywordSearch(e);
        }}
      />
    </div>
  );
};

export default connect(({ loading, search: { suggestions = [] } }) => ({
  loading: loading.effects['search/getSuggestions'],
  suggestions,
}))(React.memo(SearchMenu));
