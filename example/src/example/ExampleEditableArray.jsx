import React from 'react';
import Parcel from 'parcels';
import Example from '../component/Example';
import {Box, Code, List, ListItem, Paragraph, Text} from 'obtuse';

export default class ExampleEditableArray extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            value: ["A", "BB", "CCC"]
        };
    }

    handleChange(payload) {
        this.setState(payload);
    }

    render() {
        var parcel = Parcel(
            this.state,
            this.handleChange
        );

        const description = <Box>
            <Paragraph>When a parcel contains an array or an Immutable.js List, your parcel is created as a <Code>ListParcel</Code>. These have a few extra methods for dealing with arrays / lists.</Paragraph>
            <Box modifier="padding">
                <List element="ol" modifier="ordered">
                    <ListItem className="marginBottom">
                        <Text element="p">
                            <Text modifier="strong">delete( </Text>index<Text modifier="primary">: number</Text><Text modifier="strong"> )</Text>
                        </Text>
                        <Text element="p">Deletes the item at the given index.</Text>
                    </ListItem>
                    <ListItem className="marginBottom">
                        <Text element="p">
                            <Text modifier="strong">insert( </Text>index<Text modifier="primary">: number</Text>, parcelData<Text modifier="primary">: Object {"{"}value: *, ?meta: Object{"}"}</Text><Text modifier="strong"> )</Text>
                        </Text>
                        <Text element="p">Inserts a new item at the position specified in <Code>index</Code>.</Text>
                    </ListItem>
                    <ListItem className="marginBottom">
                        <Text element="p">
                            <Text modifier="strong">push( </Text>parcelData<Text modifier="primary">: Object {"{"}value: *, ?meta: Object{"}"}</Text><Text modifier="strong"> )</Text>
                        </Text>
                        <Text element="p">Pushes a new item to the end of the array / list.</Text>
                    </ListItem>
                    <ListItem className="marginBottom">
                        <Text element="p">
                            <Text modifier="strong">pop()</Text>
                        </Text>
                        <Text element="p">Deletes the item at the end of the array / list.</Text>
                    </ListItem>
                    <ListItem className="marginBottom">
                        <Text element="p">
                            <Text modifier="strong">shift()</Text>
                        </Text>
                        <Text element="p">Deletes the item at the start of the array / list.</Text>
                    </ListItem>
                    <ListItem className="marginBottom">
                        <Text element="p">
                            <Text modifier="strong">size()</Text>
                        </Text>
                        <Text element="p">Returns the length of the array / list.</Text>
                    </ListItem>
                    <ListItem className="marginBottom">
                        <Text element="p">
                            <Text modifier="strong">swap( </Text>indexA<Text modifier="primary">: number</Text>, indexB<Text modifier="primary">: number</Text><Text modifier="strong"> )</Text>
                        </Text>
                        <Text element="p">Swaps the items at <Code>indexA</Code> and <Code>indexB</Code>.</Text>
                    </ListItem>
                    <ListItem className="marginBottom">
                        <Text element="p">
                            <Text modifier="strong">swapNext( </Text>index<Text modifier="primary">: number</Text><Text modifier="strong"> )</Text>
                        </Text>
                        <Text element="p">Swaps the item at the <Code>index</Code> with the next item.</Text>
                    </ListItem>
                    <ListItem className="marginBottom">
                        <Text element="p">
                            <Text modifier="strong">swapPrev( </Text>index<Text modifier="primary">: number</Text><Text modifier="strong"> )</Text>
                        </Text>
                        <Text element="p">Swaps the item at the <Code>index</Code> with the previous item.</Text>
                    </ListItem>
                    <ListItem className="marginBottom">
                        <Text element="p">
                            <Text modifier="strong">unshift( </Text>parcelData<Text modifier="primary">: Object {"{"}value: *, ?meta: Object{"}"}</Text><Text modifier="strong"> )</Text>
                        </Text>
                        <Text element="p">Pushes a new item to the start of the array / list.</Text>
                    </ListItem>
                </List>
            </Box>
        </Box>;

        const makeRandomLetters = () => {
            var amount = Math.random() * 4;
            var letter = String.fromCharCode(Math.floor(Math.random() * 25) + 65);
            var result = "";
            for(let i = 0; i < amount; i++) {
                result += letter;
            }
            return result;
        };

        return <Example
            title="Editable Array"
            state={this.state}
            description={description}
            source={this.props.source}
        >
            <button className="Button Button-inline" onClick={() => parcel.push({value: makeRandomLetters()})}>Push</button>
            <button className="Button Button-inline" onClick={() => parcel.pop()}>Pop</button>
            <button className="Button Button-inline" onClick={() => parcel.shift()}>Shift</button>
            <button className="Button Button-inline" onClick={() => parcel.unshift({value: makeRandomLetters()})}>Unshift</button>
            <button className="Button Button-inline" onClick={() => parcel.swap(0, 1)}>Swap 0 and 1</button>

            {parcel.map((itemParcel, index) => {
                return <div key={itemParcel.key()}>
                    <label className="Label">item {itemParcel.key()}</label>
                    <div className="Grid Grid-auto">
                        <div className="Grid_column Grid_column-always">
                            <input className="Input" type="text" {...itemParcel.spreadDOM()} />
                        </div>
                        <div className="Grid_column Grid_column-always Grid_column-shrink">
                            <button className="Button Button-inline" onClick={() => parcel.swapPrev(index)}>Prev</button>
                            <button className="Button Button-inline" onClick={() => parcel.swapNext(index)}>Next</button>
                            <button className="Button Button-inline" onClick={() => parcel.insert(index, {value: makeRandomLetters()})}>Insert</button>
                            <button className="Button Button-inline" onClick={() => parcel.delete(index)}>Delete</button>
                        </div>
                    </div>
                </div>;
            }).value()}

        </Example>;
    }
}
