// @flow
import React from 'react';
import Page from 'component/Page';
import {ContentNav} from 'dcme-style';
import ParcelBoundaryMarkdown from 'mdx/api/Boundary.mdx';
import {apiNav} from 'nav/apiNav';

export default () => <Page>
    <ContentNav
        pageTop
        pageBottom
        mdxHeading
        nav={apiNav}
        pageNav={[
            '# Boundary',
            '# Children',
            'childRenderer',
            '# Props',
            'source',
            'dependencies',
            'buffer',
            'derive',
            'memo'
        ]}
    >
        <ParcelBoundaryMarkdown />
    </ContentNav>
</Page>;
