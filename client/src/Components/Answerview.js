import { useState, useEffect } from "react";
import axios from "axios";
import styles from './Answerview.module.css'

const Answerview = ({questionid}) => {

    const [answer, setAnswer] = useState([{
        answer: '',
        answerdate: '',
        qid: ''
    }])
    const Server_URL = process.env.REACT_APP_Server_Side_Address;

    useEffect(() => {
        async function readAnswer () {
            const answerresponses = await axios.get(`${Server_URL}/answer`, {})
            const filteredAnswer = await answerresponses.data.filter((it) => it.qid == questionid)
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
            const answerrawData = await filteredAnswer.map((it) => ({
                answer: it.answer,
                answerdate: new Intl.DateTimeFormat('en-US', options).format(new Date(it.date)).replace(/(\d+)\/(\d+)\/(\d+),/, '$3/$1/$2'),
                qid: it.qid
            }))
            setAnswer(answerrawData)
        }
        readAnswer();
    }, [])

    return (
        <div className={styles.answercontainer}>
            {answer && answer.length > 0 ? 
            answer.map((it) =>
            <div key={it.qid} className={styles.answeritems}>
                <div className={styles.answercontent}>
                    <div className={styles.answericon}>
                        <p>↳</p>
                        <p className={styles.answermark}>답변</p>
                    </div>                    
                    <p dangerouslySetInnerHTML={{ __html : it.answer }} />
                </div>
                <p className={styles.answerdate}>{it.answerdate}</p>
            </div>
            )
            : ''}
        </div>
    )
}

export default Answerview;