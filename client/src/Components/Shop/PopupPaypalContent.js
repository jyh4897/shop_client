import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useState } from "react";

// * 페이팔 가상 결제 정보
// Generic Name
// 4005519200000004
// 09/2025
// 567

// sb-43xagx29080090@personal.example.com
// l,28@SXn

function Message({ content }) {
  return <p>{content}</p>;
}

// 팝업으로 띄울 컴포넌트
const PopupPaypalContent = ({
  usePoint,
  onClose,
  submitOrdersheet,
  userCart,
}) => {
  // 서버 주소
  const Server_URL = process.env.REACT_APP_Server_Side_Address;

  // 페이팔 클라이언트 ID
  const { REACT_APP_PAYPAL_CLIENT_ID } = process.env;

  // 페이팔 유효성 체크 및 속성 설정
  const initialOptions = {
    "client-id": REACT_APP_PAYPAL_CLIENT_ID,
    "enable-funding": "card",
    "disable-funding": "paylater,venmo",
    "data-sdk-integration-source": "integrationbuilder_sc",
  };

  const [message, setMessage] = useState("");

  // 페이팔 주문생성 createOrder 이벤트 핸들러, 버튼 클릭시 작동
  const createOrder = async () => {
    try {
      const response = await fetch(`${Server_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // use the "body" param to optionally pass additional order information
        // like product ids and quantities
        body: JSON.stringify({
          cart: userCart,
          usePoint: usePoint,
        }),
      });

      const orderData = await response.json();

      if (orderData.id) {
        return orderData.id;
      } else {
        const errorDetail = orderData?.details?.[0];
        const errorMessage = errorDetail
          ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
          : JSON.stringify(orderData);

        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error(error);
      setMessage(`Could not initiate PayPal Checkout...${error}`);
    }
  };

  // 결제 요청 및 확정시 작동
  const onApprove = async (data, actions) => {
    const thisPaymentType = "페이팔 결제";
    try {
      const response = await fetch(
        `${Server_URL}/orders/${data.orderID}/capture`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const orderData = await response.json();
      // Three cases to handle:
      //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
      //   (2) Other non-recoverable errors -> Show a failure message
      //   (3) Successful transaction -> Show confirmation or thank you message

      const errorDetail = orderData?.details?.[0];

      if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
        // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
        // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
        return actions.restart();
      } else if (errorDetail) {
        // (2) Other non-recoverable errors -> Show a failure message
        throw new Error(`${errorDetail.description} (${orderData.debug_id})`);
      } else {
        // (3) Successful transaction -> Show confirmation or thank you message
        // Or go to another URL:  actions.redirect('thank_you.html');
        const transaction = orderData.purchase_units[0].payments.captures[0];
        setMessage(
          `Transaction ${transaction.status}: ${transaction.id}. See console for all available details`
        );
        submitOrdersheet(thisPaymentType);
        onClose();
      }
    } catch (error) {
      console.error(error);
      setMessage(`Sorry, your transaction could not be processed...${error}`);
    }
  };

  return (
    <div>
      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          style={{
            shape: "rect",
            layout: "vertical",
          }}
          // createOrder 이벤트 핸들러, 버튼 클릭시 작동
          createOrder={createOrder}
          // 결제 요청 및 확정시 작동
          onApprove={onApprove}
        />
      </PayPalScriptProvider>
      <Message content={message} />
      <button onClick={onClose}>닫기</button>
    </div>
  );
};

export default PopupPaypalContent;
