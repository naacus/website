/**
 * Telemetry Service (OpenTelemetry-aligned)
 *
 * This service is intentionally separate from product analytics (GA4).
 * It emits trace/span oriented telemetry with W3C trace context headers.
 */

const OTEL_ENDPOINT = process.env.REACT_APP_OTEL_EXPORTER_OTLP_ENDPOINT || '';
const OTEL_HEADERS = process.env.REACT_APP_OTEL_EXPORTER_OTLP_HEADERS || '';
const OTEL_SERVICE_NAME = process.env.REACT_APP_OTEL_SERVICE_NAME || 'naacus-website-frontend';
const OTEL_SERVICE_VERSION = process.env.REACT_APP_OTEL_SERVICE_VERSION || process.env.REACT_APP_VERSION || '0.1.0';
const OTEL_ENVIRONMENT = process.env.REACT_APP_OTEL_ENVIRONMENT || process.env.NODE_ENV || 'development';
const OTEL_SAMPLE_RATE = Number(process.env.REACT_APP_OTEL_SAMPLE_RATE || '1');

const TRACE_FLAGS_SAMPLED = '01';
const TRACE_FLAGS_NOT_SAMPLED = '00';

let telemetryInitialized = false;
let globalAttributes = {};

const isTelemetryEnabled = () => Boolean(OTEL_ENDPOINT);

function nowUnixNano() {
  return `${Date.now()}000000`;
}

function randomHex(bytes) {
  const arr = new Uint8Array(bytes);

  const cryptoApi = typeof window !== 'undefined' ? window.crypto : null;

  if (cryptoApi && typeof cryptoApi.getRandomValues === 'function') {
    cryptoApi.getRandomValues(arr);
  } else {
    for (let i = 0; i < arr.length; i += 1) {
      arr[i] = Math.floor(Math.random() * 256);
    }
  }

  return Array.from(arr, (b) => b.toString(16).padStart(2, '0')).join('');
}

function sanitizeString(input) {
  if (typeof input !== 'string') {
    return input;
  }
  return input.slice(0, 2048);
}

function sanitizeAttributes(attributes = {}) {
  const result = {};
  Object.entries(attributes).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    if (typeof value === 'string') {
      result[key] = sanitizeString(value);
      return;
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      result[key] = value;
      return;
    }

    result[key] = sanitizeString(String(value));
  });
  return result;
}

function toOtelAnyValue(value) {
  if (typeof value === 'boolean') {
    return { boolValue: value };
  }
  if (typeof value === 'number') {
    if (Number.isInteger(value)) {
      return { intValue: value };
    }
    return { doubleValue: value };
  }
  return { stringValue: String(value) };
}

function toOtelAttributes(attributes = {}) {
  return Object.entries(attributes).map(([key, value]) => ({
    key,
    value: toOtelAnyValue(value),
  }));
}

function shouldSample() {
  if (!isTelemetryEnabled()) {
    return false;
  }

  if (OTEL_SAMPLE_RATE >= 1) {
    return true;
  }

  if (OTEL_SAMPLE_RATE <= 0) {
    return false;
  }

  return Math.random() <= OTEL_SAMPLE_RATE;
}

function buildTraceparent(traceId, spanId, sampled) {
  const flags = sampled ? TRACE_FLAGS_SAMPLED : TRACE_FLAGS_NOT_SAMPLED;
  return `00-${traceId}-${spanId}-${flags}`;
}

function mapSpanKind(kind = 'internal') {
  switch ((kind || '').toLowerCase()) {
    case 'server':
      return 2;
    case 'client':
      return 3;
    case 'producer':
      return 4;
    case 'consumer':
      return 5;
    case 'internal':
    default:
      return 1;
  }
}

function sendOtelPayload(payload) {
  if (!isTelemetryEnabled()) {
    return;
  }

  const body = JSON.stringify(payload);
  const hasCustomHeaders = OTEL_HEADERS.trim().length > 0;
  const parsedHeaders = {
    'Content-Type': 'application/json',
  };

  // Supports OTLP-style env headers: key=value,key2=value2
  OTEL_HEADERS.split(',').forEach((pair) => {
    const [rawKey, ...rawValueParts] = pair.split('=');
    const key = (rawKey || '').trim();
    const value = rawValueParts.join('=').trim();
    if (key && value) {
      parsedHeaders[key] = value;
    }
  });

  if (!hasCustomHeaders && typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
    const blob = new Blob([body], { type: 'application/json' });
    navigator.sendBeacon(OTEL_ENDPOINT, blob);
    return;
  }

  fetch(OTEL_ENDPOINT, {
    method: 'POST',
    headers: parsedHeaders,
    body,
    keepalive: true,
  }).catch(() => {
    // Do not throw from telemetry path.
  });
}

function exportSpan(spanData) {
  if (!spanData.sampled || !isTelemetryEnabled()) {
    return;
  }

  const resourceAttributes = {
    'service.name': OTEL_SERVICE_NAME,
    'service.version': OTEL_SERVICE_VERSION,
    'deployment.environment': OTEL_ENVIRONMENT,
    ...globalAttributes,
  };

  const payload = {
    resourceSpans: [
      {
        resource: {
          attributes: toOtelAttributes(resourceAttributes),
        },
        scopeSpans: [
          {
            scope: {
              name: 'naacus.telemetry.manual',
              version: '1.0.0',
            },
            spans: [
              {
                traceId: spanData.traceId,
                spanId: spanData.spanId,
                parentSpanId: spanData.parentSpanId || undefined,
                name: spanData.name,
                kind: mapSpanKind(spanData.kind),
                startTimeUnixNano: spanData.startTimeUnixNano,
                endTimeUnixNano: spanData.endTimeUnixNano,
                attributes: toOtelAttributes(spanData.attributes),
                events: spanData.events.map((event) => ({
                  name: event.name,
                  timeUnixNano: event.timeUnixNano,
                  attributes: toOtelAttributes(event.attributes),
                })),
                status: spanData.status,
              },
            ],
          },
        ],
      },
    ],
  };

  sendOtelPayload(payload);
}

export function initializeTelemetry() {
  telemetryInitialized = true;
  if (process.env.NODE_ENV === 'development') {
    const state = isTelemetryEnabled() ? 'enabled' : 'disabled';
    console.log(`Telemetry ${state} (OpenTelemetry aligned)`);
  }
}

export function setTelemetryAttributes(attributes = {}) {
  globalAttributes = {
    ...globalAttributes,
    ...sanitizeAttributes(attributes),
  };
}

export function startSpan(name, attributes = {}, options = {}) {
  const sampled = shouldSample();
  const traceId = options.parentContext?.traceId || randomHex(16);
  const spanId = randomHex(8);
  const parentSpanId = options.parentContext?.spanId;
  const startTimeUnixNano = nowUnixNano();
  const events = [];
  const spanAttributes = sanitizeAttributes(attributes);

  let ended = false;

  return {
    traceId,
    spanId,
    sampled,
    getTraceparent: () => buildTraceparent(traceId, spanId, sampled),
    context: {
      traceId,
      spanId,
      sampled,
    },
    setAttribute: (key, value) => {
      spanAttributes[key] = value;
    },
    addEvent: (eventName, eventAttributes = {}) => {
      events.push({
        name: eventName,
        timeUnixNano: nowUnixNano(),
        attributes: sanitizeAttributes(eventAttributes),
      });
    },
    recordException: (error, exceptionAttributes = {}) => {
      const err = error instanceof Error ? error : new Error(String(error));
      events.push({
        name: 'exception',
        timeUnixNano: nowUnixNano(),
        attributes: sanitizeAttributes({
          'exception.type': err.name,
          'exception.message': err.message,
          'exception.stacktrace': err.stack || '',
          ...exceptionAttributes,
        }),
      });
    },
    end: (status = { code: 1 }) => {
      if (ended) {
        return;
      }
      ended = true;

      exportSpan({
        traceId,
        spanId,
        parentSpanId,
        sampled,
        name,
        kind: options.kind || 'internal',
        startTimeUnixNano,
        endTimeUnixNano: nowUnixNano(),
        attributes: spanAttributes,
        events,
        status,
      });
    },
  };
}

export async function withSpan(name, attributes = {}, fn = async () => {}, options = {}) {
  const span = startSpan(name, attributes, options);

  try {
    const result = await fn(span);
    span.end({ code: 1 });
    return result;
  } catch (error) {
    span.recordException(error);
    span.end({ code: 2, message: error?.message || 'Unhandled exception' });
    throw error;
  }
}

export function recordException(error, attributes = {}, parentContext = null) {
  const span = startSpan('exception', sanitizeAttributes(attributes), {
    kind: 'internal',
    parentContext,
  });
  span.recordException(error);
  span.end({ code: 2, message: error?.message || 'Unhandled exception' });
}

export function trackRouteTelemetry(pathname, title = '') {
  const span = startSpan('ui.route_change', {
    'app.route': pathname,
    'app.page_title': title,
  });
  span.end({ code: 1 });
}

export function getTraceHeaders(parentContext = null) {
  const sampled = shouldSample();
  const traceId = parentContext?.traceId || randomHex(16);
  const spanId = randomHex(8);
  const traceparent = buildTraceparent(traceId, spanId, sampled);
  return {
    traceparent,
  };
}

export const telemetryConfig = {
  initialized: () => telemetryInitialized,
  enabled: isTelemetryEnabled,
  endpoint: OTEL_ENDPOINT,
  serviceName: OTEL_SERVICE_NAME,
  environment: OTEL_ENVIRONMENT,
};
