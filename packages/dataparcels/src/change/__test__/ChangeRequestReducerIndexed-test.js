// @flow
import ChangeRequest from '../ChangeRequest';
import ActionReducer from '../ActionReducer';
import Action from '../Action';
import pipeWith from 'unmutable/lib/util/pipeWith';

let data = {
    value: [0,1,2],
    key: "^",
    meta: {abc: 123}
};

let EXPECTED_KEY_AND_META = {
    key: "^",
    meta: {abc: 123}
};

[
    "insertAfter",
    "insertBefore",
    "swap",
    "swapNext",
    "swapPrev"
].forEach((type: string) => {
    test(`Reducer ${type} action should return unchanged parcelData if keyPath is empty`, () => {
        expect(ActionReducer(new Action({type}))(data)).toEqual(data);
    });
});

const TestIndex = (arr) => arr.map(({action, expectedData}) => {
    test(`Reducer ${action.type} action should ${action.type} with keyPath ${JSON.stringify(action.keyPath)}`, () => {
        expect(ActionReducer(new Action(action))(data)).toEqual(expectedData);
    });

    let deepAction = {
        ...action,
        keyPath: ["a", "b", ...action.keyPath]
    };

    let deepData = {
        ...data,
        value: {
            a: {
                b: data.value
            }
        }
    };

    let deepExpectedData = {
        ...expectedData,
        value: {
            a: {
                b: expectedData.value
            }
        },
        child: {
            a: {
                key: "a",
                child: {
                    b: {
                        key: "b",
                        child: expectedData.child
                    }
                }
            }
        }
    };

    test(`Reducer ${action.type} action should ${action.type} deeply with keyPath ${JSON.stringify(deepAction.keyPath)}`, () => {
        expect(ActionReducer(new Action(deepAction))(deepData)).toEqual(deepExpectedData);
    });
});

TestIndex([
    {
        action: {
            type: "delete",
            keyPath: ["#a"]
        },
        expectedData: {
            value: [1,2],
            child: [{key: "#b"}, {key: "#c"}],
            ...EXPECTED_KEY_AND_META
        }
    }
]);

TestIndex([
    {
        action: {
            type: "insertAfter",
            payload: 3,
            keyPath: ["#a"]
        },
        expectedData: {
            value: [0,3,1,2],
            child: [{key: "#a"},{key: "#d"},{key: "#b"}, {key: "#c"}],
            ...EXPECTED_KEY_AND_META
        }
    }
]);

TestIndex([
    {
        action: {
            type: "insertBefore",
            payload: 3,
            keyPath: ["#a"]
        },
        expectedData: {
            value: [3,0,1,2],
            child: [{key: "#d"},{key: "#a"},{key: "#b"}, {key: "#c"}],
            ...EXPECTED_KEY_AND_META
        }
    }
]);

TestIndex([
    {
        action: {
            type: "push",
            keyPath: [],
            payload: [3,4]
        },
        expectedData: {
            value: [0,1,2,3,4],
            child: [{key: "#a"},{key: "#b"}, {key: "#c"},{key: "#d"},{key: "#e"}],
            ...EXPECTED_KEY_AND_META
        }
    }
]);

TestIndex([
    {
        action: {
            type: "set",
            payload: 3,
            keyPath: ["#a"]
        },
        expectedData: {
            value: [3,1,2],
            child: [{key: "#a"},{key: "#b"}, {key: "#c"}],
            ...EXPECTED_KEY_AND_META
        }
    }
]);

TestIndex([
    {
        action: {
            type: "swap",
            payload: "#c",
            keyPath: ["#a"]
        },
        expectedData: {
            value: [2,1,0],
            child: [{key: "#c"},{key: "#b"}, {key: "#a"}],
            ...EXPECTED_KEY_AND_META
        }
    }
]);

TestIndex([
    {
        action: {
            type: "swapNext",
            keyPath: ["#a"]
        },
        expectedData: {
            value: [1,0,2],
            child: [{key: "#b"},{key: "#a"}, {key: "#c"}],
            ...EXPECTED_KEY_AND_META
        }
    }
]);

