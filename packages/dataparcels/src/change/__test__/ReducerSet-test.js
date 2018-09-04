// @flow
import Reducer from '../Reducer';
import Action from '../Action';

test('Reducer should set with empty keyPath', () => {
    var data = {
        value: {
            a: 1,
            b: 2
        },
        meta: {
            abc: 123
        },
        key: "^",
        child: {
            a: {
                key: "a"
            },
            b: {
                key: "b"
            }
        }
    };
    var action = new Action({
        type: "set",
        payload: {
            value: 3
        }
    });

    var expectedData = {
        value: 3,
        key: "^",
        meta: {
            abc: 123
        }
    };

    expect(Reducer(data, action)).toEqual(expectedData);
});

test('Reducer should set with empty keyPath and clear existing child', () => {
    var data = {
        value: {
            a: {
                c: 123
            },
            b: 2
        },
        meta: {
            abc: 123
        },
        key: "^",
        child: {
            a: {
                key: "a",
                child: {
                    c: {
                        key: "c",
                        meta: {abc: 123}
                    }
                }
            },
            b: {
                key: "b"
            }
        }
    };
    var action = new Action({
        type: "set",
        payload: {
            value: 3
        }
    });

    var expectedData = {
        value: 3,
        key: "^",
        meta: {
            abc: 123
        }
    };

    expect(Reducer(data, action)).toEqual(expectedData);
});

test('Reducer should set with keyPath of 1 element', () => {
    var data = {
        value: {
            a: 1,
            b: 2
        },
        meta: {
            abc: 123
        },
        key: "^",
        child: {
            a: {
                key: "a"
            },
            b: {
                key: "b"
            }
        }
    };
    var action = new Action({
        type: "set",
        keyPath: ["a"],
        payload: {
            value: 3
        }
    });

    var expectedData = {
        value: {
            a: 3,
            b: 2
        },
        meta: {
            abc: 123
        },
        key: "^",
        child: {
            a: {
                key: "a"
            },
            b: {
                key: "b"
            }
        }
    };

    expect(Reducer(data, action)).toEqual(expectedData);
});


test('Reducer should clear child from set key', () => {
    var data = {
        value: {
            a: {
                c: 123
            },
            b: 2
        },
        meta: {
            abc: 123
        },
        key: "^",
        child: {
            a: {
                key: "a",
                child: {
                    c: {
                        key: "c",
                        meta: {
                            def: 456
                        }
                    }
                }
            },
            b: {
                key: "b"
            }
        }
    };
    var action = new Action({
        type: "set",
        keyPath: ["a"],
        payload: {
            value: 3
        }
    });

    var expectedData = {
        value: {
            a: 3,
            b: 2
        },
        meta: {
            abc: 123
        },
        key: "^",
        child: {
            a: {
                key: "a"
            },
            b: {
                key: "b"
            }
        }
    };

    expect(Reducer(data, action)).toEqual(expectedData);
});

test('Reducer should set with keyPath of 2 elements', () => {
    var data = {
        value: {
            a: {},
            b: 2
        },
        meta: {
            abc: 123
        },
        key: "^",
        child: {
            a: {
                key: "a"
            },
            b: {
                key: "b"
            }
        }
    };
    var action = new Action({
        type: "set",
        keyPath: ["a", "b"],
        payload: {
            value: 3
        }
    });

    var expectedData = {
        value: {
            a: {
                b: 3
            },
            b: 2
        },
        meta: {
            abc: 123
        },
        key: "^",
        child: {
            a: {
                key: "a",
                child: {
                    b: {
                        key: "b"
                    }
                }
            },
            b: {
                key: "b"
            }
        }
    };

    expect(Reducer(data, action)).toEqual(expectedData);
});

test('Reducer should set with keyPath of 2 elements on arrays', () => {
    var data = {
        value: [
            [],
            [1,2,3]
        ],
        meta: {
            abc: 123
        },
        key: "^"
    };
    var action = new Action({
        type: "set",
        keyPath: ["#b", "#c"],
        payload: {
            value: [4]
        }
    });

    var expectedData = {
        value: [
            [],
            [1,2,[4]]
        ],
        meta: {
            abc: 123
        },
        key: "^",
        child: [
            {
                key: "#a"
            },
            {
                key: "#b",
                child: [
                    {
                        key: "#a"
                    },
                    {
                        key: "#b"
                    },
                    {
                        key: "#c"
                    },
                ]
            }
        ]
    };

    expect(Reducer(data, action)).toEqual(expectedData);
});
