import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import aixos from "axios";
import styles from "./Product.module.css";
import Question from "../Components/Question";
import Review from "../Components/Review";
import Questionmodal from "../Components/Questionmodal";
import Shipping from "../Components/Shipping";

const Product = ({setcCartlength}) => {
  const { id } = useParams();
  const [image, setImage] = useState([]);
  const [clickedImage, setClickedImage] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [products, setProducts] = useState([
    {
      id: "",
      name: "",
      description: "",
      price: "",
      thumbnail: "",
      img1: "",
      img2: "",
      img3: "",
      img4: "",
    },
  ]);
  const navigate = useNavigate();
  const Server_URL = process.env.REACT_APP_Server_Side_Address;

  useEffect(() => {
    async function resData() {
      const responses = await aixos.get(`${Server_URL}/shop`, {});
      const inputData = await responses.data.filter((it) => it.prodid == id);
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
      }));
      setProducts(product);
      const [{ thumbnail, img1, img2, img3, img4 }] = product;
      setImage([thumbnail, img1, img2, img3, img4]);
      setClickedImage(thumbnail);
    }
    resData();
  }, [id]);

  useEffect(() => {
    if (products.length > 0) {
      setTotal(parseInt(products[0].price));
    } else {
      setTotal(0);
    }
  }, [products]);

  const [quantity, setQuantity] = useState(1);
  const [total, setTotal] = useState(0);

  const handleClickCounter = (num) => {
    setQuantity(quantity + num);
    setTotal(total + parseInt(products[0].price) * num);
  };

  const handleChangeInput = (e) => {
    let newValue = parseInt(e.target.value);
    if (!isNaN(newValue) && newValue >= 1) {
      setQuantity(newValue);
      setTotal(parseInt(products[0].price) * newValue);
    }
  };

  const onClickBasket = (products) => {
    if (localStorage.baskets === undefined) {
      localStorage.setItem("baskets", JSON.stringify([]));
    }

    const baskets = JSON.parse(localStorage.getItem("baskets"));

    let isExist = false;
    baskets.forEach((item) => {
      if (products[0].id === item.id) {
        isExist = true;
      }
    });
    if (isExist) {
      alert("이미 장바구니에 담으셨습니다.");
      return;
    }
    // const data = {...products[0], 'quantity' : quantity} < 원본
    const data = { ...products[0], quantity: quantity, isCheck: false }; // 추가_이기현
    baskets.push(data);
    setcCartlength(baskets.length); // 추가_이기현, 장바구니 수량 업데이트
    localStorage.setItem("baskets", JSON.stringify(baskets));
  };

  const handleChangeImage = (index) => {
    setClickedImage(image[index]);
    setSelectedImageIndex(index);
  };

  const handlePurchase = () => {
    const loginData = JSON.parse(sessionStorage.getItem("loggedIn"));

    if (!loginData) {
      navigate("/Login");
    } else {
      navigate("/ordersheet", {
        state: {
          ...products[0],
          quantity: quantity,
          orderType: "single_order",
        },
      });
      if (localStorage.baskets === undefined) {
        localStorage.setItem("baskets", JSON.stringify([]));
      }

      const baskets = JSON.parse(localStorage.getItem("baskets"));

      let isExist = false;
      baskets.forEach((item) => {
        if (products[0].id === item.id) {
          isExist = true;
        }
      });
      if (isExist) {
        return;
      }
      // const data = {...products[0], 'quantity' : quantity} < 원본
      const data = { ...products[0], quantity: quantity, isCheck: false }; // 추가_이기현
      baskets.push(data);
      localStorage.setItem("baskets", JSON.stringify(baskets));
    }
  };

  return (
    <div className={styles.container}>
      {products &&
        products.map((it) => (
          <div key={it.id}>
            <div className={styles.productinfo}>
              <div className={styles.imagecontainer}>
                <div className={styles.bigimage}>
                  <img
                    src={clickedImage}
                    className={styles.bigimagedetail}
                    alt="이미지"
                  />
                </div>
                <div className={styles.smallimages}>
                  {image.length
                    ? image.map(
                        (it, index) =>
                          it && (
                            <img
                              src={it}
                              key={index}
                              className={`${styles.detailimage} ${
                                selectedImageIndex === index
                                  ? styles.selectedImage
                                  : ""
                              }`}
                              onClick={() => handleChangeImage(index)}
                              alt="이미지"
                            />
                          )
                      )
                    : ""}
                </div>
              </div>
              <div key={it.id} className={styles.productcontainer}>
                <p className={styles.productname}>{it.name}</p>
                <div className={styles.proddetail}>
                  <div className={styles.detailitems}>
                    <p className={styles.itemmenu}>국내,해외배송</p>
                    <p>국내배송</p>
                  </div>
                  <div className={styles.detailitems}>
                    <p className={styles.itemmenu}>배송방법</p>
                    <p>택배</p>
                  </div>
                  <div className={styles.detailitems}>
                    <p className={styles.itemmenu}>배송비</p>
                    <p>2,500원</p>
                  </div>
                  <div className={styles.detailitems}>
                    <p className={styles.itemmenu}>제조사</p>
                    <p>빵끗샵</p>
                  </div>
                  <div className={styles.detailitems}>
                    <p className={styles.itemmenu}>원산지</p>
                    <p>국내</p>
                  </div>
                </div>
                <div className={styles.counter}>
                  <button
                    type="button"
                    onClick={() => handleClickCounter(-1)}
                    disabled={quantity === 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    className={styles.inputnumber}
                    onBlur={handleChangeInput}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                  />
                  <button type="button" onClick={() => handleClickCounter(+1)}>
                    +
                  </button>
                </div>
                <div className={styles.price}>
                  <div>총 상품금액 :</div>
                  <div className={styles.totalprice}>
                    <strong>{total.toLocaleString()} 원</strong>
                  </div>
                </div>
                <div className={styles.btncontainer}>
                  <div>
                    <button
                      className={styles.bascketbtn}
                      onClick={() => onClickBasket(products)}
                    >
                      장바구니 추가
                    </button>
                  </div>
                  <div>
                    <button
                      className={styles.purchasebtn}
                      onClick={() => handlePurchase(products)}
                    >
                      구매하기
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.productnav}>
              <ul className={styles.nav_container} id="detail">
                <li className={styles.activenav}>
                  <a href="#detail">상품 상세</a>
                </li>
                <li>
                  <a href="#review">상품평</a>
                </li>
                <li>
                  <a href="#question">상품 문의</a>
                </li>
                <li>
                  <a href="#guide">배송/교환/반품 안내</a>
                </li>
              </ul>
            </div>
            <div className={styles.productdetail}>
              <div dangerouslySetInnerHTML={{ __html: it.description }} />
            </div>
            <div className={styles.productnav} id="review">
              <ul className={styles.nav_container}>
                <li>
                  <a href="#detail">상품 상세</a>
                </li>
                <li className={styles.activenav}>
                  <a href="#review">상품평</a>
                </li>
                <li>
                  <a href="#question">상품 문의</a>
                </li>
                <li>
                  <a href="#guide">배송/교환/반품 안내</a>
                </li>
              </ul>
            </div>
            <Review id={id} />
            <div className={styles.productnav}>
              <ul className={styles.nav_container} id="question">
                <li>
                  <a href="#detail">상품 상세</a>
                </li>
                <li>
                  <a href="#review">상품평</a>
                </li>
                <li className={styles.activenav}>
                  <a href="#question">상품 문의</a>
                </li>
                <li>
                  <a href="#guide">배송/교환/반품 안내</a>
                </li>
              </ul>
            </div>
            <div className={styles.question}>
              <div className={styles.modalbox}>
                <p className={styles.questiontitle}>상품문의</p>
                <Questionmodal products={products} />
              </div>
              <Question id={id} />
            </div>
            <div className={styles.productnav} id="guide">
              <ul className={styles.nav_container}>
                <li>
                  <a href="#detail">상품 상세</a>
                </li>
                <li>
                  <a href="#review">상품평</a>
                </li>
                <li>
                  <a href="#question">상품 문의</a>
                </li>
                <li className={styles.activenav}>
                  <a href="#guide">배송/교환/반품 안내</a>
                </li>
              </ul>
            </div>
            <Shipping />
          </div>
        ))}
    </div>
  );
};

export default Product;
