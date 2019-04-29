// @flow

import type ChangeRequest from 'dataparcels/ChangeRequest';

// $FlowFixMe - useState is a named export of react
import {useRef} from 'react';
// $FlowFixMe - useState is a named export of react
import {useState} from 'react';

type OnRelease = (changeRequest: ChangeRequest) => void;

type Return = {
    bufferState: ?ChangeRequest,
    push: Function,
    clear: Function,
    release: Function
};

export default (onRelease: OnRelease): Return => {

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

    const clear = () => {
        bufferRef.current = null;
        updateBufferState();
    };

    const release = () => {
        if(bufferRef.current) {
            let changeRequest = bufferRef.current;
            onRelease(changeRequest);
            clear();
        }
    };

    return {
        bufferState,
        push,
        clear,
        release
    };
};
