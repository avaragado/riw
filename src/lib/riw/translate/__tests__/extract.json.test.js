// @flow

import path from 'path';

import mock from 'mock-fs';
import outdent from 'outdent';

import { armdExtractJSON } from '../extract';
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
            'a.json': '[]',
            'b.json': '[]',
        },
        out: [],
    },

    {
        name: '03',
        dir: {
            'a.json': outdent`
                [
                    {
                        "id": "a.1",
                        "defaultMessage": "a.1!"
                    }
                ]
            `,
            'aa.json': outdent`
                [
                    {
                        "id": "a.1",
                        "defaultMessage": "a.1 again!"
                    }
                ]
            `,
            'b.json': outdent`
                [
                    {
                        "id": "b.1",
                        "defaultMessage": "b.1!"
                    },
                    {
                        "id": "b.2",
                        "description": "b.2 desc",
                        "defaultMessage": "b.2!"
                    }
                ]
            `,
            'bb.json': outdent`
                [
                    {
                        "id": "b.2",
                        "description": "b.2 again desc",
                        "defaultMessage": "b.2 again!"
                    }
                ]
            `,
            'c.json': outdent`
                [
                    {
                        "id": "c.1",
                        "defaultMessage": "c.1!"
                    }
                ]
            `,
        },
        configOverride: {
            collateDir: 'fixtures/03',
            inputMode: 'json',
        },
        out: [
            {
                id: 'a.1',
                description: undefined,
                defaultMessage: 'a.1!',
                fabs: absify('03', 'a.json'),
            },
            {
                id: 'a.1',
                description: undefined,
                defaultMessage: 'a.1 again!',
                fabs: absify('03', 'aa.json'),
            },
            {
                id: 'b.1',
                description: undefined,
                defaultMessage: 'b.1!',
                fabs: absify('03', 'b.json'),
            },
            {
                id: 'b.2',
                description: 'b.2 desc',
                defaultMessage: 'b.2!',
                fabs: absify('03', 'b.json'),
            },
            {
                id: 'b.2',
                description: 'b.2 again desc',
                defaultMessage: 'b.2 again!',
                fabs: absify('03', 'bb.json'),
            },
            {
                id: 'c.1',
                description: undefined,
                defaultMessage: 'c.1!',
                fabs: absify('03', 'c.json'),
            },
        ],
    },

    {
        name: '04',
        dir: {
            'a.json': outdent`
                [
                    {
                        "id": "a.1",
                        "defaultMessage": "a.1!"
                    }
                ]
            `,
            'aa.json': outdent`
                [
                    {
                        "id": "a.1",
                        "defaultMessage": "a.1 again!"
                    }
                ]
            `,
            'b.json': outdent`
                [
                    {
                        "id": "b.1",
                        "defaultMessage": "b.1!"
                    },
                    {
                        "id": "b.2",
                        "description": "b.2 desc",
                        "defaultMessage": "b.2!"
                    }
                ]
            `,
            'bb.json': outdent`
                [
                    {
                        "id": "b.2",
                        "description": "b.2 again desc",
                        "defaultMessage": "b.2 again!"
                    }
                ]
            `,
            'c.json': outdent`
                [
                    {
                        "id": "c.1",
                        "defaultMessage": "c.1!"
                    }
                ]
            `,
        },
        configOverride: {
            collateDir: absify('04', ''),
            inputMode: 'json',
        },
        out: [
            {
                id: 'a.1',
                description: undefined,
                defaultMessage: 'a.1!',
                fabs: absify('04', 'a.json'),
            },
            {
                id: 'a.1',
                description: undefined,
                defaultMessage: 'a.1 again!',
                fabs: absify('04', 'aa.json'),
            },
            {
                id: 'b.1',
                description: undefined,
                defaultMessage: 'b.1!',
                fabs: absify('04', 'b.json'),
            },
            {
                id: 'b.2',
                description: 'b.2 desc',
                defaultMessage: 'b.2!',
                fabs: absify('04', 'b.json'),
            },
            {
                id: 'b.2',
                description: 'b.2 again desc',
                defaultMessage: 'b.2 again!',
                fabs: absify('04', 'bb.json'),
            },
            {
                id: 'c.1',
                description: undefined,
                defaultMessage: 'c.1!',
                fabs: absify('04', 'c.json'),
            },
        ],
    },
];

describe('lib/riw/translate/extract.json', () => {
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

            const received = armdExtractJSON(notify)(cfg);

            expect(received).toEqual(fixture.out);
        });
    });
});
