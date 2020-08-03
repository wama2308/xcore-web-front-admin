import React from "react";
import PropTypes from "prop-types";
import deburr from "lodash/deburr";
import Autosuggest from "react-autosuggest";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import { withStyles } from "@material-ui/core/styles";
import purple from "@material-ui/core/colors/purple";
import { connect } from "react-redux";
import { seeker } from "../actions/aplicantionActions";

function renderInputComponent(inputProps) {
  const { classes, inputRef = () => { }, ref, ...other } = inputProps;

  return (
    <TextField
      fullWidth
      variant="outlined"
      margin="dense"
      className="borderDios"
      InputProps={{
        classes: {
          focused: classes.cssOutlinedInput
        },
        inputRef: node => {
          ref(node);
          inputRef(node);
        }
      }}
      {...other}
    />
  );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion.label, query);
  const parts = parse(suggestion.label, matches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map((part, index) =>
          part.highlight ? (
            <span key={String(index)} style={{ fontWeight: 500 }}>
              {part.text}
            </span>
          ) : (
              <strong key={String(index)} style={{ fontWeight: 300 }}>
                {part.text}
              </strong>
            )
        )}
      </div>
    </MenuItem>
  );
}

function getSuggestions(value, options) {
  const inputValue = deburr(value.trim()).toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  if (!options) {
    return [];
  }

  return inputLength === 0
    ? []
    : options.filter(suggestion => {
      const keep = count < 6;

      if (keep) {
        count += 1;
      }

      return keep;
    });
}

function getSuggestionValue(suggestion) {
  return suggestion.label;
}

const styles = theme => ({
  root: {
    height: 250,
    flexGrow: 1
  },
  container: {
    position: "relative"
  },
  suggestionsContainerOpen: {
    position: "absolute",
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0
  },
  suggestion: {
    display: "block"
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: "none"
  },
  cssOutlinedInput: {
    "&$cssFocused $notchedOutline": {
      borderColor: purple[500]
    }
  },
  divider: {
    height: theme.spacing(1) * 2
  }
});

class DefaultSearchBienes extends React.Component {
  constructor() {
    super();
    this.state = {
      suggestions: [],
      auxValue: undefined
    };
  }

  componentDidMount = () => {
    document.getElementById("search").focus();
  };

  handleSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value, this.props.options)
    });
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  handleChange = name => (event, { newValue }) => {
    this.props.getOptions(newValue, this.props.view);
  };

  componentWillReceiveProps = props => {
    const validateSearch = this.state.suggestions.find(suggestion => {
      return suggestion.label.includes(props.value);
    });
    if (validateSearch) {
      this.setState({ auxValue: validateSearch });
    }
  };

  keyPress = e => {
    const value = !this.state.auxValue ? this.props.value : this.state.auxValue;
    if (e.key === "Enter") {
      this.props.searchAction(value, this.props.dataAllSearch);            
    }
  };

  render() {
    const { classes } = this.props;
    const autosuggestProps = {
      renderInputComponent,
      suggestions: this.state.suggestions,
      onSuggestionsFetchRequested: this.handleSuggestionsFetchRequested,
      onSuggestionsClearRequested: this.handleSuggestionsClearRequested,
      getSuggestionValue,
      renderSuggestion
    };  

    return (
      <div style={{ width: this.props.width ? this.props.width : null }}>
        <Autosuggest
          varian={"outline"}
          {...autosuggestProps}
          inputProps={{
            classes,
            disabled: this.props.disabled,
            placeholder: this.props.placeholder,
            value: this.props.value,
            onChange: this.handleChange("single"),
            onKeyDown: this.keyPress,
            ref: this.emailInput,
            id: "search"
          }}
          theme={{
            container: classes.container,
            suggestionsContainerOpen: classes.suggestionsContainerOpen,
            suggestionsList: classes.suggestionsList,
            suggestion: classes.suggestion
          }}
          renderSuggestionsContainer={options => (
            <Paper {...options.containerProps} square>
              {options.children}
            </Paper>
          )}
        />
      </div>
    );
  }
}

DefaultSearchBienes.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  value: state.general.seeker,  
});

export default connect(
  mapStateToProps,
  { seeker }
)(withStyles(styles)(DefaultSearchBienes));
