// @flow

import mock from 'mock-fs';

import { configResolve } from '../../../config';

import find from '../find';

const frelDB = 'db.json';

const cfgBase: RIWConfigSparseWithSource = {
    translationsDatabaseFile: frelDB,
};

const db: RIWDB = {
    version: 1,
    data: {
        'one': {
            'desc1': {
                'aa-aa': '[aa-aa]1 one',
                'bb-bb': '[bb-bb]1 one',
            },
            'desc2': {
                'aa-aa': '[aa-aa]2 one',
                'bb-bb': '[bb-bb]2 one',
            },
        },
        'two': {
            'desc1': {
                'aa-aa': '[aa-aa]1 two',
                'bb-bb': '[bb-bb]1 two',
            },
        },
        'three': {
            'desc1': {
                'aa-aa': '[aa-aa]1 three',
                'cc-cc': '[cc-cc]1 three',
            },
        },
        'four': {
            '_': {
                'aa-aa': '[aa-aa]no desc four',
            },
        },
    },
};

const jsonDB = JSON.stringify(db, null, 4);

type Fixture = {
    name: string,
    opt: RIWCLIOptDBFind,
};

const fixtures: Fixture[] = [
    {
        name: '01 defaultMessage match',
        opt: {
            match: {
                defaultMessage: 'two',
            },
        },
    },

    {
        name: '02 description match',
        opt: {
            match: {
                description: 'desc1',
            },
        },
    },

    {
        name: '03 locale match',
        opt: {
            match: {
                locale: 'bb-bb',
            },
        },
    },

    {
        name: '04 translation match',
        opt: {
            match: {
                translation: '[cc-cc]1 three',
            },
        },
    },

    {
        name: '05 defaultMessage match for message without desc',
        opt: {
            match: {
                defaultMessage: 'four',
            },
        },
    },

    {
        name: '06 match with two criteria',
        opt: {
            match: {
                defaultMessage: 'one',
                locale: 'aa-aa',
            },
        },
    },

    {
        name: '07 match message with default desc',
        opt: {
            match: {
                description: '_',
            },
        },
    },
];

describe('lib/riw/db/find', () => {
    fixtures.forEach((fixture) => {
        it(fixture.name, () => {
            mock({
                [frelDB]: jsonDB,
            });

            const cfg = configResolve(cfgBase);

            const received = find(cfg)(fixture.opt);

            mock.restore();

            expect(received).toMatchSnapshot();
        });
    });
});
