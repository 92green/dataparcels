// @flow
import React from 'react';
import Link from 'gatsby-link';
import {Box, Grid, GridItem, Image, NavigationList, NavigationListItem, Text} from 'dcme-style';
import SpruceClassName from 'stampy/lib/util/SpruceClassName';

import IconParcel from 'content/parcel.gif';
import IconParcelHoc from 'content/parcelhoc.gif';
import IconParcelBoundary from 'content/parcelboundary.gif';
import IconParcelBoundaryHoc from 'content/parcelboundaryhoc.gif';

const Item = ({name, description, image}) => <Box modifier="paddingBottom">
    <Grid>
        <GridItem modifier="3 padding">
            <Link to={`/api/${name}`}>
                <Image src={image} />
            </Link>
        </GridItem>
         <GridItem modifier="8 padding">
            <Box modifier="paddingTop">
                <Text element="div" modifier="sizeKilo link margin"><Link to={`/api/${name}`}>{name}</Link></Text>
                <Text element="div">{description}</Text>
            </Box>
        </GridItem>
        <GridItem modifier="1" />
    </Grid>
</Box>;

export default () => <Box>
    <Item
        name="Parcel"
        description={<Box>
            <Text element="p" modifier="marginMilli">Parcel is a data container.</Text>
            <Text element="p">Its job is to hold your data, split it into smaller parts, and merge changes back together.</Text>
        </Box>}
        image={IconParcel}
    />
    <Item
        name="ParcelHoc"
        description={<Box>
            <Text element="p" modifier="marginMilli">ParcelHoc is a React higher order component.</Text>
            <Text element="p">Its job is to provide a parcel as a prop, and to handle how the parcel binds to React props and lifecycle events.</Text>
        </Box>}
        image={IconParcelHoc}
    />
    <Item
        name="ParcelBoundary"
        description={<Box>
            <Text element="p" modifier="marginMilli">ParcelBoundary is a React component.</Text>
            <Text element="p">Its job is to optimise rendering performance, and to optionally control the flow of parcel changes.</Text>
        </Box>}
        image={IconParcelBoundary}
    />
    <Item
        name="ParcelBoundaryHoc"
        description={<Box>
            <Text element="p" modifier="marginMilli">ParcelBoundaryHoc is a React higher order component.</Text>
            <Text element="p">Its job is to control the flow of parcel changes. It is the higher order component version of a ParcelBoundary.</Text>
        </Box>}
        image={IconParcelBoundaryHoc}
    />
    <Text element="p" modifier="margin">See also: <Link className="Link" to="/api/ParcelShape">ParcelShape</Link>, <Link className="Link" to="/api/ChangeRequest">ChangeRequest</Link>, <Link className="Link" to="/api/Action">Action</Link>.</Text>
</Box>;
