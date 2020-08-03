/**
 * App Routes
 */
import React from 'react';
import { Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

// app default layout
import RctAppLayout from 'Components/RctAppLayout';

// router service
import routerService from "../services/_routerService";

const DefaultLayout = (props) => {
	const { match } = props;
	return (
		<RctAppLayout>
			{routerService && routerService.map((route,key)=>
				<Route key={key} path={`${match.url}/${route.path}`} component={route.component} />
			)}
		</RctAppLayout>
	);
}

export default withRouter(connect(null)(DefaultLayout));
