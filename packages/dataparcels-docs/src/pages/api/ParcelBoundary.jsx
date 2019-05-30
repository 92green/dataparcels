// @flow
import React from 'react';
import Layout from 'layout/Layout';
import ContentNav from 'shape/ContentNav';
import ParcelBoundaryMarkdown from 'pages/api/ParcelBoundary.mdx';

export default () => <Layout>
    <ContentNav
        content={() => <ParcelBoundaryMarkdown />}
        pageNav={[
            '# ParcelBoundary',
            '# Children',
            'childRenderer',
            '# Props',
            'parcel',
            'pure',
            'forceUpdate',
            'buffer',
            'debounce',
            'keepValue'
        ]}
    />
</Layout>;
