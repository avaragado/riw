// @flow

import findUp from 'find-up';

import type { AbsolutePath } from '../../../types';

export default (cwd: AbsolutePath): ?AbsolutePath => findUp.sync('package.json', { cwd });

