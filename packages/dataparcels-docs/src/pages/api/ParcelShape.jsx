// @flow
import React from 'react';
import Layout from 'layout/Layout';
import ContentNav from 'shape/ContentNav';
import ParcelShapeMarkdown from 'pages/api/ParcelShape.mdx';

export default () => <Layout>
    <ContentNav
        content={() => <ParcelShapeMarkdown />}
        pageNav={[
            '# ParcelShape, asShape',
            'asShape',
            'ParcelShape',
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
            'delete()',
            'update()',
            'map()',
            'setMeta()',
            '# Indexed and element change methods',
            'insertAfter()',
            'insertBefore()',
            'push()',
            'pop()',
            'shift()',
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
