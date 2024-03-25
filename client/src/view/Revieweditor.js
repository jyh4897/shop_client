import React from 'react';
import { useState,useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import styles from './Revieweditor.module.css'



const Revieweditor = () => {

    const { reviewid } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [value, setValue] = useState(3);
    const [img, setImg] = useState([]);
    const navigate = useNavigate();
    const [ selectedindex, setSelectedindex ] = useState(null);
    const [checkedIndices, setCheckedIndices] = useState([]);
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
    const [prevreview, setPrevreview] = useState([{
        reviewid: '',
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
    }])


    useEffect(() => {
        async function resData() {
            const rawreview = await axios.get("http://localhost:8000/review", {});
            const inputReview = await rawreview.data.filter((it) => it.reviewid == reviewid);
            
            const options = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false, // 24-hour time format
                timeZone: 'Asia/Seoul', // 날짜가 이미 UTC로 표시되어 있으므로 UTC로 설정
            };
            const reviews = await inputReview.map((it) => ({
                reviewid: it.reviewid,
                userid: it.userid,
                orderid: it.orderid,
                prodid: it.prodid,
                title: it.title,
                content: it.content,        
                rate: it.rate,
                date: it.date,
                img1: it.img1,
                img2: it.img2,
                img3: it.img3,
                img4: it.img4
            }))
            
            setPrevreview(reviews)
            setValue(reviews[0].rate)
            setTitle(reviews[0].title)
            setContent(reviews[0].content)
            setImg([])
            console.log(reviews)
            // const [{ img1, img2, img3, img4 }] = reviews
            // setImg([img1, img2, img3, img4].filter(item => item !== null))
            const responses = await axios.get("http://localhost:8000/shop", {})
            const inputData = await responses.data.filter((it) => it.prodid == reviews[0].prodid)
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
    }, [reviewid])
    

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
            formData.append('reviewid', prevreview[0].reviewid);
            formData.append('title', title);
            formData.append('content', content.replace(/\n/g, '<br>'));
            formData.append('rate', value);


            img.forEach((img, index) => {
                formData.append(`files`, img);
            })

            for (var key of formData) {
                console.log(key)
            }
            await axios.put('http://localhost:8000/review', formData, {
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
            
            
        }
        catch(error) {
            console.error('Error during POST request:', error);
        }
        navigate(`/product/${products[0].id}`)
    }

    const handleCancle = () => {
        navigate(`/product/${products[0].id}`)
    }

    

    const deleteSelceted = () => {
        console.log(selectedindex)
        console.log(img)
        const newimg = img.filter((_, index) => index !== selectedindex);
        setImg(newimg);
        console.log(newimg)
    }
    
    const toggleCheckbox = (index) => {
        if (checkedIndices.includes(index)) {
          setCheckedIndices(checkedIndices.filter(i => i !== index));
          setSelectedindex(null);
        } else {
          setCheckedIndices([index]);
          setSelectedindex(index);
        }
    };

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
                        <option value={3}>3점</option>
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
                    <input type="text" onChange={(e) => handleChangeTitle(e)} className={styles.title} defaultValue={prevreview[0].title}/> 
                </div>
            </div>
            <div className={styles.detailcontainer}>
                <div className={styles.detailmenu}>
                    <p>상세 후기</p>
                </div>
                <div className={styles.detailcontent}>
                    <textarea rows="20" cols="80" onChange={(e) => handleChangeContent(e)} className={styles.detail} defaultValue={prevreview[0].content.replace(/<[^>]+>/g, ' ')} />
                </div>
            </div>
            <div className={styles.filecontainer}>
                <div className={styles.filemenu}>
                    <p>파일 첨부</p>
                </div>
                <div className={styles.filecontent}>
                    <div className={styles.filebtn}>
                        <button type="submit" onClick={deleteSelceted} className={styles.deletebtn}>선택 삭제</button>
                        <input type="file" id="file-input" name="files" onChange={(e) => handleChangeFile(e)} multiple className={styles.inputbtn}/>
                    </div>
                    <div className={styles.filedetail}>
                        <div className={styles.filearray}>
                            {img.length ? img.map((img, index) => (
                            <div key={index} className={styles.filebox}>
                                <img key={img} src={ String(img).includes('http') ? img : URL.createObjectURL(img) } className={styles.previewimg} alt={`Image ${index + 1}`}  onLoad={() => URL.revokeObjectURL(img)}/>
                                <input type='checkbox' checked={checkedIndices.includes(index)} onChange={() => toggleCheckbox(index)}/>
                            </div>
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

export default Revieweditor;