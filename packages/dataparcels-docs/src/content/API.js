// @flow
import React from 'react';
import Link from 'gatsby-link';
import {Box, Grid, GridItem, NavigationList, NavigationListItem, Text} from 'dcme-style';
import SpruceClassName from 'stampy/lib/util/SpruceClassName';

export default () => <Box>
    <Grid>
        <GridItem modifier="4">
            <Link to="/api/Parcel"><Text element="div" modifier="center">Parcel</Text></Link>
        </GridItem>
        <GridItem modifier="4">
            <Link to="/api/ParcelHoc"><Text element="div" modifier="center">ParcelHoc</Text></Link>
        </GridItem>
        <GridItem modifier="4">
            <Link to="/api/ParcelBoundary"><Text element="div" modifier="center">ParcelBoundary</Text></Link>
        </GridItem>
    </Grid>
    <Text element="p" modifier="margin">See also: <Link to="/api/ChangeRequest">ChangeRequest</Link>, <Link to="/api/Action">Action</Link>.</Text>
</Box>;
