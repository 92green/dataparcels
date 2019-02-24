// @flow

import type {ComponentType} from 'react';
import type {LayoutElement} from 'dcme-style';
import type {Node} from 'react';

import React from 'react';
import composeWith from 'unmutable/lib/util/composeWith';
import {Box, Button, Grid, GridItem, Layout, Terminal, Text} from 'dcme-style';
import ParcelHoc from 'react-dataparcels/ParcelHoc';
import ParcelBoundaryHoc from 'react-dataparcels/ParcelBoundaryHoc';
import DataInspector from './DataInspector';

type Config = {
    initialValue: any,
    editor: ComponentType<any>
};

type Props = {};

type State = {
    data: any,
    proposedDataToSave: any,
    modifyData: any,
    saving: boolean,
    modifying: boolean
};

type ChildProps = {
    dataFromServer: any,
    saveToServer: (value: any) => void
};

type LayoutProps = {
    title: LayoutElement,
    dataInspector: LayoutElement,
    content: LayoutElement,
};

export default ({initialValue, editor}: Config) => {

    const FakeServerModify = composeWith(
        ParcelHoc({
            name: "serverParcel",
            valueFromProps: (props) => props.data,
            onChange: (props) => (value) => props.save(value)
        }),
        ParcelBoundaryHoc({
            name: "serverParcel",
            hold: true
        }),
        editor
    );

    return (Component: ComponentType<*>) => {
        return class FakeServerInspector extends Layout<Props> {
            constructor(props: Props) {
                super(props);
                this.state = {
                    data: initialValue,
                    proposedDataToSave: undefined,
                    saving: false,
                    modifying: false,
                    modifyData: undefined
                };
            }

            allow = () => {
                this.setState({
                    data: this.state.proposedDataToSave,
                    saving: false
                });
            };

            modify = (data: any) => {
                this.setState({
                    modifyData: data,
                    modifying: true
                });
            };

            reject = () => {
                this.setState({
                    saving: false
                });
            };

            static elements = ['title', 'content', 'dataInspector', 'control'];

            static layout = ({title, dataInspector, content, control}) => <Box>
                <Box modifier="paddingBottom">
                    <Box modifier="exampleInner">
                        <Grid>
                            <GridItem modifier="6 padding">
                                {title()}
                                {dataInspector()}
                            </GridItem>
                            <GridItem modifier="6 padding">
                                {control()}
                            </GridItem>
                        </Grid>
                    </Box>
                </Box>
                {content()}
            </Box>;

            title = (): Node => {
                return <Text element="div" modifier="monospace"><Text modifier="weightKilo">Server</Text> - data</Text>;
            };

            dataInspector = (): Node => {
                return <DataInspector data={this.state.data} />;
            };

            content = (): Node => {
                let {data} = this.state;
                return <Component
                    {...this.props}
                    dataFromServer={data}
                    saveToServer={(proposedDataToSave: any) => {
                        this.setState({
                            proposedDataToSave,
                            saving: true,
                            modifying: false
                        });
                    }}
                />;
            };

            control = (): Node => {
                let {
                    modifyData,
                    saving,
                    modifying,
                    proposedDataToSave
                } = this.state;

                if(modifying) {
                    return <FakeServerModify
                        data={modifyData}
                        save={(data) => {
                            this.setState({
                                data,
                                modifying: false,
                                saving: false
                            })
                        }}
                    />;
                }

                if(!saving) {
                    return <Button modifier="inline" onClick={() => this.modify(this.state.data)}>Modify</Button>;
                }
                return <Box>
                    <Text element="div" modifier="monospace">A client wants to save this data:</Text>
                    <DataInspector data={proposedDataToSave} />
                    <Text element="div">
                        <Button modifier="inline" onClick={() => this.allow()}>Allow</Button>
                        <Button modifier="inline" onClick={() => this.modify(proposedDataToSave)}>Modify</Button>
                        <Button modifier="inline" onClick={() => this.reject()}>Reject</Button>
                    </Text>
                </Box>
            };
        };
    };
};
