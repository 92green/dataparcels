// @flow
import React from 'react';
import Layout from 'layout/Layout';
import ContentNav from 'shape/ContentNav';
import CancelMarkdown from 'pages/api/cancel.mdx';

export default () => <Layout>
    <ContentNav
        content={() => <CancelMarkdown />}
        pageNav={[
            '# cancel'
        ]}
    />
</Layout>;
