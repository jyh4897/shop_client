import { Link } from "react-router-dom";
import React, { useState } from "react";
import DaumPostcode from "react-daum-postcode";
import { handlePostcode } from "./Handle/Postcodehandle";
import axios from "axios";
import "./combineRegister.css";

function RegesterPersonal() {
  const [username, setUsername] = useState(""); //이름
  const [email, setEmail] = useState(""); //이메일
  const [password, setPassword] = useState(""); //비밀번호
  const [confirmPassword, setConfirmPassword] = useState(""); //비밀번호확인
  const [openPostcode, setOpenPostcode] = useState(false); //주소
  const [address, setAddress] = useState(""); //주소
  const [detailedaddress, setdetailedaddress] = useState(""); //상세주소
  const [phonenumber, setphonenumber] = useState(""); //핸드폰번호
  const [emailDuplication, setEmailDuplication] = useState(true); //이메일 유효성
  // 이메일 유효성 검사 02/14 김민호

  const [formEffectiveness, setFormEffectiveness] = useState(true);

  // 서버 주소
  const Server_URL = process.env.REACT_APP_Server_Side_Address;

  const handle = handlePostcode(openPostcode, setOpenPostcode, setAddress);

  const setPasswordMatch = (match) => {
    // setPasswordMatch(true) 또는 setPasswordMatch(false) 등으로 사용
  };

  // 이메일 유효성 검사 02/14 김민호
  const handleEmailDuplicationCheck = () => {
    if (!email) {
      alert("이메일을 입력해주세요!");
      return;
    }

    // 클라이언트가 서버에 이메일 중복 확인을 요청합니다./0214 김민호
    axios
      .post(`${Server_URL}/checkEmailDuplication`, { email })
      .then((response) => {
        console.log("서버 응답:", response.data);
        setEmailDuplication(response.data.success);
        alert(response.data.message);
      })
      .catch((error) => {
        console.error("이메일 중복 확인 중 오류:", error);
        alert("이메일 중복 확인 중 오류가 발생했습니다.");
      });
  };

  const handleRegesterClick = () => {
    if (!username || !email || !password || !confirmPassword || !address) {
      alert("필수 입력 사항들을 모두 입력해주세요!");
      setFormEffectiveness(false);
      return;
    }
    if (!emailDuplication) {
      alert("이메일 중복 확인을 해주세요.");
      return;
    }

    if (!email) {
      alert("이메일을 입력해주세요!");
      return;
    }
    if (!emailDuplication) {
      alert("이미 등록된 이메일입니다.");
      return;
    }
    // if (!email.includes('@')) {
    //   alert('이메일을 입력해주세요!');
    //   return;
    // }

    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      setPasswordMatch(false);
      return;
    }
    // 이메일이 중복되었는지 확인합니다.
    // 이메일 유효성 검사 02/14 김민호

    // if (password.length < 10 || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    //   alert('비밀번호는 최소 10글자 이상이어야 하며, 특수문자를 포함해야 합니다.');
    //   return;
    // }

    // 클라이언트에서 서버로 회원가입 요청
    axios
      .post(`${Server_URL}/regester`, {
        username,
        password,
        email,
        address,
        detailedaddress,
        phonenumber,
        usertype: "personal",
      })
      .then((response) => {
        console.log("서버 응답:", response.data);
        alert("회원가입이 완료되었습니다.");
        if (response.data.userType === 1) {
          // 개인 사용자 처리
        }
        window.location.href = "/"; // 홈 페이지 또는 다른 페이지로 리디렉션
      })
      .catch((error) => {
        if (error.response) {
          // 서버가 응답한 상태 코드가 2xx가 아닌 경우
          console.error(
            "서버 응답 오류:",
            error.response.status,
            error.response.data
          );
        } else if (error.request) {
          // 서버로 요청이 전송되었지만 응답이 없는 경우
          console.error("서버 응답이 없음:", error.request);
        } else {
          // 요청을 설정하는 중에 에러가 발생한 경우
          console.error("요청 설정 중 오류:", error.message);
        }
        alert("서버와의 통신 중 오류가 발생했습니다.");
      });
  };

  return (
    <div className="register_full_container">
      <div>
        <div>
          <h1>회 원 가 입</h1>
          <div className="register_text_info_container">
            <span className="register_text_info">* 필수 입력 사항</span>
          </div>
          <div>
            <input
              className={
                formEffectiveness
                  ? "register_input_form"
                  : "register_input_form_false"
              }
              type="text"
              placeholder="사용자명*"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <br />
            <div className="register_password_container">
              <input
                className={
                  formEffectiveness
                    ? "register_input_password_form"
                    : "register_input_password_form_false"
                }
                type="password"
                placeholder="비밀번호*"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <input
                className={
                  formEffectiveness
                    ? "register_input_password_form"
                    : "register_input_password_form_false"
                }
                type="password"
                placeholder="비밀번호 확인*"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="register_email_container">
              <input
                className={
                  formEffectiveness
                    ? "register_input_email_form"
                    : "register_input_email_form_false"
                }
                type="text"
                placeholder="이메일*"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                className="register_input_email_btn"
                onClick={handleEmailDuplicationCheck}
              >
                확인
              </button>
            </div>
            {/* 이메일 유효성 검사 02/14 김민호 */}

            <input
              type="text"
              className={
                formEffectiveness
                  ? "register_input_form"
                  : "register_input_form_false"
              }
              placeholder="핸드폰번호*"
              value={phonenumber}
              onChange={(e) => setphonenumber(e.target.value)}
            />

            <br />
            <div className="register_address_container">
              <input
                className={
                  formEffectiveness
                    ? "register_input_address_form"
                    : "register_input_address_form_false"
                }
                type="text"
                placeholder="주소*"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />

              <button
                className="register_input_address_btn"
                onClick={handle.clickButton}
              >
                선택
              </button>
            </div>
            <div className="register_DaumPostcode_container">
              {openPostcode && (
                <DaumPostcode
                  onComplete={handle.selectAddress}
                  autoClose={false}
                  defaultQuery=""
                />
              )}
            </div>
            <input
              className={
                formEffectiveness
                  ? "register_input_form"
                  : "register_input_form_false"
              }
              type="text"
              placeholder="상세주소*"
              value={detailedaddress}
              onChange={(e) => setdetailedaddress(e.target.value)}
            />
          </div>
          <div className="register_btn_container">
            <button className="RegisterBtn" onClick={handleRegesterClick}>
              가입완료
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegesterPersonal;
