// @flow
import React from 'react';
import Layout from 'layout/Layout';
import ContentNav from 'shape/ContentNav';
import ValueUpdatersMarkdown from 'pages/value-updaters.mdx';

export default () => <Layout>
    <ContentNav
        content={() => <ValueUpdatersMarkdown />}
        pageNav={[
            '# Value Updaters',
            'Simple value updaters',
            'Shape updaters'
        ]}
    />
</Layout>;
