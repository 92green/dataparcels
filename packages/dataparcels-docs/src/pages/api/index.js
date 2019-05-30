// @flow
import React from 'react';
import Layout from 'layout/Layout';
import ContentNav from 'shape/ContentNav';
import API from 'content/API';
import {Text} from 'dcme-style';

export default () => <Layout>
    <ContentNav
        typography={false}
        content={() => <>
            <Text id="API" element="h1" modifier="sizeGiga">API</Text>
            <API />
        </>}
        pageNav={[
            '# API'
        ]}
    />
</Layout>;
