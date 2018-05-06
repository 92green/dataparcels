// // @flow
// import test from 'ava';
// import React from 'react';

// import {configure} from 'enzyme';
// import Adapter from 'enzyme-adapter-react-16';
// configure({adapter: new Adapter()});

// import {shallow} from 'enzyme';
// import PureParcel from '../PureParcel';

// let render = () => {};

// test('PureParcel shouldComponentUpdate should be pure', tt => {
//     let props = {
//         element: "div",
//         a: 123,
//         render
//     };

//     let comp = shallow(<PureParcel {...props} />);
//     let shouldUpdate = comp.instance().shouldComponentUpdate({
//         element: "div",
//         a: 123,
//         render
//     })

//     tt.false(shouldUpdate);

//     shouldUpdate = comp.instance().shouldComponentUpdate({
//         element: "div",
//         a: 123,
//         b: 456,
//         render
//     })

//     tt.true(shouldUpdate);
// });

// test('PureParcel shouldComponentUpdate should use parcel.value() for comparison', tt => {
//     let parcelValue = {
//         b:456
//     };

//     let props = {
//         element: "div",
//         a: 123,
//         parcel: {
//             value: () => parcelValue
//         },
//         render
//     };

//     let comp = shallow(<PureParcel {...props} />);
//     let shouldUpdate = comp.instance().shouldComponentUpdate({
//         element: "div",
//         a: 123,
//         parcel: {
//             value: () => parcelValue
//         },
//         render
//     });

//     tt.false(shouldUpdate);

//     shouldUpdate = comp.instance().shouldComponentUpdate({
//         element: "div",
//         a: 123,
//         parcel: {
//             value: () => 2111
//         },
//         render
//     })

//     tt.true(shouldUpdate);
// });
