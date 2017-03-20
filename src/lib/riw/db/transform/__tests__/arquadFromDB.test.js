// @flow

import type { TranslationsDB } from '../../';
import arquadFromDB from '../arquadFromDB';

type Fixture = {
    name: string,
    in: TranslationsDB,
};

const fixtures: Fixture[] = [
    {
        name: '01 empty db',
        in: {
            version: 1,
            data: {},
        },
    },

    {
        name: '02 lots of entries',
        in: {
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

describe('lib/riw/db/transform/arquadFromDB', () => {
    fixtures.forEach((fixture) => {
        it(fixture.name, () => {
            const received = arquadFromDB(fixture.in);

            expect(received).toMatchSnapshot();
        });
    });
});
