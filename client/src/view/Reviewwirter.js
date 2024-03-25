import React from 'react';
import { useState,useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import styles from './Reviewwriter.module.css'


const desc = ['1점', '2점', '3점', '4점', '5점'];

const Reviewwriter = () => {

    const { userid, orderid, prodid } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [value, setValue] = useState(3);
    const [img, setImg] = useState([]);
    const navigate = useNavigate();
    const [products, setProducts] = useState([{
        id: '',
        name: '',
        description: '',
        price: '',
        thumbnail: '',
        img1: '',
        img2: '',
        img3: '',
        img4: ''
    }])
    const Server_URL = process.env.REACT_APP_Server_Side_Address;

    useEffect(() => {
        async function resData() {
            const responses = await axios.get(`${Server_URL}/shop`, {})
            const inputData = await responses.data.filter((it) => it.prodid == prodid)
            const product = await inputData.map((it) => ({
                id: it.prodid,
                name: it.title,
                description: it.description,
                price: it.price,
                thumbnail: it.thumbnail,
                img1: it.img1,
                img2: it.img2,
                img3: it.img3,
                img4: it.img4,
            }))
            setProducts(product);
        }
        resData();
    }, [prodid])
    

    const handleChangeTitle = (e) => {
        setTitle(e.target.value)
    }

    const handleChangeContent = (e) => {
        setContent(e.target.value);
    }

    const handleChangeFile = (e) => {
        const selectedFiles = e.target.files;
                
        if(selectedFiles.length > 0){
        const filesArray = Array.from(selectedFiles);
        setImg((prev) => [...prev, ...filesArray])
        }

    };

    async function handleSubmit () {
        try {
            const formData = new FormData();
            formData.append('userid', userid);
            formData.append('orderid', orderid);
            formData.append('prodid', prodid);
            formData.append('title', title);
            formData.append('content', content.replace(/\n/g, '<br>'));
            formData.append('rate', value);


            img.forEach((img, index) => {
                formData.append(`files`, img);
            })

            for (var key of formData) {
                console.log(key)
            }
            await axios.post(`${Server_URL}/review`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
            })
            .then((result)=>{console.log('요청성공')
            console.log(result)
            
            })
            .catch((error) => {console.log('error')
            console.log(error)
            })
            
            setImg([]); // 이미지 업로드가 성공하면 초기화
        }
        catch(error) {
            console.error('Error during POST request:', error);
        }
        navigate('/myOrderList')
    }

    const handleCancle = () => {
        navigate("/")
    }


    return (
        <div className={styles.reviewwriter}>
            <div className={styles.namecontainer}>
                <div className={styles.namemenu}>
                    <p>상품명</p>
                </div>
                <div className={styles.namecontent}>
                    <img src={products[0].thumbnail} className={styles.prodimg} />
                    <p>{products[0].name}</p>
                </div>
            </div>
            <div className={styles.ratecontainer}>
                <div className={styles.ratemenu}>
                    <p>평점</p>
                </div>
                <div className={styles.ratecontent}>
                    <select value={value} onChange={(e) => setValue(e.target.value)} className={styles.rate}>
                        <option value={5}>5점</option>
                        <option value={4}>4점</option>
                        <option defaultValue={3} value={3} >3점</option>
                        <option value={2}>2점</option>
                        <option value={1}>1점</option>
                    </select>
                </div>
            </div>
            <div className={styles.titlecontainer}>
                <div className={styles.titlemenu}>
                    <p>한줄 평</p>
                </div>
                <div className={styles.titlecontent}>
                    <input type="text" onChange={(e) => handleChangeTitle(e)} className={styles.title}/>
                </div>
            </div>
            <div className={styles.detailcontainer}>
                <div className={styles.detailmenu}>
                    <p>상세 후기</p>
                </div>
                <div className={styles.detailcontent}>
                    <textarea rows="20" cols="80" onChange={(e) => handleChangeContent(e)} className={styles.detail} />
                </div>
            </div>
            <div className={styles.filecontainer}>
                <div className={styles.filemenu}>
                    <p>파일 첨부</p>
                </div>
                <div className={styles.filecontent}>
                    <input type="file" id="file-input" name="files" onChange={(e) => handleChangeFile(e)} multiple />
                    <div className={styles.filedetail}>
                        <div className={styles.filenamearray}>
                            {img.length ? img.map((it,index) => <span key={index} className={styles.filename}>{it.name} </span>) : ''}
                        </div>
                        <div className={styles.filearray}>
                            {img.length ? img.map((img, index) => (
                            <img key={index} src={URL.createObjectURL(img)} className={styles.previewimg} alt={`Image ${index + 1}`} onLoad={() => URL.revokeObjectURL(img)} />
                        )) : '' }
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.btncontainer}>
                <button onClick={handleSubmit} className={styles.enrollbtn}>등록</button>
                <button onClick={handleCancle} className={styles.cancelbtn}>취소</button>
            </div>
        </div>
    )
}

export default Reviewwriter;