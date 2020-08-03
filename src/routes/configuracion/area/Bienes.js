import React from "react";
import { Card, CardHeader, Input } from "reactstrap";
import styled from "styled-components";
import DefaultSearchBienes from "../../../components/DefaultSearchBienes";
import "../../../assets/css/style.css";
import {
  Table,
  TableCell,
  TableBody,
  TableRow,
  TableHead,
  IconButton,
} from "@material-ui/core";
import { Delete } from "@material-ui/icons";

class Bienes extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      action: "",
      disabled: "",
      showHide: "",
      option: 0,
      edit: false,
      delete: false,
      quantyToSell: 0,
      discountP: false,
    };
  }

  optionsBienes = (options) => {
    if (!options) {
      return [];
    }
    const data = [];
    options.data.map((option) => {
      data.push({
        label: `${option.label}`,
        value: option.value,
        info: option.info,
      });
    });
    return data;
  };

  handleChange = (event, data) => {
    this.props.limpiarValidacionesBienes();
    this.props.setQuantityBienAction(
      data.goods_id,
      parseFloat(event.target.value)
    );
  };

  eventBlurInputQuantity = (id) => (e) => {
    if (
      document.getElementById("inputQuantity_" + id).value === "" ||
      document.getElementById("inputQuantity_" + id).value === "0"
    ) {
      document.getElementById("inputQuantity_" + id).value = "0";
    }
  };

  eventFocusInputQuantity = (id) => (e) => {
    if (document.getElementById("inputQuantity_" + id).value === "0") {
      document.getElementById("inputQuantity_" + id).value = "";
    }
  };

  keyPress = (e, data) => {
    if (e.key === "Enter") {
      this.props.limpiarValidacionesBienes();
      this.props.setQuantityBienAction(data.goods_id, data.quantity);
      document.getElementById("search").value = "";
      document.getElementById("search").focus();
    }
  };

  delete = (key) => {
    const message = {
      title: "Eliminar Bien",
      info: "¿Esta seguro que desea eliminar este bien?",
    };
    this.props.confirm(message, (res) => {
      if (res) {
        this.props.deleteBienIdFunction(key);
      }
    });
  };

  render() {
    const optionsBienes = this.optionsBienes(this.props.dataAllBienes);
    const { bienSelect } = this.props;
    //console.log(optionsBienes)
    return (
      <span>
        <Card
          style={{
            flex: 1,
            margin: "10px 0px",
            overflow: "auto",
            minHeight: 480,
            maxHeight: 480,
          }}
        >
          <div className={`${this.props.tableBienesHide} errorControlDiv`}>
            {this.props.tableBienesTextError}
          </div>
          <div>
            <Header>
              <div>Bienes</div>
              <div style={{ width: "50%" }}>
                <DefaultSearchBienes
                  pressKey={true}
                  placeholder="Buscar Bien..."
                  getOptions={this.props.searchBienes}
                  options={optionsBienes}
                  searchAction={this.props.searchBienId}
                  disabled={this.props.disabled}
                  dataAllSearch={bienSelect}
                />
              </div>
            </Header>
          </div>
          <div style={{ overflow: "auto", height: "70%" }}>
            <table
              className="table table-hover"
              style={{ width: "100%", height: "10vh" }}
            >
              <thead>
                <tr>
                  <td style={{ width: "20%" }} align="center">
                    Nro
                  </td>
                  <td style={{ width: "30%" }} align="center">
                    Nombre
                  </td>
                  <td style={{ width: "30%" }} align="center">
                    Cantidad
                  </td>
                  <td style={{ width: "20%" }} align="center">
                    Acciones
                  </td>
                </tr>
              </thead>
              <tbody>
                {bienSelect &&
                  bienSelect.map((data, key) => {
                    return (
                      <tr key={key}>
                        <td style={{ width: "20%" }} align="center">
                          {key + 1}
                        </td>
                        <td style={{ width: "30%" }} align="center">
                          {data.name}
                        </td>
                        <td style={{ width: "30%" }} align="center">
                          <Input
                            name={`inputQuantity_${data.goods_id}`}
                            id={`inputQuantity_${data.goods_id}`}
                            type="number"
                            className={data.goods_id}
                            value={data.quantity}
                            onKeyDown={(e) => this.keyPress(e, data)}
                            onChange={(event) => this.handleChange(event, data)}
                            style={{ height: "48", borderRadius: 0 }}
                            onBlur={this.eventBlurInputQuantity(data.goods_id)}
                            onFocus={this.eventFocusInputQuantity(
                              data.goods_id
                            )}
                            disabled={this.props.disabled}
                          />
                        </td>
                        <td style={{ width: "20%" }} align="center">
                          <div
                            className=""
                            style={{ marginTop: "-24px", height: "10px" }}
                          >
                            <IconButton
                              title="Eliminar Bien"
                              onClick={() => {
                                this.delete(key);
                              }}
                              disabled={this.props.disabled}
                            >
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
      </span>
    );
  }
}

export default Bienes;

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
