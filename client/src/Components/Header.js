import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";

function Header({ cartlength }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const Server_URL = process.env.REACT_APP_Server_Side_Address;
  // 페이지가 로드될 때 로그인 상태를 확인하고 상태를 업데이트
  useEffect(() => {
    const storedLoggedIn = sessionStorage.getItem("loggedIn");
    if (storedLoggedIn) {
      setLoggedIn(true);
    }
  }, [setLoggedIn]);

  // 로그아웃 시 세션 스토리지에서 로그인 상태 제거
  const handleLogout = () => {
    sessionStorage.removeItem("loggedIn");
    sessionStorage.removeItem("usertype"); // 0304 이기현 추가
    sessionStorage.removeItem("userData"); //0210 상호형 추가
    setLoggedIn(false);
    navigate("/"); //0210 상호형 추가
    window.location.reload(); // 0312 전윤호 추가
  };

  return (
    <div className={styles.container}>
      <div className={styles.headercontainer}>
      <div>
          <Link to="/">
            <img src={`${Server_URL}/logo.png`} className={styles.logoimg} />
          </Link>
        </div>
        {loggedIn ? (
          <ul className={styles.logincontainer}>
            <li className={styles.LoginBtn} onClick={handleLogout}>
              로그아웃
            </li>
            <li>
              {/* 20240307 업데이트_이기현 */}
              <Link to="/cart">
                장바구니{" "}
                {cartlength > 0 ? (
                  <b className="header_cart_count_icon">{cartlength}</b>
                ) : (
                  <b></b>
                )}
              </Link>
            </li>
            <li>
              <Link to="/myOrderList">주문내역</Link>
            </li>
          </ul>
        ) : (
          // 로그아웃 상태일 때 로그인과 회원가입 버튼 표시
          <ul className={styles.logincontainer}>
            <li className={styles.LoginBtn}>
              <Link to="/Login">로그인</Link>
            </li>
            <li>
            <Link to="/Register/personal">회원가입</Link>
            </li>
            <li>
              {/* 20240307 업데이트_이기현 */}

              <Link to="/Login">
                장바구니{" "}
                {cartlength > 0 ? (
                  <b className="header_cart_count_icon">{cartlength}</b>
                ) : (
                  <b></b>
                )}
              </Link>
            </li>
          </ul>
        )}
      </div>
      {/* 20240213 테스트 추가_이기현 */}
      {/* ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ이기현 */}
      <div className={styles.horizon}></div>
      <ul className={styles.navcontainer}>
        <li>
          <Link to="/shop/1/1/1">리빙</Link>
        </li>
        <li>
          <Link to="/shop/2/1/1">패션</Link>
        </li>
        <li>
          <Link to="/shop/3/1/1">식품</Link>
        </li>
        <li>
          <Link to="/shop/4/1/1">헤어,바디</Link>
        </li>
      </ul>
      <div className={styles.horizon}></div>
    </div>
  );
}

export default Header;
