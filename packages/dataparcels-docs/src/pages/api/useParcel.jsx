// @flow
import React from 'react';
import Page from 'component/Page';
import {ContentNav} from 'dcme-style';
import UseParcelMarkdown from 'mdx/api/useParcel.mdx';
import {apiNav} from 'nav/apiNav';

export default () => <Page>
    <ContentNav
        pageTop
        pageBottom
        mdxHeading
        nav={apiNav}
        pageNav={[
            '# useParcel',
            '# Params',
            'source',
            'dependencies',
            'onChange',
            'derive',
            'buffer',
            'history',
            'deriveSource',
            'types',
            '# Returns',
            'parcel'
        ]}
    >
        <UseParcelMarkdown />
    </ContentNav>
</Page>;
