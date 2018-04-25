// @flow
import React from 'react';
import type {Element} from 'react';
import PropTypes from 'prop-types';
import BaseParcel from '../parcel/BaseParcel';

import shallowEquals from 'unmutable/lib/shallowEquals';
import del from 'unmutable/lib/delete';
import update from 'unmutable/lib/update';
import pipe from 'unmutable/lib/util/pipe';

export default class PureParcel extends React.Component {
    static defaultProps = {
        element: "div"
    };

    static propTypes = {
        element: PropTypes.string,
        parcel: PropTypes.instanceOf(BaseParcel).isRequired,
        render: PropTypes.func.isRequired
    };

    shouldComponentUpdate(nextProps: Object): boolean {
        let withParcelValue = pipe(
            del("render"),
            update("parcel", parcel => parcel && parcel.value())
        );

        let aa = withParcelValue(this.props);
        let bb = withParcelValue(nextProps);
        return !shallowEquals(aa)(bb);
    }

    render(): Element<*> {
        let {
            element,
            render,
            parcel,
            ...rest
        } = this.props;

        let Component = element;
        return <Component {...rest} >
            {render(parcel)}
        </Component>;
    }
}
