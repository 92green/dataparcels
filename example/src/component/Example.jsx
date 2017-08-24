import React from 'react';
import {Box, Column, Grid, Terminal, Text} from 'obtuse';

export default ({children, state, title, description}) => {
    return <Box modifier="marginRowMega">
        <Text element="h2" modifier="sizeMega marginMega">{title}</Text>
        {description && <Box modifier="marginBottomKilo">{description}</Box>}
        <Grid>
            <Column modifier="6">
                {state &&
                    <Box modifier="marginBottom">
                        <Text element="h3" modifier="strong marginMilli">State</Text>
                        <Terminal>
                            <pre>{JSON.stringify(state, null, 4)}</pre>
                        </Terminal>
                    </Box>
                }
            </Column>
            <Column modifier="6">
                {children}
            </Column>
        </Grid>
    </Box>
}
