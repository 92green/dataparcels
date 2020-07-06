/* eslint-disable flowtype/require-valid-file-annotation */
/* eslint-disable react/prop-types */
import type {Node} from 'react';
import React from 'react';
import {useState} from 'react';

import {Box} from 'dcme-style/layout';
import {Flex} from 'dcme-style/layout';
import {Input} from 'dcme-style/affordance';
import {Touch} from 'dcme-style/affordance';
import {Text} from 'dcme-style/affordance';
import {Icon} from 'dcme-style/affordance';
import {Paper} from 'dcme-style';
import {styled} from 'dcme-style/core';

import useParcel from 'react-dataparcels/useParcel';
import Boundary from 'react-dataparcels/Boundary';
import Drag from 'react-dataparcels/Drag';

import DemoSlider from 'component/DemoSlider';
import DemoPane from 'component/DemoPane';

const Draggy = styled.div`
    background:url(
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAGCAYAAADgzO9IAAAAMUlEQVQYV2P8////fwYoYGRkZISzYRLIgiAxRjCBpBKuEKYVRKMYC5NAtwtsGTYHAAB2px/7D6GXXQAAAABJRU5ErkJggg==
   ) repeat;
   width: 1rem;
   opacity: 0.2;
   margin-right: 1rem;
   cursor: move;
`;

const RerenderCircle = styled.div`
    background-color: #FFF;
    width: 1rem;
    height: 1rem;
    border-radius: 1rem;
    margin-top: .4rem;

    animation: .4s linear onShow;
    opacity: 0;

    @keyframes onShow {
        0% {
            opacity: 1;
        }
        50% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }
`;

const DEMO_A_1 = {
    title: `An easy example`,
    desc: `Type in the text inputs and watch the state update. Click the CODE tab to see how it's done.`,
    code: `import useParcel from 'react-dataparcels/useParcel';

const initalValue = {
    name: 'Damien',
    address: {
        street: '123 Fake St'
    }
};

export function PersonEditor() {

    // put the initialValue into a parcel
    let personParcel = useParcel({
        source: () => ({
            value: initialValue
        })
    });

    // take it out using .value
    console.log('person', personParcel.value);

    // branch off a piece of the data using .get()
    console.log('name', personParcel.get('name').value);

    // bind parcels to inputs using .spreadInput()
    return <div>
        <label>
            name:
            <input {...personParcel.get('name').spreadInput()} />
        </label>

        <label>
            street address:
            <input {...personParcel.getIn(['address', 'street']).spreadInput()} />
        </label>
    </div>;
}`,
    hook: () => {
        return useParcel({
            source: () => ({
                value: {
                    name: 'Damien',
                    address: {
                        street: '123 Fake St'
                    }
                }
            })
        });
    },
    Component: (props) => {
        let {parcel} = props;

        // take it out using .value
        console.log('person', parcel.value);

        // branch off a piece of the data using .get()
        console.log('name', parcel.get('name').value);

        return <Box p={3}>
            <Flex mb={2} as="label">
                <Box mr={3} width="10rem">name:</Box>
                <Box>
                    <Input invert width="100%" {...parcel.get('name').spreadInput()} />
                </Box>
            </Flex>

            <Flex mb={2} as="label">
                <Box mr={3} width="10rem">street address:</Box>
                <Box>
                    <Input invert width="100%" {...parcel.getIn(['address', 'street']).spreadInput()} />
                </Box>
            </Flex>
        </Box>;
    }
};

const DEMO_A_2 = {
    title: `Improving performance`,
    desc: `The flashing dots indicate when a re-render occurs. Watch how only the changed field will re-render, and how changes are debounced so the state in the top parcel changes less frequently.`,
    code: `import useParcel from 'react-dataparcels/useParcel';
import Boundary from 'react-dataparcels/Boundary';

const initalValue = {
    name: 'Damien',
    address: {
        street: '123 Fake St'
    }
};

export function PersonEditor() {

    let personParcel = useParcel({
        source: () => ({
            value: initialValue
        })
    });

    // use Boundary to only re-render when values change, and to debounce changes (200ms)
    return <div>
        <label>
            name:
            <Boundary source={personParcel.get('name')} buffer={200}>
                {nameParcel => <input {...nameParcel.spreadInput()} />}
            </Boundary>
        </label>

        <label>
            street address:
            <Boundary source={personParcel.getIn(['address', 'street'])} buffer={200}>
                {streetParcel => <input {...streetParcel.spreadInput()} />}
            </Boundary>
        </label>
    </div>;
}`,
    lines: '23-25,30-32',
    hook: () => {
        return useParcel({
            source: () => ({
                value: {
                    name: 'Damien',
                    address: {
                        street: '123 Fake St'
                    }
                }
            })
        });
    },
    Component: (props) => {
        let {parcel} = props;

        console.log('value: ', parcel.value); // eslint-disable-line

        return <Box p={3}>
            <Flex mb={2} as="label">
                <Box mr={3} width="10rem">name:</Box>
                <Box>
                    <Boundary source={parcel.get('name')} buffer={200}>
                        {nameParcel => <Flex>
                            <Input invert width="100%" {...nameParcel.spreadInput()} />
                            <Box ml={3}>
                                <RerenderCircle key={Math.random()} />
                            </Box>
                        </Flex>}
                    </Boundary>
                </Box>
            </Flex>

            <Flex mb={2} as="label">
                <Box mr={3} width="10rem">street address:</Box>
                <Box>
                    <Boundary source={parcel.getIn(['address', 'street'])} buffer={200}>
                        {streetParcel => <Flex>
                            <Input invert width="100%" {...streetParcel.spreadInput()} />
                            <Box ml={3}>
                                <RerenderCircle key={Math.random()} />
                            </Box>
                        </Flex>}
                    </Boundary>
                </Box>
            </Flex>
        </Box>;
    }
};

const DEMO_B_1 = {
    title: `Basic array editing`,
    desc: `Array elements can be iterated over to create an input for each.`,
    code: `import useParcel from 'react-dataparcels/useParcel';
import Boundary from 'react-dataparcels/Boundary';

const initalValue = [
    'cool',
    'wow'
];

export function TagsEditor() {

    let tagsParcel = useParcel({
        source: () => ({
            value: initialValue
        })
    });

    // .children() will iterate over the parcel's children and return the result of each
    return <div>
        tags:
        {tagsParcel.children(tagParcel => {
            // tagParcel.key provides a unique key for React
            return <Boundary source={tagParcel} key={tagParcel.key}>
                {tagParcel => <TagInput tagParcel={tagParcel} />}
            <Boundary>;
        })}
        <button onClick={() => tagsParcel.push('')}>New tag</button>
    </div>;
}

function TagInput(props) {
    let {tagParcel} = props;

    // you don't have to create a component for each child input
    // but it helps avoid too much nested code

    return <div>
        <input {...tagParcel.spreadInput()} />
        <button onClick={() => tagParcel.delete()}>x</button>
    </div>;
}
`,
    hook: () => {
        return useParcel({
            source: () => ({
                value: ['cool','wow']
            })
        });
    },
    Component: (props) => {
        let {parcel} = props;

        return <Box p={3}>
            <Box mr={3} width="10rem">tags:</Box>
            {parcel.children(tagParcel => {
                return <Boundary key={tagParcel.key} source={tagParcel}>
                    {tagParcel => <Flex alignItems="center">
                        <Box>
                            <Input invert width="100%" {...tagParcel.spreadInput()} />
                        </Box>
                        <Box py={2} width="2rem">
                            <Text as="div" fontSize="xs" textAlign="center">
                                <Touch invert onClick={() => tagParcel.delete()}><Icon icon="cross" /></Touch>
                            </Text>
                        </Box>
                    </Flex>}
                </Boundary>;
            })}
            <Box mt={3}>
                <Touch onClick={() => parcel.push('')}>New tag</Touch>
            </Box>
        </Box>;
    }
};

const DEMO_B_2 = {
    title: `Moving array elements`,
    desc: `Array elements can be moved using methods on each parcel.`,
    code: `import useParcel from 'react-dataparcels/useParcel';
import Boundary from 'react-dataparcels/Boundary';

const initalValue = [
    'cool',
    'wow'
];

export function TagsEditor() {

    let tagsParcel = useParcel({
        source: () => ({
            value: initialValue
        })
    });


    return <div>
        tags:
        {tagsParcel.children(tagParcel => {

            return <Boundary source={tagParcel} key={tagParcel.key}>
                {tagParcel => <TagInput tagParcel={tagParcel} />}
            <Boundary>;
        })}
        <button onClick={() => tagsParcel.push('')}>New tag</button>
    </div>;
}

function TagInput(props) {
    let {tagParcel} = props;

    // if a parcel's parent data type is an array
    // extra methods become available to alter elements in the array

    return <div>
        <input {...tagParcel.spreadInput()} />
        <button onClick={() => tagParcel.swapPrev()}>^</Touch>
        <button onClick={() => tagParcel.swapNext()}>v</Touch>
        <button onClick={() => tagParcel.insertAfter(\`\${tagParcel.value} copy\`)}>+</Touch>
        <button onClick={() => tagParcel.delete()}>x</button>
    </div>;
}
`,
    hook: () => {
        return useParcel({
            source: () => ({
                value: ['cool','wow']
            })
        });
    },
    lines: '38-40',
    Component: (props) => {
        let {parcel} = props;

        return <Box p={3}>
            <Box mr={3} width="10rem">tags:</Box>
            {parcel.children(tagParcel => {
                return <Boundary key={tagParcel.key} source={tagParcel}>
                    {tagParcel => <Flex alignItems="center">
                        <Box>
                            <Input invert width="100%" {...tagParcel.spreadInput()} />
                        </Box>
                        <Box py={2} width="2rem">
                            <Text as="div" fontSize="xs" textAlign="center">
                                <Touch invert onClick={() => tagParcel.swapPrev()}><Icon icon="chevron-up" /></Touch>
                            </Text>
                        </Box>
                        <Box py={2} width="2rem">
                            <Text as="div" fontSize="xs" textAlign="center">
                                <Touch invert onClick={() => tagParcel.swapNext()}><Icon icon="chevron-down" /></Touch>
                            </Text>
                        </Box>
                        <Box py={2} width="2rem">
                            <Text as="div" fontSize="xs" textAlign="center">
                                <Touch invert onClick={() => tagParcel.insertAfter(`${tagParcel.value} copy`)}><Icon icon="plus" /></Touch>
                            </Text>
                        </Box>
                        <Box py={2} width="2rem">
                            <Text as="div" fontSize="xs" textAlign="center">
                                <Touch invert onClick={() => tagParcel.delete()}><Icon icon="cross" /></Touch>
                            </Text>
                        </Box>
                    </Flex>}
                </Boundary>;
            })}
            <Box mt={3}>
                <Touch onClick={() => parcel.push('')}>New tag</Touch>
            </Box>
        </Box>;
    }
};

const DEMO_B_3 = {
    title: `Dragging array elements`,
    desc: `Array elements can be dragged using the Drag component.`,
    code: `import useParcel from 'react-dataparcels/useParcel';
import Boundary from 'react-dataparcels/Boundary';
import Drag from 'react-dataparcels/Drag';

const initalValue = [
    'cool',
    'wow'
];

export function TagsEditor() {

    let tagsParcel = useParcel({
        source: () => ({
            value: initialValue
        })
    });


    return <div>
        tags:
        <Drag source={tagsParcel} distance={5}>
            {tagParcel => <Boundary source={tagParcel}>
                {tagParcel => <PetInput tagParcel={tagParcel} />}
            </Boundary>}
        </Drag>

        <button onClick={() => tagsParcel.push('')}>New tag</button>
    </div>;
}

function TagInput(props) {
    let {tagParcel} = props;

    return <div>
        <input {...tagParcel.spreadInput()} />
        <button onClick={() => tagParcel.delete()}>x</button>
    </div>;
}
`,
    hook: () => {
        return useParcel({
            source: () => ({
                value: ['cool','wow']
            })
        });
    },
    lines: '21,22,24,25',
    Component: (props) => {
        let {parcel} = props;

        return <Box p={3}>
            <Box mr={3} width="10rem">tags:</Box>
            <Drag source={parcel} distance={5}>
                {tagParcel => <Boundary source={tagParcel}>
                    {tagParcel => <Paper invert display="flex" key={tagParcel.key} mb={2}>
                        <Draggy />
                        <Flex alignItems="center">
                            <Box>
                                <Input invert width="100%" {...tagParcel.spreadInput()} />
                            </Box>
                            <Box py={2} width="2rem">
                                <Text as="div" fontSize="xs" textAlign="center">
                                    <Touch invert onClick={() => tagParcel.delete()}><Icon icon="cross" /></Touch>
                                </Text>
                            </Box>
                        </Flex>
                    </Paper>}
                </Boundary>}
            </Drag>
            <Box mt={3}>
                <Touch onClick={() => parcel.push('')}>New tag</Touch>
            </Box>
        </Box>;
    }
};

const DEMOS = [
    'Getting Started',
    DEMO_A_1,
    DEMO_A_2,
    // select
    // checkbox
    // radio
    'Working with arrays',
    DEMO_B_1,
    DEMO_B_2,
    DEMO_B_3
];

const Demo = (props) => {
    let {code, desc, hook, Component, slide, setSlide, lines} = props;
    let parcel = hook();

    return <DemoPane
        data={parcel.value}
        demo={<Component parcel={parcel} />}
        code={code}
        pl={0}
        slide={slide}
        setSlide={setSlide}
        lines={lines}
        desc={desc}
    />;
};

export default (): Node => {
    let [demoIndex, setDemoIndex] = useState(1);
    let [slide, setSlide] = useState('demo');

    return <DemoSlider demoIndex={demoIndex} setDemoIndex={setDemoIndex} demos={DEMOS}>
        <Demo key={demoIndex} {...DEMOS[demoIndex]} slide={slide} setSlide={setSlide} />
    </DemoSlider>;
};
