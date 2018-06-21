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

class Return extends Record({
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

const Fields = Record({
    name: null, // ?string;
    kind: null, // ?string;
    slug: null, // ?string;
    sortBy: null // ?string;
});

const Type = Record({
    name: null, // ?string;
    type: null // ?string;
});

class DocNode extends Record({
    augments: null, // ?string;
    children: null, // ?*;
    context: null, // ?*;
    description: null, // ?*;
    errors: [], // ?Err[] = [];
    examples: [], // ?Example[] = [];
    fields: [], // ?Field[] = [];
    id: null, // ?string;
    internal: null, // ?Internal;
    kind: null, // ?string;
    loc: null, // ?*;
    memberof: null, // ?string;
    name: null, // ?string;
    namespace: null, // ?string;
    namespace: null, // ?string;
    params: [], // ?Param[] = [];
    parent: null, // ?*;
    path: null, // ?Path;
    properties: [], // ?Property[] = [];
    returns: [], // ?Return[] = [];
    scope: null, // ?string;
    tags: null, // ?Tag[];
    type: null // ?Type;
}) {
    constructor(props) {
        super(props);
        pipeWith(
            this,
            update('errors', map(_ => new Err(_))),
            update('examples', map(_ => new Example(_))),
            update('fields', _ => new Fields(_)),
            update('internal', _ => new Internal(_)),
            update('params', map(_ => new Param(_))),
            update('path', _ => new Path(_)),
            update('properties', map(_ => new Property(_))),
            update('returns', map(_ => new Return(_)))
            update('tags', map(_ => new Tag(_)))
        );
    }
};

module.exports = {
    Tag,
    Err,
    Example,
    Param,
    Return,
    Property,
    Path,
    Internal,
    Fields,
    Type,
    DocNode
};
