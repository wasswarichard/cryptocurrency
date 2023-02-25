import React, { useState, useEffect } from 'react';
import './index.sass';

const defaultButton = (props: any) => <button {...props}>{props.children}</button>;

const TablePagination = (props: any) => {
   const activePage = props.page;
   const [visiblePages, setVisiblePages] = useState([]);

   useEffect(() => {
      setVisiblePages(getVisiblePages(null, props.pages));
   }, [props.pages]);

   const changePage = (page: number) => {
      if (page === props.page) {
         return;
      }
      const newVisiblePages = getVisiblePages(page, props.pages);
      setVisiblePages(filterPages(newVisiblePages, props.pages));
      props.onPageChange(page);
   };

   const filterPages = (visiblePages: any, totalPages: any) => {
      return visiblePages.filter((page: any) => page <= totalPages);
   };

   const getVisiblePages = (page: any, total: any) => {
      if (total < 7) {
         return filterPages([1, 2, 3, 4, 5, 6], total);
      } else {
         if (page % 5 >= 0 && page > 4 && page + 2 < total) {
            return [1, page - 1, page, page + 1, total];
         } else if (page % 5 >= 0 && page > 4 && page + 2 >= total) {
            return [1, total - 3, total - 2, total - 1, total];
         } else {
            return [1, 2, 3, 4, 5, total];
         }
      }
   };

   const { PageButtonComponent = defaultButton } = props;

   return (
      <div className="Table__pagination">
         <div className="Table__prevPageWrapper">
            <PageButtonComponent
               className="Table__pageButton"
               onClick={() => {
                  if (activePage === 1) return;
                  changePage(activePage - 1);
               }}
               disabled={activePage === 1}
            >
               {props.previousText}
            </PageButtonComponent>
         </div>
         <div className="Table__visiblePagesWrapper">
            {visiblePages.map((page, index, array) => {
               return (
                  <PageButtonComponent
                     key={page}
                     className={
                        activePage === page
                           ? 'Table__pageButton Table__pageButton--active'
                           : 'Table__pageButton'
                     }
                     onClick={() => changePage(page)}
                  >
                     {array[index - 1] + 2 < page ? `...${page}` : page}
                  </PageButtonComponent>
               );
            })}
         </div>
         <div className="Table__nextPageWrapper">
            <PageButtonComponent
               className="Table__pageButton"
               onClick={() => {
                  if (activePage === props.pages) return;
                  changePage(activePage + 1);
               }}
               disabled={activePage === props.pages}
            >
               {props.nextText}
            </PageButtonComponent>
         </div>
      </div>
   );
};

export default TablePagination;
