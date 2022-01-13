import { map } from 'lodash';
import React from 'react';
import styles from './index.less';
import { intersection, difference } from 'lodash';
import { template } from '@/utils/template';

export default function TableChart({
  data: {
    externalId = '',
    externalConfig = [],
    internalId = '',
    internalConfig = [],
    dataConfig = {},
    feature = '',
  } = {},
  setId = () => {},
  typeChart = 4,
}) {
  const differenceData = difference(externalConfig, internalConfig);
  const internalDifferenceData = difference(internalConfig, externalConfig);
  const sameData = intersection(internalConfig, externalConfig);
  const showDetail = (_feature) => {
    setId(_feature);
  };

  const __renderConfig = (config) => {
    const reg = template[feature];
    const matchConfig = config.match(reg);
    if (!matchConfig) return config;

    let result = config;
    matchConfig.forEach((item) => {
      result = result.replace(item, `<mark>${item}</mark>`);
    });
    return result;
  };

  if (!Object.keys(dataConfig).length && typeChart === 5)
    return <div className={styles.noData}>No data to display</div>;
  return (
    <div className={styles.tableChart}>
      {typeChart === 4 && (
        <table className={styles.tableChart__category}>
          <thead>
            <tr>
              <th>Configuration</th>
              <th>{`External Customer - ${externalId}`}</th>
              <th>{`Internal Customer - ${internalId}`}</th>
            </tr>
          </thead>
          <tbody>
            {differenceData.map((item, index) => (
              <tr
                onClick={() => showDetail(item)}
                className={`${styles.tableChart__difference} ${styles.hover}`}
                key={index}
              >
                <td>{item}</td>
                <td>enabled</td>
                <td />
              </tr>
            ))}
            {sameData.map((item, index) => (
              <tr
                className={styles.hover}
                onClick={() => showDetail(item)}
                key={differenceData.length + index}
              >
                <td>{item}</td>
                <td>enabled</td>
                <td>enabled</td>
              </tr>
            ))}
            {internalDifferenceData.map((item, index) => (
              <tr key={differenceData.length + index}>
                <td>{item}</td>
                <td />
                <td>enabled</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {typeChart === 5 && (
        <table>
          <thead>
            <tr>
              <th>Filename</th>
              <th>Configurations</th>
            </tr>
          </thead>
          <tbody>
            {map(dataConfig, (item, index) => (
              <tr key={index}>
                <td>{item.file}</td>
                <td>
                  <div className={styles.tableContent}>
                    <div>
                      {map(item.dataConfig, (config) => (
                        <div
                          className={styles.tableContent__configs}
                          style={{ whiteSpace: 'pre-wrap' }}
                          dangerouslySetInnerHTML={{ __html: __renderConfig(config) }}
                        />
                      ))}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {differenceData.length > 0 && (
        <div>
          <strong>*Note:</strong>{' '}
          <span className={styles.tableChart__difference}>Configuration</span> is the configuration
          not match
        </div>
      )}
    </div>
  );
}
