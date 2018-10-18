// @flow
import type {Node} from 'react';

import React from 'react';
import {Box, Text, Wrapper} from 'dcme-style';
import PageLayout from 'component/PageLayout';
import API from 'content/API';
import IconParcel from 'content/parcelinverted.gif';

export default () => <Box>
    <PageLayout
        modifier="marginBottom"
        content={() => <Box modifier="paddingTopKilo">
            <Text id="API" element="h1" modifier="sizeGiga">API</Text>
        </Box>}
    />
    <Wrapper>
        <API />
    </Wrapper>
</Box>
