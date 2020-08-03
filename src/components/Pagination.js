import React, { Component } from 'react';
import { TablePagination, TableFooter, TableRow, IconButton } from '@material-ui/core'
import { LastPage, FirstPage, KeyboardArrowRight, KeyboardArrowLeft } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';


const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing(1) * 2.5,
  },
});

class TablePaginationActions extends Component {
  handleFirstPageButtonClick = event => {
    this.props.onChangePage(event, 0);
  };

  handleBackButtonClick = event => {
    this.props.onChangePage(event, this.props.page - 1);
  };

  handleNextButtonClick = event => {
    this.props.onChangePage(event, this.props.page + 1);
  };

  handleLastPageButtonClick = event => {
    this.props.onChangePage(
      event,
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1),
    );
  };

  render() {
    const { classes, count, page, rowsPerPage, theme } = this.props;
    return (
      <div className={classes.root}>
        <IconButton
          onClick={this.handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="First Page"
        >
          {theme.direction === 'rtl' ? <LastPage /> : <FirstPage />}
        </IconButton>

        <IconButton
          onClick={this.handleBackButtonClick}
          disabled={page === 0}
          aria-label="Previous Page">
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>

        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Next Page">
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>

        <IconButton
          onClick={this.handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Last Page">
          {theme.direction === 'rtl' ? <FirstPage /> : <LastPage />}
        </IconButton>
      </div>
    );
  }
}

const TablePaginationActionsWrapped = withStyles(actionsStyles, { withTheme: true })(
  TablePaginationActions,
);

class Pagination extends Component {
  render() {
    return (
      <TableFooter>
        <TableRow>
          <TablePagination
            count={this.props.contador.length}
            page={this.props.page}
            rowsPerPageOptions={[10, 15, 20]}
            rowsPerPage={this.props.rowsPerPage}
            onChangeRowsPerPage={this.props.handleChangeRowsPerPage}
            onChangePage={this.props.handleChangePage}
            ActionsComponent={TablePaginationActionsWrapped}
            labelRowsPerPage={['Filas por página:']}
            //style={{ "display": "flex", "justifyContent": "flex-end" }}
          >
          </TablePagination>
        </TableRow>
      </TableFooter>
    );
  }
}

export default Pagination;
