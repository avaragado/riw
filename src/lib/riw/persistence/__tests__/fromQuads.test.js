// @flow

import fromQuads from '../fromQuads';
import cfgBase from '../../__tests__/helpers/dummyConfig';

type Fixture = {
    name: string,
    in: RIWDBQuad[],
    config: Object,
    out: RIWDB,
};

const fixtures: Fixture[] = [
    {
        name: '01 empty db',
        in: [],
        config: {},
        out: {
            version: 1,
            data: {},
        },
    },

    {
        name: '02 lots of entries',
        in: [
            ['hello', 'desc2', 'fr-fr', 'OVERWRITTEN bonjour'],
            ['hello', 'desc1', 'en-re', 'olleh'],
            ['hello', 'desc1', 'en-UP', 'HELLO'],
            ['hello', 'desc2', 'fr-fr', 'bonjour'],
            ['goodbye', 'desc1', 'en-re', 'eybdoog'],
            ['goodbye', 'desc1', 'en-UP', 'GOODBYE'],
        ],
        config: {},
        out: {
            version: 1,
            data: {
                'hello': {
                    'desc1': {
                        'en-re': 'olleh',
                        'en-UP': 'HELLO',
                    },
                    'desc2': {
                        'fr-fr': 'bonjour',
                    },
                },
                'goodbye': {
                    'desc1': {
                        'en-re': 'eybdoog',
                        'en-UP': 'GOODBYE',
                    },
                },
            },
        },
    },
];

describe('lib/riw/persistence/fromQuads', () => {
    fixtures.forEach((fixture) => {
        it(fixture.name, () => {
            const cfg = { ...cfgBase, ...fixture.config };

            const received = fromQuads(cfg)(fixture.in);

            expect(received).toEqual(fixture.out);
        });
    });
});
