// @flow

import mock from 'mock-fs';

import { configResolve } from '../../../../config';

import todo from '../todo';

const stringify = obj => JSON.stringify(obj, null, 4);

const cfgBase: RIWConfigSparseWithSource = {
    todoFile: 'fixtures/dir/TODO.json',
};

type Fixture = {
    name: string,
    in: ?RIWMessageDescriptorUntranslated[],
};

const fixtures: Fixture[] = [
    {
        name: '01',
        in: null,
    },

    {
        name: '02',
        in: [
            { id: 'md1', defaultMessage: 'aa', description: 'aa desc', locale: 'xx-xx' },
            { id: 'md1', defaultMessage: 'aa', description: 'aa desc', locale: 'yy-yy' },
            { id: 'md1', defaultMessage: 'aa', description: 'aa desc', locale: 'zz-zz' },
            { id: 'md2', defaultMessage: 'bb', description: 'bb desc', locale: 'xx-xx' },
            { id: 'md3', defaultMessage: 'cc', description: 'cc desc', locale: 'zz-zz' },
            { id: 'md4', defaultMessage: 'dd', locale: 'zz-zz' },
        ],
    },
];

describe('lib/riw/app/status/todo', () => {
    it('returns null for missing file', () => {
        mock({
            fixtures: {
                dir: {},
            },
        });

        const received = todo(configResolve(cfgBase));

        mock.restore();

        expect(received).toEqual({ todo: null });
    });

    fixtures.forEach((fixture) => {
        it(fixture.name, () => {
            mock({
                fixtures: {
                    dir: {
                        'TODO.json': stringify(fixture.in),
                    },
                },
            });

            const received = todo(configResolve(cfgBase));

            mock.restore();

            expect(received).toMatchSnapshot();
        });
    });
});
