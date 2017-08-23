import React from 'react';
import {Box, Column, Grid, Terminal, Text} from 'obtuse';

export default ({children, state, title}) => {
    return <Box className="marginBottom3">
        <Text element="h2" modifier="gamma">{title}</Text>
        <Grid>
            <Column modifier="6">
                {state &&
                    <Box>
                        <Text element="h3" modifier="strong" className="marginBottom05">State</Text>
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
