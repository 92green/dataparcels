// @flow
import type {Node} from 'react';

import React from 'react';
import {Text,  Wrapper} from 'dcme-style';
import PageLayout from 'component/PageLayout';
import API from 'content/API';
import IconParcel from 'content/icon-parcelinverted0001.png';

export default () => <Wrapper modifier="marginBottom">
    <Text id="API" element="h1" modifier="sizeGiga">API</Text>
    <API />
</Wrapper>;
