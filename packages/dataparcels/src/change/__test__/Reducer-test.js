// @flow
import Reducer from '../Reducer';
import Action from '../Action';

test('Reducer should throw error if action is not provided', () => {
    var data = {
        value: 123,
        key: "^",
        child: undefined
    };

    // $FlowFixMe - intential misuse of types
    expect(() => Reducer(data)).toThrowError(`Reducer must receive an Action`);
});
