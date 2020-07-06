// @flow
import React from 'react';
import Page from 'component/Page';
import {ContentNav} from 'dcme-style';
import UseBufferMarkdown from 'mdx/api/useBuffer.mdx';
import {apiNav} from 'nav/apiNav';

export default () => <Page>
    <ContentNav
        pageTop
        pageBottom
        mdxHeading
        nav={apiNav}
        pageNav={[
            '# useBuffer',
            '# Params',
            'source',
            'buffer',
            'history',
            'derive',
            'revertKey',
            '# Returns',
            'innerParcel'
        ]}
    >
        <UseBufferMarkdown />
    </ContentNav>
</Page>;
