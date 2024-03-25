import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Review.module.css';
import Paging from '../Components/Paging'

const Review = ({ id }) => {

    const [count, setCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPosts, setCurrentPosts] = useState(0);
    const postPerPage = 5;
    const indexOfLastPost = currentPage * postPerPage;
    const indexOfFirstPost = indexOfLastPost - postPerPage;
    const [point, setPoint] = useState(1);
    const [reviews, setReviews] = useState([{
        id: '',
        userid: '',
        orderid: '',
        prodid: '',
        title: '',
        content: '',
        rate: '',
        date: '',
        img1: '',
        img2: '',
        img3: '',
        img4: ''
    }]);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    const Admin = 150249
    const Server_URL = process.env.REACT_APP_Server_Side_Address;

    useEffect(() => {
        async function readReview () {
            try {
                const responses = await axios.get(`${Server_URL}/review`, {});
                const reviewData = responses.data.filter((it) => it.prodid === id);
                const options = {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false,
                    timeZone: 'Asia/Seoul'
                };
                const rawData = reviewData.map((it) => ({
                    id: it.reviewid,
                    userid: it.userid,
                    orderid: it.orderid,
                    prodid: it.prodid,
                    title: it.title,
                    content : it.content,
                    rate: it.rate,
                    date: new Intl.DateTimeFormat('en-US', options).format(new Date(it.date)).replace(/(\d+)\/(\d+)\/(\d+),/, '$3/$1/$2'),
                    img1 : it.img1,
                    img2: it.img2,
                    img3: it.img3,
                    img4: it.img4
                }));
                setReviews(rawData.sort((a,b) => b.id - a.id));
                setCount(rawData.length);
            }
            catch (error) {
                console.error('Error fetching reviews:', error) 
            }
        }
        readReview();
    }, [id])

    useEffect(() => {
        const reviewPoint = () => {
            var sum = 0;
            for (var i=0; i < reviews.length; i++) {
                sum += reviews[i].rate
            }
            setPoint(sum/(reviews.length))
        }
        reviewPoint();
    }, [reviews])

    useEffect(() => {
        setCurrentPosts(getsearchResult().slice(indexOfFirstPost, indexOfLastPost));
    }, [search, reviews, indexOfFirstPost, indexOfLastPost]);

    const onChangeSearch = (e) => {
        setSearch(e.target.value);
    }

    const handleChangePage = (page) => {
        setCurrentPage(page)
    }

    const getsearchResult = () => {
        return search === "" ? reviews : reviews.filter((it) => it.content.toLowerCase().includes(search.toLowerCase()));
    }

    const handleOnDelete = async (reviews) => {
        try {
            await axios.delete(`${Server_URL}/review`, {
                data : {
                    ...reviews
                },
                headers: {
                    'Content-Type': `application/json`,
                }
            })
            window.location.reload();           
        }
        catch {
            console.error("ERROR during delete");
        }
    }

    const handleRatebtn = () => {
        navigate('/myOrderList')
    }

    const goEditor = (id) => {
        navigate(`/review/editor/${id}`)
    }


    return (
        <div>
            <div className={styles.ratecontainer}>
                {currentPosts && currentPosts.length > 0 ?
                <div className={styles.avgrate}>
                    <span>상품만족도</span>
                    <div className={styles.ratebox}>
                        <img src={`${Server_URL}/star.jpg`} className={styles.rateimg} alt="이미지"/>
                        <p>{Number(point).toFixed(1)}/5.0</p>
                    </div> 
                </div>: '표시할 만족도가 없습니다'}
                <div>
                    <button className={styles.ratebtn} onClick={handleRatebtn}>상품평 쓰기</button>
                </div>
            </div>
            <div className={styles.inputcontainer}>
                <div>
                    <p>총 <strong>{reviews.length}</strong>개의 상품평</p>
                </div>
                <input value={search} onChange={onChangeSearch} className={styles.searchbar} placeholder="상품평을 검색해보세요" /> 
            </div>
            {currentPosts && currentPosts.length > 0 ? currentPosts.map((it) => (
                <div key={it.id} className={styles.reviewitem}>
                    <div className={styles.userinfo}>
                        <p>{it.userid}님</p>
                        <div className={styles.userratebox}>
                            <img src={`${Server_URL}/star.jpg`} className={styles.userrateimg} alt="이미지"/>
                            <p><strong>{it.rate}</strong>/5 점</p>
                        </div>
                        
                        <p className={styles.itemdate}>{it.date}</p>
                    </div>
                    <div className={styles.reviewcontent} key={it.id}>                        
                        <div className={styles.reviewimgcontainer} key={it.id}>
                            {it.img1 ? 
                                <img src={it.img1} className={styles.reviewimg} alt='이미지' />
                            : ''}
                            {it.img2 ? 
                                <img src={it.img2} className={styles.reviewimg} alt='이미지' />
                            : ''}
                            {it.img3 ? 
                                <img src={it.img3} className={styles.reviewimg} alt='이미지' />
                            : ''}
                            {it.img4 ? 
                                <img src={it.img4} className={styles.reviewimg} alt='이미지' />
                            : ''}
                        </div>
                        <div className={styles.items}>
                            <p className={styles.itemtitle}>{it.title}</p>
                            <p className={styles.itemcontent} dangerouslySetInnerHTML={{ __html : it.content }} />
                        </div>
                        {JSON.parse(sessionStorage.getItem('userData')) && (JSON.parse(sessionStorage.getItem('userData')).userid == Admin || JSON.parse(sessionStorage.getItem('userData')).userid == it.userid) ? <button onClick={() => handleOnDelete(it)} className={styles.deletebtn} >삭제하기</button>: ''}
                        {JSON.parse(sessionStorage.getItem('userData')) && JSON.parse(sessionStorage.getItem('userData')).userid == it.userid ? <button onClick={() => goEditor(it.id)} className={styles.editbtn}>수정하기</button>: ''}    
                    </div>               
                </div>
            )) : (
                <div>
                    <p>표시할 리뷰가 없습니다</p>
                </div>
            )}
            {currentPosts && currentPosts.length > 0 ? 
            <Paging page={currentPage} count={count} handleChangePage={handleChangePage} postPerPage={postPerPage} /> 
            : ''}
        </div>
    )
}


export default Review;