// @flow
import test from 'ava';
import {List, Map} from 'immutable';
import Reducer from '../Reducer';
import Action from '../Action';

test('Reducer should throw error if action is not provided', tt => {
    var data = {
        value: 123
    };

    tt.is(tt.throws(() => Reducer(data), Error).message, `Reducer must receive an Action`);
});

//
// delete
//

test('Reducer delete action should throw error if keyPath is empty', tt => {
    var data = {
        value: [
            0,
            1,
            2
        ]
    };
    var action = new Action({
        type: "delete"
    });

    tt.is(tt.throws(() => Reducer(data, action), Error).message, `Delete actions must have a keyPath with at least one key`);
});


test('Reducer should delete key', tt => {
    var data = {
        value: {
            a: 1,
            b: 2
        }
    };
    var action = new Action({
        type: "delete",
        keyPath: ["a"]
    });

    var expectedValue = {
        b: 2
    };
    tt.deepEqual(expectedValue, Reducer(data, action).value);
});

test('Reducer should delete deep key', tt => {
    var data = {
        value: {
            a: {
                b: 2,
                d: 4
            },
            c: 3
        }
    };
    var action = new Action({
        type: "delete",
        keyPath: ["a", "b"]
    });

    var expectedValue = {
        a: {
            d: 4
        },
        c: 3
    };
    tt.deepEqual(expectedValue, Reducer(data, action).value);
});

test('Reducer should delete array index', tt => {
    var data = {
        value: [
            0,
            1,
            2
        ]
    };
    var action = new Action({
        type: "delete",
        keyPath: [0]
    });

    var expectedValue = [
        1,
        2
    ];
    tt.deepEqual(expectedValue, Reducer(data, action).value);
});

test('Reducer should delete array key', tt => {
    var data = {
        value: [
            0,
            1,
            2
        ]
    };
    var action = new Action({
        type: "delete",
        keyPath: ["#a"]
    });

    var expectedValue = [
        1,
        2
    ];
    tt.deepEqual(expectedValue, Reducer(data, action).value);
});

//
// insertAfter
//

test('Reducer insertAfter action should throw error if keyPath is empty', tt => {
    var data = {
        value: [
            0,
            1,
            2
        ]
    };
    var action = new Action({
        type: "insertAfter",
        payload: {
            value: 3
        }
    });

    tt.is(tt.throws(() => Reducer(data, action), Error).message, `InsertAfter actions must have a keyPath with at least one key`);
});

test('Reducer should insertAfter by array index', tt => {
    var data = {
        value: [
            0,
            1,
            2
        ]
    };
    var action = new Action({
        type: "insertAfter",
        keyPath: [1],
        payload: {
            value: 3
        }
    });

    var expectedValue = [
        0,
        1,
        3,
        2
    ];
    tt.deepEqual(expectedValue, Reducer(data, action).value);
});

test('Reducer should insertAfter by array key', tt => {
    var data = {
        value: [
            0,
            1,
            2
        ]
    };
    var action = new Action({
        type: "insertAfter",
        keyPath: ["#c"],
        payload: {
            value: 3
        }
    });
    var expectedValue = [
        0,
        1,
        2,
        3
    ];
    tt.deepEqual(expectedValue, Reducer(data, action).value);
});

test('Reducer should insertAfter by array index deeply', tt => {
    var data = {
        value: [
            null,
            {
                thing: [
                    0,
                    1,
                    2
                ]
            }
        ]
    };
    var action = new Action({
        type: "insertAfter",
        keyPath: [1, "thing", 1],
        payload: {
            value: 3
        }
    });

    var expectedValue = [
        null,
        {
            thing: [
                0,
                1,
                3,
                2
            ]
        }
    ];
    tt.deepEqual(expectedValue, Reducer(data, action).value);
});

//
// insertBefore
//

test('Reducer insertBefore action should throw error if keyPath is empty', tt => {
    var data = {
        value: [
            0,
            1,
            2
        ]
    };
    var action = new Action({
        type: "insertBefore",
        payload: {
            value: 3
        }
    });

    tt.is(tt.throws(() => Reducer(data, action), Error).message, `InsertBefore actions must have a keyPath with at least one key`);
});

test('Reducer should insertBefore by array index', tt => {
    var data = {
        value: [
            0,
            1,
            2
        ]
    };
    var action = new Action({
        type: "insertBefore",
        keyPath: [1],
        payload: {
            value: 3
        }
    });

    var expectedValue = [
        0,
        3,
        1,
        2
    ];
    tt.deepEqual(expectedValue, Reducer(data, action).value);
});

test('Reducer should insertBefore by array key', tt => {
    var data = {
        value: [
            0,
            1,
            2
        ]
    };
    var action = new Action({
        type: "insertBefore",
        keyPath: ["#c"],
        payload: {
            value: 3
        }
    });
    var expectedValue = [
        0,
        1,
        3,
        2
    ];
    tt.deepEqual(expectedValue, Reducer(data, action).value);
});

test('Reducer should insertBefore by array index deeply', tt => {
    var data = {
        value: [
            null,
            {
                thing: [
                    0,
                    1,
                    2
                ]
            }
        ]
    };
    var action = new Action({
        type: "insertBefore",
        keyPath: [1, "thing", 1],
        payload: {
            value: 3
        }
    });

    var expectedValue = [
        null,
        {
            thing: [
                0,
                3,
                1,
                2
            ]
        }
    ];
    tt.deepEqual(expectedValue, Reducer(data, action).value);
});

//
// pop
//

test('Reducer should pop', tt => {
    var data = {
        value: [
            0,
            1,
            2
        ]
    };
    var action = new Action({
        type: "pop"
    });

    var expectedValue = [
        0,
        1
    ];
    tt.deepEqual(expectedValue, Reducer(data, action).value);
});

test('Reducer should pop deeply', tt => {
    var data = {
        value: {
            woo: [
                0,
                1,
                2
            ]
        }
    };
    var action = new Action({
        type: "pop",
        keyPath: ["woo"]
    });

    var expectedValue = {
        woo: [
            0,
            1
        ]
    };
    tt.deepEqual(expectedValue, Reducer(data, action).value);
});

test('Reducer pop action should throw error if array keys in keyPath are invalid', tt => {
    var data = {
        value: [
            0,
            1,
            2
        ]
    };
    var action = new Action({
        type: "pop",
        keyPath: ["#z"]
    });

    tt.truthy(tt.throws(() => {
        Reducer(data, action);
    }, Error));
});

//
// push
//

test('Reducer should push', tt => {
    var data = {
        value: [
            0,
            1,
            2
        ]
    };
    var action = new Action({
        type: "push",
        payload: {
            value: 3
        }
    });
    var expectedValue = [
        0,
        1,
        2,
        3
    ];
    tt.deepEqual(expectedValue, Reducer(data, action).value);
});

test('Reducer should push deeply', tt => {
    var data = {
        value: [
            null,
            {
                thing: [
                    0,
                    1,
                    2
                ]
            }
        ]
    };
    var action = new Action({
        type: "push",
        keyPath: [1, "thing"],
        payload: {
            value: 3
        }
    });
    var expectedValue = [
        null,
        {
            thing: [
                0,
                1,
                2,
                3
            ]
        }
    ];
    tt.deepEqual(expectedValue, Reducer(data, action).value);
});

//
// set
//

test('Reducer should set with empty keyPath', tt => {
    var data = {
        value: {
            a: 1,
            b: 2
        }
    };
    var action = new Action({
        type: "set",
        payload: {
            value: 3
        }
    });
    var expectedValue = 3;

    tt.deepEqual(expectedValue, Reducer(data, action).value);
});

test('Reducer should set by key', tt => {
    var data = {
        value: {
            a: 1,
            b: 2
        }
    };
    var action = new Action({
        type: "set",
        keyPath: ["b"],
        payload: {
            value: 3
        }
    });
    var expectedValue = {
        a: 1,
        b: 3
    };

    tt.deepEqual(expectedValue, Reducer(data, action).value);
});

test('Reducer should set by deep key', tt => {
    var data = {
        value: {
            a: 1,
            b: {
                c: 1
            }
        }
    };
    var action = new Action({
        type: "set",
        keyPath: ["b", "c"],
        payload: {
            value: 3
        }
    });
    var expectedValue = {
        a: 1,
        b: {
            c: 3
        }
    };

    tt.deepEqual(expectedValue, Reducer(data, action).value);
});


test('Reducer should set by array index', tt => {
    var data = {
        value: [
            0,
            1,
            2
        ]
    };
    var action = new Action({
        type: "set",
        keyPath: [1],
        payload: {
            value: 111
        }
    });
    var expectedValue = [
        0,
        111,
        2
    ];
    tt.deepEqual(expectedValue, Reducer(data, action).value);
});

test('Reducer should set by array key', tt => {
    var data = {
        value: [
            0,
            1,
            2
        ]
    };
    var action = new Action({
        type: "set",
        keyPath: ["#c"],
        payload: {
            value: 333
        }
    });
    var expectedValue = [
        0,
        1,
        333
    ];
    tt.deepEqual(expectedValue, Reducer(data, action).value);
});

//
// setMeta
//

test('Reducer should setMeta with empty keyPath', tt => {
    var data = {
        value: {
            a: 1,
            b: 2
        },
        meta: {}
    };
    var action = new Action({
        type: "setMeta",
        keyPath: [],
        payload: {
            meta: {
                abc: 123
            }
        }
    });
    var expectedMeta = {
        abc: 123
    };

    tt.deepEqual(expectedMeta, Reducer(data, action).meta);
});

test('Reducer should setMeta merge', tt => {
    var data = {
        value: {
            a: 1,
            b: 2
        },
        meta: {
            def: 456
        }
    };
    var action = new Action({
        type: "setMeta",
        keyPath: [],
        payload: {
            meta: {
                abc: 123
            }
        }
    });
    var expectedMeta = {
        abc: 123,
        def: 456
    };

    tt.deepEqual(expectedMeta, Reducer(data, action).meta);
});

test('Reducer should setMeta with keyPath', tt => {
    var data = {
        value: {
            a: 1,
            b: 2
        },
        meta: {}
    };
    var action = new Action({
        type: "setMeta",
        keyPath: ["a"],
        payload: {
            meta: {
                abc: 123
            }
        }
    });
    var expectedChild = {
        a: {
            key: "a",
            meta: {
                abc: 123
            }
        },
        b: {
            key: "b"
        }
    };

    tt.deepEqual(expectedChild, Reducer(data, action).child);
});

test('Reducer should merge setMeta with keyPath', tt => {
    var data = {
        value: {
            a: 1,
            b: 2
        },
        child: {
            a: {
                key: "a",
                meta: {
                    abc: 123
                }
            }
        },
        meta: {}
    };
    var action = new Action({
        type: "setMeta",
        keyPath: ["a"],
        payload: {
            meta: {
                def: 456
            }
        }
    });
    var expectedChild = {
        a: {
            key: "a",
            meta: {
                abc: 123,
                def: 456
            }
        },
        b: {
            key: "b"
        }
    };

    tt.deepEqual(expectedChild, Reducer(data, action).child);
});


//
// shift
//

test('Reducer should shift', tt => {
    var data = {
        value: [
            0,
            1,
            2
        ]
    };
    var action = new Action({
        type: "shift"
    });

    var expectedValue = [
        1,
        2
    ];
    tt.deepEqual(expectedValue, Reducer(data, action).value);
});

test('Reducer should shift deeply', tt => {
    var data = {
        value: {
            woo: [
                0,
                1,
                2
            ]
        }
    };
    var action = new Action({
        type: "shift",
        keyPath: ["woo"]
    });
    var expectedValue = {
        woo: [
            1,
            2
        ]
    };
    tt.deepEqual(expectedValue, Reducer(data, action).value);
});

//
// swap
//

test('Reducer swap action should throw error if keyPath is empty', tt => {
    var data = {
        value: [
            0,
            1,
            2
        ]
    };
    var action = new Action({
        type: "swap",
        payload: {
            swapIndex: 1
        }
    });

    tt.is(tt.throws(() => Reducer(data, action), Error).message, `Swap actions must have a keyPath with at least one key`);
});

test('Reducer swap action should throw error if payload.swapIndex doesnt exist', tt => {
    var data = {
        value: [
            0,
            1,
            2
        ]
    };
    var action = new Action({
        type: "swap",
        keyPath: [0]
    });

    tt.is(tt.throws(() => Reducer(data, action), Error).message, `Swap actions must have a swapIndex in their payload`);
});


test('Reducer should swap by array indexes', tt => {
    var data = {
        value: [
            0,
            1,
            2
        ]
    };
    var action = new Action({
        type: "swap",
        keyPath: [0],
        payload: {
            swapIndex: 2
        }
    });
    var expectedValue = [
        2,
        1,
        0
    ];
    tt.deepEqual(expectedValue, Reducer(data, action).value);
});

test('Reducer should swap by array keys', tt => {
    var data = {
        value: [
            0,
            1,
            2
        ]
    };
    var action = new Action({
        type: "swap",
        keyPath: ["#a"],
        payload: {
            swapIndex: "#b"
        }
    });
    var expectedValue = [
        1,
        0,
        2
    ];
    tt.deepEqual(expectedValue, Reducer(data, action).value);
});

//
// swapNext
//

test('Reducer swapNext action should throw error if keyPath is empty', tt => {
    var data = {
        value: [
            0,
            1,
            2
        ]
    };
    var action = new Action({
        type: "swapNext"
    });

    tt.is(tt.throws(() => Reducer(data, action), Error).message, `SwapNext actions must have a keyPath with at least one key`);
});

//
// swapPrev
//

test('Reducer swapPrev action should throw error if keyPath is empty', tt => {
    var data = {
        value: [
            0,
            1,
            2
        ]
    };
    var action = new Action({
        type: "swapPrev"
    });

    tt.is(tt.throws(() => Reducer(data, action), Error).message, `SwapPrev actions must have a keyPath with at least one key`);
});

//
// unshift
//

test('Reducer should unshift', tt => {
    var data = {
        value: [
            0,
            1,
            2
        ]
    };
    var action = new Action({
        type: "unshift",
        payload: {
            value: 7
        }
    });
    var expectedValue = [
        7,
        0,
        1,
        2
    ];
    tt.deepEqual(expectedValue, Reducer(data, action).value);
});

test('Reducer should unshift deeply', tt => {
    var data = {
        value: [
            null,
            {
                thing: [
                    0,
                    1,
                    2
                ]
            }
        ]
    };
    var action = new Action({
        type: "unshift",
        keyPath: [1, "thing"],
        payload: {
            value: 7
        }
    });
    var expectedValue = [
        null,
        {
            thing: [
                7,
                0,
                1,
                2
            ]
        }
    ];
    tt.deepEqual(expectedValue, Reducer(data, action).value);
});

test('Reducer should swap deeply', tt => {
    var data = {
        value: [
            {
                firstname: "Killie",
                lastname: "Oberst",
                pets: [
                    {
                        name: "Yoghurt",
                        animal: "Dog"
                    },
                    {
                        name: "Simpson",
                        animal: "Yak"
                    }
                ]
            },
            {
                firstname: "Amanda",
                lastname: "Hobbleston",
                pets: [
                    {
                        name: "Klepto",
                        animal: "Fish"
                    }
                ]
            }
        ]
    };


    var action = new Action({
        type: "swap",
        keyPath: [0, "pets", 0],
        payload: {
            swapIndex: 1
        }
    });
    var expectedValue = [
        {
            firstname: "Killie",
            lastname: "Oberst",
            pets: [
                {
                    name: "Simpson",
                    animal: "Yak"
                },
                {
                    name: "Yoghurt",
                    animal: "Dog"
                }
            ]
        },
        {
            firstname: "Amanda",
            lastname: "Hobbleston",
            pets: [
                {
                    name: "Klepto",
                    animal: "Fish"
                }
            ]
        }
    ];

    tt.deepEqual(expectedValue, Reducer(data, action).value);
});

//
// action array test with push
//

test('Reducer should push multiple', tt => {
    var data = {
        value: [
            0,
            1,
            2
        ]
    };
    var action = [
        new Action({
            type: "push",
            payload: {
                value: 3
            }
        }),
        new Action({
            type: "push",
            payload: {
                value: 4
            }
        })
    ];

    var expectedValue = [
        0,
        1,
        2,
        3,
        4
    ];
    tt.deepEqual(expectedValue, Reducer(data, action).value);
});

//
// incorrect action
//

test('Reducer should throw error if action is not valid', tt => {
    var data = {
        value: [
            0,
            1,
            2
        ]
    };
    var action = new Action({
        type: "fake"
    });

    tt.is(tt.throws(() => Reducer(data, action), Error).message, `"fake" is not a valid action`);
});
