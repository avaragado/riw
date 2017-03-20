// @flow

import path from 'path';

import type { Config } from '../../config';

const sPlaceholder = '[locale]';
const sSingle = 'locales';

export default (config: Config) => {
    const replace = (str: string) => path.resolve(
        config.rootDir,
        config.translationsOutputFile.replace(sPlaceholder, str),
    );

    return {
        sPlaceholder,
        hasPlaceholder: () => config.translationsOutputFile.includes(sPlaceholder),
        fromLid: replace,
        forSingleFile: () => replace(sSingle),
    };
};
