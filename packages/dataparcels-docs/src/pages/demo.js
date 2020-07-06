// @flow
import React from 'react';
import Page from 'component/Page';
import {H2} from 'dcme-style';

import {Box} from 'dcme-style/layout';

import MainDemo from 'component/MainDemo.jsx';
import {Link} from 'dcme-style/affordance';
import {Text} from 'dcme-style/affordance';

export default () => <Page>
    <Box mt={4} mx={3} mb={3}>
        <H2>Dataparcels demo</H2>
        <Box mt={2}>
            <Text textStyle="monospace">
                <Link to="/">Home</Link>
            </Text>
        </Box>
    </Box>
    <MainDemo />
</Page>;
