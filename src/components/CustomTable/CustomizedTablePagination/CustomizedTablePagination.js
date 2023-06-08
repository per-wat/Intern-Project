import { TableFooter, TablePagination, TableRow } from "@material-ui/core"

const CustomizedTablePagination = ({
  rowsPerPageOptions,
  totalRowsCount,
  rowsPerPage,
  tablePage,
  setTablePage,
  setRowsPerPage,
  handleFetchMore,
}) => {
  const handleChangePage = (event, newPage) => {
    handleFetchMore()
    setTablePage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value))
    setTablePage(0)
  }

  return (
    <TableFooter>
      <TableRow>
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          count={totalRowsCount}
          rowsPerPage={rowsPerPage}
          page={tablePage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableRow>
    </TableFooter>
  )
}

export default CustomizedTablePagination