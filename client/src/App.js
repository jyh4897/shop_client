import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import Main from "./view/Main";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
// 김민호(임시)-----------------
import LoginPage from "./Components/Logins/Login";
import Modify from "./Components/Logins/Modify";
import Regester from "./Components/Logins/Regester";
import RegesterPersonal from "./Components/Logins/RegesterPersonal";
import RegesterGroup from "./Components/Logins/RegisterGroup";
import RegesterCorporate from "./Components/Logins/RegisterCorporate";
// ---------------------------
// 이기현 ------------------
import Cart from "./view/Cart"; // 이기현_장바구니 컴포넌트
import Ordersheet from "./view/Ordersheet"; // 이기현_오더시트 컴포넌트
import CompleteOrder from "./Components/Shop/CompleteOrder"; // 이기현_주문완료 컴포넌트
import MyOrderList from "./Components/Shop/MyOrderList"; // 이기현_주문내역 조회 컴포넌트

//-------------------------
import Higherlist from "./view/Higherlist";
import Latestlist from "./view/Latestlist";
import Lowerlist from "./view/Lowerlist";
import Product from "./view/Product";
import Productregister from "./view/Productregister";
import Reviewwriter from "./view/Reviewwirter";
import Answer from './view/Answer';
import Scrolltotop from "./Components/Scrolltotop";
import Revieweditor from "./view/Revieweditor";

function App() {
  const [cartlength, setcCartlength] = useState(0); // 장바구니에 담은 아이템 수

  useEffect(() => {
    // "baskets" 키에 대한 로컬 스토리지가 존재할 경우,
    if (localStorage.baskets !== undefined) {
      // "baskets" 키-값 데이터를 파싱하여 배열로 저장한 후,
      const baskets = JSON.parse(localStorage.getItem("baskets"));

      // 그 아이템의 수 만큼 setcCartlength 에 저장한다.
      setcCartlength(baskets.length);
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Scrolltotop />
        <Header cartlength={cartlength} />
        <div className="App_main_height">
          <Routes>
            {/* Main Page */}
            <Route exact path="/" element={<Main />} />
            {/* 이기현 */}
            <Route
              exact
              path="/cart"
              element={<Cart setcCartlength={setcCartlength} />}
            />
            {/* "/" 로컬 장바구니 페이지 라우팅 */}
            <Route
              exact
              path="/ordersheet"
              element={<Ordersheet setcCartlength={setcCartlength} />}
            />
            {/* "/" 주문서 작성 페이지 라우팅 */}
            <Route exact path="/completeOrder" element={<CompleteOrder />} />
            {/* "/" 주문 완료 페이지 라우팅 */}
            <Route exact path="/myOrderList" element={<MyOrderList />} />
            {/* "/" 주문 내역 조회 페이지 라우팅 */}
            {/* 이주호 */}
            {/* 김민호 */}
            <Route path="/Login" element={<LoginPage />}></Route>
            <Route path="/Modify" element={<Modify />}></Route>
            {/* <Route path="/Regester" element={<Regester />}></Route> */}
            <Route
              path="/Register/personal"
              element={<RegesterPersonal />}
            ></Route>
            {/* <Route
              path="/Regester/corporate"
              element={<RegesterCorporate />}
            ></Route>
            <Route path="/Regester/group" element={<RegesterGroup />}></Route> */}

            {/* 전윤호 */}
            {/* <Route path="/shop" element={<Shop />} /> */}
            <Route path="/shop/:categoryid/1/:page" element={<Latestlist />} />
            <Route path="/shop/:categoryid/2/:page" element={<Higherlist />} />
            <Route path="/shop/:categoryid/3/:page" element={<Lowerlist />} />
            {/* 20240307 prop 데이터 setcCartlength 추가_ 이기현 */}
            <Route
              path="/product/:id"
              element={<Product setcCartlength={setcCartlength} />}
            />
            <Route path="/product/register" element={<Productregister />} />
            <Route
              path="/review/:userid/:orderid/:prodid"
              element={<Reviewwriter />}
            />
            <Route path="/answer/:questionid" element={<Answer />} />
            <Route path="/review/editor/:reviewid" element={<Revieweditor />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
