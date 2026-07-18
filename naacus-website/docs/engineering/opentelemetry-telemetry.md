# OpenTelemetry Telemetry Guide

> **Category:** Engineering | **Audience:** Developers and operations
> **Last Updated:** July 18, 2026 | [<- Docs Index](../readme.md)

---

## Purpose

Define telemetry implementation that is separate from product analytics and aligned with OpenTelemetry trace/span concepts.

- **Telemetry:** reliability, performance, errors, dependency health
- **Analytics:** user behavior, funnels, conversions

Telemetry must not be treated as GA4 event tracking.

---

## Architecture

Frontend telemetry is implemented in `src/services/telemetryService.js`.

It provides:

1. Span lifecycle (`startSpan`, `withSpan`)
2. Exception recording (`recordException`)
3. W3C Trace Context header generation (`traceparent`)
4. OTLP-style trace export payloads to `REACT_APP_OTEL_EXPORTER_OTLP_ENDPOINT`

Instrumentation points:

1. App lifecycle and route telemetry in `src/App.js`
2. Global/runtime exception capture in `src/components/ErrorBoundary.js`
3. Chat dependency spans in `src/services/chatbotService.js`
4. Stripe dependency load spans in `src/components/StripeDonateButton.js`

---

## Environment Variables

Set in local/dev/prod environment (or Key Vault/CI secrets):

```bash
REACT_APP_OTEL_EXPORTER_OTLP_ENDPOINT=https://your-otel-endpoint/v1/traces
REACT_APP_OTEL_EXPORTER_OTLP_HEADERS=Authorization=Bearer <token>
REACT_APP_OTEL_SERVICE_NAME=naacus-website-frontend
REACT_APP_OTEL_SERVICE_VERSION=0.1.0
REACT_APP_OTEL_ENVIRONMENT=production
REACT_APP_OTEL_SAMPLE_RATE=1
```

Notes:

- If `REACT_APP_OTEL_EXPORTER_OTLP_ENDPOINT` is empty, telemetry is disabled.
- `REACT_APP_OTEL_SAMPLE_RATE` supports `0..1`.
- `REACT_APP_OTEL_EXPORTER_OTLP_HEADERS` uses OTLP format `key=value,key2=value2`.

---

## ELK Integration

Recommended pipeline:

1. Browser app exports OTLP JSON spans.
2. OpenTelemetry Collector receives traces.
3. Collector exports to Elasticsearch.
4. Kibana reads and visualizes trace data.

This avoids exposing Elasticsearch ingestion details directly in frontend code and keeps auth/secrets at collector boundary.

Minimal collector flow:

```yaml
receivers:
	otlp:
		protocols:
			http:

processors:
	batch:

exporters:
	elasticsearch:
		endpoints: ["https://your-elastic-endpoint:9200"]
		logs_index: "otel-logs"
		traces_index: "otel-traces"

service:
	pipelines:
		traces:
			receivers: [otlp]
			processors: [batch]
			exporters: [elasticsearch]
```

---

## Compliance Notes

This implementation aligns with OpenTelemetry fundamentals:

1. Trace IDs and Span IDs are generated per W3C trace context model.
2. `traceparent` header format uses `version-traceid-spanid-flags`.
3. Spans include status, attributes, and exception events.
4. Export payloads are structured as resource spans and scope spans.

For full enterprise deployment, route exporter traffic through a trusted OpenTelemetry Collector and enforce:

1. PII scrubbing
2. Sampling policy
3. Retry/backoff controls
4. Authentication at the collector edge

---

## Separation Rule (Mandatory)

Do not merge telemetry and analytics APIs.

- Keep telemetry logic in `telemetryService.js`.
- Keep GA4/business analytics in `analyticsService.js` and `googleAnalyticsService.js`.

This separation preserves operational signal quality and data governance clarity.
