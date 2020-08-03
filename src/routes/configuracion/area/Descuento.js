import React from "react";

class Descuento extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { dataDescuento } = this.props;
    return (
      <div>
        <table
          className="table table-hover"
          style={{ width: "100%", height: "10vh" }}
        >
          <thead>
            <tr>
              <td style={{ width: "20%" }} align="center">
                Nombre
              </td>
              <td style={{ width: "20%" }} align="center">
                Tipo
              </td>
              <td style={{ width: "20%" }} align="center">
                Valor
              </td>
              <td style={{ width: "20%" }} align="center">
                Fecha Inicio
              </td>
              <td style={{ width: "20%" }} align="center">
                Fecha Final
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ width: "20%" }} align="center">
                {dataDescuento.name}
              </td>
              <td style={{ width: "20%" }} align="center">
                {dataDescuento.type}
              </td>
              <td style={{ width: "20%" }} align="center">
                {dataDescuento.value}
              </td>
              <td style={{ width: "20%" }} align="center">
                {dataDescuento.start_date}
              </td>
              <td style={{ width: "20%" }} align="center">
                {dataDescuento.final_date}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
export default Descuento;
