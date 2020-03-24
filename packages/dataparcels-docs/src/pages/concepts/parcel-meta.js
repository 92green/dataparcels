// @flow
import React from 'react';
import Page from 'component/Page';
import {ContentNav} from 'dcme-style';
import ParcelMetaMarkdown from 'mdx/concepts/parcel-meta.mdx';
import {conceptsNav} from 'nav/apiNav';

export default () => <Page>
    <ContentNav
        pageTop
        pageBottom
        mdxHeading
        nav={conceptsNav}
        pageNav={[
            '# Parcel Meta',
            'Examples'
        ]}
    >
        <ParcelMetaMarkdown />
    </ContentNav>
</Page>;
