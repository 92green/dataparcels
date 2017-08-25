import React from 'react';
import {Box, Paragraph, Text} from 'obtuse';

import ExampleSimplestParcel from '../example/ExampleSimplestParcel';
import ExampleSimplestParcelSource from '!raw!../example/ExampleSimplestParcel';

import ExampleSimpleObject from '../example/ExampleSimpleObject';
import ExampleSimpleObjectSource from '!raw!../example/ExampleSimpleObject';
import ExampleDeepObject from '../example/ExampleDeepObject';
import ExampleImmutableMap from '../example/ExampleImmutableMap';
import ExampleCustomInputs from '../example/ExampleCustomInputs';
import ExampleObjectWithMeta from '../example/ExampleObjectWithMeta';
import ExampleSimpleArray from '../example/ExampleSimpleArray';
import ExampleEditableArray from '../example/ExampleEditableArray';

export default () => {
    return <Box modifier="padding">
        <Text element="h1" modifier="sizeGiga marginGiga">Parcels</Text>
        <Paragraph>Parcels wrap up values and the functions that change them, and provides a set of chainable methods for splitting and iterating over your data.</Paragraph>
        <Paragraph>This becomes extremely powerful for handling user input in forms, especially if you have nested data structures.</Paragraph>
        <ExampleSimplestParcel source={ExampleSimplestParcelSource} />
        <ExampleSimpleObject source={ExampleSimpleObjectSource} />
        <ExampleDeepObject />
        <ExampleImmutableMap />
        <ExampleCustomInputs />
        <ExampleObjectWithMeta />
        <ExampleSimpleArray />
        <ExampleEditableArray />
    </Box>
}
