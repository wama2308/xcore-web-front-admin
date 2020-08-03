import React from "react";
import { Input, ListGroup, ListGroupItem } from "reactstrap";
import styled from "styled-components";
import { search, outsideClick } from "../actions/aplicantionActions";
import { connect } from "react-redux";

class SelectComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      over: 2,
      clicked: false
    };
  }

  onOver = () => {
    this.setState({ over: 2 });
  };

  mouseOut = () => {
    this.setState({ over: 1 });
  };

  keyPress = e => {
    if (e.key === "Enter" && this.props.pressKey) {
      this.props.searchAction(this.props.value);
    }
  };

  render() {

    return (
      <div style={{ minWidth: "40%" }}>
        <Search
          placeholder="Buscar..."
          theme={!this.props.outside ? "yes" : "no"}
          onMouseOver={this.onOver}
          onClick={this.handleClick}
          value={this.props.value}
          onChange={event => this.props.search(event.target.value)}
          onKeyDown={this.keyPress}
          onMouseOut={this.mouseOut}
        />
        {!this.props.outside && this.props.options && (
          <BodySearch>
            {this.props.options.map(option => {
              return (
                <List key={option.id}>
                  <ListGroupItem
                    className="list-contend"
                    onClick={() => {
                      this.props.search(option.name);
                      this.props.outsideClick();
                    }}
                  >
                    {option.name}
                  </ListGroupItem>
                </List>
              );
            })}
          </BodySearch>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  outside: state.general.outside,
  value: state.general.search
});

export default connect(
  mapStateToProps,
  { search, outsideClick }
)(SelectComponent);

const Search = styled(Input)`
  border-radius: ${props =>
    props.theme === "yes" ? "20px 20px 0px 0px" : "20px 20px"};
  height: 40px;
  &:hover {
    box-shadow: 0px 1.5px 7px 0px rgba(134, 117, 117, 0.75);
  }
`;

const BodySearch = styled.div`
  position: absolute;
  min-height: 215px;
  width: 38.5%;
  border-radius: 0px 0px 20px 20px;
  z-index: 2;
  background: white;
  /* border-top: 1px solid black; */
  top: 57px;
  box-shadow: 0px 1.5px 7px 0px rgba(134, 117, 117, 0.75);
`;

const List = styled(ListGroup)`
  cursor: pointer;
  .list-contend {
    &:hover {
      background: #d7e0e4;
    }
  }
`;
