import { useEffect, useState } from "react";

import axios from "axios";

import spinnerImage from "../Shop/image/spinner2.gif"; // 로딩 이미지

import "./ReadExchangeRate.css";

const ReadExchangeRate = () => {
  // 서버 주소
  const Server_URL = process.env.REACT_APP_Server_Side_Address;

  const [exchangeRate, setExchangeRate] = useState(false); // 환율 데이터

  useEffect(() => {
    axios.get(`${Server_URL}/getExchangeRate`).then((response) => {
      setExchangeRate(response.data);
    });
  }, []);

  // 환율이 조회되지 않는 중이라면,
  if (!exchangeRate.length) {
    return (
      <div className="exchangeRate_container">
        <center>
          <img src={spinnerImage} width={70} height={70} />
        </center>
      </div>
    );
  } else {
    return (
      <div className="exchangeRate_container">
        <span>환율정보{`(매매기준율)`}</span>
        <hr></hr>
        <b>미국(USD)</b> : {exchangeRate} 원
      </div>
    );
  }
};

export default ReadExchangeRate;
