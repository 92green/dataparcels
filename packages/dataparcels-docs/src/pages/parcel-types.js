// @flow
import type {Node} from 'react';
import React from 'react';
import {Wrapper, Text, Typography} from 'dcme-style';
import ParcelTypesMarkdown from 'pages/parcel-types.md';
import PageLayout from 'component/PageLayout';
import Layout from 'layouts/Layout';

export default () => <Layout>
    <PageLayout
        modifier="marginBottom"
        content={() => <Typography><ParcelTypesMarkdown /></Typography>}
    />
</Layout>
