// @flow
import React from 'react';
import Layout from 'layout/Layout';
import ContentNav from 'shape/ContentNav';
import ParcelNodeMarkdown from 'pages/api/ParcelNode.mdx';

export default () => <Layout>
    <ContentNav
        content={() => <ParcelNodeMarkdown />}
        pageNav={[
            '# ParcelNode',
            'asNode',
            'asChildNodes',
            'ParcelNode',
            '# Properties',
            'value',
            'meta',
            'data',
            'key',
            '# Methods',
            'get()',
            'update()',
            'setMeta()'
        ]}
    />
</Layout>;
