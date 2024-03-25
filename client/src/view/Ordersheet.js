import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Modal from "react-modal"; // 팝업 라이브러리
import DaumPostcode from "react-daum-postcode"; // 주소 검색 라이브러리
import { handlePostcode } from "../Components/Logins/Handle/Postcodehandle"; // 주소 검색 라이브러리

import axios from "axios";

import "./Ordersheet.css";
import PopupPaypalContent from "../Components/Shop/PopupPaypalContent";
import MultiPayment from "../Components/Shop/MultiPayment";
import ReadExchangeRate from "../Components/Shop/ReadExchangeRate";

const Ordersheet = ({ setcCartlength }) => {
  const [userInfo, setUserInfo] = useState([]); // 로그인된 사용자 상세 정보를 저장하기 위한 상태값
  const [nameInfo, setNameInfo] = useState(""); // input 태그의 이름 정보 상태 저장
  const [phoneNumberInfo, setPhoneNumberInfo] = useState(""); // input 태그의 연락처 정보 상태 저장
  const [addressInfo, setAddressInfo] = useState(""); // input 태그의 주소 정보 상태 저장
  const [messageInfo, setMessageInfo] = useState(""); // input 태그의 배송요청사항 정보 상태 저장
  const [usePoint, setUsePoint] = useState(0); // input 태그의 포인트 사용량 정보 상태 저장, 초기값 0
  const [userCart, setUserCart] = useState([]); // 주문할 상품들에 대한 데이터 저장소
  const [isModalOpen, setModalOpen] = useState(false); // paypal 결제 팝업창 표시 여부
  const [viewOrdererSheet, setViewOrdererSheet] = useState(true);
  const [viewUsePointSheet, setViewUsePointSheet] = useState(false);
  const [viewPaymentSheet, setViewPaymentSheet] = useState(false);
  const [openPostcode, setOpenPostcode] = useState(false); //주소

  const handle = handlePostcode(openPostcode, setOpenPostcode, setAddressInfo);

  const navigate = useNavigate();
  const location = useLocation(); // <Link> prop으로 전달 받은 데이터를 사용하기 위한 훅스

  // <Link> prop으로 전달 받은 데이터를 사용하기 위해 변수에 저장
  // orderTypeData은 개별 구매, 선택 상품 구매, 모든 상품 구매 중 하나의 주문형식 값을 가져오는 데 사용

  const Server_URL = process.env.REACT_APP_Server_Side_Address;
  const { REACT_APP_PortOne_ChannelKey, REACT_APP_PortOne_Kakao_ChannelKey } =
    process.env;

  const paymentMethods = [
    {
      paymentType: "카드 결제",
      channelKey: REACT_APP_PortOne_ChannelKey,
      payMethod: "CARD",
      paymentName: "카드 결제",
    },
    {
      paymentType: "실시간 계좌이체",
      channelKey: REACT_APP_PortOne_ChannelKey,
      payMethod: "TRANSFER",
      paymentName: "실시간 계좌이체",
    },
    {
      paymentType: "모바일 결제",
      channelKey: REACT_APP_PortOne_ChannelKey,
      payMethod: "MOBILE",
      paymentName: "모바일 결제",
    },
    {
      paymentType: "카카오 페이",
      channelKey: REACT_APP_PortOne_Kakao_ChannelKey,
      payMethod: "EASY_PAY",
      paymentName: "카카오 페이",
    },
  ];

  // useEffect() 페이지의 마운트 과정에서 실행된다.
  // 1. orderType 에 주문형식을 가져오고, id 에 사용자의 고유 id 값을 가져온다.
  // 2. axios => 사용자의 id 를 토대로 서버 DB에 사용자 정보를 요청하여
  //    응답받은 데이터를  setUserInfo() 릍 통해 저장한다.
  //    주문자 배송지 정보, 포인트 보유량 등에 활용하기 위해 요청함.
  // 3. switch => orderType, 즉 주문 형식에 따라 사용자에게 보여줄 상품들의 리스트를 설정한다.
  useEffect(() => {
    // 로컬 스토리지가 확인되지 않는다면 생성한다.
    if (localStorage.baskets === undefined) {
      localStorage.setItem("baskets", JSON.stringify([]));
    }

    // <Link> 를 통한 ordersheet 접근이 아닐 경우,
    if (!location.state) {
      alert("잘못된 접근입니다!");
      return navigate("/");
    } else {
      const orderTypeData = location.state;
      const { orderType } = orderTypeData;

      const getUserData = JSON.parse(sessionStorage.getItem("userData"));
      const { userid } = { ...getUserData };

      axios
        .get(`${Server_URL}/ordersheet`, { params: { userId: userid } })
        .then((data) => {
          setUserInfo(data.data[0]);
        });

      switch (orderType) {
        case "single_order":
          return setUserCart([orderTypeData]);
        case "select_order": {
          const cartProducts = JSON.parse(sessionStorage.getItem("selectCart"));
          // sessionStorage.removeItem("selectCart");
          return setUserCart(cartProducts);
        }
        case "all_order": {
          const cartProducts = JSON.parse(localStorage.getItem("baskets"));
          return setUserCart(cartProducts);
        }
        default: {
          const cartProducts = JSON.parse(localStorage.getItem("baskets"));
          return setUserCart(cartProducts);
        }
      }
    }
  }, []);
  // [], 빈 배열을 넣음으로써 페이지 마운트 과정 중 한번만 실행되게끔 함.

  // 총 상품 금액을 구하는 메소드
  const totalProductAmount = () => {
    let sumAmount = 0;
    userCart.map((item) => (sumAmount += item.price * item.quantity));
    return sumAmount;
  };

  // "주문자 정보 가져오기" 버튼 핸들러, 각 상태에 사용자 정보를 저장하고 갱신함.
  const onClickLoadRecipient = () => {
    setNameInfo(userInfo.username);
    setPhoneNumberInfo(userInfo.phonenumber);
    setAddressInfo(userInfo.address + ", " + userInfo.detailedaddress);
  };

  // 포인트 사용량 핸들러
  const onChangeUsePoint = (e) => {
    const minimumOrderAmount = 100; // 최소 결제 금액
    const totalAmount = totalProductAmount(); // 총 기본 결제금액
    const maximumAllowedPaymentAmount = totalAmount - minimumOrderAmount;

    // 입력된 값이 보유한 포인트에 비해 많을 경우 경고창을 호출하며, 0으로 초기화한다.
    if (e.target.value > userInfo.point) {
      alert("보유 금액 이상 사용은 불가능 합니다.");
      setUsePoint(0);
      return;
    }

    // 입력한 포인트값이 혀용된 최대 결제금액을 초과할 경우,
    if (e.target.value > maximumAllowedPaymentAmount) {
      alert("최소 결제금액은 100원 이상이여야 합니다.");
      setUsePoint(maximumAllowedPaymentAmount);
      return;
    }

    setUsePoint(e.target.value);
  };

  // "전액 사용" 버튼 핸들러
  const onClcikAllUsePoint = () => {
    const minimumOrderAmount = 100; // 최소 결제 금액
    const totalAmount = totalProductAmount(); // 총 기본 결제금액
    const maximumAllowedPaymentAmount = totalAmount - minimumOrderAmount;

    // 입력한 포인트값이 혀용된 최대 결제금액을 초과할 경우,
    if (userInfo.point > maximumAllowedPaymentAmount) {
      alert("최소 결제금액은 100원 이상이여야 합니다.");
      setUsePoint(maximumAllowedPaymentAmount);
      return;
    } else {
      setUsePoint(userInfo.point);
      return;
    }
  };

  // 결제수단 paypal 버튼을 클릭하면 팝업창 발생
  // 입력 필수 사항인 배송지 정보가 누락되면 return 한다.
  const openPaypalModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const onClickNextUsePointSheet = () => {
    if (!nameInfo || !phoneNumberInfo || !addressInfo) {
      alert("배송지 입력은 필수 사항입니다.");
      return;
    }
    setViewOrdererSheet(false);
    setViewUsePointSheet(true);
  };

  const onClickNextPaymentSheett = () => {
    setViewPaymentSheet(true);
    setViewUsePointSheet(false);
  };

  // 서버측에 주문서를 DB에 등록하는 메소드
  const submitOrdersheet = (payment) => {
    // 현재 시간과 날짜를 구하는 내장 객체
    const date = new Date();

    // createOrderNumber에는 주문번호를 생성한다.
    const createOrderNumber =
      String(userInfo.userid) +
      String(date.getFullYear()) +
      String(date.getMonth() + 1) +
      String(date.getDate()) +
      String(date.getHours()) +
      String(date.getMinutes()) +
      String(date.getSeconds()) +
      "-" +
      String(userCart[0].id);

    // 서버에 전달할 데이터를 담을 변수 배열 설정
    const reqOrderSheet = [];

    // userCart(주문 상품들의 정보가 들어있는 배열)
    // forEach()를 통해 요소(상품) 마다 name, addr 등의 키:값을 추가한 후,
    // 그 요소를 reqOrderSheet 배열에 저장한다.
    userCart.forEach((data) => {
      reqOrderSheet.push({
        ...data,
        orderNumber: createOrderNumber,
        userId: userInfo.userid,
        name: nameInfo,
        addr: addressInfo,
        phoneNumber: phoneNumberInfo,
        reqMessage: messageInfo,
        totalCount: userCart.length,
        totalAmount: totalProductAmount() - usePoint,
        payment: payment,
        usePoint: usePoint,
        imageURL: data.thumbnail,
        paymentAmount: data.price * data.quantity,
      });
    });

    const completeOrderData = {
      orderNumber: createOrderNumber,
      deliveryDestName: nameInfo,
      deliveryDestPhone: phoneNumberInfo,
      deliveryDestAddress: addressInfo,
      deliveryDestMessage: messageInfo,
      paymentType: payment,
      payTotalAmount: totalProductAmount() - usePoint,
      orderProduct: userCart,
    };

    // 서버에 엔드포인트 "/reqOrder" 로 POST 요청,
    // 전달할 데이터는 orderSheet 이름의 reqOrderSheet 객체 변수
    axios
      .post(`${Server_URL}/reqOrder`, {
        orderSheet: reqOrderSheet,
        orderUserId: userInfo.userid,
      })
      // 서버에서 성공적으로 실행되었다면, 다음 then() 코드가 실행된다.
      .then(() => {
        const getCartList = JSON.parse(localStorage.getItem("baskets"));
        const orderProductCode = [];

        userCart.forEach((product) => orderProductCode.push(product.id));

        const updateCartList = getCartList.filter((product) => {
          if (orderProductCode.indexOf(product.id) < 0) return product;
        });

        setcCartlength(updateCartList.length); // 장바구니 수량 업데이트

        localStorage.setItem("baskets", JSON.stringify(updateCartList));
        sessionStorage.removeItem("selectCart");
        navigate("/completeOrder", { state: { orderData: completeOrderData } });
        // alert("주문이 완료되었습니다."); // "/completeOrder" 페이지 생성으로 폐기
        // navigate("/shop"); // "/completeOrder" 페이지 생성으로 폐기
      });
  };

  return (
    <div>
      <div className="ordersheet_contanier">
        <div className="order_detail_box">
          <h2>주문 상품</h2>
          <hr></hr>
          <div className="order_product_box">
            {userCart.map((product) => (
              <div key={product.id}>
                <Link to={`/product/${product.id}`} target="_blank">
                  <div className="order_itemBox">
                    <div className="order_item">
                      <img src={product.thumbnail} width={140} height={140} />
                    </div>
                    <div className="order_item">
                      <p>
                        <b style={{ color: "black" }}>{product.name}</b>
                      </p>
                      <p style={{ color: "gray" }}>
                        주문 수량 : {product.quantity} 개
                      </p>
                      <p style={{ color: "gray" }}>
                        {(product.price * product.quantity).toLocaleString()} 원
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
            <hr></hr>총 주문 상품 금액 : {totalProductAmount().toLocaleString()}{" "}
            원<hr></hr>
          </div>
          <div
            className={
              viewOrdererSheet
                ? "orderersheet_display_open"
                : "orderersheet_display_close"
            }
          >
            <form>
              <h2>배송지</h2>
              <hr></hr>
              <input
                type="button"
                style={{ marginRight: 10 }}
                value={"주문자 정보 가져오기"}
                onClick={onClickLoadRecipient}
              />
              {/* <p></p> */}
              <span
                style={{
                  fontSize: 12,
                  textDecoration: "underline",
                  textDecorationColor: "green",
                }}
              >
                * 표시는 필수 입력 사항입니다.
              </span>
              <table>
                <thead></thead>
                <tbody>
                  <tr>
                    <td className="ordersheet_table_label">
                      <label for="full_name">수령인 이름*</label>
                    </td>
                    <td>
                      <input
                        className="ordersheet_table_input"
                        type="text"
                        id="full_name"
                        name="full_name"
                        value={nameInfo}
                        onChange={(e) => setNameInfo(e.target.value)}
                        required
                      ></input>
                    </td>
                  </tr>
                  <tr>
                    <td className="ordersheet_table_label">
                      <label for="full_name">수령인 연락처*</label>
                    </td>
                    <td>
                      <input
                        className="ordersheet_table_input"
                        type="tel"
                        id="tel"
                        name="tel"
                        value={phoneNumberInfo}
                        placeholder="000-0000-0000"
                        onChange={(e) => setPhoneNumberInfo(e.target.value)}
                        required
                      ></input>
                    </td>
                  </tr>
                  <tr>
                    <td className="ordersheet_table_label">
                      <label for="address">배송 주소*</label>
                    </td>
                    <td>
                      <input
                        type="text"
                        className="ordersheet_table_input"
                        id="address"
                        name="address"
                        value={addressInfo}
                        onChange={(e) => setAddressInfo(e.target.value)}
                        required
                      />
                      <input
                        className="positive_btn"
                        type="button"
                        onClick={handle.clickButton}
                        value={"주소 검색"}
                      />
                      {openPostcode && (
                        <DaumPostcode
                          onComplete={handle.selectAddress}
                          autoClose={false}
                          defaultQuery=""
                        />
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="ordersheet_table_label">주소지 확인</td>
                    <td>{addressInfo}</td>
                  </tr>
                  <tr>
                    <td className="ordersheet_table_label">
                      <label for="req">배송 요청 사항</label>
                    </td>
                    <td>
                      <input
                        type="text"
                        className="ordersheet_table_input"
                        id="req"
                        value={messageInfo}
                        name="req"
                        onChange={(e) => setMessageInfo(e.target.value)}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </form>
            <p></p>
            <input
              className="positive_btn"
              type="button"
              value={"다음 단계로"}
              onClick={onClickNextUsePointSheet}
            />
            <hr></hr>
          </div>
          <div
            className={
              viewUsePointSheet
                ? "usePointsheet_display_open"
                : "usePointsheet_display_close"
            }
          >
            <h2>
              <b>빵끗 포인트</b> 보유 :{" "}
              <b>
                {userInfo && userInfo.point
                  ? userInfo.point.toLocaleString()
                  : 0}
              </b>{" "}
              원
            </h2>
            <hr></hr>
            사용 :{" "}
            <input
              type="number"
              value={usePoint}
              onChange={onChangeUsePoint}
            />{" "}
            원{"  "}
            <input
              type="button"
              onClick={onClcikAllUsePoint}
              value={"전액 사용"}
            />
            <p></p>
            <input
              className="positive_btn"
              type="button"
              value={"다음 단계로"}
              onClick={onClickNextPaymentSheett}
            />
            <hr></hr>
          </div>
          <div
            className={
              viewPaymentSheet
                ? "paymentSheet_display_open"
                : "paymentSheet_display_close"
            }
          >
            <h2>! 주문 내용을 확인하였으며, 정보 제공 등에 동의합니다.</h2>
            <h2>결제 수단 선택</h2>
            <hr></hr>
            <input
              className="payment_btn_paypal"
              type="button"
              onClick={openPaypalModal}
              value={"Paypal"}
            />
            {paymentMethods.map((paymentData) => (
              <MultiPayment
                usePoint={usePoint}
                paymentData={paymentData}
                userCart={userCart}
                submitOrdersheet={submitOrdersheet}
              />
            ))}
          </div>
        </div>
        <div className="ordersheet_summary_container">
          <h2>결제 상세</h2>
          <hr></hr>
          {userCart.length ? (
            <h2>
              상품명 :{" "}
              <span className="emphasis_positive">{userCart[0].name}</span>{" "}
              {userCart.length > 1 && (
                <span>
                  외{" "}
                  <span className="emphasis_positive">
                    {userCart.length - 1}
                  </span>{" "}
                  건
                </span>
              )}
            </h2>
          ) : (
            <h2>장바구니에 담긴 상품이 없습니다.</h2>
          )}
          <h2>
            주문 금액 : {(totalProductAmount() - usePoint).toLocaleString()} 원
          </h2>
          + 상품 금액: {totalProductAmount().toLocaleString()} 원<p></p>- 포인트
          : {usePoint.toLocaleString()}원<p></p>
          <h3>
            {" "}
            ! <b style={{ color: "green" }}>도움이 필요하신가요?</b>
          </h3>
          <p></p>
          <h4>Contact us</h4>
          <h5 style={{ fontWeight: "normal" }}>월요일 ~ 금요일(영업일 기준)</h5>
          <h5 style={{ fontWeight: "normal" }}>08.00 to 17.00</h5>
          <h5 style={{ fontWeight: "normal" }}>담당자 : 상호형 대표님</h5>
          <ReadExchangeRate />
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="팝업창"
      >
        <PopupPaypalContent
          usePoint={usePoint}
          onClose={closeModal}
          submitOrdersheet={submitOrdersheet}
          userCart={userCart}
        />
      </Modal>
    </div>
  );
};

// Ordersheet.defaultProps = {
//   orderType: "all_order",
// };

export default Ordersheet;
