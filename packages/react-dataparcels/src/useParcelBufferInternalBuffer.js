// @flow

import ChangeRequest from 'dataparcels/ChangeRequest';

// $FlowFixMe - useState is a named export of react
import {useRef} from 'react';
// $FlowFixMe - useState is a named export of react
import {useState} from 'react';

type Params = {
    onSubmit: (changeRequest: ChangeRequest) => void,
    onReset: () => void
};

type Return = {
    bufferState: ?ChangeRequest,
    push: Function,
    reset: Function,
    submit: Function
};

export default ({onSubmit, onReset}: Params): Return => {

    // buffer ref is used to allow handleChange functions from past renders
    // to always affect the same buffer reference
    const bufferRef = useRef();

    // buffer state is used to update the component
    // whenever the buffer changes so that the buffer
    // can be passed down as props
    const [bufferState, setBufferState] = useState(null);

    const updateBufferState = () => setBufferState(bufferRef.current);

    const push = (changeRequest: ChangeRequest) => {
        bufferRef.current = bufferRef.current
            ? bufferRef.current.merge(changeRequest)
            : changeRequest;

        updateBufferState();
    };

    const reset = () => {
        bufferRef.current = null;
        updateBufferState();
        onReset();
    };

    const submit = () => {
        if(bufferRef.current) {
            let changeRequest = bufferRef.current;
            onSubmit(changeRequest);
            bufferRef.current = null;
            updateBufferState();
        } else {
            onSubmit(new ChangeRequest());
        }
    };

    return {
        bufferState,
        push,
        reset,
        submit
    };
};
