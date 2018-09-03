// @flow
import { List, Map } from 'immutable';
import Reducer from '../Reducer';
import Action from '../Action';

test('Reducer should throw error if action is not provided', () => {
    var data = {
        value: 123,
        meta: {},
        key: "^",
        child: undefined
    };

    // $FlowFixMe - intential misuse of types
    expect(() => Reducer(data)).toThrowError(`Reducer must receive an Action`);
});

//
// delete
//

test('Reducer delete action should throw error if keyPath is empty', () => {
    var data = {
        value: [
            0,
            1,
            2
        ],
        meta: {},
        key: "^",
        child: undefined
    };
    var action = new Action({
        type: "delete"
    });

    expect(() => Reducer(data, action)).toThrowError(`Delete actions must have a keyPath with at least one key`);
});


test('Reducer should delete key', () => {
    var data = {
        value: {
            a: 1,
            b: 2
        },
        meta: {},
        key: "^",
        child: undefined
    };
    var action = new Action({
        type: "delete",
        keyPath: ["a"]
    });

    var expectedValue = {
        b: 2
    };
    expect(expectedValue).toEqual(Reducer(data, action).value);
});

test('Reducer should delete deep key', () => {
    var data = {
        value: {
            a: {
                b: 2,
                d: 4
            },
            c: 3
        },
        meta: {},
        key: "^",
        child: undefined
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
    expect(expectedValue).toEqual(Reducer(data, action).value);
});

test('Reducer should delete array index', () => {
    var data = {
        value: [
            0,
            1,
            2
        ],
        meta: {},
        key: "^",
        child: undefined
    };
    var action = new Action({
        type: "delete",
        keyPath: [0]
    });

    var expectedValue = [
        1,
        2
    ];
    expect(expectedValue).toEqual(Reducer(data, action).value);
});

test('Reducer should delete array key', () => {
    var data = {
        value: [
            0,
            1,
            2
        ],
        meta: {},
        key: "^",
        child: undefined
    };
    var action = new Action({
        type: "delete",
        keyPath: ["#a"]
    });

    var expectedValue = [
        1,
        2
    ];
    expect(expectedValue).toEqual(Reducer(data, action).value);
});

//
// insertAfter
//

test('Reducer insertAfter action should throw error if keyPath is empty', () => {
    var data = {
        value: [
            0,
            1,
            2
        ],
        meta: {},
        key: "^",
        child: undefined
    };
    var action = new Action({
        type: "insertAfter",
        payload: {
            value: 3
        }
    });

    expect(() => Reducer(data, action)).toThrowError(`InsertAfter actions must have a keyPath with at least one key`);
});

test('Reducer should insertAfter by array index', () => {
    var data = {
        value: [
            0,
            1,
            2
        ],
        meta: {},
        key: "^",
        child: undefined
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
    expect(expectedValue).toEqual(Reducer(data, action).value);
});

test('Reducer should insertAfter by array key', () => {
    var data = {
        value: [
            0,
            1,
            2
        ],
        meta: {},
        key: "^",
        child: undefined
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
    expect(expectedValue).toEqual(Reducer(data, action).value);
});

test('Reducer should insertAfter by array index deeply', () => {
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
        ],
        meta: {},
        key: "^",
        child: undefined
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
    expect(expectedValue).toEqual(Reducer(data, action).value);
});

//
// insertBefore
//

test('Reducer insertBefore action should throw error if keyPath is empty', () => {
    var data = {
        value: [
            0,
            1,
            2
        ],
        meta: {},
        key: "^",
        child: undefined
    };
    var action = new Action({
        type: "insertBefore",
        payload: {
            value: 3
        }
    });

    expect(() => Reducer(data, action)).toThrowError(`InsertBefore actions must have a keyPath with at least one key`);
});

test('Reducer should insertBefore by array index', () => {
    var data = {
        value: [
            0,
            1,
            2
        ],
        meta: {},
        key: "^",
        child: undefined
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
    expect(expectedValue).toEqual(Reducer(data, action).value);
});

test('Reducer should insertBefore by array key', () => {
    var data = {
        value: [
            0,
            1,
            2
        ],
        meta: {},
        key: "^",
        child: undefined
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
    expect(expectedValue).toEqual(Reducer(data, action).value);
});

test('Reducer should insertBefore by array index deeply', () => {
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
        ],
        meta: {},
        key: "^",
        child: undefined
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
    expect(expectedValue).toEqual(Reducer(data, action).value);
});

//
// ping
//

test('Reducer should ping', () => {
    var data = {
        value: [
            0,
            1,
            2
        ],
        meta: {},
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


//
// pop
//

test('Reducer should pop', () => {
    var data = {
        value: [
            0,
            1,
            2
        ],
        meta: {},
        key: "^",
        child: undefined
    };
    var action = new Action({
        type: "pop"
    });

    var expectedValue = [
        0,
        1
    ];
    expect(expectedValue).toEqual(Reducer(data, action).value);
});

test('Reducer should pop deeply', () => {
    var data = {
        value: {
            woo: [
                0,
                1,
                2
            ]
        },
        meta: {},
        key: "^",
        child: undefined
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
    expect(expectedValue).toEqual(Reducer(data, action).value);
});

test('Reducer pop action should throw error if array keys in keyPath are invalid', () => {
    var data = {
        value: [
            0,
            1,
            2
        ],
        meta: {},
        key: "^",
        child: undefined
    };
    var action = new Action({
        type: "pop",
        keyPath: ["#z"]
    });

    expect(() => Reducer(data, action)).toThrowError();
});

//
// push
//

test('Reducer should push', () => {
    var data = {
        value: [
            0,
            1,
            2
        ],
        meta: {},
        key: "^",
        child: undefined
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
    expect(expectedValue).toEqual(Reducer(data, action).value);
});

test('Reducer should push deeply', () => {
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
        ],
        meta: {},
        key: "^",
        child: undefined
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
    expect(expectedValue).toEqual(Reducer(data, action).value);
});

//
// set
//

test('Reducer should set with empty keyPath', () => {
    var data = {
        value: {
            a: 1,
            b: 2
        },
        meta: {},
        key: "^",
        child: undefined
    };
    var action = new Action({
        type: "set",
        payload: {
            value: 3
        }
    });
    var expectedValue = 3;

    expect(expectedValue).toEqual(Reducer(data, action).value);
});

test('Reducer should set by key', () => {
    var data = {
        value: {
            a: 1,
            b: 2
        },
        meta: {},
        key: "^",
        child: undefined
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

    expect(expectedValue).toEqual(Reducer(data, action).value);
});

test('Reducer should set by deep key', () => {
    var data = {
        value: {
            a: 1,
            b: {
                c: 1
            }
        },
        meta: {},
        key: "^",
        child: undefined
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

    expect(expectedValue).toEqual(Reducer(data, action).value);
});


test('Reducer should set by array index', () => {
    var data = {
        value: [
            0,
            1,
            2
        ],
        meta: {},
        key: "^",
        child: undefined
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
    expect(expectedValue).toEqual(Reducer(data, action).value);
});

test('Reducer should set by array key', () => {
    var data = {
        value: [
            0,
            1,
            2
        ],
        meta: {},
        key: "^",
        child: undefined
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
    expect(expectedValue).toEqual(Reducer(data, action).value);
});

//
// setMeta
//

test('Reducer should setMeta with empty keyPath', () => {
    var data = {
        value: {
            a: 1,
            b: 2
        },
        meta: {},
        key: "^",
        child: undefined
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

    expect(expectedMeta).toEqual(Reducer(data, action).meta);
});

test('Reducer should setMeta merge', () => {
    var data = {
        value: {
            a: 1,
            b: 2
        },
        meta: {
            def: 456
        },
        key: "^",
        child: undefined
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

    expect(expectedMeta).toEqual(Reducer(data, action).meta);
});

test('Reducer should setMeta with keyPath', () => {
    var data = {
        value: {
            a: 1,
            b: 2
        },
        meta: {},
        key: "^",
        child: undefined
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

    expect(expectedChild).toEqual(Reducer(data, action).child);
});

test('Reducer should merge setMeta with keyPath', () => {
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
        meta: {},
        key: "^"
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

    expect(expectedChild).toEqual(Reducer(data, action).child);
});


//
// shift
//

test('Reducer should shift', () => {
    var data = {
        value: [
            0,
            1,
            2
        ],
        meta: {},
        key: "^",
        child: undefined
    };
    var action = new Action({
        type: "shift"
    });

    var expectedValue = [
        1,
        2
    ];
    expect(expectedValue).toEqual(Reducer(data, action).value);
});

test('Reducer should shift deeply', () => {
    var data = {
        value: {
            woo: [
                0,
                1,
                2
            ]
        },
        meta: {},
        key: "^",
        child: undefined
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
    expect(expectedValue).toEqual(Reducer(data, action).value);
});

//
// swap
//

test('Reducer swap action should throw error if keyPath is empty', () => {
    var data = {
        value: [
            0,
            1,
            2
        ],
        meta: {},
        key: "^",
        child: undefined
    };
    var action = new Action({
        type: "swap",
        payload: {
            swapKey: 1
        }
    });

    expect(() => Reducer(data, action)).toThrowError(`Swap actions must have a keyPath with at least one key`);
});

test('Reducer swap action should throw error if payload.swapKey doesnt exist', () => {
    var data = {
        value: [
            0,
            1,
            2
        ],
        meta: {},
        key: "^",
        child: undefined
    };
    var action = new Action({
        type: "swap",
        keyPath: [0]
    });

    expect(() => Reducer(data, action)).toThrowError(`Swap actions must have a swapKey in their payload`);
});


test('Reducer should swap by array indexes', () => {
    var data = {
        value: [
            0,
            1,
            2
        ],
        meta: {},
        key: "^",
        child: undefined
    };
    var action = new Action({
        type: "swap",
        keyPath: [0],
        payload: {
            swapKey: 2
        }
    });
    var expectedValue = [
        2,
        1,
        0
    ];
    expect(expectedValue).toEqual(Reducer(data, action).value);
});

test('Reducer should swap by array keys', () => {
    var data = {
        value: [
            0,
            1,
            2
        ],
        meta: {},
        key: "^",
        child: undefined
    };
    var action = new Action({
        type: "swap",
        keyPath: ["#a"],
        payload: {
            swapKey: "#b"
        }
    });
    var expectedValue = [
        1,
        0,
        2
    ];
    expect(expectedValue).toEqual(Reducer(data, action).value);
});

//
// swapNext
//

test('Reducer swapNext action should throw error if keyPath is empty', () => {
    var data = {
        value: [
            0,
            1,
            2
        ],
        meta: {},
        key: "^",
        child: undefined
    };
    var action = new Action({
        type: "swapNext"
    });

    expect(() => Reducer(data, action)).toThrowError(`SwapNext actions must have a keyPath with at least one key`);
});

//
// swapPrev
//

test('Reducer swapPrev action should throw error if keyPath is empty', () => {
    var data = {
        value: [
            0,
            1,
            2
        ],
        meta: {},
        key: "^",
        child: undefined
    };
    var action = new Action({
        type: "swapPrev"
    });

    expect(() => Reducer(data, action)).toThrowError(`SwapPrev actions must have a keyPath with at least one key`);
});

//
// unshift
//

test('Reducer should unshift', () => {
    var data = {
        value: [
            0,
            1,
            2
        ],
        meta: {},
        key: "^",
        child: undefined
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
    expect(expectedValue).toEqual(Reducer(data, action).value);
});

test('Reducer should unshift deeply', () => {
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
        ],
        meta: {},
        key: "^",
        child: undefined
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
    expect(expectedValue).toEqual(Reducer(data, action).value);
});

test('Reducer should swap deeply', () => {
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
        ],
        meta: {},
        key: "^",
        child: undefined
    };


    var action = new Action({
        type: "swap",
        keyPath: [0, "pets", 0],
        payload: {
            swapKey: 1
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

    expect(expectedValue).toEqual(Reducer(data, action).value);
});

//
// action array test with push
//

test('Reducer should push multiple', () => {
    var data = {
        value: [
            0,
            1,
            2
        ],
        meta: {},
        key: "^",
        child: undefined
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
    expect(expectedValue).toEqual(Reducer(data, action).value);
});

//
// incorrect action
//

test('Reducer should throw error if action is not valid', () => {
    var data = {
        value: [
            0,
            1,
            2
        ],
        meta: {},
        key: "^",
        child: undefined
    };
    var action = new Action({
        type: "fake"
    });

    expect(() => Reducer(data, action)).toThrowError(`"fake" is not a valid action`);
});

//
// meta
//

test('Reducer should set meta if not provided', () => {
    var data = {
        value: {
            a: 1,
            b: 2
        },
        meta: {},
        key: "^",
        child: undefined
    };
    var action = new Action({
        type: "set",
        keyPath: ["b"],
        payload: {
            value: 3
        }
    });

    expect({}).toEqual(Reducer(data, action).meta);
});

test('Reducer should pass through meta if provided', () => {
    var meta = {
        abc: 123
    };

    var data = {
        value: {
            a: 1,
            b: 2
        },
        meta,
        key: "^",
        child: undefined
    };
    var action = new Action({
        type: "set",
        keyPath: ["b"],
        payload: {
            value: 3
        }
    });

    expect(meta).toEqual(Reducer(data, action).meta);
});
