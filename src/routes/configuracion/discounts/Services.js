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
            discountP: false
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
                    <div style={{ overflow: "auto", height: "70%" }}>
                        <table className="table table-hover" style={{ width: '100%', height: '10vh' }} >
                            <thead>
                                <tr>
                                    <td style={{ width: '20%' }} align="center">Nro</td>
                                    <td style={{ width: '30%' }} align="center">Nombre</td>
                                    <td style={{ width: '30%' }} align="center">Descripcion</td>                                    
                                    <td style={{ width: '20%' }} align="center">Acciones</td>
                                </tr>
                            </thead>
                            <tbody>
                                {dataSelect &&
                                    dataSelect.map((data, key) => {
                                        return (
                                            <tr key={key}>
                                                <td style={{ width: '20%' }} align="center">{key + 1}</td>
                                                <td style={{ width: '30%' }} align="center">{data.name}</td>                                                
                                                <td style={{ width: '30%' }} align="center">{data.description}</td>
                                                <td style={{ width: '20%' }} align="center">
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
  align-items: center;
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
  align-items: center;
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
    align-items: center;
  }
  .titleBol {
    font-weight: bold;
    padding: 10px;
  }
`;
