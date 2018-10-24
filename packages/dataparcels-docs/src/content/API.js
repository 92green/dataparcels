// @flow
import React from 'react';
import Link from 'gatsby-link';
import {Box, Grid, GridItem, Image, NavigationList, NavigationListItem, Text} from 'dcme-style';
import SpruceClassName from 'stampy/lib/util/SpruceClassName';

import IconParcel from 'content/parcel.gif';
import IconParcelHoc from 'content/parcelhoc.gif';
import IconParcelBoundary from 'content/parcelboundary.gif';

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
            description={<Box>
                <Text element="p" modifier="marginMilli">Parcel is a data container.</Text>
                <Text element="p">It's job is to hold your data, split it into smaller parts, and merge changes back together.</Text>
            </Box>}
            image={IconParcel}
        />
        <Item
            name="ParcelHoc"
            description={<Box>
                <Text element="p" modifier="marginMilli">ParcelHoc is a React higher order component.</Text>
                <Text element="p">It's job is to provide a parcel as a prop, and to handle how the parcel binds to React props and lifecycle events.</Text>
            </Box>}
            image={IconParcelHoc}
        />
        <Item
            name="ParcelBoundary"
            description={<Box>
                <Text element="p" modifier="marginMilli">ParcelBoundary is a React component.</Text>
                <Text element="p">It's job is to optimise rendering performance, and to optionally control the flow of parcel changes.</Text>
            </Box>}
            image={IconParcelBoundary}
        />
    </Grid>
    <Text element="p" modifier="margin">See also: <Link className="Link" to="/api/ChangeRequest">ChangeRequest</Link>, <Link className="Link" to="/api/Action">Action</Link>.</Text>
</Box>;
