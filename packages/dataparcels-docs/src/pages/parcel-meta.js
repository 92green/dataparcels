// @flow
import React from 'react';
import Layout from 'layout/Layout';
import ContentNav from 'shape/ContentNav';
import ParcelMetaMarkdown from 'pages/parcel-meta.mdx';

export default () => <Layout>
    <ContentNav
        content={() => <ParcelMetaMarkdown />}
        pageNav={[
            '# Parcel Meta',
            'Examples'
        ]}
    />
</Layout>;
