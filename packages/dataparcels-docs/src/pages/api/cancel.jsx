// @flow
import React from 'react';
import Layout from 'layout/Layout';
import ContentNav from 'shape/ContentNav';
import cancelMarkdown from 'pages/api/cancel.mdx';

export default () => <Layout>
    <ContentNav
        content={() => <cancelMarkdown />}
        pageNav={[
            '# cancel'
        ]}
    />
</Layout>;
