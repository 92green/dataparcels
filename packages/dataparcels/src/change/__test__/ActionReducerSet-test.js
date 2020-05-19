// @flow
import ActionReducer from '../ActionReducer';
import Action from '../Action';

import TypeSet from '../../typeHandlers/TypeSet';
const typeSet = new TypeSet(TypeSet.defaultTypes);

test('ActionReducer should set with empty keyPath', () => {
    var data = {
        value: 123,
        meta: {
            abc: 123
        },
        key: "^"
    };
    var action = new Action({
        type: "basic.set",
        payload: 3
    });

    var expectedData = {
        value: 3,
        key: "^",
        meta: {
            abc: 123
        }
    };

    // value should be replaced
    // key and meta should be untouched
    expect(ActionReducer(typeSet)(action,data)).toEqual(expectedData);
});

test('ActionReducer should set with empty keyPath and clear existing child', () => {
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
        type: "basic.set",
        payload: 3
    });

    var expectedData = {
        value: 3,
        key: "^",
        meta: {
            abc: 123
        }
    };

    // value should be replaced
    // key and meta should be untouched
    // child should be removed
    expect(ActionReducer(typeSet)(action,data)).toEqual(expectedData);
});

test('ActionReducer should set with keyPath of 1 element', () => {
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
        type: "basic.set",
        keyPath: ["a"],
        payload: 3
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

    // value should be replaced at keypath
    // key and meta should be untouched
    // top level child should be kept
    expect(ActionReducer(typeSet)(action,data)).toEqual(expectedData);
});

test('ActionReducer should noop set with keyPath of 1 element on a non parent value', () => {
    var data = {
        value: 123,
        meta: {
            abc: 123
        },
        key: "^"
    };
    var action = new Action({
        type: "basic.set",
        keyPath: ["a"],
        payload: 3
    });

    expect(ActionReducer(typeSet)(action,data)).toEqual(data);
});

test('ActionReducer should clear child from set key', () => {
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
                key: "b",
                meta: {}
            }
        }
    };
    var action = new Action({
        type: "basic.set",
        keyPath: ["a"],
        payload: 3
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
                key: "b",
                meta: {}
            }
        }
    };

    // value should be replaced at keyPath
    // child should be removed at keyPath
    // top level key and meta should be untouched
    // child.b.meta should be untouched
    expect(ActionReducer(typeSet)(action,data)).toEqual(expectedData);
});

test('ActionReducer should set with keyPath of 2 elements', () => {
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
        type: "basic.set",
        keyPath: ["a", "b"],
        payload: 3
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

    // value should be replaced at keypath
    // key and meta should be untouched
    // top level child should be kept
    expect(ActionReducer(typeSet)(action,data)).toEqual(expectedData);
});

test('ActionReducer should set with keyPath of 2 elements on arrays', () => {
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
        type: "basic.set",
        keyPath: ["#1", "#2"],
        payload: 4
    });

    var expectedData = {
        value: [
            [],
            [1,2,4]
        ],
        meta: {
            abc: 123
        },
        key: "^",
        child: [
            {
                key: "#0"
            },
            {
                key: "#1",
                child: [
                    {
                        key: "#0"
                    },
                    {
                        key: "#1"
                    },
                    {
                        key: "#2"
                    },
                ]
            }
        ]
    };

    // value should be replaced at keypath
    // key and meta should be untouched
    // top level child should be kept
    // keys should be generated for existing value, and for newly set value
    expect(ActionReducer(typeSet)(action,data)).toEqual(expectedData);
});

test('ActionReducer should set with an unkeyed array and give it keys', () => {
    var data = {
        value: 9,
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
        type: "basic.set",
        keyPath: [],
        payload: [1,2,3]
    });

    var expectedData = {
        value: [1,2,3],
        meta: {
            abc: 123
        },
        key: "^",
        child: [
            {key: "#0"},
            {key: "#1"},
            {key: "#2"}
        ]
    };

    // value should be replaced
    // key and meta should be untouched
    // top level child should be kept
    // keys should be generated for newly set value
    expect(ActionReducer(typeSet)(action,data)).toEqual(expectedData);
});

test('ActionReducer should set (with a keyPath) with an unkeyed array and give it keys', () => {
    var data = {
        value: {
            a: [0,0,0]
        },
        meta: {
            abc: 123
        },
        key: "^",
        child: {
            a: {
                key: "a"
            }
        }
    };
    var action = new Action({
        type: "basic.set",
        keyPath: ["a"],
        payload: [1,2,3]
    });

    var expectedData = {
        value: {
            a: [1,2,3]
        },
        meta: {
            abc: 123
        },
        key: "^",
        child: {
            a: {
                key: "a",
                child: [
                    {key: "#0"},
                    {key: "#1"},
                    {key: "#2"}
                ]
            }
        }
    };

    // value should be replaced at keypath
    // key and meta should be untouched
    // top level child should be kept
    // keys should be generated for newly set value
    expect(ActionReducer(typeSet)(action,data)).toEqual(expectedData);
});

test('ActionReducer should not set if keypath doesnt exist', () => {
    var data = {
        value: [],
        meta: {
            abc: 123
        },
        key: "^",
        child: {
            a: {
                key: "a"
            }
        }
    };
    var action = new Action({
        type: "basic.set",
        keyPath: ["#a"],
        payload: 123
    });

    expect(ActionReducer(typeSet)(action,data)).toEqual(data);
});

test('ActionReducer should not insert if keypath doesnt exist', () => {
    var data = {
        value: [],
        meta: {
            abc: 123
        },
        key: "^",
        child: {
            a: {
                key: "a"
            }
        }
    };
    var action = new Action({
        type: "array.child.insert",
        keyPath: ["#a"],
        payload: {value: 123, offset: 0}
    });

    expect(ActionReducer(typeSet)(action,data)).toEqual(data);
});

test('ActionReducer should not insert if homogenous action differs type', () => {
    var data = {
        value: {},
        meta: {
            abc: 123
        },
        key: "^",
        child: {
            a: {
                key: "a"
            }
        }
    };
    var action = new Action({
        type: "array.child.insert",
        keyPath: ["#a"],
        payload: {value: 123, offset: 0}
    });

    expect(ActionReducer(typeSet)(action,data)).toEqual(data);
});
