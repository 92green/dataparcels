const documentation = require(`documentation`);
const crypto = require(`crypto`);
const digest = str => crypto.createHash(`md5`).update(str).digest(`hex`);
const remark = require(`remark`);
const Prism = require(`prismjs`);
const {DocletNode} = require(`./Records`);

const stringifyMarkdownAST = (node = ``) => typeof node === 'string'
    ? node
    : remark().stringify(node);

const commentId = (parentId, commentNumber) => `documentationJS ${parentId} comment #${commentNumber}`;
const descriptionId = (parentId, name) => `${parentId}--DocumentationJSComponentDescription--${name}`;

function createDescriptionNode(
    node,
    docletNodeId,
    markdownStr,
    name,
    boundActionCreators
) {
    const {createNode} = boundActionCreators;

    const descriptionNode = {
        id: descriptionId(docletNodeId, name),
        parent: node.id,
        children: [],
        internal: {
            type: `DocumentationJSComponentDescription`,
            mediaType: `text/markdown`,
            content: markdownStr,
            contentDigest: digest(markdownStr),
        },
    };

    node.children = node.children.concat([descriptionNode.id])
    createNode(descriptionNode)
    return descriptionNode.id
}

function createDocletNode(doclet, i, node, boundActionCreators) {

    const {
        createNode,
        createParentChildLink
    } = boundActionCreators;

    if(doclet.description) {
        doclet.description___NODE = createDescriptionNode(
            node,
            commentId(node.id, i),
            stringifyMarkdownAST(doclet.description),
            `comment.description`,
            boundActionCreators
        );
    }

    const transformParam = (param) => {
        if(param.description) {
            param.description___NODE = createDescriptionNode(
                node,
                commentId(node.id, i),
                stringifyMarkdownAST(param.description),
                param.name,
                boundActionCreators
            )
            delete param.description;
        }
        delete param.lineNumber;

        // When documenting destructured parameters, the name
        // is parent.child where we just want the child.
        if(param.name.split(`.`).length > 1) {
            param.name = param.name
                .split(`.`)
                .slice(-1)
                .join(`.`);
        }

        if(param.properties) {
            param.properties = param.properties.map(transformParam);
        }
        return param
    };

    if(doclet.params) {
        doclet.params = doclet.params.map(transformParam);
    }

    if(doclet.returns) {
        doclet.returns = doclet.returns
            .map(ret => {
                if(ret.description) {
                    ret.description___NODE = createDescriptionNode(
                        node,
                        commentId(node.id, i),
                        stringifyMarkdownAST(ret.description),
                        ret.title,
                        boundActionCreators
                    )
                }
                return ret;
            });
    }

    if(doclet.properties) {
        doclet.properties = doclet.properties
            .map(prop => {
                const tag = doclet.tags.find(tag => tag.name === prop.name);
                if(tag && tag.description) {
                    prop.description___NODE = createDescriptionNode(
                        node,
                        commentId(node.id, i),
                        stringifyMarkdownAST(tag.description),
                        tag.name,
                        boundActionCreators
                    )
                }
                return prop;
            });
    }

    if(doclet.examples) {
        doclet.examples = doclet.examples
            .map(example => ({
                raw: example.description,
                highlighted: Prism.highlight(
                    example.description,
                    Prism.languages.javascript
                ),
            }));
    }

    const strContent = JSON.stringify(doclet, null, 4);

    let docletNode = {
        ...doclet,
        commentNumber: i,
        id: commentId(node.id, i),
        parent: node.id,
        children: [],
        internal: {
            contentDigest: digest(strContent),
            type: `DocumentationJs`,
        }
    };

    docletNode = new DocletNode(docletNode).toJS();

    // console.log('====docletNode===:', i);
    // console.log(docletNode);
    // console.log('\n');

    createParentChildLink({
        parent: node,
        child: docletNode
    });

    createNode(docletNode);

    if(doclet.members.instance) {
        doclet.members.instance = doclet.members.instance
            .map((doclet, jj) => createDocletNode(doclet, `${i}.${jj}`, node, boundActionCreators));
    }
}

/**
 * Implement the onCreateNode API to create documentation.js nodes
 * @param {Object} super this is a super param
 */
exports.onCreateNode = async ({
    node,
    loadNodeContent,
    boundActionCreators,
}) => {
    if(node.internal.mediaType !== `application/javascript` || node.internal.type !== `File`) {
        return null;
    }

    let documentationJson;
    try {
        documentationJson = await documentation.build(node.absolutePath, {shallow: true})
    } catch (e) {
        // Ignore as there'll probably be other tooling already checking for errors
        // and an error here kills Gatsby.
    }

    if(documentationJson && documentationJson.length > 0) {
        // get around the problem of gatsby's dynamically generated graphql schemas by making one node
        // that contains the complete possible data shape
        // createDocletNode(DocletNode.createEmpty(), 0, node, boundActionCreators);

        documentationJson.forEach((doclet, ii) => createDocletNode(doclet, ii, node, boundActionCreators));
        return true;
    }
    return null;
}
