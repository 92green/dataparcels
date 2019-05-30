// @flow
import React from 'react';
import Layout from 'layout/Layout';
import ContentNav from 'shape/ContentNav';
import CancelActionMarkerMarkdown from 'pages/api/CancelActionMarker.mdx';

export default () => <Layout>
    <ContentNav
        content={() => <CancelActionMarkerMarkdown />}
        pageNav={[
            '# CancelActionMarker'
        ]}
    />
</Layout>;
