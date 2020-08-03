import React from "react";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";

class Pager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        const { dataPagination } = this.props;
        let totalPage = Math.ceil(dataPagination.total / dataPagination.perPage);
        return (
            <div style={{ float: 'right' }}>
                <Pagination aria-label="Page navigation example">
                    {
                        dataPagination.page > 1 &&
                        <PaginationItem>
                            <PaginationLink
                                first
                                onClick={() => { this.props.allFunction(1, 10, ""); }}
                            />
                        </PaginationItem>
                    }
                    {
                        dataPagination.page > 1 &&
                        <PaginationItem>
                            <PaginationLink
                                previous
                                onClick={() => { this.props.allFunction(dataPagination.page - 1, 10, ""); }}
                            />
                        </PaginationItem>
                    }


                    {dataPagination.numberPage && dataPagination.numberPage.map((data, i) => {
                        return (
                            <PaginationItem key={i} active={data === dataPagination.page ? true : false}>
                                <PaginationLink onClick={() => { this.props.allFunction(data, 10, ""); }} >
                                    {data}
                                </PaginationLink>
                            </PaginationItem>
                        );
                    })
                    }
                    {
                        dataPagination.page < dataPagination.lastPage &&
                        <PaginationItem>
                            <PaginationLink
                                next
                                onClick={() => { this.props.allFunction(dataPagination.page + 1, 10, ""); }}
                            />
                        </PaginationItem>
                    }
                    {
                        dataPagination.page < dataPagination.lastPage &&
                        <PaginationItem>
                            <PaginationLink 
                                last 
                                onClick={() => { this.props.allFunction(totalPage, 10, ""); }}
                            />
                        </PaginationItem>
                    }
                </Pagination>
            </div>
        );
    }
}
export default Pager;