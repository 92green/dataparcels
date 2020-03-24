// @flow
import React from 'react';
import Page from 'component/Page';
import {ContentNav} from 'dcme-style';
import UseParcelBufferMarkdown from 'mdx/api/useParcelBuffer.mdx';
import {apiNav} from 'nav/apiNav';

export default () => <Page>
    <ContentNav
        pageTop
        pageBottom
        mdxHeading
        nav={apiNav}
        pageNav={[
            '# useParcelBuffer',
            '# Params',
            'parcel',
            'buffer',
            'debounce',
            'beforeChange',
            '# Returns',
            'innerParcel',
            'control',
            '# ParcelHookControl'
        ]}
    >
        <UseParcelBufferMarkdown />
    </ContentNav>
</Page>;
