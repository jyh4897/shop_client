import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import axios from 'axios';
import Paging from '../Components/Paging';
import styles from './Higherlist.module.css'


const Highertlist = () => {

    const { categoryid, page } = useParams();
    const [products, setProducts] = useState([{
        id: '',
        name: '',
        price: '',
        thumbnail: '',
        date: ''
    }])

    const [count, setCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPosts, setCurrentPosts] = useState(0);
    const postPerPage = 9;
    const indexOfLastPost = page * postPerPage;
    const indexOfFirstPost = indexOfLastPost - postPerPage
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const title = [ "리빙", "패션", "식품", "헤어,바디" ]
    const Admin = 150249;
    const Server_URL = process.env.REACT_APP_Server_Side_Address;

    useEffect(() => {
        async function fetchData() {
            try {
                const rawData = await axios.get(`${Server_URL}/shop`, {});
                const categoryData = rawData.data.filter((it) => it.category.toString() === categoryid.toString());
                const prodData = categoryData.map((it) => ({
                    id: it.prodid,
                    name: it.title,
                    price: it.price,
                    thumbnail: it.thumbnail,
                    date: it.date
                }));
                const sortedProd = [...prodData].sort((a, b) => Number(b.price) - Number(a.price));
                setProducts(sortedProd);
                setCount(sortedProd.length);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    
        fetchData();
    }, [categoryid]); 

    useEffect(() => {
        setCurrentPosts(getSearchResult().slice(indexOfFirstPost, indexOfLastPost));
    },[page, search, products])

    const handleChangePage = (page) => {
        const newUrl = `/shop/${categoryid}/2/${page}`;
        navigate(newUrl);
        setCurrentPage(page)
    }

    const onChangeSearch = (e) => {
        setSearch(e.target.value);
    }

    const getSearchResult = () => {
        return search === "" ? products : products.filter((it) => it.name.toLowerCase().includes(search.toLowerCase()));
    }

    const goLatest = () => {
        navigate(`/shop/${categoryid}/1/1`)
    }

    const goHigher = () => {
        navigate(`/shop/${categoryid}/2/1`)
    }
    const goLower = () => {
        navigate(`/shop/${categoryid}/3/1`)
    }

    const goRegister = () => {
        navigate('/product/register')
    }

    return (
        <div className={styles.listcontainer}>
            <div className={styles.titlecontainer}>
                <p className={styles.title}>{title[categoryid-1]}</p>
            </div>
            <div className={styles.listnavbar}>
                <div>
                    <ul>
                        <li>총 <span className={styles.itemscount}>{count}</span>개의 상품이 있습니다.</li>
                    </ul>
                </div>
                <ul className={styles.orderlist}>
                    <li onClick={goLatest}>최신순</li>
                    <li onClick={goLower}>낮은가격순</li>
                    <li onClick={goHigher}><strong>높은가격순</strong></li>
                </ul>
            </div>
            <div className={styles.searchbox}>
                <input value={search} onChange={onChangeSearch} className={styles.searchbar} placeholder="검색어를 입력하세요" /> 
            </div>
            <div className={styles.items}>
                {currentPosts && currentPosts.map((product) => (
                    <div key={product.id} className={styles.proditemcontainer}>
                        <ul className={styles.itembox}>
                            <div className={styles.imgbox}>
                                <Link to={`/product/${product.id}`} >
                                    <img src={product.thumbnail} className={styles.itemimg} alt="이미지"/>
                                </Link>
                            </div>
                            <li className={styles.productname}>{product.name}</li>
                            <li className={styles.productprice}>{product.price.toLocaleString()}원</li>
                        </ul>
                    </div>
                ))}
            </div>
            <div className={styles.registercontainer}>
                {JSON.parse(sessionStorage.getItem('userData')) && JSON.parse(sessionStorage.getItem('userData')).userid == Admin ? <button onClick={goRegister} className={styles.registerbtn}>상품 등록</button> 
                : ''}
            </div>
            <Paging page={page} count={count} handleChangePage={handleChangePage} postPerPage={postPerPage} />
        </div>
    )
}

export default Highertlist;