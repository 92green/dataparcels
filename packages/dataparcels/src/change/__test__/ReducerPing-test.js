// @flow
import Reducer from '../Reducer';
import Action from '../Action';

test('Reducer should ping', () => {
    var data = {
        value: [
            0,
            1,
            2
        ],
        key: "^",
        child: undefined
    };
    var action = new Action({
        type: "ping"
    });

    var expectedValue = [
        0,
        1,
        2
    ];
    expect(expectedValue).toEqual(Reducer(data, action).value);
});

