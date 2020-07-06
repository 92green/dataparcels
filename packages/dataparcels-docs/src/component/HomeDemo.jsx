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
import {Button} from 'dcme-style/affordance';
import {Icon} from 'dcme-style/affordance';
import {styled} from 'dcme-style/core';
import {Paper} from 'dcme-style';

import useParcel from 'react-dataparcels/useParcel';
import Boundary from 'react-dataparcels/Boundary';
import Drag from 'react-dataparcels/Drag';

import DemoPane from 'component/DemoPane';

const Choice = styled(({children, onClick, className}) => {
    return <Flex className={className}>
        <Box mx={2}>{children}</Box>
        <Box>
            <Touch invert style={{height: '100%', width: '1.5rem'}} onClick={onClick}><Icon style={{fontSize: '8px'}} icon="cross" /></Touch>
        </Box>
    </Flex>;
})`
    font-size: .8rem;
    float: left;
    background-color: #1d3c58;
    margin-right: .3rem;
    margin-bottom: .3rem;
`;

const Draggy = styled.div`
    background:url(
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAGCAYAAADgzO9IAAAAMUlEQVQYV2P8////fwYoYGRkZISzYRLIgiAxRjCBpBKuEKYVRKMYC5NAtwtsGTYHAAB2px/7D6GXXQAAAABJRU5ErkJggg==
   ) repeat;
   width: 1rem;
   opacity: 0.2;
   margin-right: 1rem;
   cursor: move;
`;

const source = `import useParcel from 'react-dataparcels/useParcel';
import Boundary from 'react-dataparcels/Boundary';
import Drag from 'react-dataparcels/Drag';

// if you'd prefer to start with a simpler example
// head over to the demo page





const initialValue = {
    name: 'Damien',
    address: {
        street: '123 Fake St'
    },
    pets: [
        {
            name: 'Rover',
            noises: ['woof', 'bark']
        },
        {
            name: 'Lido',
            noises: ['screech', 'yummy']
        }
    ]
};

export function PersonEditor() {
    let personParcel = useParcel({
        source: () => ({
            value: initialValue
        })
    });
    return <PersonInput personParcel={personParcel} />;
}

function PersonInput(props) {
    let {personParcel} = props;

    let addNewPet = () => {
        personParcel.get('pets').push({name: '', noises: []});
    };

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

        pets:
        <Drag source={personParcel.get('pets')} distance={5}>
            {petParcel => <Boundary source={petParcel}>
                {petParcel => <PetInput petParcel={petParcel} />}
            </Boundary>}
        </Drag>

        <button onClick={addNewPet}>New pet</button>
    </div>;
}

function PetInput(props) {
    let {petParcel} = props;
    return <div>
        name:
        <Boundary source={petParcel.get('name')} buffer={200}>
            {nameParcel => <input {...nameParcel.spreadInput()} />}
        </Boundary>

        noises:
        <Boundary source={petParcel.get('noises')}>
            {noisesParcel => <NoisesInput noisesParcel={noisesParcel} />}
        </Boundary>

        <button onClick={() => petParcel.delete()}>x</button>
    </div>;
}

function NoisesInput(props) {
    let {noisesParcel} = props;

    let newNoiseParcel = useParcel({
        source: () => ({
            value: ''
        })
    });

    let add = () => {
        if(newNoiseParcel.value !== '') {
            noisesParcel.push(newNoiseParcel.value);
            newNoiseParcel.set('');
        }
    };

    return <div>
        {noisesParcel.children(callParcel => {
            return <div key={callParcel.key}>
                {callParcel.value}
                <button onClick={() => callParcel.delete()}>x</button>
            </div>;
        })}

        <Boundary source={newNoiseParcel} buffer={200}>
            {newNoiseParcel => <div>
                <input {...newNoiseParcel.spreadInput()} />
                <button onClick={add}>add</button>
            </div>}
        </Boundary>
    </div>;
}`;

const initialValue = {
    name: 'Damien',
    address: {
        street: '123 Fake St'
    },
    pets: [
        {
            name: 'Rover',
            noises: ['woof', 'bark']
        },
        {
            name: 'Lido',
            noises: ['screech', 'yummy']
        }
    ]
};

function PersonInput(props) {
    let {personParcel} = props;

    let addNewPet = () => {
        personParcel.get('pets').push({name: '', noises: []});
    };

    return <Box p={3}>
        <Flex>
            <Box ml="auto">
                <Touch disabled={!personParcel.meta.canUndo} onClick={personParcel.meta.undo}><Icon icon="undo2" /></Touch>
            </Box>
            <Box ml={2}>
                <Touch disabled={!personParcel.meta.canRedo} onClick={personParcel.meta.redo}><Icon icon="redo2" /></Touch>
            </Box>
        </Flex>
        <Flex mb={2} as="label">
            <Box mr={3} width="10rem">name:</Box>
            <Box>
                <Boundary source={personParcel.get('name')} buffer={200}>
                    {nameParcel => <Input invert width="100%" {...nameParcel.spreadInput()} />}
                </Boundary>
            </Box>
        </Flex>

        <Flex mb={2} as="label">
            <Box mr={3} width="10rem">street address:</Box>
            <Box>
                <Boundary source={personParcel.getIn(['address', 'street'])} buffer={200}>
                    {streetParcel => <Input invert width="100%" {...streetParcel.spreadInput()} />}
                </Boundary>
            </Box>
        </Flex>

        <Box mb={2}>
            pets:
        </Box>
        <Drag source={personParcel.get('pets')} distance={5}>
            {petParcel => <Boundary source={petParcel}>
                {petParcel => <PetInput petParcel={petParcel} />}
            </Boundary>}
        </Drag>

        <Touch onClick={addNewPet}>New pet</Touch>
    </Box>;
}

function PetInput(props) {
    let {petParcel} = props;
    return <Paper display="flex" invert textStyle="monospace" mb={2}>
        <Draggy />
        <Box py={2} flexGrow="1">
            <Flex mb={2} as="label">
                <Box mr={3} width="8rem">name:</Box>
                <Box width="14rem">
                    <Boundary source={petParcel.get('name')} buffer={200}>
                        {nameParcel => <Input invert width="100%" {...nameParcel.spreadInput()} />}
                    </Boundary>
                </Box>
            </Flex>

            <Flex mb={2}>
                <Box mr={3} width="8rem">noises:</Box>
                <Box width="14rem">
                    <Boundary source={petParcel.get('noises')}>
                        {noisesParcel => <NoisesInput noisesParcel={noisesParcel} />}
                    </Boundary>
                </Box>
            </Flex>
        </Box>
        <Box py={2} width="2rem">
            <Text as="div" fontSize="xs" textAlign="center">
                <Touch invert onClick={() => petParcel.delete()}><Icon icon="cross" /></Touch>
            </Text>
        </Box>
    </Paper>;
}

function NoisesInput(props) {
    let {noisesParcel} = props;

    let newNoiseParcel = useParcel({
        source: () => ({
            value: ''
        })
    });

    let add = () => {
        if(newNoiseParcel.value !== '') {
            noisesParcel.push(newNoiseParcel.value);
            newNoiseParcel.set('');
        }
    };

    return <Paper invert input py={2}>
        <Box px=".9rem" pb={noisesParcel.size > 0 ? 2 : 0}>
            {noisesParcel.children(callParcel => {
                return <Choice key={callParcel.key} onClick={() => callParcel.delete()}>
                    {callParcel.value}
                </Choice>;
            })}
        </Box>

        <Flex style={{clear: 'both'}}>
            <Box>
                <Boundary source={newNoiseParcel} buffer={200}>
                    {newNoiseParcel => <Input clear invert width="100%" {...newNoiseParcel.spreadInput()} />}
                </Boundary>
            </Box>
            <Box pr=".9rem">
                <Touch onClick={add}>add</Touch>
            </Box>
        </Flex>
    </Paper>;
}

export default (): Node => {
    let personParcel = useParcel({
        source: () => ({
            value: initialValue
        }),
        buffer: true,
        history: 50
    });

    let [slide, setSlide] = useState('demo');

    return <Box position="relative">
        <DemoPane
            data={personParcel.value}
            demo={<PersonInput personParcel={personParcel} />}
            code={source}
            slide={slide}
            setSlide={setSlide}
        />
        {slide === 'code' &&
            <Box position="absolute" top="11.6rem" left={[null,null,null,'15rem']} pl={3}>
                <Button outline invert to="/demo">Go to demo page</Button>
            </Box>}
    </Box>;
};
