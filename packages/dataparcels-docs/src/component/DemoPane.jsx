/* eslint-disable flowtype/require-valid-file-annotation */
/* eslint-disable react/prop-types */
import type {Node} from 'react';
import React from 'react';

import {Pre} from 'dcme-style/affordance';
import {CodeHighlight} from 'dcme-style';
import {Paper} from 'dcme-style';
import {Button} from 'dcme-style/affordance';
import {Box} from 'dcme-style/layout';

const Slide = (props) => {
    return <Paper
        bg="bg"
        width={['100%',props.width]}
        minWidth="4px"
        flexGrow={0}
        flexShrink={props.flexShrink === undefined ? '1' : props.flexShrink}
    >
        <Paper
            invert
            overflow="auto"
            position="relative"
            opacity={props.opacity || '1'}
            height="100%"
        >

            {props.children}
        </Paper>

    </Paper>;
};

type Props = {
    data: any,
    desc?: string,
    demo: Node,
    code: string,
    pl: number|string,
    slide: string,
    setSlide: (slide: string) => void,
    lines?: string
};

export default (props: Props): Node => {
    let {data, desc, demo, code, pl = "15rem", slide, setSlide, lines} = props;

    return <>
        <Box pl={[null,null,null,pl]}>
            <Paper
                display="flex"
                textStyle="monospace"
                height="2.2rem"
            >
                <Box ml={1}>
                    <Button width="auto" height="2.3rem" invert={slide === 'demo'} onClick={() => setSlide('demo')}>DEMO</Button>
                </Box>
                <Box ml={1}>
                    <Button width="auto" height="2.3rem" invert={slide === 'code'} onClick={() => setSlide('code')}>CODE</Button>
                </Box>
            </Paper>
        </Box>
        <Paper
            display={["block","flex"]}
            bg="bgInvert"
            flexShrink={1}
            flexGrow={1}
            overflow="hidden"
            pl={[null,null,null,pl]}
            textStyle="monospace"
            minHeight={[null,"60vh"]}
        >
            {slide === 'demo' &&
                <>
                    <Slide width="20rem">
                        <Pre bounded overflow="visible">
                            <CodeHighlight language="jsx">{JSON.stringify(data, null, 4)}</CodeHighlight>
                        </Pre>
                    </Slide>
                    <Slide width="30rem" opacity={0.96} flexShrink={0}>
                        {desc && <Paper p={3} mb={3} fontSize="s" color="copyLight">{desc}</Paper>}
                        {demo}
                    </Slide>
                </>
            }
            {slide === 'code' &&
                <Slide width="50rem">
                    <Pre bounded overflow="visible" lines={lines}>
                        <CodeHighlight language="jsx">{code}</CodeHighlight>
                    </Pre>
                </Slide>
            }
        </Paper>
    </>;
};
