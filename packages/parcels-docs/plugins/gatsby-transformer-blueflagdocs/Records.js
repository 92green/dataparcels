const {Record} = require(`immutable`);

const update = require(`unmutable/lib/update`).default;
const map = require(`unmutable/lib/map`).default;
const pipeWith = require(`unmutable/lib/util/pipeWith`).default;

const Tag = Record({
    description: null, // ?string;
    kind: null, // ?string;
    lineNumber: null, // ?number;
    name: null, // ?string;
    title: null // ?string;
});

const Err = Record({
    commentLineNumber: null, // ?number;
    message: null // ?string;
});

const Example = Record({
    highlighted: null, // ?string;
    raw: null // ?string;
});

const Members = Record({
    global: [], // ??????[],
    inner: [], // ??????[],
    instance: [], // ??????[],
    events: [], // ??????[],
    static: [] // ??????[],
});

class Param extends Record({
    default: null, // ?string;
    name: null, // ?string;
    title: null, // ?string;
    type: null // ?Type;
}) {
    constructor(props) {
        super(props);
        pipeWith(
            this,
            update('type', _ => new Type(_))
        );
    }
}

class Returns extends Record({
    name: null, // ?string;
    type: null // ?Type;
}) {
    constructor(props) {
        super(props);
        pipeWith(
            this,
            update('type', _ => new Type(_))
        );
    }
}

class Property extends Record({
    name: null, // ?string;
    type: null // ?Type;
}) {
    constructor(props) {
        super(props);
        pipeWith(
            this,
            update('type', _ => new Type(_))
        );
    }
}

const Path = Record({
    kind: null, // ?string;
    name: null, // ?string;
    scope: null // ?string;
});

const Internal = Record({
    contentDigest: null, // ?*;
    owner: null, // ?*;
    type: null // ?*;
});

const Type = Record({
    name: null, // ?string;
    type: null // ?string;
});

class DocletNode extends Record({
    augments: null, // ?string;
    children: null, // ?*;
    commentNumber: null, // ?number;
    context: null, // ?*;
    description: null, // ?*;
    description___NODE: null, // ?*;
    errors: [], // ?Err[] = [];
    examples: [], // ?Example[] = [];
    id: null, // ?string;
    internal: null, // ?Internal;
    kind: null, // ?string;
    loc: null, // ?*;
    memberof: null, // ?string;
    members: null, // ?Members;
    name: null, // ?string;
    namespace: null, // ?string;
    params: [], // ?Param[] = [];
    parent: null, // ?*;
    path: null, // ?Path;
    properties: [], // ?Property[] = [];
    returns: [], // ?Returns[] = [];
    scope: null, // ?string;
    sees: [], // ?????[];
    tags: [], // ?Tag[];
    throws: [], // ?????[];
    todos: [], // ?????[];
    type: null // ?Type;
}) {
    constructor(props) {
        super(props);
        pipeWith(
            this,
            update('errors', map(_ => new Err(_))),
            update('examples', map(_ => new Example(_))),
            update('internal', _ => new Internal(_)),
            update('params', map(_ => new Param(_))),
            update('path', _ => new Path(_)),
            update('properties', map(_ => new Property(_))),
            update('returns', map(_ => new Returns(_))),
            update('tags', map(_ => new Tag(_)))
        );
    }

    static createEmpty() {
        return new DocletNode({});
    }
};

module.exports = {
    Tag,
    Err,
    Example,
    Param,
    Returns,
    Property,
    Path,
    Internal,
    Type,
    Members,
    DocletNode
};
