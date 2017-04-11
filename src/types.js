// @flow
// types without a more natural home

export type AbsolutePath = string;
export type RelativePath = string;
export type Glob = string;
export type LocaleId = string;

export type Path = AbsolutePath | RelativePath;

export type MessageId = string;
export type DefaultMessage = string;
export type Description = string | Object;
export type SerialisedDescription = string;
export type TranslatedMessage = string;

export type DefaultPair = [DefaultMessage, SerialisedDescription];
export type TranslationQuad = [DefaultMessage, SerialisedDescription, LocaleId, TranslatedMessage];

// corresponds to react-intl's message descriptor, with mandatory defaultMessage
// (supporting only string descriptions for now)
export type MessageDescriptor = {
    id: MessageId,
    defaultMessage: DefaultMessage,
    description?: Description,
};

export type MessageDescriptorWithFile = MessageDescriptor & {
    file: AbsolutePath,
};

export type UntranslatedMessageDescriptor = MessageDescriptor & {
    locale: LocaleId,
};

// NOT an intersection with MessageDescriptor, as translations don't require the id.
// (the translations database doesn't use message descriptor ids at all.)
export type TranslatedMessageDescriptor = {
    defaultMessage: DefaultMessage,
    description?: Description,
    locale: LocaleId,
    translation: TranslatedMessage,
};
