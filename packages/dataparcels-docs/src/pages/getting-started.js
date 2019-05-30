// @flow
import React from 'react';
import Layout from 'layout/Layout';
import ContentNav from 'shape/ContentNav';
import GettingStartedMarkdown from './getting-started.mdx';

export default () => <Layout>
    <ContentNav
        content={() => <GettingStartedMarkdown />}
        pageNav={[
            '# Getting Started',
            'Installation',
            'Hello World',
            'Hello World 2',
            'More'
        ]}
    />
</Layout>;
