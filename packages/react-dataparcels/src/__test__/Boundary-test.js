// @flow
import React from 'react';
import Boundary from '../Boundary';
import Parcel from 'dataparcels';

test('Boundary should not rerender if parcel has not changed value and memo = true', () => {
    let childRenderer = jest.fn();

    let parcel = new Parcel();

    let wrapper = shallow(<Boundary source={parcel}>
        {childRenderer}
    </Boundary>);

    wrapper.setProps({
        parcel,
        somethingElse: true
    });

    wrapper.update();

    expect(childRenderer).toHaveBeenCalledTimes(1);
});

test('Boundary should rerender if parcel has not changed value and memo = false', () => {
    let childRenderer = jest.fn();

    let parcel = new Parcel();

    let wrapper = shallow(<Boundary source={parcel} memo={false}>
        {childRenderer}
    </Boundary>);

    wrapper.setProps({
        parcel,
        somethingElse: true
    });

    wrapper.update();

    // greater than one because react with hooks can re-render more than just once
    expect(childRenderer.mock.calls.length > 1).toBe(true);
});

test('Boundary should rerender if parcel has not changed value but dependencies has', () => {
    let childRenderer = jest.fn();

    let parcel = new Parcel();

    let wrapper = shallow(<Boundary source={parcel} dependencies={["abc"]}>
        {childRenderer}
    </Boundary>);

    wrapper.setProps({
        parcel,
        dependencies: ["def"]
    });

    wrapper.update();

    expect(childRenderer).toHaveBeenCalledTimes(2);
});
