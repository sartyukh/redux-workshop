export class AppResponseError extends Error {}

export class NotFoundError extends AppResponseError {}

export class ServiceUnavailableError extends AppResponseError {}

export class TooManyRequestsError extends AppResponseError {}
