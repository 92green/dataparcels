// @flow
import ChangeRequest from '../ChangeRequest';
import ChangeRequestReducer from '../ChangeRequestReducer';
import Action from '../Action';
import pipeWith from 'unmutable/lib/util/pipeWith';

const makeReducer = (action) => pipeWith(
    new ChangeRequest(action),
    ChangeRequestReducer
);

test('ChangeRequestReducer should ping', () => {
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
    expect(makeReducer(action)(data).value).toEqual(expectedValue);
});

