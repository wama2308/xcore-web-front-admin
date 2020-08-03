import React from "react";
import { Card, CardHeader, Input } from "reactstrap";
import styled from "styled-components";
import DefaultSearchProducts from "../../../components/DefaultSearchProducts";
import "../../../assets/css/style.css";
import {
    TableCell,
    TableRow,
    IconButton
} from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import Select from "react-select";
import { number_format } from "../../../helpers/helpers";

class Products extends React.Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        this.state = {
            option: 0,
            type_comparison: "",
            type_comparison_error: false,
            time_cycle: null,
            time_cycle_error: "",
            time_amount: "",
            time_amount_error: false,
            percentage: null,
            percentage_error: "",
            percentage_amount: "",
            percentage_amount_error: false,
            options_time: [
                { label: 'Mensual', value: true },
                { label: 'Diario', value: false }
            ],
            options_amounts: [
                { label: 'Porcentaje', value: true },
                { label: 'Monto', value: false }
            ],
        };
    }

    optionsData = (options) => {
        if (!options) {
            return [];
        }
        const data = [];
        options.data.data.map(option => {
            data.push({
                label: `${option.name}`,
                value: option._id,
                code: option.code
            });
        });
        return data;
    };

    delete = key => {
        const message = {
            title: "Eliminar Producto",
            info: "¿Esta seguro que desea eliminar este producto?"
        };
        this.props.confirm(message, res => {
            if (res) {
                this.props.deleteProductoIdFunction(key);
            }
        });
    };

    handleChange = (e, id, type) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
        this.props.setDataProductsAction(id, e.target.value, type);
    };

    keyPress = (e, id, type) => {
        if (e.key === "Enter") {
            this.props.setDataProductsAction(id, e.target.value, type);
            document.getElementById("search").value = '';
            document.getElementById("search").focus();
        }
    };

    handlekey(campo) {
        document.getElementById(campo).classList.remove("borderColor");        
    };

    handleChangeSelect = (value, select, selectError, id, div) => {
        document.getElementById(div).classList.remove("borderColor");
        this.setState({
            [select]: value,
            [selectError]: "",
        });
        this.props.setSelectDataProducts(id, value, select);
    };

    handlekeyMonto(campo, campoError, campoErrorText, campohide) {
        let monto = event.target.value.replace(/\D/g, "")
            .replace(/([0-9])([0-9]{2})$/, '$1.$2')
            .replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ",");
        this.setState({
            [campo]: monto,
            [campoError]: false,
            [campoErrorText]: "",
            [campohide]: "hide",
        });
    };

    eventoBlur = name => event => {
        if (event.target.value === '' || event.target.value === '0.0') {
            this.setState({
                [name]: '0.00'
            });
        }
    }

    eventoFocus = name => event => {
        if (event.target.value === '0.00') {
            this.setState({
                [name]: ''
            });
        }
    }

    render() {
        const optionsData = this.optionsData(this.props.dataAll);
        const { dataSelect } = this.props;
        return (
            <span>
                <Card
                    style={{
                        flex: 1,
                        margin: "10px 0px",
                        overflow: "auto",
                        minHeight: 480,
                        maxHeight: 480
                    }}
                >
                    <div className={`errorControlDiv`}>
                        {this.props.tableProductsTextError}
                    </div>
                    <div>
                        <Header>
                            <div>Productos</div>
                            <div style={{ width: "50%" }}>
                                <DefaultSearchProducts
                                    pressKey={true}
                                    placeholder="Buscar Producto..."
                                    getOptions={this.props.search}
                                    options={optionsData}
                                    searchAction={this.props.searchId}
                                    disabled={this.props.disabled}
                                    dataAllSearch={dataSelect}
                                />
                            </div>
                        </Header>
                    </div>
                    {/* <div style={{ overflow: "auto", height: "100%" }}> */}
                    <div style={{ height: "100%" }}>
                        <table className="table table-hover" style={{ width: '100%', height: '10vh' }} >
                            <thead>
                                <tr>
                                    <td style={{ width: '5%' }} align="left">Nro</td>
                                    <td style={{ width: '15%' }} align="left">Nombre</td>
                                    <td style={{ width: '10%' }} align="left">Codigo</td>
                                    <td style={{ width: '10%' }} align="left">Regla</td>
                                    <td style={{ width: '15%' }} align="left">Tiempo</td>
                                    <td style={{ width: '10%' }} align="left">Cantidad</td>
                                    <td style={{ width: '10%' }} align="left">Tipo Monto</td>
                                    <td style={{ width: '15%' }} align="left">Monto</td>
                                    <td style={{ width: '10%' }} align="left">Accion</td>
                                </tr>
                            </thead>
                            <tbody>
                                {dataSelect &&
                                    dataSelect.map((data, key) => {
                                        return (
                                            <tr key={key}>
                                                <td style={{ width: '5%' }} align="left">{key + 1}</td>
                                                <td style={{ width: '15%' }} align="left">{data.name}</td>
                                                <td style={{ width: '10%' }} align="left">{data.code}</td>
                                                <td style={{ width: '10%' }} align="left">
                                                    <div id={`div_type_comparison_${key}`} className="">
                                                        <Input
                                                            invalid={this.state.type_comparison_error}
                                                            id={`type_comparison_${key}`}
                                                            name={`type_comparison_${key}`}
                                                            onKeyUp={event => this.handlekey(
                                                                `div_type_comparison_${key}`,
                                                            )}
                                                            onChange={event => this.handleChange(event, data.products_id, "type_comparison")}
                                                            onKeyDown={event => this.keyPress(event, data.products_id, "type_comparison")}
                                                            value={data.type_comparison}
                                                            type="number"
                                                            min="0"
                                                            disabled={this.props.disabled}
                                                        />
                                                    </div>
                                                </td>
                                                <td style={{ width: '15%' }} align="left">
                                                    <div id={`div_time_cycle_${key}`} className="">
                                                        <Select
                                                            isClearable
                                                            isSearchable
                                                            isDisabled={this.props.disabled}
                                                            name="time_cycle"
                                                            id="time_cycle"
                                                            value={data.time_cycle}
                                                            onChange={event => this.handleChangeSelect(
                                                                event,
                                                                "time_cycle",
                                                                "time_cycle_error",
                                                                data.products_id,
                                                                `div_time_cycle_${key}`,
                                                            )}
                                                            options={this.state.options_time}
                                                        />
                                                    </div>
                                                </td>
                                                <td style={{ width: '10%' }} align="left">
                                                    <div id={`div_time_amount_${key}`} className="">
                                                        <Input
                                                            invalid={this.state.time_amount_error}
                                                            id="time_amount"
                                                            name="time_amount"
                                                            onKeyUp={event => this.handlekey(
                                                                `div_time_amount_${key}`,
                                                            )}
                                                            onChange={event => this.handleChange(event, data.products_id, "time_amount")}
                                                            onKeyDown={event => this.keyPress(event, data.products_id, "time_amount")}
                                                            value={data.time_amount}
                                                            type="number"
                                                            min="0"
                                                            disabled={this.props.disabled}
                                                        />
                                                        <div className={`${this.state.time_amount_hide} errorControl`}>
                                                            {this.state.time_amount_text_error}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ width: '15%' }} align="left">
                                                    <div id={`div_percentage_${key}`} className="">
                                                        <Select
                                                            isClearable
                                                            isSearchable
                                                            isDisabled={this.props.disabled}
                                                            name="percentage"
                                                            id="percentage"
                                                            value={data.percentage}
                                                            onChange={event => this.handleChangeSelect(
                                                                event,
                                                                "percentage",
                                                                "percentage_error",
                                                                data.products_id,
                                                                `div_percentage_${key}`,
                                                            )}
                                                            options={this.state.options_amounts}
                                                        />
                                                    </div>
                                                </td>
                                                <td style={{ width: '15%' }} align="left">
                                                    <div id={`div_percentage_amount_${key}`} className="">
                                                        <Input
                                                            invalid={this.state.percentage_amount_error}
                                                            id="percentage_amount"
                                                            name="percentage_amount"
                                                            // onKeyUp={event => this.handlekeyMonto(
                                                            //     "percentage_amount",
                                                            //     "percentage_amount_error",
                                                            //     "percentage_amount_text_error",
                                                            //     "percentage_amount_hide",
                                                            //     1
                                                            // )}
                                                            onKeyUp={event => this.handlekey(
                                                                `div_percentage_amount_${key}`,
                                                            )}
                                                            onChange={event => this.handleChange(event, data.products_id, "percentage_amount")}
                                                            onKeyDown={event => this.keyPress(event, data.products_id, "percentage_amount")}
                                                            value={data.percentage_amount}
                                                            type="text"
                                                            onBlur={this.eventoBlur("percentage_amount")}
                                                            onFocus={this.eventoFocus("percentage_amount")}
                                                            disabled={this.props.disabled}
                                                        />
                                                        <div className={`${this.state.percentage_amount_hide} errorControl`}>
                                                            {this.state.percentage_amount_text_error}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ width: '10%' }} align="left">
                                                    <div className="" style={{ marginTop: '-24px', height: '10px' }}>
                                                        <IconButton
                                                            title="Eliminar Producto"
                                                            onClick={() => { this.delete(key); }}
                                                            disabled={this.props.disabled}>
                                                            <Delete className="iconTable" />
                                                        </IconButton>
                                                    </div>
                                                </td>

                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </span >
        );
    }
}

export default Products;

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