// @flow

import makeNotifier from '../';

describe('lib/notify/makeNotifier', () => {
    it('returns input, and does not call function if not defined', () => {
        const handler = jest.fn();

        const notify = makeNotifier({
            aa: handler,
        });

        const received = notify('bb')(123);

        expect(received).toBe(123);
        expect(handler.mock.calls.length).toBe(0);
    });

    it('returns input, and calls function if defined', () => {
        const handler = jest.fn();

        const notify = makeNotifier({
            aa: handler,
        });

        const received = notify('aa')(123);

        expect(received).toBe(123);
        expect(handler.mock.calls).toEqual([[123]]);
    });
});
