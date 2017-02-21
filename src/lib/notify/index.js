// @flow

type HandlerMap = {
    [key: string]: (input: any) => any,
};

export default (on?: HandlerMap) => (sEvent: string) => (data: any) => {
    if (on && on[sEvent]) {
        on[sEvent](data);
    }

    return data;
};
