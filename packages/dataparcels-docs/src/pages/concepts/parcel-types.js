// @flow
import React from 'react';
import Page from 'component/Page';
import {ContentNav} from 'dcme-style';
import ParcelTypesMarkdown from 'mdx/concepts/parcel-types.mdx';
import {conceptsNav} from 'nav/apiNav';

export default () => <Page>
    <ContentNav
        pageTop
        pageBottom
        mdxHeading
        nav={conceptsNav}
        pageNav={[
            '# Parcel Types',
            'ParentParcel',
            'ChildParcel',
            'IndexedParcel',
            'ElementParcel',
            'TopLevelParcel'
        ]}
    >
        <ParcelTypesMarkdown />
    </ContentNav>
</Page>;
