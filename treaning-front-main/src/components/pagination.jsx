import React from 'react';
import ReactPaginate from 'react-paginate';
import { useTranslation, initReactI18next } from "react-i18next";


export default function PaginatedItems({ itemsPerPage, total, setPage }) {
  const pageCount = total / itemsPerPage
  const { t } = useTranslation();


  return (
    <>
      <ReactPaginate
        breakLabel="..."
        nextLabel={t("next >")}
        onPageChange={(e) => { setPage(e.selected + 1) }}
        pageRangeDisplayed={1}
        pageCount={pageCount}
        previousLabel={t("< previous")}
        renderOnZeroPageCount={null}
        containerClassName='custom-pagination d-flex align-items-center justify-content-end'
        pageLinkClassName='pagination-tag-anchor mx-2 text-secondary rounded-circle'
        activeLinkClassName='bg-success text-white'
      />
    </>
  );
}
