// @flow
import test from 'ava';
import React from 'react';

import {configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});

import {shallow} from 'enzyme';
import PureMapper from '../PureMapper';
import ParcelFactory from '../../ParcelFactory';

test('PureMapper should pass correct args around', tt => {
    tt.plan(5);
    let config = {
        value: "???",
        key: "keeey",
        handleChange: () => {}
    };

    let parcel = ParcelFactory(config);

    let index = 0;
    let iter = {};
    let render = () => "?";

    let e = PureMapper((pp, ii, it) => {
        tt.is(parcel, pp, `PureMapper shjould pass parcel`);
        tt.is(index, ii, `PureMapper should pass index`);
        tt.is(iter, it, `PureMapper should pass iter`);
        return render;
    })(parcel, index, iter);

    tt.is(config.key, e.key, `Key should be set`);
    tt.is(parcel, e.props.parcel, `Parcel should be passed as prop`);

    e.props.render();
});

test('PureMapper should pass extra props', tt => {
    let config = {
        value: "???",
        key: "keeey",
        handleChange: () => {}
    };

    let parcel = ParcelFactory(config);

    let index = 0;
    let iter = {};
    let render = () => "?";
    let extraProps = {a: "1"};

    let e = PureMapper(() => render, extraProps)(parcel, index, iter);
    tt.is(extraProps.a, e.props.a, `Parcel should be passed extra props`);
});
