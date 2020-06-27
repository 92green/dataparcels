// @flow
import cancel from './cancel';

export default (...updaters: Function[]) => (parcelData: any): any => {
    return updaters.reduce((parcelData, updater) => {
        return runUpdater(updater, parcelData);
    }, parcelData);
};

const runUpdater = (updater: Function, parcelData: any): any => {
    let nextData = updater({meta: {}, ...parcelData}) || {};
    if(nextData === cancel || nextData.value === cancel) {
        throw new Error('CANCEL');
    }
    delete parcelData.changeRequest;

    return {
        ...parcelData,
        ...nextData,
        meta: {
            ...parcelData.meta,
            ...(nextData.meta || {})
        }
    };
};
