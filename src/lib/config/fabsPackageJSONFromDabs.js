// @flow

import findUp from 'find-up';

export default (cwd: AbsolutePath): ?AbsolutePath => findUp.sync('package.json', { cwd });

