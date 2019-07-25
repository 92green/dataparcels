// @flow
import React from 'react';
import Layout from 'layout/Layout';
import ContentNav from 'shape/ContentNav';
import ShapeMarkdown from 'pages/api/asShape.mdx';

export default () => <Layout>
    <ContentNav
        content={() => <ShapeMarkdown />}
        pageNav={[
            '# asShape'
        ]}
    />
</Layout>;
