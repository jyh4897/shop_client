import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useRef } from "react";

// https://www.npmjs.com/package/file-saver
// https://www.npmjs.com/package/html2canvas
import html2canvas from "html2canvas"; // 이미지 다운로드 라이브러리
import { saveAs } from "file-saver"; // 이미지 다운로드 라이브러리

import "./CompleteOrder.css";
import downloadImage from "..//Shop/image/downloaded_icon.png"; // 다운로드 이미지

import BuyerDistributionChart from "./BuyerDistributionChart";

const CompleteOrder = () => {
  // 이미지 저장에 참조가 되는 html div 태그 요소. 아직 지정하지 않았으므로 초기값은 null
  const divRef = useRef(null);

  const location = useLocation(); // useNavigate 훅스를 통해 가져온 데이터를 다루기 위한 기능
  const navigate = useNavigate();

  // 메인 || 샵 이동 핸들러
  const onClickShopNavigateHandler = () => {
    navigate("/");
  };

  // 이미지 다운로드 핸들러
  const handleDownload = async () => {
    const div = divRef.current; // div 태그 요소를 저장

    // html2canvas 라이브러리를 이용하여 참조된 div 영역을 이미지로 변환
    const canvas = await html2canvas(div, { useCORS: true });
    // useCORS 옵션을 true로 설정, 이미지 CORS 정책을 통과하기 위함.

    // Canvas의 내용을 데이터 URL로 변환
    const imageDataUrl = canvas.toDataURL("image/png");

    // 파일로 저장
    saveAs(imageDataUrl, "downloaded_order_complete.png");
  };

  // 구매내역 페이지 이동 핸들러
  const onClickMyOrderListNavigateHandler = () => {
    navigate("/myOrderList");
  };

  if (!location.state) {
    // 올바른 접근 방법이 아닐 경우
    return (
      <div>
        <h1>요청한 페이지를 찾을 수 없습니다.</h1>
        <h3>! 올바른 접근이 아니거나 요청 데이터를 찾을 수 없습니다.</h3>
        <h3>
          메인으로 돌아가려면 <Link to={"/"}>이곳</Link>을 클릭해주세요.
        </h3>
      </div>
    );
  } else {
    // 정상적으로 이 경로에 접근한 경우
    const { orderData } = location.state;

    const {
      orderNumber,
      deliveryDestName,
      deliveryDestPhone,
      deliveryDestAddress,
      deliveryDestMessage,
      paymentType,
      payTotalAmount,
      orderProduct,
    } = orderData;

    console.log(orderProduct);

    return (
      <div className="complete_order_full_container">
        <h1 style={{ textAlign: "center" }}>
          <b style={{ color: "green" }}>주문이 정상적으로 완료</b>되었습니다.
        </h1>
        <div ref={divRef} className="complete_order_container">
          <div>
            <div className="order_detail_box_1">
              <h1>주문 번호</h1>
              <h2>{orderNumber}</h2>
              주문서 이미지 다운로드
              <button className="image_download_btn" onClick={handleDownload}>
                <img src={downloadImage} width={20} height={20} />
              </button>
              <h1>배송지 정보</h1>
              <hr></hr>
              <table>
                <thead></thead>
                <tbody>
                  <tr>
                    <td className="order_complete_delivery_destination">
                      주소
                    </td>
                    <td>{deliveryDestAddress}</td>
                  </tr>
                  <tr>
                    <td className="order_complete_delivery_destination">
                      수령인 성명
                    </td>
                    <td>{deliveryDestName}</td>
                  </tr>
                  <tr>
                    <td className="order_complete_delivery_destination">
                      수령인 연락처
                    </td>
                    <td>{deliveryDestPhone}</td>
                  </tr>
                  <tr>
                    <td className="order_complete_delivery_destination">
                      배송 메시지
                    </td>
                    <td>{deliveryDestMessage}</td>
                  </tr>
                </tbody>
              </table>
              <hr></hr>
              <h1>결제 상세</h1>
              <hr></hr>
              <table>
                <thead></thead>
                <tbody>
                  <tr>
                    <td className="order_complete_delivery_destination">
                      <b>{paymentType}</b>
                    </td>
                    <td>{`${payTotalAmount.toLocaleString()} 원`}</td>
                  </tr>
                </tbody>
              </table>
              <hr></hr>
              <div>광고존</div>
            </div>
            <div>
              <center>
                <input
                  type="button"
                  className="complete_order_btnOrder"
                  onClick={onClickShopNavigateHandler}
                  value={"쇼핑 홈 가기"}
                />
                <input
                  type="button"
                  className="complete_order_btnOrder"
                  onClick={onClickMyOrderListNavigateHandler}
                  value={"구매내역 보기"}
                />
              </center>
            </div>
          </div>

          <div className="order_detail_box_2">
            <h1>결제 상품</h1>
            <hr></hr>
            {orderProduct.map((product) => (
              <div key={product.id}>
                <div className="order_complete_itemBox">
                  <div className="order_complete_item">
                    <img src={product.thumbnail} width={150} height={150} />
                  </div>
                  <div className="order_complete_item">
                    <p>
                      <b>{product.name}</b>
                    </p>
                    <p>주문 수량 : {product.quantity} 개</p>
                    <p>
                      <span style={{ color: "blue" }}>
                        {(product.price * product.quantity).toLocaleString()}
                      </span>{" "}
                      원
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <center>
          <div className="complete_order_chart_component">
            <h1>상품별 구매자 분포</h1>
            <hr></hr>
            <div className="buyer_chart_container">
              {orderProduct.map((product) => (
                <BuyerDistributionChart key={product.id} product={product} />
              ))}
            </div>
          </div>
        </center>
      </div>
    );
  }
};

export default CompleteOrder;
