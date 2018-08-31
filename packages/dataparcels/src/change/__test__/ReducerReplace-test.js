// @flow
import Reducer from '../Reducer';
import Action from '../Action';

test('Reducer should replace with empty keyPath', () => {
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
        type: "replace",
        payload: {
            value: 3
        }
    });

    var expectedData = {
        value: 3,
        key: "^",
        meta: {
            abc: 123
        },
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

test('Reducer should replace with empty keyPath and NOT clear existing child', () => {
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
        type: "replace",
        payload: {
            value: 3
        }
    });

    var expectedData = {
        value: 3,
        key: "^",
        meta: {
            abc: 123
        },
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

    expect(Reducer(data, action)).toEqual(expectedData);
});

test('Reducer should replace with keyPath of 1 element', () => {
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
        type: "replace",
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


test('Reducer should clear child from replace key', () => {
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
        type: "replace",
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

test('Reducer should replace with keyPath of 2 elements', () => {
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
        type: "replace",
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

test('Reducer should replace with keyPath of 2 elements on arrays', () => {
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
        type: "replace",
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
