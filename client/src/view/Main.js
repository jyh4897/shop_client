import React from 'react'
import Banner from '../Components/Banner'
import styles from './Main.module.css'
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import Slider from 'react-slick'; 
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Main() {

    const [best, setBest] = useState({
        prodid: '',
        name: '',
        price: '',
        thumbnail: '',
        count: ''
    })
    const Server_URL = process.env.REACT_APP_Server_Side_Address;

    useEffect(() => {
        async function fetchData() {
        try {
            const responses = await axios.get(`${Server_URL}/ordercount`, {});
            const rawData = await responses.data.map((it) => ({
                prodid: it.prodid,
                name: it.title,
                price: it.price.toLocaleString(),
                thumbnail: it.thumbnail,
                count: it.ordered
            }))
            const sortedData = [...rawData].sort((a,b) => Number(b.count) - Number(a.count)).slice(0,9)
            
            setBest(sortedData)
        }
        catch (error) {
            console.error("에러!!")
        }
        }
        fetchData()
    }, [])

    const settings = {
        dots: true,
        infinite: true,
        speed: 1000,
        slidesToShow: 3,
        slidesToScroll: 3,
        autoplay: false,
        arrows: false,
        appendDots: dots => (
            <div
            style={{

            }}
            >
            <ul style={{ margin: "0px", height: "20px" }}> {dots} </ul>
            </div>
        ),
    };

    useEffect(() => {
        if (sessionStorage.userData) {
            const logindata = JSON.parse(sessionStorage.getItem('userData'))
            if(logindata.userid == 150249) {
                sessionStorage.setItem("authorized", true)
            }
            else {
                sessionStorage.setItem("authorized", false)
            }
        }
        else {
            sessionStorage.removeItem("authorized")
        }
    })


  return (
    <div className={styles.container}>
      <Banner />
      <div className={styles.bestitems}>
                <div className={styles.besttitle}>
                    <span>BEST</span>
                </div>
                <Slider {...settings} className={styles.bestslidercontainer}>
                    {best && best.length > 0 ? best.map((it) => (
                        <div key={it.prodid} className={styles.bestcontainer}>
                            <Link to={`/product/${it.prodid}`}>
                                <div className={styles.bestimgcontainer}><img src={it.thumbnail} className={styles.bestimg}/></div>
                                <div className={styles.bestname}>{it.name}</div>
                                <div className={styles.bestprice}>{it.price}원</div>
                            </Link>
                        </div>
                    )) : ''}
                </Slider>
            </div>
            <div className={styles.recommendcontainer}>
                <div className={styles.recommendtitle}>
                    <strong>추천 카테고리</strong>
                </div>
                <div>
                    <ul className={styles.categroycontainer}>
                            <li className={styles.categoryitem}>
                                <Link to={`/shop/1/1/1`}>
                                    <img src={`${Server_URL}/living.jpg`} className={styles.categoryimg}/>
                                </Link>
                                <Link to={`/shop/1/1/1`}>
                                    <span className={styles.categorytitle}>리빙</span>
                                </Link>
                            </li>
                            <li className={styles.categoryitem}>
                                <Link to={`/shop/2/1/1`}>
                                    <img src={`${Server_URL}/fashion.jpeg`} className={styles.categoryimg}/>
                                </Link>
                                <Link to={`/shop/2/1/1`}>
                                    <span className={styles.categorytitle}>패션</span>
                                </Link>                                
                            </li>
                                <li className={styles.categoryitem}>
                                <Link to={`/shop/3/1/1`}>
                                    <img src={`${Server_URL}/grocery.jpeg`} className={styles.categoryimg}/>
                                </Link>
                                <Link to={`/shop/3/1/1`}>
                                    <span className={styles.categorytitle}>식품</span>
                                </Link>
                            </li>
                            <li className={styles.categoryitem}>
                                <Link to={`/shop/4/1/1`}>
                                    <img src={`${Server_URL}/hair.jpg`} className={styles.categoryimg}/>
                                </Link>
                                <Link to={`/shop/4/1/1`}>
                                    <span className={styles.categorytitle}>헤어,바디</span>
                                </Link>    
                            </li>
                    </ul>
                </div>
            </div>
    </div>
  )
}

export default Main