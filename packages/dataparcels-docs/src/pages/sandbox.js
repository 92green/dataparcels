// @flow
import type {Node} from 'react';
import React from 'react';
import {Box, Wrapper, Text, Typography} from 'dcme-style';
import Markdown from 'pages/sandbox.md';
import PageLayout from 'component/PageLayout';
import Layout from 'layouts/Layout';

// hooks test

import useParcelState from 'react-dataparcels/useParcelState';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import ExampleHoc from 'component/ExampleHoc';

const HooksTest = (props) => {

    let [personParcel] = useParcelState({
        value: {
            firstname: "Robert",
            lastname: "Clamps",
            address: {
                postcode: "1234"
            }
        }
    });

    return <div>
        <label>firstname</label>
        <ParcelBoundary parcel={personParcel.get('firstname')}>
            {(firstname) => <input type="text" {...firstname.spreadDOM()} />}
        </ParcelBoundary>

        <label>lastname</label>
        <ParcelBoundary parcel={personParcel.get('lastname')}>
            {(lastname) => <input type="text" {...lastname.spreadDOM()} />}
        </ParcelBoundary>

        <label>postcode</label>
        <ParcelBoundary parcel={personParcel.getIn(['address', 'postcode'])}>
            {(postcode) => <input type="text" {...postcode.spreadDOM()} />}
        </ParcelBoundary>
    </div>;
};

const Example = ExampleHoc(HooksTest);

export default () => <Layout>
    <PageLayout
        modifier="marginBottom"
        content={() => <Box>
            <Text element="h1" modifier="sizeGiga marginGiga">Sandbox</Text>
            <Typography>
                <Example />
            </Typography>
        </Box>}
    />
</Layout>
