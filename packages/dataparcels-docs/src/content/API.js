// @flow
import React from 'react';
import Link from 'gatsby-link';
import {Box, BulletList, BulletListItem, Grid, GridItem, Image, Text} from 'dcme-style';

import IconParcel from 'assets/parcel.gif';
import IconParcelHoc from 'assets/parcelhoc.gif';
import IconParcelBoundary from 'assets/parcelboundary.gif';
import IconParcelBoundaryHoc from 'assets/parcelboundaryhoc.gif';

const Item = ({name, description, image}: any) => <Box modifier="paddingBottom">
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
        name="ParcelBoundary"
        description={<Box>
            <Text element="p" modifier="marginMilli">ParcelBoundary is a React component.</Text>
            <Text element="p">Its job is to optimise rendering performance, and to optionally configure the behaviour of individual inputs.</Text>
        </Box>}
        image={IconParcelBoundary}
    />
    <Item
        name="useParcelForm"
        description={<Box>
            <Text element="p" modifier="marginMilli">useParcelForm is a React hook.</Text>
            <Text element="p">Its job is to make submittable forms easy to build. It provides a parcel stored in state and a buffer to store unsaved changes, and also handles how the parcel responds to changes in React props.</Text>
        </Box>}
        image={IconParcelHoc}
    />
    <Item
        name="useParcelState"
        description={<Box>
            <Text element="p" modifier="marginMilli">useParcelState is a React hook.</Text>
            <Text element="p">Its job is to provide a parcel stored in state, and to handle how the parcel responds to changes in React props.</Text>
        </Box>}
        image={IconParcelHoc}
    />
    <Text element="h3" modifier="marginKilo sizeKilo">See also</Text>
    <BulletList>
        <BulletListItem><Link className="Link" to="/api/ParcelDrag">ParcelDrag</Link></BulletListItem>
        <BulletListItem><Link className="Link" to="/api/validation">validation</Link></BulletListItem>
        <BulletListItem><Link className="Link" to="/api/useParcelBuffer">useParcelBuffer</Link></BulletListItem>
        <BulletListItem><Link className="Link" to="/api/ChangeRequest">ChangeRequest</Link></BulletListItem>
        <BulletListItem><Link className="Link" to="/api/CancelActionMarker">CancelActionMarker</Link></BulletListItem>
        <BulletListItem><Link className="Link" to="/api/ParcelShape">ParcelShape</Link></BulletListItem>
        <BulletListItem><Link className="Link" to="/api/updateShape">updateShape</Link></BulletListItem>
    </BulletList>
    <Text element="h3" modifier="marginKilo sizeKilo">Deprecated</Text>
    <BulletList>
        <BulletListItem><Link className="Link" to="/api/ParcelHoc">ParcelHoc</Link></BulletListItem>
        <BulletListItem><Link className="Link" to="/api/ParcelBoundaryHoc">ParcelBoundaryHoc</Link></BulletListItem>
    </BulletList>
</Box>;
