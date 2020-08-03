import React from 'react';
import { ReactAgenda, ReactAgendaCtrl, guid, Modal } from 'react-agenda';
import 'react-agenda/build/styles.css';
import 'react-datetime/css/react-datetime.css';

require('moment/locale/es.js'); // this is important for traduction purpose

var colors = {
  'color-1': "rgba(102, 195, 131 , 1)",
  "color-2": "rgba(102, 195, 131 , 1)",
  "color-3": "rgba(102, 195, 131 , 1)"
}

var now = new Date();

var data = [
  {
    _id: guid(),
    name: 'Meeting , dev staff!',
    startDateTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0),
    endDateTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0),
    classes: 'color-1'
  },
  {
    _id: guid(),
    name: 'Working lunch , Holly',
    startDateTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 11, 0),
    endDateTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 13, 0),
    classes: 'color-2 color-3'
  },

];

export default class Horario extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      selected: [],
      cellHeight: 30,
      showModal: false,
      locale: "es",
      rowsPerHour: 2,
      numberOfDays: 7,
      startDate: new Date("02-03-2020"),
      minDate: new Date("02-03-2020"),
      maxDate: new Date("02-03-2020"),
    }
    this.handleCellSelection = this.handleCellSelection.bind(this)
    this.handleItemEdit = this.handleItemEdit.bind(this)
    this.handleRangeSelection = this.handleRangeSelection.bind(this)
    this.removeEvent = this.removeEvent.bind(this)

  }

  componentDidMount() {
    this.setState({ items: [] })
  }


  handleCellSelection(item) {
    //console.log('handleCellSelection', item)
    //this.setState({ items: [item] })
  }
  handleItemEdit(item) {
    //console.log('handleItemEdit', item)
  }
  handleRangeSelection(item) {
    console.log(new Date(item[0]))
    console.log(new Date(item[1]))
    let a = {
      _id: "1",
      name: '',
      startDateTime: new Date(item[0]),
      endDateTime: new Date(item[1]),
      classes: "color-1"
    }
    let b = [];
    b.push(a);

    this.setState({
      items: b
    });
  }

  removeEvent(items, item) {
    this.setState({ items: items });
  }
  handleItemChange(items, item) {
    this.setState({ items: items })
  }
  handleItemSize(items, item) {
    this.setState({ items: items })
  }

  render() {
    //console.log("data ", data)
    return (
      <div>
        <ReactAgenda
          minDate={this.state.minDate}
          maxDate={this.state.maxDate}
          startAtTime={4}
          endAtTime={23}
          disablePrevButton={false}
          startDate={this.state.startDate}
          cellHeight={this.state.cellHeight}
          locale={this.state.locale}
          items={data}
          numberOfDays={this.state.numberOfDays}
          rowsPerHour={this.state.rowsPerHour}
          headFormat={"ddd"}
          helper={true}
          itemColors={colors}
          autoScale={false}
          fixedHeader={true}
          //onItemEdit={this.handleItemEdit.bind(this)}
          onCellSelect={this.handleCellSelection.bind(this)}
          onRangeSelection={this.handleRangeSelection.bind(this)}
          onItemRemove={this.removeEvent.bind(this)}
          onChangeEvent={this.handleItemChange.bind(this)}
          onChangeDuration={this.handleItemSize.bind(this)}
        />
      </div>
    );
  }
}