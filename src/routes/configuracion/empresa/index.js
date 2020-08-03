import React, { Component } from 'react';
import { Helmet } from "react-helmet";
// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import IntlMessages from 'Util/IntlMessages';
import ListEmpresas from "./ListEmpresas";
import { LoadEmpresasAction, allBusinessFunction } from "../../../actions/EmpresaActions"
import { connect } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import { business } from './../../../sockets/business'
import { calculatePage } from './../../../helpers/helpers'
import { permitsMenu } from "../../../helpers/helpers";
import { openConfirmDialog } from "../../../actions/aplicantionActions"

class Empresa extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentDidMount = () => {
        this.props.LoadEmpresasAction();
    };

    componentWillReceiveProps = props => { }

   

    render() {
        const { LoadEmpresasAction } = this.props                
        return (
            <div className="blank-wrapper">
                {
                    this.props.empresa.data ?
                        <div>
                            <Helmet>
                                <title>XCORE - Empresa</title>
                                <meta name="description" content="Reactify Blank Page" />
                            </Helmet>
                            <PageTitleBar title={<IntlMessages id="sidebar.configuracionEmpresa" />} match={this.props.match} />
                            <ListEmpresas
                                data={this.props.empresa.data}
                                pagination={this.props.empresa.pagination}
                                allBusinessFunction={this.props.allBusinessFunction}
                                search={this.props.searchData}
                                loadEmpresas={LoadEmpresasAction}
                                permitsModule={permitsMenu(this.props.dataGeneral.dataMenu, "Configuraciones", "Empresa")}
                                confirm={this.props.confirm}
                            />
                        </div>
                        :
                        <div style={{ height: "60vh" }}>
                            <CircularProgress style={{ position: " absolute", height: 40, top: "45%", right: "50%", zIndex: 2 }} />
                        </div>
                }
            </div>
        );
    }
}

const mapStateToProps = state => ({
    empresa: state.empresa.toJS(),
    searchData: state.general.search,
    dataGeneral: state.general.dataGeneral,
});

const mapDispatchToProps = dispatch => ({
    LoadEmpresasAction: () => {
        business.on('business', (business) => {
            dispatch({
                type: "LOAD_EMPRESAS",
                payload: {
                    loading: "hide",
                    data: business.data,
                    pagination: {
                        total: business.total,
                        page: business.page,
                        perPage: business.perPage,
                        lastPage: business.lastPage,
                        numberPage: calculatePage(business.page, 2, business.lastPage),
                    },
                }
            });
        })
        dispatch(LoadEmpresasAction())
    },
    allBusinessFunction: (page, perPage, search) => dispatch(allBusinessFunction(page, perPage, search)),
    confirm: (message, callback) => dispatch(openConfirmDialog(message, callback)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Empresa);