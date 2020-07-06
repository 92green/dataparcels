// @flow
import React from 'react';
import Page from 'component/Page';
import {ContentNav} from 'dcme-style';
import ParcelNodeMarkdown from 'mdx/api/ParcelNode.mdx';
import {apiNav} from 'nav/apiNav';

export default () => <Page>
    <ContentNav
        pageTop
        pageBottom
        mdxHeading
        nav={apiNav}
        pageNav={[
            '# ParcelNode',
            'asNode',
            'asChildNodes',
            'ParcelNode',
            '# Properties',
            'value',
            'meta',
            'data',
            'key',
            '# Methods',
            'get()',
            'update()'
        ]}
    >
        <ParcelNodeMarkdown />
    </ContentNav>
</Page>;
