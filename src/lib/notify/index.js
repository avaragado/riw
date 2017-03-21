// @flow

type HandlerMap = {
    [key: string]: (input: any) => any,
};

export type Notifier = (sEvent: string) => (data: *) => *;

type NotifierFactory = (on?: HandlerMap) => Notifier;

export default (on => sEvent => (data) => {
    if (on && on[sEvent]) {
        on[sEvent](data);
    }

    return data;
}: NotifierFactory);
