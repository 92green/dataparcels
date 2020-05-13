// @flow

// exports
import Parcel from '../src/index';
import Action from '../Action';
import ChangeRequest from '../ChangeRequest';
import combine from '../combine';
import ParcelNode from '../ParcelNode';
import arrange from '../arrange';
import cancel from '../cancel';
import promisify from '../promisify';
import translate from '../translate';

// internal files
import InternalParcel from '../src/parcel/Parcel';

// internal lib files
import InternalAction from '../lib/change/Action';
import InternalChangeRequest from '../lib/change/ChangeRequest';
import InternalCreateUpdater from '../lib/parcelData/combine';
import InternalParcelNode from '../lib/parcelNode/ParcelNode';
import InternalAsNodes from '../lib/parcelNode/arrange';
import Internalcancel from '../lib/change/cancel';
import InternalPromisify from '../lib/modifiers/promisify';
import InternalTranslate from '../lib/modifiers/translate';

test('index should export Parcel', () => {
    expect(Parcel).toBe(InternalParcel);
});

test('/Action should export Action', () => {
    expect(Action).toBe(InternalAction);
});

test('/ChangeRequest should export ChangeRequest', () => {
    expect(ChangeRequest).toBe(InternalChangeRequest);
});

test('/combine should export combine', () => {
    expect(combine).toBe(InternalCreateUpdater);
});

test('/ParcelNode should export ParcelNode', () => {
    expect(ParcelNode).toBe(InternalParcelNode);
});

test('/arrange should export arrange', () => {
    expect(arrange).toBe(InternalAsNodes);
});

test('/cancel should export cancel', () => {
    expect(cancel).toBe(Internalcancel);
});

test('/promisify should export promisify', () => {
    expect(promisify).toBe(InternalPromisify);
});

test('/translate should export translate', () => {
    expect(translate).toBe(InternalTranslate);
});
