import React from "react";
import { Input, InputGroup, InputGroupAddon, InputGroupText, Button, FormGroup } from "reactstrap";
import styled from "styled-components";
import { Search } from "@material-ui/icons";

class SearchInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search: ''
        };
    }

    handleChange = e => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    };

    handlekey = event => {
        if (event.target.value === '') {
            this.props.allFunction("", "", event.target.value);
        }
    };

    keyPress = e => {
        if (e.key === "Enter") {
            this.props.allFunction("", "", e.target.value);
        }
    };

    render() {
        //console.log(this.props.type)
        //console.log(this.props.area)
        return (
            <div style={{ display: 'flex', width: '100%' }}>
                <div style={{ flex: 1 }}>
                    <SearchIn
                        id="search"
                        name="search"
                        placeholder="Buscar..."
                        onKeyUp={this.handlekey}
                        onKeyDown={e => this.keyPress(e)}
                        onChange={this.handleChange}
                        value={this.state.search}
                    />
                </div>
                <Button
                    title="Buscar"
                    style={{ background: '#5D92F4', height: '40px', borderColor: '#5D92F4' }}
                    onClick={() => { this.props.allFunction("", "", this.state.search);; }}
                >
                    <Search className="iconTable" />
                </Button>
            </div>

        );
    }
}

export default (SearchInput);

const SearchIn = styled(Input)`  
  height: 40px;

`;

// const In = styled(Input)`
//   border-radius: ${props =>
//         props.theme === "yes" ? "20px 20px 0px 0px" : "20px 20px"};
//   height: 40px;

// `;