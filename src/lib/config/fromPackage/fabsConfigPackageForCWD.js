// @flow

import compose from 'ramda/src/compose';

import fabsPackageJSONFromDabs from './fabsPackageJSONFromDabs';
import fabsConfigPackageFromPackageJSONFabs from './fabsConfigPackageFromPackageJSONFabs';

export default compose(
    fabsConfigPackageFromPackageJSONFabs,
    fabsPackageJSONFromDabs,
    () => process.cwd(),
);

