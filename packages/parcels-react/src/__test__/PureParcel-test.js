// @flow
import test from 'ava';
import React from 'react';

import {configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});

import {shallow} from 'enzyme';
import PureParcel from '../PureParcel';
import Parcel from 'parcels';

test('PureParcel shouldComponentUpdate should be pure', tt => {
    let parcel = new Parcel();
    let children = (parcel) => "...";

    let comp = shallow(<PureParcel parcel={parcel}>
        {children}
    </PureParcel>);

    let shouldUpdate = comp.instance().shouldComponentUpdate({
        parcel,
        children
    });

    tt.false(shouldUpdate);
});
