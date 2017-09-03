// @flow
import {Wrap} from 'unmutable'; // TODO swap this out with unmutable-lite

function recursiveFilter(item, filterer, filteredValue) {
    var wrap = Wrap(item);
    if(wrap.isIndexed() || wrap.isKeyed()) {
        const clean: * = wrap
            .map(ii => recursiveFilter(ii, filterer))
            .filter(ii => ii !== filteredValue && filterer(ii));

        return clean.isEmpty() ? filteredValue : clean;
    }
    return item;
}

export default recursiveFilter;
