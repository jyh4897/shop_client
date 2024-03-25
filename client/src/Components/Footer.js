import React from "react";

import instaIcon from "../Components/Shop/image/icon_insta.png"; // 인스타 이미지
import youtubeIcon from "../Components/Shop/image/icon_youtube.png"; // 유튜브 이미지
import facebookIcon from "../Components/Shop/image/icon_facebook.png"; // 페이스북 이미지
import githubIcon from "../Components/Shop/image/icon_github.png"; // 페이스북 이미지

import "./Footer.css";

function Footer() {
  return (
    <div className="footer_full_container">
      <div className="footer_first_container">
        <nav className="family_site_nav">
          <ul>
            <li className="family_site_nav_item">
              <b>Family Site :</b>
            </li>
            <li className="family_site_nav_item">
              <a href="#">BBANG끗 캠페인</a>
            </li>
            <li className="family_site_nav_item">
              <a href="#">BBANG끗 커뮤니티</a>
            </li>
          </ul>
        </nav>
        <div className="footer_second_container">
          <div>
            <nav className="footer_nav">
              <ul>
                <li className="footer_nav_item">상호명: EZEN 빵끗 쇼핑몰</li>
                <li className="footer_nav_item">대표자명: 전윤호</li>
                <li className="footer_nav_item">
                  주소: 인천광역시 남동구 인주대로 593 엔타스 12층
                </li>
              </ul>
            </nav>
          </div>
          <div className="github_box">
            <div className="github_item">GitHub</div>
            <div className="github_item">
              <a
                href="https://github.com/hyundesk/project_shoppingMall"
                target="_blank"
              >
                <img className="github_image" src={githubIcon} />
              </a>
            </div>
          </div>
        </div>
        <div className="footer_third_container">
          <div className="footer_third_item">
            "BBANG끗샵"의 모든 콘텐트는 저작권법의 보호를 받은바, 무단 전재,
            복사, 배포 등을 금합니다. Copyright by "BBANG끗샵" All Rights
            Reserved.
          </div>
          <div className="footer_third_item">
            <nav className="sns_group_nav">
              <ul>
                <li className="sns_item">
                  <a href="https://www.instagram.com/" target="_blank">
                    <img src={instaIcon} />
                  </a>
                </li>
                <li className="sns_item">
                  <a href="https://www.youtube.com/" target="_blank">
                    <img src={youtubeIcon} />
                  </a>
                </li>
                <li className="sns_item">
                  <a href="https://www.facebook.com/" target="_blank">
                    <img src={facebookIcon} />
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
