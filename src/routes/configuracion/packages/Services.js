import React from "react";
import { Card, CardHeader, Input } from "reactstrap";
import styled from "styled-components";
import DefaultSearchServices from "../../../components/DefaultSearchServices";
import "../../../assets/css/style.css";
import {
    Table,
    TableCell,
    TableBody,
    TableRow,
    TableHead,
    IconButton
} from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import Select from "react-select";
import { number_format } from "../../../helpers/helpers";

class Services extends React.Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        this.state = {
            action: '',
            disabled: '',
            showHide: '',
            option: 0,
            edit: false,
            delete: false,
            quantyToSell: 0,
            discountP: false,
            arrayDescuentos: null,
            arrayDescuentosError: '',
            arrayDescuentosTextError: '',
            arrayDescuentosHide: 'hide',
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
                description: option.description,
                dataDiscount: this.props.discountValue ? this.props.discountValue.info : null
            });
        });
        return data;
    };

    delete = key => {
        const message = {
            title: "Eliminar Servicio",
            info: "¿Esta seguro que desea eliminar este servicio?"
        };
        this.props.confirm(message, res => {
            if (res) {
                this.props.deleteServiceIdFunction(key);
            }
        });
    };

    handleChangeSelect = (value, select, selectError, selectErrorText, selecthide, id) => {
        this.setState({
            [select]: value,
            [selectError]: "",
            [selectErrorText]: "",
            [selecthide]: "hide",
        });
        this.props.addDiscountSelectService(value, id)
        if(value){
            this.props.cleanTextErrorServices();
        }
    };

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
                        {this.props.tableServicesTextError}
                    </div>
                    <div>
                        <Header>
                            <div>Servicios</div>
                            <div style={{ width: "50%" }}>
                                <DefaultSearchServices
                                    pressKey={true}
                                    placeholder="Buscar Servicio..."
                                    getOptions={this.props.search}
                                    options={optionsData}
                                    searchAction={this.props.searchId}
                                    disabled={this.props.disabled}
                                    dataAllSearch={dataSelect}                                    
                                />
                            </div>
                        </Header>
                    </div>
                    {/* <div style={{ overflow: "auto", height: "70%" }}> */}
                    <div style={{ height: "100%" }}>
                        <table className="table table-hover" style={{ width: '100%', height: '10vh' }} >
                            <thead>
                                {
                                    this.props.discountGeneral &&
                                    <tr>
                                        <td style={{ width: '10%' }} align="left">Nro</td>
                                        <td style={{ width: '20%' }} align="left">Nombre</td>
                                        <td style={{ width: '20%' }} align="left">Descripcion</td>
                                        <td style={{ width: '20%' }} align="left">Tipo</td>
                                        <td style={{ width: '20%' }} align="left">Descuento</td>
                                        <td style={{ width: '10%' }} align="left">Acciones</td>
                                    </tr>
                                }
                                {
                                    this.props.discountIndividual &&
                                    <tr>
                                        <td style={{ width: '10%' }} align="left">Nro</td>
                                        <td style={{ width: '20%' }} align="left">Nombre</td>
                                        <td style={{ width: '20%' }} align="left">Descripcion</td>
                                        <td style={{ width: '40%' }} align="left">Descuento</td>
                                        <td style={{ width: '10%' }} align="left">Acciones</td>
                                    </tr>
                                }
                                {
                                    (!this.props.discountGeneral && !this.props.discountIndividual) &&
                                    <tr>
                                        <td style={{ width: '10%' }} align="left">Nro</td>
                                        <td style={{ width: '40%' }} align="left">Nombre</td>
                                        <td style={{ width: '40%' }} align="left">Descripcion</td>
                                        <td style={{ width: '10%' }} align="left">Acciones</td>
                                    </tr>
                                }
                            </thead>
                            {
                                this.props.discountGeneral &&
                                <tbody>
                                    {dataSelect &&
                                        dataSelect.map((data, key) => {
                                            return (
                                                <tr key={key}>
                                                    <td style={{ width: '10%' }} align="left">{key + 1}</td>
                                                    <td style={{ width: '20%' }} align="left">{data.name}</td>
                                                    <td style={{ width: '20%' }} align="left">{data.description}</td>
                                                    <td style={{ width: '20%' }} align="left">
                                                        {this.props.discountValue.info.type.trim() === "percentage" ? "Porcentaje" : "Monto"}
                                                    </td>
                                                    <td style={{ width: '20%' }} align="left">
                                                        {number_format(this.props.discountValue.info.value, 2)}
                                                    </td>
                                                    <td style={{ width: '10%' }} align="left">
                                                        <div className="" style={{ marginTop: '-24px', height: '10px' }}>
                                                            <IconButton
                                                                title="Eliminar Servicio"
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
                            }
                            {
                                this.props.discountIndividual &&
                                <tbody>
                                    {dataSelect &&
                                        dataSelect.map((data, key) => {
                                            return (
                                                <tr key={key}>
                                                    <td style={{ width: '10%' }} align="left">{key + 1}</td>
                                                    <td style={{ width: '20%' }} align="left">{data.name}</td>
                                                    <td style={{ width: '20%' }} align="left">{data.description}</td>
                                                    <td style={{ width: '40%' }} align="left">
                                                        <Select
                                                            isClearable={true}
                                                            isSearchable={true}
                                                            isDisabled={this.props.disabled}
                                                            name="arrayDescuentos"
                                                            id="arrayDescuentos"
                                                            value={data.valueSelect}
                                                            onChange={event => this.handleChangeSelect(
                                                                event,
                                                                "arrayDescuentos",
                                                                "arrayDescuentosError",
                                                                "arrayDescuentosTextError",
                                                                "arrayDescuentosHide",
                                                                data.services_id
                                                            )}
                                                            options={this.props.dataDiscount}
                                                        />
                                                    </td>
                                                    <td style={{ width: '10%' }} align="left">
                                                        <div className="" style={{ marginTop: '-24px', height: '10px' }}>
                                                            <IconButton
                                                                title="Eliminar Servicio"
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
                            }
                            {
                                (!this.props.discountGeneral && !this.props.discountIndividual) &&
                                <tbody>
                                    {dataSelect &&
                                        dataSelect.map((data, key) => {
                                            return (
                                                <tr key={key}>
                                                    <td style={{ width: '10%' }} align="left">{key + 1}</td>
                                                    <td style={{ width: '40%' }} align="left">{data.name}</td>
                                                    <td style={{ width: '40%' }} align="left">{data.description}</td>
                                                    <td style={{ width: '10%' }} align="left">
                                                        <div className="" style={{ marginTop: '-24px', height: '10px' }}>
                                                            <IconButton
                                                                title="Eliminar Servicio"
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
                            }
                        </table>
                    </div>
                </Card>
            </span >
        );
    }
}

export default Services;

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
