import React from "react";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";

class PagerSaleAll extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    paginationFunction = data => {
        let numberPage = [];
        for (let i = 0; i < data; i++) {
            numberPage.push(i + 1);
        }
        return numberPage;
    }

    render() {
        const { dataPagination, page, perPage, numberPage } = this.props;
        let totalPage = Math.ceil(dataPagination.length / perPage);
        let pagination = this.paginationFunction(totalPage);

        return (
            <div style={{ float: 'right' }}>
                <Pagination aria-label="Page navigation example">
                    {
                        page > 1 &&
                        <PaginationItem>
                            <PaginationLink
                                first
                                onClick={() => { this.props.handlePagination(1, totalPage) }}
                            />
                        </PaginationItem>
                    }
                    {
                        page > 1 &&
                        <PaginationItem>
                            <PaginationLink
                                previous
                                onClick={() => { this.props.handlePagination(page - 1, totalPage); }}
                            />
                        </PaginationItem>
                    }


                    {numberPage && numberPage.map((data, i) => {
                        return (
                            <PaginationItem key={i} active={data === this.props.page ? true : false}>
                                <PaginationLink onClick={() => { this.props.handlePagination(data, totalPage) }} >
                                    {data}
                                </PaginationLink>
                            </PaginationItem>
                        );
                    })
                    }
                    {
                        page < totalPage &&
                        <PaginationItem>
                            <PaginationLink
                                next
                                onClick={() => { this.props.handlePagination(page + 1, totalPage) }}
                            />
                        </PaginationItem>
                    }
                    {
                        page < totalPage &&
                        <PaginationItem>
                            <PaginationLink
                                last
                                onClick={() => { this.props.handlePagination(totalPage, totalPage) }}
                            />
                        </PaginationItem>
                    }
                </Pagination>
            </div>
        );
    }
}
export default PagerSaleAll;