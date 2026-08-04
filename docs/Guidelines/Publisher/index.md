---
title: "Guidelines for Publishers"
---

# National Event Management Service (NEMS) Guidelines for Publishers

## Purpose

This document provides information, guidelines, and recommendations to support National Event Management Service (NEMS) publishers to design the integration solution with NEMS.

## Audience

The target audience for this guideline document is primarily solution designers and application developers in organisations within the New Zealand health sector designing and developing solutions producing nationally significant healthcare events to NEMS.

## Prereading

Information on key NEMS concepts, including Event-Driven Architecture (EDA), events, and topic taxonomy, is available in the NEMS Key Concepts document (reference link). A sound understanding of these concepts is essential for designing and publishing events within the NEMS ecosystem.

It is assumed that readers are familiar with the applicable NEMS policies, standards, and governance documents. These documents define the principles, requirements, and constraints that publishers must adhere to when designing event schemas, structuring topics, protecting sensitive information, and publishing events to NEMS.

Publishers should review these documents before commencing solution design to ensure their event-driven integration aligns with NEMS architecture, security, and interoperability requirements.

## Design guidelines and considerations

NEMS is the national platform for enabling Event-Driven Architecture (EDA) within the New Zealand health ecosystem. It facilitates the secure and reliable exchange of events between systems, reducing point-to-point dependencies and promoting loose coupling, agility, and reuse across health services.

As a cloud-based service, NEMS provides a standardised integration capability that enables connected systems to publish and consume events over the internet. The platform supports a broad range of security standards, messaging protocols, and development technologies, allowing organisations to adopt event-driven integration patterns while maintaining interoperability and compliance with Health NZ standards.

## Consider business events

Events occur continuously across health systems. It is estimated that more than two million health-related events are generated in New Zealand each day. Whenever data is created, updated, or deleted, it can be considered an event. NEMS is an event-driven architecture platform designed to facilitate the exchange of events that have significance beyond a single organisation and provide value across the wider health ecosystem.

If you are aware of business events within your organisation that could deliver value to other health sector participants, engage with the NEMS team to discuss the use case. The proposed event can then be assessed, prioritised, and considered for inclusion in the NEMS roadmap.
An ideal NEMS event typically exhibits the following characteristics:
- **National significance** and relevance beyond a single organisation, region, or local context.
- **Clear value** to the New Zealand health sector and its participants.
- **Well-defined business semantics**, representing a meaningful business event rather than a technical system event.
- **Significant impact** on subscribing systems, workflows, or business processes.

For example, a patient enrolment transfer event aligns well with these characteristics. When a patient transfers from one general practice to another, the previous practice requires timely notification so that it can update its records and cease services that are no longer required, such as repeat prescription communications.
Organisations intending to publish new events to NEMS should engage with the NEMS team as early as possible in the design process. Early engagement helps ensure a clear understanding of NEMS policies, standards, and architectural requirements, and enables any impacts to the solution design, event model, security approach, or integration architecture to be identified and addressed before development begins.

## Event topics

The responsibility for defining the event topic is a shared between the publishers and the NEMS team. Each event topic has an event topic taxonomy. This forms a hierarchical structure of topics to enable NEMS to route and filter the event messages. The design of event topic taxonomy requires a good understanding of the business event, NEMS internal architecture, and use cases of the event consumptions.

## Connectivity patterns

NEMS supports two types of connectivity patterns:

- on-demand connection
- persistent connection.

On-demand connection allows the publisher to connect to NEMS, publish events and then disconnect from NEMS. This pattern supports typical low frequency events andmittent publishing activities. For example, a publisher could implement protocols like REST to connect to NEMS, publish an event message with Post request, and then close the connection after receiving a 200 response.

Persistent connection is a continuous, typically long-lasting connection. This pattern supports high throughput or low latency event publishing.

Both patterns support various messaging protocols and technologies.

The connectivity pattern you choose will not impact the authentication mechanism used in your connection to NEMS.

As an example for the on-demand connectivity, a publisher could implement protocols like REST to connect to NEMS, publishes an event message with Post request, and then close the connection after receiving a 200 response.Network connections

NEMS provides REST and tcps publishing endpoints. As a publisher, you are responsible for ensuring the network connectivity from your systems to the NEMS environment.

## Publishing patterns

The publishing patterns are simplified with NEMS. Currently the default publishing pattern for NEMS is the publisher-subscriber pattern. As a publisher, the subscribers are agnostic to you. It is the publisher’s responsibility to ensure the events have been received by NEMS and NEMS manages the delivery of the events to the subscribers.

Based on your use cases and the nature of your events, you have the option to publish your events either triggered by the real-time business event, or in a batch by group of events.

Real-time event publishing means you publish an event message when a business event occurs. This pattern supports better timeliness of the event. The order of event messages follows the natural sequence of the business events.

Batch style means you publish your event messages in batches, by groups of events. You need to consider the following if you are using this pattern:

- Duplicates of your events: e.g. when an event happens twice, do you want to publish them as two separate events?
- Order of events
- Volume of events
- Potential impact for the subscribers.

NEMS recommends the real-time publishing pattern over batch publishing as the former matches better with the event-driven architecture mind set. NEMS also recognises the possible needs for batch publishing to save computing power and different criticality and needs in timeliness and ease of implementation.

## Security and privacy

NEMS mandates the OAuth 2.0 authentication and authorisation standard to secure its event-driven APIs. The OAuth Client Credential flow will be used to authenticate the publisher’s connectivity with centralised IdP (identity Provider). It is publisher’s responsibility to securely store and manage all keys and secrets.

NEMS is a cloud-based service and provides access and interoperability based on internet protocols. All communications are secured. Data transfers between all systems are encrypted. Data in transition in NEMS is encrypted. Message payload is never decrypted in NEMS for security and data protection reasons.

As a publisher, you have full control of what information goes into event messages. The data held within your messages, whether they are in the message headers or message payload, may contain sensitive information. As a publisher you will not always know who your event messages will be sent to and how the message data will be used. You could weigh the following protection mechanism to protect the data according to the data sensitivity:

- consider thin event: include insensitive identification information of your event in the event message, and require the subscriber to retrieve more information from one or more services (through their APIs).
- Publish minimum but sufficient data and consider how your subscribers might process events to reduce the mandate of the subscriber to do additional API call. Please note, these API calls might cause extra load and stress to your systems.
- Avoid adding sensitive data into topic taxonomy, especially if you are publishing using the REST endpoint. The topic taxonomy is a part of your publishing API URL.

The diagram below represents a possible data flow for a thin event where the subscriber performs an API callback against the publisher’s service API. To achieve the highest level of interoperability Fast Healthcare Interoperability Resources (FHIR) is the recommended standard to use when exposing such an API.

Thin event flow

![Thin Event Flow](Aspose.Words.524df83d-d8f1-4d17-ae1b-cae20f9b09de.001.png)

## Data quality

As a publisher, you are responsible for the data quality of your events. Data quality is expected to be high standard and to conform to the event specification.

## Service migration

Depending on the nature of the event being published, careful planning is required to ensure a successful onboarding and adoption process. In some cases, the event or associated data may already be provided through an existing or legacy integration solution. As subscribers transition from the legacy mechanism to NEMS, continuity of service must be maintained to minimise disruption.

While managing subscriber migration is not the responsibility of the publisher, publishers may be required to support both the existing integration process and the new NEMS-based event stream during the transition period. This may involve running parallel solutions for a defined period while subscribers complete their migration activities.

Publishers should take subscriber onboarding, cutover planning, and migration timelines into account when designing their solution. Early consideration of these factors can help ensure a smooth transition, minimise service disruption, and support the successful adoption of the new NEMS event.

## Monitoring and alerting

As a publisher, you are responsible for the reliable generation and publication of events to NEMS. An event should only be considered successfully published once it has been acknowledged by the NEMS event broker. Publishers are responsible for monitoring the health of their NEMS connectivity, tracking event publication success and failure rates, and responding to issues that may affect event delivery.

It is recommended that publishers implement appropriate observability and operational monitoring practices, including APM, logging, metrics, and alerting, to ensure their publishing services meet the required performance, reliability, and service-level objectives.

NEMS is responsible for operating and maintaining the event platform, including its availability, performance, scalability, and resilience, to ensure accepted events can be reliably routed and delivered to authorised subscribers.

## Error handling

Publishers are responsible for managing errors that occur during the publication of events to NEMS. If an event cannot be successfully published to the NEMS broker, the publisher must implement appropriate retry and recovery mechanisms to ensure the event is eventually delivered.

An event should only be considered successfully published once it has been accepted and acknowledged by the NEMS broker. Until that acknowledgement is received, the event has not entered the NEMS ecosystem and remains the responsibility of the publisher. As a result, publishers should design their solutions to support reliable event delivery through retry, persistence, and failure recovery processes.

It is recommended that publishers separate the business logic responsible for generating an event from the logic responsible for sending the event to NEMS. This architectural pattern improves resilience by allowing event publication failures to be handled independently of the upstream business process. The publisher application should first construct and validate the event to ensure it conforms to the NEMS event specification before submitting it for delivery.

NEMS performs only limited validation of incoming messages. Provided the client is correctly configured to use the approved protocol and can successfully connect to the NEMS broker, the message will generally be accepted and acknowledged. To minimise performance overhead and reduce exposure to sensitive information, NEMS does not validate event payload content or verify that required business headers are populated.

Therefore, publishers are responsible for ensuring that:

- The event payload conforms to the agreed event specification.
- All mandatory message headers are populated and valid.
- The event data is complete, accurate, and fit for downstream consumption.

Publishers should understand the broker error codes that may be returned by NEMS and implement appropriate handling for each expected failure scenario. In addition, a catch-all error handling mechanism should be implemented to manage unexpected or unrecognised errors, ensuring that events are not silently lost and operational teams are alerted when intervention is required.

## Scalability

The publisher application should be designed and scaled to accommodate the expected event throughput, including anticipated growth in event volumes over time. Publishers are responsible for ensuring that their event generation, processing, and publication components can meet both functional and non-functional requirements.

The NEMS team is responsible for ensuring that the NEMS event broker has sufficient capacity, performance, and scalability to receive and distribute published events. To support effective capacity planning, publishers should engage with the NEMS team early and provide estimates of expected event volumes, publishing patterns, and any significant future changes in workload.

Publishers should also consider the broader impact that introducing event-driven integration may have on their underlying systems. While NEMS enables scalable event distribution, downstream interactions generated by those events may place additional load on publisher-managed services.

>For example, when implementing a **thin event** pattern, subscribers may retrieve additional information by invoking a publisher-provided API. Publishers must ensure that any APIs exposed for callback or data retrieval purposes are designed to support the expected demand and can scale appropriately.

It is important to consider fan-out scenarios. A single event published to NEMS may be consumed by many subscribers. For example, if an event has 100 subscribers and each subscriber invokes a callback API to retrieve additional information, the publication of a single event could generate 100 subsequent API requests. Without appropriate scalability controls, this pattern may introduce performance, availability, or stability risks to downstream systems.

Publishers should assess the expected subscriber demand and implement suitable scalability measures, such as:

* Caching frequently requested event data.
* Load balancing and horizontal scaling of APIs.
* Rate limiting and traffic management controls.
* Asynchronous processing where appropriate.
* Read-optimised data stores or event-specific query services.

A commonly adopted approach is to generate and store an event-specific representation of the data when the event is published. Subscriber API requests can then be served from a cache or dedicated retrieval layer rather than directly from the source system. This reduces load on backend systems and improves the scalability and resilience of the overall solution.


![Callback Capability](Aspose.Words.524df83d-d8f1-4d17-ae1b-cae20f9b09de.002.png)

## Testing

Publishers are responsible for defining and implementing an appropriate testing strategy to ensure that their event publishing solution meets all business, technical, and operational requirements. The testing approach should provide confidence that:
* Published events conform to the agreed NEMS event specifications and quality standards.
* Event generation, publishing logic, and error-handling processes operate as intended.
* The publishing application meets performance, scalability, and reliability requirements.
* All applicable functional and non-functional requirements have been satisfied.

NEMS supports the development and testing lifecycle by providing a shared non-production environment for publishers and subscribers to develop, integrate, and validate their solutions. As this environment is shared by multiple organisations and teams, publishers should use it responsibly and ensure that their testing activities do not adversely affect other NEMS participants.

Publishers are encouraged to adopt a testing strategy that minimises dependencies on external systems, including NEMS, wherever practical. Most functional and business-rule validation should be performed through automated unit tests, component tests, and service virtualisation or mock implementations. This approach enables earlier defect detection, faster feedback cycles, and more reliable testing outcomes.

A recommended testing pyramid is:

* Unit Testing to validate business logic and event construction.
* Component Testing to verify event publication components and error-handling behaviour.
* Integration Testing to validate interactions with NEMS and other dependent services.
* End-to-End Testing to confirm complete business workflows across participating systems.

End-to-end testing involving NEMS should be performed selectively and based on defined business, technical, or release requirements. As end-to-end testing typically requires coordination across multiple parties and environments, it is often more costly and time-consuming than lower-level testing. For this reason, it should be reserved for validating critical integration scenarios and key business outcomes that cannot be adequately tested through isolated or simulated approaches.

Publishers should ensure that their testing strategy provides sufficient coverage to verify the correctness, resilience, performance, and operational readiness of their event publishing solution before it is deployed to production.

## Disaster recovery

NEMS is designed to provide a highly available and resilient event platform, incorporating disaster recovery capabilities to minimise service disruption and prevent data loss. The platform is designed to meet a zero Recovery Point Objective (RPO) target, meaning that no accepted event messages should be lost in the event of a disaster recovery scenario.

Publishers are not required to implement any NEMS-specific disaster recovery procedures beyond standard integration resilience and error-handling practices. During a disaster recovery event, the NEMS service may be temporarily unavailable while failover or recovery activities are performed. During this period, publisher applications may experience connectivity issues or message publication failures.

Publishers should be designed to tolerate these transient failures by implementing appropriate retry, reconnection, and recovery mechanisms. Once the NEMS platform has been restored, publisher applications should automatically reconnect and resume event publication without manual intervention.

Although NEMS provides platform-level disaster recovery capabilities, publishers remain responsible for ensuring the resilience of their own systems and business processes. Failure within publisher-managed applications, infrastructure, or data stores can result in lost or duplicated events if appropriate safeguards are not implemented.

Publishers should design their disaster recovery and business continuity processes in accordance with their own Recovery Time Objective (RTO) and Recovery Point Objective (RPO) requirements. Consideration should be given to:

- The maximum acceptable delay in event publication following a system outage.
- The amount of event data that can be tolerated for loss during a failure scenario.
- The ability to recover and replay unpublished events.
- The prevention of duplicate event publication during recovery processing.
- The automatic restoration of connectivity to NEMS following service interruption.

To minimise the risk of data loss and duplicate event delivery, it is recommended that publishers implement durable event persistence, idempotent processing patterns, and automated recovery procedures. These capabilities will help ensure that event publication can resume reliably following an application, infrastructure, or disaster recovery event while maintaining the integrity of published information.

## Traceability and Audit

The publisher should at least record the `messageId`, `messageSubjectId` and `publishing timestamp` in your logs (or traces) to satisfy the end to end traceability requirements.