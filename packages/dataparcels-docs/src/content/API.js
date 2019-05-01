// @flow
import React from 'react';
import Link from 'gatsby-link';
import {Box, BulletList, BulletListItem, Grid, GridItem, Image, NavigationList, NavigationListItem, Text} from 'dcme-style';
import SpruceClassName from 'react-spruce/lib/SpruceClassName';

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
        name="useParcelState"
        description={<Box>
            <Text element="p" modifier="marginMilli">useParcelState is a React hook.</Text>
            <Text element="p">Its job is to provide a parcel stored in state, and to handle how the parcel binds to React props.</Text>
        </Box>}
        image={IconParcelHoc}
    />
    <Item
        name="useParcelBuffer"
        description={<Box>
            <Text element="p" modifier="marginMilli">useParcelBuffer is a React hook.</Text>
            <Text element="p">Its job is to control the flow of parcel changes.</Text>
        </Box>}
        image={IconParcelBoundaryHoc}
    />
    <Item
        name="ParcelBoundary"
        description={<Box>
            <Text element="p" modifier="marginMilli">ParcelBoundary is a React component.</Text>
            <Text element="p">Its job is to optimise rendering performance, and to optionally control the flow of parcel changes using useParcelBuffer.</Text>
        </Box>}
        image={IconParcelBoundary}
    />
    <Text element="p" modifier="margin">See also:</Text>
    <BulletList>
        <BulletListItem><Link className="Link" to="/api/ChangeRequest">ChangeRequest</Link></BulletListItem>
        <BulletListItem><Link className="Link" to="/api/CancelActionMarker">CancelActionMarker</Link></BulletListItem>
        <BulletListItem><Link className="Link" to="/api/ParcelShape">ParcelShape</Link></BulletListItem>
        <BulletListItem><Link className="Link" to="/api/shape">shape</Link></BulletListItem>
        <BulletListItem><Link className="Link" to="/api/ParcelHoc">ParcelHoc</Link></BulletListItem>
        <BulletListItem><Link className="Link" to="/api/ParcelBoundaryHoc">ParcelBoundaryHoc</Link></BulletListItem>
    </BulletList>
</Box>;
