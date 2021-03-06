// @flow
import React from 'react';
import Page from 'component/Page';
import {ContentNav} from 'dcme-style';
import ParcelBoundaryMarkdown from 'mdx/api/ParcelBoundary.mdx';
import {apiNav} from 'nav/apiNav';

export default () => <Page>
    <ContentNav
        pageTop
        pageBottom
        mdxHeading
        nav={apiNav}
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
    >
        <ParcelBoundaryMarkdown />
    </ContentNav>
</Page>;
