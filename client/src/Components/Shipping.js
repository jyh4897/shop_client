import styles from './Shipping.module.css'



const Shipping = () => {

    return (
        <div className={styles.shippingcontainer}>
            <div className={styles.deliverycontainer}>
                <div className={styles.deliverytitle}>
                    <p>배송정보</p>
                </div>
                <ul className={styles.deliverycontent}>
                    <li>배송 방법: 순차배송</li>
                    <li>묶음배송 여부: 가능</li>
                    <li>배송비: 상품별 상이</li>
                    <li>배송 기간: 3~7일</li>
                    <li>배송 안내: 도서 산간 지역 등은 배송 기간이 더 소요될 수 있습니다.</li>
                </ul>
            </div>
            <div className={styles.exchangecontainer}>
                <div className={styles.exchangetitle}>
                    <p>교환/반품 안내</p>
                </div>
                <div className={styles.exchangecontent}>
                    <div>
                        <p className={styles.echtitle}>교환/반품 비용</p>
                        <p>
                        - [총 주문금액] - [반품 상품금액] = 19,800원 미만인 경우 반품비 5,000원<br/>
                        - [총 주문금액] - [반품 상품금액] = 19,800원 이상인 경우 반품비 2,500원
                        </p>
                    </div>
                    <div>
                        <p className={styles.echtitle}>교환 및 반품이 가능한 경우</p>
                        <p>- 상품을 수령한 날로부터 7일 이내, 단 가전제품의 경우 포장을 개봉하였거나 포장이 훼손되어 상품가치가 상실된 경우 교환/반품이 불가능합니다.</p>
                        <p>- 수령한 상품 및 용역의 내용이 표시,광고 내용과 다르거나 다르게 이행된 경우에는 공급받은 날로부터 3개월 이내, 또는 그 사실을 알게된 날로부터 30일 이내인 경우</p>
                    </div>
                    <div>
                        <p className={styles.echtitle}>교환 및 반품 제한사항</p>
                        <p>- 주문/제작 상품의 경우, 상품의 제작이 이미 진행된 경우</p>
                        <p>- 상품 포장을 개봉하여 사용 또는 설치 완료되어 상품의 가치가 훼손된 경우 (단, 내용 확인을 위한 포장 개봉의 경우는 예외)</p>
                        <p>- 고객의 사용, 시간경과, 일부 소비에 의하여 상품의 가치가 현저히 감소한 경우</p>
                        <p>- 세트상품 일부 사용, 구성품을 분실하였거나 취급 부주의로 인한 파손/고장/오염으로 재판매 불가한 경우</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Shipping;