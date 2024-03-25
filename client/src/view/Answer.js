import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import styles from './Answer.module.css'

const Answer = () => {

    const { questionid } = useParams();
    const [question, setQuestion] = useState([{
        questionid: '',
        userid : '',
        prodid : '',
        content : '',
        date: ''       
    }]);
    const [product, setProduct] = useState([{
        prodid: '',
        name:''
    }])
    const [answer, setAnswer] = useState('');
    const navigate = useNavigate();
    const Server_URL = process.env.REACT_APP_Server_Side_Address;

    useEffect(() => {
        async function readQuestion () {
            const responses = await axios.get(`${Server_URL}/question`, {})
            const filteredData = await responses.data.filter((it) => it.qid == questionid)
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
            const rawData = await filteredData.map((it) => ({
                questionid : it.qid,
                userid: it.userid,
                prodid : it.prodid,
                content: it.content,
                date : new Intl.DateTimeFormat('en-US', options).format(new Date(it.date)).replace(/(\d+)\/(\d+)\/(\d+),/, '$3/$1/$2')
            }));
            const prodresponses = await axios.get(`${Server_URL}/shop`, {});
            const filterprod = await prodresponses.data.filter((it) => it.prodid == rawData[0].prodid)
            const prodrawData = await filterprod.map((it) => ({
                prodid: it.prodid,
                name: it.title
            }))
            setQuestion(rawData);
            setProduct(prodrawData)
        }
        readQuestion();
        
    }, [])

    const handleAnswer = (e) => {
        setAnswer(e.target.value)
    }

    async function handleSubmit () {
        const pushData = [question[0].questionid, answer.replace(/\n/g, '<br>'), product[0].prodid]
        console.log(pushData);
        await axios.post(`${Server_URL}/answer`, pushData)
        .then((result) => {
            console.log('요청성공')
            console.log(result)
        })
        .catch((error) => {
            console.log('error')
            console.log(error)
        })
        navigate(`/product/${product[0].prodid}`)
    }

    return (
        <div className={styles.container}>
            <div className={styles.questioninfo}>
                <div className={styles.questiondetail}>
                    <div className={styles.detailleft}>
                        <div className={styles.detailname}>
                            <div className={styles.leftmenu}>
                                <p>작성자</p>
                            </div>
                            <div className={styles.leftcontent}>
                                <p>{question[0].userid}</p>
                            </div>
                        </div>
                        <div className={styles.detailname}>
                            <div className={styles.leftmenu}>
                                <p>작성일</p>
                            </div>
                            <div className={styles.leftcontent}>
                                <p>{question[0].date}</p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.detailright}>
                        <div className={styles.rightmenu}>
                            <p>상품명</p>
                        </div>
                        <div className={styles.rightcontent}>
                            <p>{product[0].name}</p>
                        </div>
                    </div>
                </div>
                <div className={styles.questioncontent}>
                    <div className={styles.question}>
                        <p>문의 내용</p>
                    </div>
                    
                    <div className={styles.leftcontent}>
                        <p dangerouslySetInnerHTML={{ __html : question[0].content }} />
                    </div>
                </div>
            </div>
            <div className={styles.answercontainer}>
                <div className={styles.answer}>
                    <p>답변</p>
                </div>
                <div className={styles.textbox}>
                    <textarea rows="20" cols="100" onChange={(e) => handleAnswer(e)}/>
                </div>
                
            </div>
            <div className={styles.btnbox}>
                <button onClick={handleSubmit} className={styles.enrollbtn}>등록</button>
                <button className={styles.closebtn}>취소</button>
            </div>
        </div>
    )
}

export default Answer;