import Slider from 'react-slick'; 
import { useState, useEffect, useCallback, useRef  } from 'react'
import axios from 'axios'
import styles from './Banner.module.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";



const Banner = () => {
    const slickRef = useRef(null);

    const previous = useCallback(() => slickRef.current.slickPrev(), []);
    const next = useCallback(() => slickRef.current.slickNext(), []);
    const Server_URL = process.env.REACT_APP_Server_Side_Address;

    const settings = {
        dots: true,
        infinite: true,
        fade: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2500,
        arrows: false
    };

    const [banner, setBanner] = useState({
        bannerid: '',
        bannerurl: ''
    })


    useEffect(() => {
        async function fetchData() {
            const responses = await axios.get(`${Server_URL}/banner`, {})
            const rawData = await responses.data.map((it) => ({
                bannerid : it.bannerid,
                bannerurl: it.bannerurl
            }))
            setBanner(rawData);
        }
        fetchData();
    }, [])

    return (
        <div>
            <div className={styles.box}>
                <Slider {...settings} className={styles.slidercontainer} ref={slickRef}>
                {banner && banner.length > 0 ? 
                    banner.map((it) => (
                        <div key={it.bannerid}>
                            <img src={it.bannerurl} className={styles.bannerimg}/>
                        </div>
                    )) : ''}
                </Slider> 
                <div className={styles.arrowcontainer}>
                    <div onClick={previous} className={styles.arrow}>
                        &lt;
                    </div>
                    <div onClick={next} className={styles.arrow}>
                        &gt;
                    </div>
                </div>               
            </div>
            
        </div>
    )
}

export default Banner;