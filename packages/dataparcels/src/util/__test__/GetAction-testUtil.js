// @flow
export default (changeRequest: any) => {
    let action = changeRequest.actions[0];
    return {
        type: action.type,
        payload: action.payload,
        keyPath: action.keyPath
    };
};
