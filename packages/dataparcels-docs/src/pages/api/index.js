// @flow
import type {Node} from 'react';

import React from 'react';
import {Box, Text} from 'dcme-style';
import PageLayout from 'component/PageLayout';
import API from 'content/API';
import IconParcel from 'content/icon-parcelinverted0001.png';

export default () => <PageLayout
    content={() => <Box modifier="paddingTopKilo">
        <Text id="API" element="h1" modifier="sizeGiga">API</Text>
        <API />
    </Box>}
/>;
