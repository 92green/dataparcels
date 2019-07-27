// @flow
import React from 'react';
import Layout from 'layout/Layout';
import ContentNav from 'shape/ContentNav';
import ParcelShapeMarkdown from 'pages/api/ParcelShape.mdx';

export default () => <Layout>
    <ContentNav
        content={() => <ParcelShapeMarkdown />}
        pageNav={[
            '# ParcelShape',
            'Example Usage',
            '# Properties',
            'value',
            'meta',
            'data',
            'key',
            '# Parent methods',
            'get()',
            'getIn()',
            'children()',
            'toArray()',
            'has()',
            'size()',
            '# Set methods',
            'set()',
            'setIn()',
            'delete()',
            'deleteIn()',
            'update()',
            'updateIn()',
            'map()',
            'setMeta()',
            '# Indexed and element change methods',
            'insertAfter()',
            'insertBefore()',
            'move()',
            'push()',
            'pop()',
            'shift()',
            'swap()',
            'swapNext()',
            'swapPrev()',
            'unshift()',
            '# Type methods',
            'isChild()',
            'isElement()',
            'isIndexed()',
            'isParent()',
            'isTopLevel()'
        ]}
    />
</Layout>;
