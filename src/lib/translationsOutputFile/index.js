// @flow

import path from 'path';

const sPlaceholder = '[locale]';
const sSingle = 'locales';

export default (config: RIWConfig) => {
    const replace = (str: string) => path.resolve(
        config.rootDir || '.',
        config.translationsOutputFile.replace(sPlaceholder, str),
    );

    return {
        sPlaceholder,
        hasPlaceholder: () => config.translationsOutputFile.includes(sPlaceholder),
        fromLid: replace,
        forSingleFile: () => replace(sSingle),
    };
};
