import React, { useState, useEffect } from 'react';
import { Card, CardHeader, Input } from "reactstrap";
import styled from "styled-components";
import CircularProgress from "@material-ui/core/CircularProgress";
import "../../../assets/css/style.css";
import {
    TableCell,
    TableRow,
    IconButton
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import Divider from '@material-ui/core/Divider';
import ListProductSearch from "./ListProductSearch";

const useStyles = makeStyles(theme => ({
    root: {
        padding: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: 400
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1
    },
    iconButton: {
        padding: 10
    },
    divider: {
        height: 28,
        margin: 4
    }
}));

const SearchProduct = props => {
    const classes = useStyles();
    const [searchInput, setSearchInput] = useState('')
    const [searchInputError, setSearchInputError] = useState('')
    const [searchInputTextError, setSearchInputTextError] = useState('')
    const [searchInputHide, setSearchInputHide] = useState('hide')

    const handleChange = e => {
        const { name, value } = e.target;
        setSearchInput(value);
    };

    const handlekey = e => {
        if (e.target.value !== "") {
            setSearchInputError('');
            setSearchInputTextError('');
            setSearchInputHide('hide');
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            const isValid = validate();
            if (isValid) {
                props.searchProducturchaseFunction(searchInput)
            }
        }
    }

    const searchButtonProduct = event => {
        event.preventDefault();
        const isValid = validate();
        if (isValid) {
            props.searchProducturchaseFunction(searchInput)
        }
    }

    const validate = () => {
        let acum = "";
        if (searchInput === '') {
            setSearchInputError('borderColor');
            setSearchInputTextError('Campo Vacio');
            setSearchInputHide('show');
        }
        if (acum > 0) {
            return false;
        }
        return true;
    }

    return (
        <span>
            <Card
                style={{
                    flex: 1,
                    margin: "10px 0px",
                    overflow: "auto",
                    minHeight: 500,
                    maxHeight: 500
                }}
            >
                <div>
                    <Header style={{ alignItems: 'center' }}>
                        <Paper className={`${classes.root} ${searchInputError}`}>
                            <InputBase
                                id="searchInput"
                                name="searchInput"
                                onKeyUp={handlekey}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                value={searchInput}
                                className={classes.input}
                                placeholder="Buscar Producto..."
                                inputProps={{ "aria-label": "buscar producto" }}
                                disabled={props.option !== 2 ? props.loadingSearchProduct : props.disabled}
                            />
                            <Divider className={classes.divider} orientation="vertical" />
                            {
                                !props.loadingSearchProduct ?
                                    <IconButton
                                        title="Buscar Producto"
                                        className={classes.iconButton}
                                        aria-label="search"
                                        onClick={searchButtonProduct}
                                    >
                                        <SearchIcon />
                                    </IconButton>
                                    :
                                    <CircularProgress
                                        style={{
                                            width: "20px",
                                            height: "20px",
                                            margin: "0px 6px 0px 6px",
                                        }}
                                    />
                            }
                        </Paper>
                    </Header>
                </div>
                <div style={{ position: 'absolute', top: '65px', left: '20px' }} className={`${searchInputHide} errorControl`}>
                    {searchInputTextError}
                </div>
                <div style={{ height: "100%" }}>
                    {
                        props.products.length > 0 && (
                            <ListProductSearch
                                products={props.products}
                                paginationProducts={props.paginationProducts}
                                currency_symbol={props.currency_symbol}
                                openModal={props.openModal}
                            />
                        )
                    }
                </div>
            </Card>
        </span >
    );

}

export default SearchProduct;

const Header = styled(CardHeader)`
  display: flex;
  justify-content: space-between;
  align-items: left;
  min-height: 88px;
`;

const Cell = styled(TableCell)`
  border: 1px solid #c8ced3;
`;

const RowTable = styled(TableRow)`
  && {
    &:hover {
      background: #eeeeee;
    }
  }
`;

const Footer = styled.div`
  display: flex;
  flex: 1;
  align-items: left;
  justify-content: flex-end;
  border-top: 1px solid #c8ced3;
  border-bottom: 1px solid #c8ced3;
  .totalStyle {
    padding-right: 20px;
    border-left: 1px solid #c8ced3;
    border-right: 1px solid #c8ced3;
    display: flex;
    height: 100%;
    min-width: 20%;
    align-items: left;
  }
  .titleBol {
    font-weight: bold;
    padding: 10px;
  }
`;