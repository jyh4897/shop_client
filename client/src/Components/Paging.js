import React, { useEffect } from 'react'
import Pagination from 'react-js-pagination'
import './Paging.css'

const Paging = ( { page, count, handleChangePage, postPerPage }) => {

    return (
        <div>
            <Pagination
                activePage={Number(page)}
                itemsCountPerPage={postPerPage}
                totalItemsCount={count}
                pageRangeDisplayed={5}
                prevPageText={"<"}
                nextPageText={">"}
                onChange={handleChangePage}
            />
        </div>
    )
}

export default Paging