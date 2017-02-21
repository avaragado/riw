// @flow

import path from 'path';

import mock from 'mock-fs';
import outdent from 'outdent';

import extractRIMDs from '../extractRIMDs';
import cfgBase from './helpers/dummyConfig';

type Fixture = {
    name: string,
    dir: { [key: string]: string },
    out: RIWCLIProjectExtractResult,
};

const absify = (name, frel) => path.resolve('fixtures', name, frel);

const fixtures: Fixture[] = [
    {
        name: '01',
        dir: {}, // empty
        out: {
            armd: [],
            dups: [],
        },
    },

    {
        name: '02',
        dir: {
            'a.js': 'export default a => a;',
            'b.js': 'export default b => b + 1;',
        },
        out: {
            armd: [],
            dups: [],
        },
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
        out: {
            armd: [
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
            dups: [],
        },
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
        out: {
            armd: [
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
            dups: [
                {
                    id: 'a.1',
                    arfabs: ['a.js', 'aa.js'].map(frel => absify('04', frel)),
                },
                {
                    id: 'b.2',
                    arfabs: ['b.js', 'bb.js'].map(frel => absify('04', frel)),
                },
            ],
        },
    },
];

describe('lib/riw/extractRIMDs', () => {
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
                ...cfgBase,
                rootDir: '.',
                sourceDirs: [`fixtures/${fixture.name}/**/*.js`],
            };

            const received = extractRIMDs(cfg)({});

            expect(received).toEqual(fixture.out);
        });
    });
});
