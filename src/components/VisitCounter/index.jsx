import { getTotalVisitCount } from '@/services/configs';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import './index.less';
const SECOND = 1000;
function VisitCounter(props) {
  const [data, setData] = useState('');
  useEffect(() => {
    let isExcute = false;
    handleSetDataInterval();
    const idInterval = setInterval(() => {
      isExcute = true;
      handleSetDataInterval();
    }, SECOND * 5);
    return () => {
      if (!isExcute) {
        clearInterval(idInterval);
      }
    };
  }, []);

  const handleSetDataInterval = async () => {
    try {
      const res = await getTotalVisitCount();
      const { data } = res;
      setData((preState) => {
        if (preState === data) {
          return preState;
        }
        return data;
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="warpVisitCounter">
      <p className="textVisitCounter">Visit Counter</p>
      <p className="containerNumberVisitCounter">
        {data
          .toString()
          .split('')
          .map((item, index) => {
            return (
              <span key={index} className="numberVisitCounter">
                {item}
              </span>
            );
          })}
      </p>
    </div>
  );
}

export default VisitCounter;
