import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import "./Login.css";

//로그인 페이지 상태 변화 함수
function LoginPage() {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loginStatus, setloginStatus] = useState("");
  const [userTypes, setUserTypes] = useState(1);

  // 서버 주소
  const Server_URL = process.env.REACT_APP_Server_Side_Address;

  //어떤 체크박스가 클릭이 됬는지 확인 해주는 함수
  // const handleCheckboxChange = (type) => {
  //   setUserTypes(type);
  // }; // 현재 개인회원만 받으므로 비활성화_이기현

  const LoginPageJs = () => {
    console.log("LoginPageJs 함수 호출됨"); //스크립트 동작시 콘솔에 출력

    // 로그인 요청 구현
    axios
      .post(`${Server_URL}/login`, {
        email: email,
        password: password,
        usertype: userTypes,
      }) //회원 정보 email, password, usertype의 정보를 가져옴
      .then((response) => {
        console.log("서버 응답:", response);
        if (response.data.success) {
          const { usertype, userid, username } = response.data.data[0]; //0213 김민호 익스플로우세션
          const userData = {
            userid: userid,
            username: username,
            usertype: usertype,
          };
          sessionStorage.setItem("loggedIn", true);
          sessionStorage.setItem("userData", JSON.stringify(userData)); // 0210 상호형 추가 세션에 userNumber,username추가
          sessionStorage.setItem("usertype", usertype); //익스플로우 세션 데이터 추가 0213 김민호
          //Application에 세션스토리지 안에서 정보를 출력한다

          navigate("/");
          window.location.reload(); //0210 상호형 추가 페이지를강제로 리로드
        } else {
          // 로그인 실패 시 처리
          console.log("로그인 실패:", response.data);
          setloginStatus("로그인 실패: " + response.data.message);
        }
      });
  };

  return (
    <div className="login_full_container">
      <div>
        <h1>로 그 인</h1>
        <div className="login_container">
          <form className="login-form">
            <div className="login_notice_text">
              가입된 이메일과 비밀번호를 입력해주세요. <br /> 아직 등록하지 않은
              경우 BBANG끗샵 계정을 만드십시오.
            </div>
            <div>
              {/* 로그인 아이디 비밀번호 표시 */}
              <input
                className="login_input_form"
                id="id"
                type="text"
                placeholder=" 이메일"
                value={email}
                onChange={(e) => setemail(e.target.value)}
              />
              <br />
              <input
                className="login_input_form"
                type="password"
                placeholder=" 비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {loginStatus && (
                <div className="login_input_form_error">{loginStatus}</div>
              )}
              <br />
            </div>
            {/* 체크박스 표시  */}
            {/* <div className="login_form_checkbox_container">
              <div
                className={
                  userTypes === 1
                    ? `login_form_checkbox_checked`
                    : `login_form_checkbox`
                }
              >
                <input
                  type="checkbox"
                  className="login_form_checkbox_item"
                  id="personalCheckbox"
                  checked={userTypes === 1}
                  onChange={() => handleCheckboxChange(1)}
                />
                <label htmlFor="personalCheckbox">개 인</label>
              </div>
              <div
                className={
                  userTypes === 2
                    ? `login_form_checkbox_checked`
                    : `login_form_checkbox`
                }
              >
                <input
                  type="checkbox"
                  className="login_form_checkbox_item"
                  id="businessCheckbox"
                  checked={userTypes === 2}
                  onChange={() => handleCheckboxChange(2)}
                />
                <label htmlFor="businessCheckbox">기 업</label>
              </div>
              <div
                className={
                  userTypes === 3
                    ? `login_form_checkbox_checked`
                    : `login_form_checkbox`
                }
              >
                <input
                  type="checkbox"
                  className="login_form_checkbox_item"
                  id="organizationCheckbox"
                  checked={userTypes === 3}
                  onChange={() => handleCheckboxChange(3)}
                />
                <label htmlFor="organizationCheckbox">단 체</label>
              </div>
            </div> */}
            <hr></hr>
            <div className="login_btn_container">
              {/* 로그인 버튼 표시 */}
              <button
                className="login_btn"
                onClick={(e) => {
                  e.preventDefault();
                  // console.log("버튼 클릭됨");
                  LoginPageJs();
                }}
              >
                로그인
              </button>
              <button
                className="regester_btn"
                onClick={() => navigate("/Register/personal")}
              >
                회원가입
              </button>
            </div>
            <div className="login_find_link">
              <Link to="#">ID, 비밀번호 찾기</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
