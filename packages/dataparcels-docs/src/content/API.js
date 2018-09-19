// @flow
import React from 'react';
import Link from 'gatsby-link';
import {Box, Grid, GridItem, Image, NavigationList, NavigationListItem, Text} from 'dcme-style';
import SpruceClassName from 'stampy/lib/util/SpruceClassName';

import IconParcel from 'content/icon-parcel0001.png';
import IconParcelHoc from 'content/icon-parcelhoc0001.png';
import IconParcelBoundary from 'content/icon-parcelboundary0001.png';

const Item = ({name, description, image}) => <GridItem modifier="4">
    <Link to={`/api/${name}`}>
        <Box modifier="padding">
            <Image src={image} modifier="center" />
            <Text element="div" modifier="center sizeHecto link">{name}</Text>
        </Box>
    </Link>
    <Box modifier="padding">
        <Text element="div" modifier="center">{description}</Text>
    </Box>
</GridItem>;

export default () => <Box>
    <Grid>
        <Item
            name="Parcel"
            description="Parcel is a data container. It's job is to hold your data, split it into smaller parts, and merge changes back together."
            image={IconParcel}
        />
        <Item
            name="ParcelHoc"
            description="ParcelHoc is a React higher order component. It's job is to provide a parcel as props, and to handle how the parcel responds to the React lifecycle."
            image={IconParcelHoc}
        />
        <Item
            name="ParcelBoundary"
            description="ParcelBoundary is a React component. It's job is to optimise rendering performance, and to optionally control the flow of parcel changes."
            image={IconParcelBoundary}
        />
    </Grid>
    <Text element="p" modifier="margin">See also: <Link className="Link" to="/api/ChangeRequest">ChangeRequest</Link>, <Link className="Link" to="/api/Action">Action</Link>.</Text>
</Box>;
