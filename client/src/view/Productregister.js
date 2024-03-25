import styles from './Productregister.module.css'
import { useRef, useMemo, useState } from 'react';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



const Readerboard = () => {

    const [value, setValue] = useState('');
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState(1)
    const [img, setImg] = useState([]);
    const [thumbnail, setThumbnail] = useState([]);
    const quillRef = useRef();
    const navigate = useNavigate();
    const Server_URL = process.env.REACT_APP_Server_Side_Address;
    

    const imageHandler = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.addEventListener('change', async () => {
            console.log('체인지')
            const file = input.files[0];
            const formData = new FormData();
            
            formData.append('img', file);
            try {
                const result = await axios.post(`${Server_URL}/img`, formData);
                console.log(result.data.url)
                const IMG_URL = result.data.url
                const editor = quillRef.current.getEditor();

                const range = editor.getSelection();
                editor.insertEmbed(range.index, 'image', IMG_URL);
            }
            catch (error) {
                console.log('err');
              }
        })

    }

    const modules = useMemo(() => {
        return {
            toolbar : {
                container: [
                    ['link', 'image'],
                    [{ size: ["small", false, "large", "huge"] }],
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    [{ 'align': [] }, { 'color': [] }, { 'background': [] }],
                    [
                        { list: "ordered" },
                        { list: "bullet" },
                        { indent: "-1" },
                        { indent: "+1" },
                    ],
                    ["clean"],
                ],
                handlers: {
                    image: imageHandler,
                },
            }
        }
    }, [])

    const formats = [
        'header',
        "size",
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'image',
        'align', 
        'color', 
        'background',
        "list",
        "bullet",
        "indent",
        "link",
    ];

    const handleChangeFile = (e) => {
        const selectedFiles = e.target.files;
                
        if(selectedFiles.length > 0){
        const filesArray = Array.from(selectedFiles);
        setImg((prev) => [...prev, ...filesArray])
        }

    };

    const handleChangeThumbnail = (e) => {
        const selectedFiles = e.target.files
        if(selectedFiles.length > 0){
            const filesArray = Array.from(selectedFiles);
            setThumbnail((prev) => [...prev, ...filesArray])
        }
    }

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('price', price);
            formData.append('category', category);
            formData.append('description', value);

            thumbnail.forEach((img) => {
                formData.append(`files`, img);
            })
            img.forEach((img) => {
                formData.append(`files`, img);
            })


            // const boardData = { title, price, category, value }
            await axios.post(`${Server_URL}/register`, formData,{
            headers: {
                'Content-Type': 'multipart/form-data',
            }
            })
            .then((result) => {
                console.log('요청성공')
                console.log(result)
            })
            .catch((err) => {
                console.log('err')
                console.log(err)
            })

        }
        catch (error) {
            console.error('에러');
        }
        navigate(`/shop/${category}/1/1`)
        

    }

    const handleCancelbtn = () => {
        navigate('/')
    }

    return (
        <div className={styles.registercontainer}>
            <div className={styles.boardbox}>
                <div className={styles.registerrow}>
                    <div className={styles.namebox}>
                        <p className={styles.productmenu}>상품명</p>
                    </div>
                    <div className={styles.contentbox}>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={styles.productname} />
                    </div>
                </div>
                <div className={styles.registerrow}>
                    <div className={styles.namebox}>
                        <p className={styles.productmenu}>상품 카테고리</p>
                    </div>
                    <div className={styles.contentbox}>
                        <select value={category} onChange={(e) => setCategory(e.target.value)} className={styles.productcategory}>
                            <option value="1">리빙</option>
                            <option value="2">패션</option>
                            <option value="3">식품</option>
                            <option value="4">헤어,바디</option>
                        </select>
                    </div>
                </div>
                <div className={styles.thumbnailrow}>
                    <div className={styles.namebox}>
                        <p className={styles.productmenu}>대표 사진</p> 
                    </div>      
                    <div className={styles.thumbnailbox}>
                        <div>
                            <input type="file" name="files" onChange={(e) => handleChangeThumbnail(e)} />      
                        </div>                       
                        <div className={styles.thumbnailarray}>
                            {thumbnail.length ? thumbnail.map((img, index) => (
                                <img key={index} src={URL.createObjectURL(img)} className={styles.previewimg} alt={`Image ${index + 1}`} onLoad={() => URL.revokeObjectURL(img)}
                                />                               
                            )) : '' }
                        </div>
                        <div className={styles.thumbnailname}>
                            {thumbnail.length ? thumbnail.map((it,index) => <span key={index} className={styles.imgname}>{it.name} </span>) : ''}
                        </div>
                    </div>
                </div>
                <div className={styles.thumbnailrow}>
                    <div className={styles.namebox}>
                        <p className={styles.productmenu}>상세 사진</p>
                    </div>
                    <div className={styles.imagesbox}>      
                        <div>
                            <input type="file" id="file-input" name="files" onChange={(e) => handleChangeFile(e)} multiple />
                        </div>                
                        <div className={styles.thumbnailarray}>                            
                            {img.length ? img.map((img, index) => (
                                <img key={index} src={URL.createObjectURL(img)} className={styles.previewimg} alt={`Image ${index + 1}`} onLoad={() => URL.revokeObjectURL(img)} />
                            )) : '' }
                        </div>
                        <div className={styles.thumbnailname}>
                            {img.length ? img.map((it,index) => <span key={index} className={styles.imgname}>{it.name} </span>) : ''}
                        </div>
                    </div> 
                </div>
                <div className={styles.registerrow}>
                    <div className={styles.namebox}>
                        <p className={styles.productmenu}>가격</p>
                    </div>
                    <div className={styles.contentbox}>
                        <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} className={styles.productprice}/>
                    </div>
                    
                </div>
                <div className={styles.descriptionrow}>
                    <div className={styles.namebox}>
                        <p className={styles.productmenu}>상세설명</p>
                    </div>
                    <div className={styles.quillbox}>                   
                        <ReactQuill
                        ref={quillRef}
                        theme="snow"
                        placeholder=""
                        value={value}
                        onChange={setValue}
                        modules={modules}
                        formats={formats}
                        className={styles.quill}
                        />
                    </div>
                </div>
                <div className={styles.btnbox}>
                    <button type="submit" onClick={handleSubmit} className={styles.registerbtn}>상품등록</button>
                    <button className={styles.cancelbtn}  onClick={handleCancelbtn}>취소</button>
                </div>
                    
            </div>
            
        </div>
    )
}

export default Readerboard;