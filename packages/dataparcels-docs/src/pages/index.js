// @flow
import React from 'react';

import {DocsHeader} from 'dcme-style';
import {Link as HtmlLink} from 'dcme-style';
import {Text} from 'dcme-style';

import {Link} from 'dcme-gatsby';
import ContentNav from '../shape/ContentNav';
import Layout from '../layout/Layout';
import IndexMarkdown from './index.mdx';
import Logo from 'assets/parcelinverted.gif';

export default () => <Layout>
    <DocsHeader
        title={() => <Text element="h1" modifier="sizeTera superDuper margin">dataparcels</Text>}
        description={() => "A library for editing data structures that works really well with React."}
        links={() => <Text><HtmlLink href="https://github.com/blueflag/dataparcels">github</HtmlLink> | <HtmlLink href="https://www.npmjs.com/package/react-dataparcels">npm</HtmlLink> | <Link to="/api">api documentation</Link></Text>}
        logo={Logo}
    />
    <ContentNav
        content={() => <IndexMarkdown />}
        pageNav={[
            'What is it?',
            'Getting Started',
            'Features',
            'Development'
        ]}
    />
</Layout>;
