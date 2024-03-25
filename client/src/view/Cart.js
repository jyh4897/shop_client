import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import LocalCartList from "../Components/Shop/LocalCartList";

import "./Cart.css";

const Cart = ({ setcCartlength }) => {
  const [cartList, setCartList] = useState([]); // 유저의 장바구니 데이터 상태
  const [cartReset, setCartReset] = useState(0); // 장바구니 상태 갱신 핸들러
  const [isCheckItem, setIsCheckItem] = useState(false); // 체크 상품 여부
  const [isLoggedin, setIsLoggedin] = useState(false); // 로그인 여부 확인

  const navigate = useNavigate();

  // 모든 상품 또는 선택한 상품들에 대한 결제하기 버튼을 누를 시,
  // "/orderSheet" 경로로 전달할 데이터를 규정
  const orderType = {
    allOrder: "all_order",
    selectOrder: "select_order",
  };

  //체크박스 false 상태로 초기화
  function resetAllCheckboxes() {
    // checkboxes 변수에 클래스 네임이 ".item_checkbox "로 지정된 모든 태그를 담는다.
    // 간략히 말하면, 체크박스 태그들을 넣음.
    const checkboxes = document.querySelectorAll(".item_checkbox");

    // checkboxes에 저장된 체크박스 태그 요소들을 forEach()를 통해 하나씩 순회하면서, 체크 상태를 false로 전환
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
    setIsCheckItem(false);
  }

  // 마운트 과정에서 장바구니 데이터를 가져오는 메소드
  useEffect(() => {
    // 로그인 여부를 확인한다.
    if (sessionStorage.loggedIn !== undefined) {
      setIsLoggedin(true);
    }

    // 로컬 스토리지가 확인되지 않는다면 생성한다.
    if (localStorage.baskets === undefined) {
      localStorage.setItem("baskets", JSON.stringify([]));
    }

    setCartReset(0);
    resetAllCheckboxes();
    // 로컬 스토리지의 데이터를 json 파일로 가져온다
    const carts = JSON.parse(localStorage.getItem("baskets"));
    setCartList(carts);
  }, [cartReset]);

  // 상품 페이지 이동 핸들러
  const onClickGoShop = () => {
    navigate("/shop");
  };

  // 장바구니 아이템 상품 체크상태 업데이트
  const cartListUpdate = (id) => {
    // isCheckItems 변수에 cartList 배열 요소를 하나씩 담되,
    // 체크박스에 체크된 요소만은 isCheck 값을 전환하여 반환한다.
    const isCheckItems = cartList.map((item) => {
      if (item.id == id) {
        item.isCheck = !item.isCheck;
      }
      return item;
    });

    const checkItem = cartList.find((item) => item.isCheck == true);

    if (checkItem === undefined) setIsCheckItem(false);
    else setIsCheckItem(true);

    setCartList(isCheckItems);
  };

  //  체크박스 선택한 상품 삭제
  const cartSelectDelete = () => {
    // cartList 배열을 한 요소씩 순회하면서 item.isCheck == true,
    // 즉 체크박스에 체크된 요소가 하나라도 있는지 확인한다.
    // 없다면 undefined으로 값을 반환된다.
    const checkItem = cartList.find((item) => item.isCheck == true);

    if (checkItem === undefined) alert("선택한 항목이 없습니다.");
    else if (window.confirm("선택한 상품들을 장바구니에서 삭제하시겠습니까?")) {
      // filter()를 사용하여, 체크된 상품을 제외한 요소만들 filterItem 변수에 담는다.
      const filterItem = cartList.filter((item) => item.isCheck == false);

      setcCartlength(filterItem.length); // 장바구니 수량 업데이트

      // 로컬 스토리지 갱신
      localStorage.setItem("baskets", JSON.stringify(filterItem));
      setCartReset(1); // 페이지 리렌더링 유도(useEffect 재가동)
    }
  };

  // 전체 상품 선택 (체크박스 전부 TRUE 전환)
  const allCheckedTrueItem = () => {
    // checkboxes 변수에 클래스 네임이 ".item_checkbox "로 지정된 모든 태그를 담는다.
    // 간략히 말하면, 체크박스 태그들을 넣음.
    const checkboxes = document.querySelectorAll(".item_checkbox");

    // checkboxes에 저장된 체크박스 태그 요소들을 forEach()를 통해 하나씩 순회하면서, 체크 상태를 true로 전환.
    checkboxes.forEach((checkbox) => {
      checkbox.checked = true; // 또는 false
    });

    // 이어서 cartList 배열 요소를 모두 순회하며 체크 속성(isCheck)값을 true로 바꿔준다.
    const isCheckItems = cartList.map((item) => {
      item.isCheck = true;
      return item;
    });
    setIsCheckItem(true);
    setCartList(isCheckItems); // 바뀐 배열을 setCartList 상태로 저장 및 리렌더링
  };

  // 전체 상품 선택 해제 (체크박스 전부 FALSE 전환)
  const allCheckedFalseItem = () => {
    // checkboxes 변수에 클래스 네임이 ".item_checkbox "로 지정된 모든 태그를 담는다.
    // 간략히 말하면, 체크박스 태그들을 넣음.
    const checkboxes = document.querySelectorAll(".item_checkbox");

    // checkboxes에 저장된 체크박스 태그 요소들을 forEach()를 통해 하나씩 순회하면서, 체크 상태를 해제한다.
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });

    // 이어서 cartList 배열 요소를 모두 순회하며 체크 속성(isCheck)값을 false로 바꿔준다.
    const isCheckItems = cartList.map((item) => {
      item.isCheck = false;
      return item;
    });
    setIsCheckItem(false);
    setCartList(isCheckItems); // 바뀐 배열을 setCartList 상태로 저장 및 리렌더링
  };

  //  선택한 상품만 주문하기 버튼
  const onClcikSelectOrder = () => {
    // cartList 배열을 한 요소씩 순회하면서 item.isCheck == true,
    // 즉 체크박스에 체크된 요소가 하나라도 있는지 확인한다.
    // 없다면 undefined으로 값을 반환된다.
    const checkItem = cartList.find((item) => item.isCheck == true);

    if (checkItem === undefined) {
      alert("선택한 항목이 없습니다.");
      sessionStorage.setItem("selectCart", JSON.stringify([]));
    } else {
      // cartList 배열의 요소 하나씩 순회하면서 item.isCheck == true,
      // 즉 체크된 요소만을  filterItem에 반환한다(담는다).
      const filterItem = cartList.filter((item) => item.isCheck == true);
      // "selectCart" 라는 별개의 로컬 스토리지 생성한 후 담는다.
      sessionStorage.setItem("selectCart", JSON.stringify(filterItem));
    }
  };

  // 총 상품 금액을 구하는 메소드
  const totalCount = () => {
    let sumCount = 0;
    // map() 함수를 사용하여 cartList 배열 요소를 순회하며
    // 수량과 개별 가격을 곱한 값을 sumCount에 더하면서 저장
    cartList.map((item) => (sumCount = sumCount + item.price * item.quantity));
    return sumCount;
  };

  // 선택 상품들의 총 금액을 구하는 메소드
  const selectTotalCount = () => {
    let sumCount = 0;
    cartList.map((item) => {
      if (item.isCheck == true)
        sumCount = sumCount + item.price * item.quantity;
    });
    return sumCount;
  };

  return (
    <div className="cart_full_container">
      <div className="cart_detail_container">
        <h1>장바구니</h1>
        <hr></hr>
        <button className="cart_select_menu" onClick={allCheckedTrueItem}>
          전체 선택
        </button>
        <button className="cart_select_menu" onClick={allCheckedFalseItem}>
          전체 선택 해제
        </button>
        <button className="cart_select_menu" onClick={cartSelectDelete}>
          선택한 상품 삭제
        </button>
        <hr></hr>
        <LocalCartList
          cartList={cartList}
          setCartReset={setCartReset}
          cartListUpdate={cartListUpdate}
          setcCartlength={setcCartlength}
        />
      </div>
      <div className="order_summary_container">
        <h1>주문서 요약</h1>
        {cartList.length ? (
          <h2>
            상품명 :{" "}
            <span className="emphasis_positive">{cartList[0].name}</span>{" "}
            {cartList.length > 1 && (
              <span>
                외{" "}
                <span className="emphasis_positive">{cartList.length - 1}</span>{" "}
                건
              </span>
            )}
          </h2>
        ) : (
          <h2>장바구니에 담긴 상품이 없습니다.</h2>
        )}

        <h2>
          총 상품 금액 :{" "}
          <span className="emphasis_positive">
            {totalCount().toLocaleString()}
          </span>{" "}
          원
        </h2>
        <hr></hr>
        <h2>
          {isCheckItem && (
            <span>
              선택한 상품 금액 :{" "}
              <span className="emphasis_positive">
                {selectTotalCount().toLocaleString()}
              </span>{" "}
              원
            </span>
          )}
        </h2>
        {/* Link를 클릭 시, 전달할 prop 데이터로 state 값을 넘겨주게끔 함 */}
        {isLoggedin ? (
          <>
            {cartList.length > 0 && (
              <Link to="/ordersheet" state={{ orderType: orderType.allOrder }}>
                <button className="btnOrder">모든 상품 주문하기</button>
              </Link>
            )}
            {isCheckItem && (
              <Link
                to="/ordersheet"
                state={{ orderType: orderType.selectOrder }}
              >
                <button className="btnOrder" onClick={onClcikSelectOrder}>
                  선택한 상품만 주문하기
                </button>
              </Link>
            )}
          </>
        ) : (
          <>! 주문하려면 로그인이 필요합니다.</>
        )}
        <h3>
          {" "}
          ! <b style={{ color: "green" }}>도움이 필요하신가요?</b>
        </h3>
        <p></p>
        <h4>Contact us</h4>
        <h5 style={{ fontWeight: "normal" }}>월요일 ~ 금요일(영업일 기준)</h5>
        <h5 style={{ fontWeight: "normal" }}>08.00 to 17.00</h5>
        <h5 style={{ fontWeight: "normal" }}>담당자 : 상호형 대표님</h5>
      </div>
    </div>
  );
};

export default Cart;
