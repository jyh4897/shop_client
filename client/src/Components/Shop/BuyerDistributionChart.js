import { useEffect, useState } from "react";

// https://www.chartjs.org/docs/latest/ chart.js 참고 페이지
import { Doughnut } from "react-chartjs-2"; // 도넛 형태의 차드 사용 모듈
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"; // 차드 지원 모듈

import axios from "axios";

import "./BuyerDistributionChart.css";
import spinnerImage from "../Shop/image/spinner2.gif"; // 로딩 이미지

ChartJS.register(ArcElement, Tooltip, Legend);

const BuyerDistributionChart = ({ product }) => {
  const [chartUserTypeData, setChartUserTypeData] = useState([]); // 차트에 사용될 표본 데이터

  // 서버 경로
  const Server_URL = process.env.REACT_APP_Server_Side_Address;

  // 상품코드, 이미지 경로, 상품명 변수
  const { id, thumbnail, name } = product;

  const chartLabels = ["개인", "기업", "단체"]; // 차트 라벨
  const chartTitle = "구매 비율(%)"; // 차트 제목

  useEffect(() => {
    axios
      .get(`${Server_URL}/products/usertype`, {
        params: { productCode: id },
      })
      .then((response) => {
        // 개인, 기업, 단체 데이터 분해 구조 할당
        const { buyerPersonal, buyerCorporate, buyerGroup } = response.data;

        // 데이터를 배열 형식으로 저장
        setChartUserTypeData([buyerPersonal, buyerCorporate, buyerGroup]);
      });
  }, []);

  // 차트에 필요한 데이터 설정
  const data = {
    labels: chartLabels,
    datasets: [
      {
        label: chartTitle,
        data: chartUserTypeData,
        backgroundColor: [
          "rgb(90, 226, 215)",
          "rgb(255, 105, 185)",
          "rgb(0, 190, 255)",
        ],
        hoverOffset: 4,
      },
    ],
  };

  // 데이터를 불러오는 중일때,
  if (!chartUserTypeData.length) {
    return (
      <div>
        <center>
          <img src={spinnerImage} width={200} height={200} />
        </center>
      </div>
    );
  } else {
    return (
      <div className="buyer_chart_item">
        {/* <center> */}
        <table className="tabledddd">
          <thead>
            <tr>
              <th className="tabledddd" colSpan="2">
                {name}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="table_image">
                <img src={thumbnail} width={200} height={200} />
              </td>
              <td className="table_chart">
                <div style={{ width: "200px", height: "200px" }}>
                  <Doughnut data={data} />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        {/* </center> */}
      </div>
    );
  }
};

export default BuyerDistributionChart;
