// @flow
import React from 'react';
import Page from 'component/Page';
import {ContentNav} from 'dcme-style';
import ParcelUpdatersMarkdown from 'mdx/concepts/parcel-updaters.mdx';
import {conceptsNav} from 'nav/apiNav';

export default () => <Page>
    <ContentNav
        pageTop
        pageBottom
        mdxHeading
        nav={conceptsNav}
        pageNav={[
            '# Value Updaters',
            'Simple updaters',
            'asNode',
            'asChildNodes'
        ]}
    >
        <ParcelUpdatersMarkdown />
    </ContentNav>
</Page>;
