import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import styles from './Questionmodal.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

const Questionmodal = ({products}) => {

    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState('')
    const [userid, setUserid] = useState('')
    const [loggedIn, setLoggedIn] = useState(false);
    const navigate = useNavigate();
    const Server_URL = process.env.REACT_APP_Server_Side_Address;

    useEffect(() => {
        const storedLoggedIn = sessionStorage.getItem("loggedIn");
        const userData = JSON.parse(sessionStorage.getItem("userData"));
        if (storedLoggedIn) {
        setLoggedIn(true);
        setUserid(userData.userid)
        }
    }, [setLoggedIn, userid]);
    
    const handleOpen = ()=> {
        if (loggedIn) {
        setIsOpen(true);}
        else {
            navigate('/login')
        }
    }

    const handleClose = () => {
        setIsOpen(false);
    }

    const handleChangeContent = (e) => {
        setContent(e.target.value)
    }

    

    async function handleSubmit () {
        const pushData = [products[0].id, userid, content.replace(/\n/g, '<br>')]
        console.log(pushData)
        await axios.post(`${Server_URL}/question`, pushData)
        .then((result) => {
            console.log('요청성공')
            console.log(result)
        })
        .catch((error) => {
            console.log('error')
            console.log(error)
        })
        setIsOpen(false);
        window.location.reload();
    }

    return (
        <div>
            <button onClick={handleOpen} className={styles.modalbtn}>문의하기</button>
            <Modal
                open={isOpen}
                onClose={handleClose}
            >
                <div className={styles.modal}>
                    <div className={styles.closebox}>
                        <span>상품 문의</span>
                        <button onClick={handleClose} className={styles.closebutton}>x</button>
                    </div>
                    <div className={styles.contentbox}>
                        <div className={styles.prodbox}>
                            <div className={styles.menuname}>
                                <p>상품명</p>
                            </div>
                            <div className={styles.prodname}>
                                <img src={products[0].thumbnail} className={styles.modalprodimg}/>
                                <span>{products[0].name}</span>
                            </div>
                        </div>
                        <div className={styles.questionbox}>
                            <div className={styles.questiontext}>
                                <p>문의사항</p>
                            </div>
                            <textarea rows="10" cols="80" className={styles.textbox} onChange={(e) => handleChangeContent(e)} />
                        </div>
                        <div className={styles.infor}>
                            <p>* 개인정보(주민번호, 연락처, 주소, 계좌번호, 카드번호 등)가 포함되지 않도록 유의해주세요.</p>
                        </div>
                        <div className={styles.btnbox}>
                            <button onClick={handleSubmit} className={styles.inputbtn}>완료</button>
                            <button onClick={handleClose} className={styles.closebtn}>취소</button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}


export default Questionmodal;