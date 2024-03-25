import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid"; //랜덤 코드 생성 라이브러리

import "./MultiPayment.css";

const MultiPayment = ({
  usePoint,
  userCart,
  submitOrdersheet,
  paymentData,
}) => {
  const { paymentType, channelKey, payMethod, paymentName } = paymentData;
  // 포트원 상점 아이디
  const { REACT_APP_PortOne_StoreId } = process.env;

  let payResponse;

  useEffect(() => {
    const jquery = document.createElement("script");
    jquery.src = "https://code.jquery.com/jquery-3.7.1.min.js";
    const iamport = document.createElement("script");
    iamport.src = "https://cdn.portone.io/v2/browser-sdk.js";
    document.head.appendChild(jquery);
    document.head.appendChild(iamport);
    return () => {
      document.head.removeChild(jquery);
      document.head.removeChild(iamport);
    };
  }, []);

  // 총 상품 금액을 구하는 메소드
  const totalProductAmount = () => {
    let sumAmount = 0;
    userCart.map((item) => (sumAmount += item.price * item.quantity));
    return sumAmount;
  };

  const onClickPayment = async () => {
    const thisPaymentType = paymentType;
    const { PortOne } = window;

    if (paymentType == "카카오 페이") {
      payResponse = await PortOne.requestPayment({
        // Store ID 설정
        storeId: REACT_APP_PortOne_StoreId,
        // 채널 키 설정
        channelKey: channelKey,
        paymentId: `payment-${uuidv4()}`,
        orderName: `${userCart[0].name} 외 ${userCart.length - 1} 건`,
        totalAmount: totalProductAmount() - usePoint,
        // totalAmount: 1000,
        currency: "CURRENCY_KRW",
        payMethod: payMethod,
        productType: "PRODUCT_TYPE_REAL",
        easyPay: { easyPayProvider: "KAKAOPAY" },
      });
    } else {
      payResponse = await PortOne.requestPayment({
        // Store ID 설정
        storeId: REACT_APP_PortOne_StoreId,
        // 채널 키 설정
        channelKey: channelKey,
        paymentId: `payment-${uuidv4()}`,
        orderName: `${userCart[0].name} 외 ${userCart.length - 1} 건`,
        // totalAmount: totalProductAmount() - usePoint,

        totalAmount: 1000,
        currency: "CURRENCY_KRW",
        payMethod: payMethod,
        productType: "PRODUCT_TYPE_REAL",
      });
    }

    if (payResponse.code != null) {
      // 오류 발생
      return alert(payResponse.message);
    }

    if (payResponse.transactionType == "PAYMENT") {
      submitOrdersheet(thisPaymentType);
    }
  };

  return (
    <>
      {paymentName == "카카오 페이" ? (
        <input
          className="payment_btn_kakaopay"
          type="button"
          onClick={onClickPayment}
          value={paymentName}
        />
      ) : (
        <input
          className="payment_btn_multi"
          type="button"
          onClick={onClickPayment}
          value={paymentName}
        />
      )}
    </>
  );
};
export default MultiPayment;
