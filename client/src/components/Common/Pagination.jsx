import React from "react";
import TablePagination from "@mui/material/TablePagination";

const Pagination = ({ count, page, setOffset }) => {
  return (
    <TablePagination
      component="div"
      count={count}
      page={page}
      onPageChange={(event, page) => {
        setOffset(page * 10);
      }}
      rowsPerPage={10}
      rowsPerPageOptions={[10]}
    />
  );
};

export default Pagination;
