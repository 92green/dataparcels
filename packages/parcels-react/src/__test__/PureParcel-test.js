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

test('PureParcel shouldComponentUpdate should rerender when parcel contents changes', tt => {
    let parcel = new Parcel({value: 123});
    let parcel2 = new Parcel({value: 456});
    let children = (parcel) => "...";
    let a = "???";

    let comp = shallow(<PureParcel parcel={parcel}>
        {children}
    </PureParcel>);

    let shouldUpdate = comp.instance().shouldComponentUpdate({
        parcel: parcel2,
        children
    });

    tt.true(shouldUpdate);
});


test('PureParcel shouldComponentUpdate should rerender when forceUpdate props change', tt => {
    let parcel = new Parcel();
    let children = (parcel) => "...";
    let a = "???";

    let comp = shallow(<PureParcel parcel={parcel} forceUpdate={[a]}>
        {children}
    </PureParcel>);

    let shouldUpdate = comp.instance().shouldComponentUpdate({
        parcel,
        forceUpdate: ["!!!"],
        children
    });

    tt.true(shouldUpdate);
});
