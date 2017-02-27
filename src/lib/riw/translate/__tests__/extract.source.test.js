// @flow

import path from 'path';

import mock from 'mock-fs';
import outdent from 'outdent';

import { armdExtractSource } from '../extract';
import cfgBase from '../../__tests__/helpers/dummyConfig';

const absify = (name, frel) => path.resolve('fixtures', name, frel);

const cfgOverride = {
    ...cfgBase,
    rootDir: '.',
};

const notify = () => x => x;

type Fixture = {
    name: string,
    dir: { [key: string]: string },
    configOverride?: Object,
    out: RIWMessageDescriptor[],
};

const fixtures: Fixture[] = [
    {
        name: '01',
        dir: {}, // empty
        out: [],
    },

    {
        name: '02',
        dir: {
            'a.js': 'export default a => a;',
            'b.js': 'export default b => b + 1;',
        },
        out: [],
    },

    {
        name: '03',
        dir: {
            'a.js': outdent`
                import { defineMessages } from 'react-intl';

                const msg = defineMessages({
                    a1: {
                        id: 'a.1',
                        defaultMessage: 'a.1!',
                    },
                });
            `,
            'b.js': outdent`
                import { defineMessages } from 'react-intl';

                const msg = defineMessages({
                    b1: {
                        id: 'b.1',
                        defaultMessage: 'b.1!',
                    },
                    b2: {
                        id: 'b.2',
                        description: 'b.2 desc',
                        defaultMessage: 'b.2!',
                    },
                });
            `,
        },
        out: [
            {
                id: 'a.1',
                description: undefined,
                defaultMessage: 'a.1!',
                fabs: absify('03', 'a.js'),
            },
            {
                id: 'b.1',
                description: undefined,
                defaultMessage: 'b.1!',
                fabs: absify('03', 'b.js'),
            },
            {
                id: 'b.2',
                description: 'b.2 desc',
                defaultMessage: 'b.2!',
                fabs: absify('03', 'b.js'),
            },
        ],
    },

    {
        name: '04',
        dir: {
            'a.js': outdent`
                import { defineMessages } from 'react-intl';

                const msg = defineMessages({
                    a1: {
                        id: 'a.1',
                        defaultMessage: 'a.1!',
                    },
                });
            `,
            'aa.js': outdent`
                import { defineMessages } from 'react-intl';

                const msg = defineMessages({
                    a1again: {
                        id: 'a.1',
                        defaultMessage: 'a.1 again!',
                    },
                });
            `,
            'b.js': outdent`
                import { defineMessages } from 'react-intl';

                const msg = defineMessages({
                    b1: {
                        id: 'b.1',
                        defaultMessage: 'b.1!',
                    },
                    b2: {
                        id: 'b.2',
                        description: 'b.2 desc',
                        defaultMessage: 'b.2!',
                    },
                });
            `,
            'bb.js': outdent`
                import { defineMessages } from 'react-intl';

                const msg = defineMessages({
                    b2again: {
                        id: 'b.2',
                        description: 'b.2 again desc',
                        defaultMessage: 'b.2 again!',
                    },
                });
            `,
            'c.js': outdent`
                import { defineMessages } from 'react-intl';

                const msg = defineMessages({
                    c1: {
                        id: 'c.1',
                        defaultMessage: 'c.1!',
                    },
                });
            `,
        },
        out: [
            {
                id: 'a.1',
                description: undefined,
                defaultMessage: 'a.1!',
                fabs: absify('04', 'a.js'),
            },
            {
                id: 'a.1',
                description: undefined,
                defaultMessage: 'a.1 again!',
                fabs: absify('04', 'aa.js'),
            },
            {
                id: 'b.1',
                description: undefined,
                defaultMessage: 'b.1!',
                fabs: absify('04', 'b.js'),
            },
            {
                id: 'b.2',
                description: 'b.2 desc',
                defaultMessage: 'b.2!',
                fabs: absify('04', 'b.js'),
            },
            {
                id: 'b.2',
                description: 'b.2 again desc',
                defaultMessage: 'b.2 again!',
                fabs: absify('04', 'bb.js'),
            },
            {
                id: 'c.1',
                description: undefined,
                defaultMessage: 'c.1!',
                fabs: absify('04', 'c.js'),
            },
        ],
    },
];

describe('lib/riw/translate/extract.source', () => {
    afterEach(() => {
        mock.restore();
    });

    fixtures.forEach((fixture) => {
        it(fixture.name, () => {
            mock({
                fixtures: {
                    [fixture.name]: fixture.dir,
                },
            });

            const cfg = {
                ...cfgOverride,
                sourceDirs: [`fixtures/${fixture.name}/**/*.js`],
                ...fixture.configOverride,
            };

            const received = armdExtractSource(notify)(cfg);

            expect(received).toEqual(fixture.out);
        });
    });
});
