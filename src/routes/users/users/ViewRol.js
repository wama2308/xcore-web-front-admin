import React, { Fragment, useState, useEffect } from 'react';
import { Label } from "reactstrap";
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import CheckboxTree from 'react-checkbox-tree';

const ViewRol = props => {
    const initialState = {
        modal: false,
        modalHeader: '',
        modalFooter: '',
        buttonFooter: '',
        data: {},
        disabled: '',
        showHide: false,
        option: 0,
    }
    const [list, setList] = useState(initialState)

    const { data } = props;
    //console.log("data ", data)
    return (
        <div className='flex-container'>
            <div style={{
                width: '100%',
                backgroundColor: '#fff',
                border: '1px solid rgba(0, 0, 0, 0.125)',
                borderRadius: '0.25rem',
                padding: '10px',
                overflow: 'auto',
            }}
            >
                <div style={{ width: '45vh' }}>
                    <Label for="rold_id">Rol: {data.name}</Label><br />
                    <Label for="rold_id">Descripcion: {data.description}</Label>
                </div>
            </div>
            <div style={{
                width: '100%',
                backgroundColor: '#fff',
                border: '1px solid rgba(0, 0, 0, 0.125)',
                borderRadius: '0.25rem',
                padding: '10px',
                overflow: 'auto',
            }}
            >
                <div style={{ width: '45vh' }}>
                    <Label for="rold_id">Modulos - Permisos</Label>
                    <CheckboxTree
                        nodes={data.modules}
                        checked={data.simplePermits}
                        expanded={data.simpleModules}
                        //onExpand={expanded => this.expandedTree(expanded)}
                        icons={{
                            check: <span><i className="fa fa-check"></i></span>,
                            uncheck: <span className="rct-icon rct-icon-uncheck" />,
                            halfCheck: <span className="rct-icon rct-icon-half-check" />,
                            expandClose: <span className="rct-icon rct-icon-expand-close" />,
                            expandOpen: <span className="" />,
                            expandAll: <span className="" />,
                            collapseAll: <span className="rct-icon rct-icon-collapse-all" />,
                            parentClose: <span className="" />,
                            parentOpen: <span className="" />,
                            leaf: <span className="" />,
                        }}
                        disabled={props.disabled}
                    />
                </div>
            </div>
            <style jsx=''>
                {
                    `.rct-title {
                        margin-left: -40px;                                      
                    }`
                }

            </style>
        </div>
    )
}

export default ViewRol