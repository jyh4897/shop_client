import React from "react";
import { Link, useNavigate } from "react-router-dom";

import personalIcon from "../Shop/image/iconMj01.png"; // 개인회원 이미지
import corporateIcon from "../Shop/image/iconMj03.png"; // 기업회원 이미지
import groupIcon from "../Shop/image/iconMj02.png"; // 단체회원 이미지

import "./Regester.css";

function Regester() {
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
  };

  const handleRegesterClick = () => {
    // 회원가입이 성공하면 다음 경로로 이동합니다.
    navigate("/");
  };

  return (
    <div className="register_type_full_container">
      <div>
        <h1>회 원 가 입</h1>
        <div>
          <h1>
            <b style={{ color: "green" }}>BBANG끗샵</b>에 오신 것을 환영합니다!
          </h1>
        </div>
        <div className="register_type_container">
          <div
            className="register_type"
            onClick={() => navigateTo("/Regester/personal")}
          >
            개인 회원 <br />
            <img src={personalIcon} />
          </div>
          <div
            className="register_type"
            onClick={() => navigateTo("/Regester/corporate")}
          >
            기업 회원 <br />
            <img src={corporateIcon} />
          </div>
          <div
            className="register_type"
            onClick={() => navigateTo("/Regester/group")}
          >
            단체 회원 <br />
            <img src={groupIcon} />
          </div>
        </div>
        <br />
        <div>
          이미 가입회원일 경우,{" "}
          <button className="register_navigate_login_btn">
            <Link to="/login">로그인 {">"}</Link>
          </button>{" "}
          을 클릭해주세요.
        </div>
      </div>
    </div>
  );
}

export default Regester;
