import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

export type NAV_LINKS_TYPE = {
    label: string;
    href: string;
    // When true the link is faded and not clickable until the user logs in.
    requiresLogin?: boolean;
}

export type USER_TYPE = {
    id: string;
    name: string;
    email: string;
    picture: string;
}

// Response of POST /api/auth/refresh.
export type SESSION_TYPE = {
    accessToken: string;
    // Seconds until the access token expires.
    expiresIn: number;
    user: USER_TYPE;
}

export type AUTH_CONTEXT_TYPE = {
    user: USER_TYPE | null;
    isLoggedIn: boolean;
    // True until the first check for an existing session has finished.
    isAuthLoading: boolean;
    // Resolves to a valid access token for "Authorization: Bearer <token>", renewing it
    // when it is about to expire, or to null for a guest.
    getAccessToken: () => Promise<string | null>;
    logout: () => void;
    isLoginModalOpen: boolean;
    openLoginModal: () => void;
    closeLoginModal: () => void;
}

export type FOOTER_LINK_TYPE = {
    label: string;
    url: string;
}

// Footer sections keyed by section name (pages, socials, ...).
export type FOOTER_CONTENT_TYPE = Record<string, FOOTER_LINK_TYPE[]>

export type STREAM_STATUS_TYPE = 'idle' | 'connecting' | 'live' | 'paused' | 'reconnecting' | 'disconnected'

export type STREAM_STATUS_STYLE_TYPE = {
    label: string;
    dotClassName: string;
}

export type PREVIEW_STREAM_TYPE = {
    name: string;
    status: STREAM_STATUS_TYPE;
    tint: string;
}

export type CONTACT_LINK_TYPE = {
    platform: string;
    username: string;
    url: string;
    icon: IconDefinition;
}

export type CONNECTION_TYPE = {
    id: number;
    name: string;
    url: string;
    // False for streams loaded from the account's history: they wait for the user to press start.
    autoStart: boolean;
    // ID of the saved record when the stream came from the account's history.
    savedStreamId?: string;
}

// A stream saved to the logged-in user's account.
export type SAVED_STREAM_TYPE = {
    id: string;
    url: string;
    createdAt: string;
}

// Response of POST /api/streams/connect.
export type STREAM_TICKET_TYPE = {
    ticket: string;
    // Path of the video WebSocket, including the single-use ticket.
    wsPath: string;
    // The saved record, or null for guests.
    stream: SAVED_STREAM_TYPE | null;
}
