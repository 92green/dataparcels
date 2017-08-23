import React from 'react';
import {Box, Text} from 'obtuse';
import ExampleSimpleObject from '../example/ExampleSimpleObject';
import ExampleDeepObject from '../example/ExampleDeepObject';
import ExampleImmutableMap from '../example/ExampleImmutableMap';
import ExampleObjectWithMeta from '../example/ExampleObjectWithMeta';

export default (props) => {
    return <Box modifier="padded">
        <Text element="h1" modifier="alpha">Parcels</Text>
        <ExampleSimpleObject />
        {/*<ExampleDeepObject />*/}
        {/*<ExampleImmutableMap />*/}
        <ExampleObjectWithMeta />
    </Box>
}
