// @flow
import React from 'react';
import type {Element} from 'react';
import PropTypes from 'prop-types';
import Parcel from '../parcel/Parcel';

import shallowEquals from 'unmutable/lib/shallowEquals';
import del from 'unmutable/lib/delete';
import update from 'unmutable/lib/update';
import pipe from 'unmutable/lib/util/pipe';

type Props = {
    element: *,
    render: (parcel: Parcel) => Element<*>,
    parcel: Parcel
};

export default class PureParcel extends React.Component<Props> {
    static defaultProps = {
        element: "div"
    };

    static propTypes = {
        element: PropTypes.string,
        parcel: PropTypes.instanceOf(Parcel).isRequired,
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
