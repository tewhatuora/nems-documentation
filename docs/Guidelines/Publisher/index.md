---
title: "Guidelines for Publishers"
---

# National Event Management Service (NEMS) Guidelines for Publishers

## Purpose

This document provides information, guidelines, and recommendations to support National Event Management Service (NEMS) publishers to design the integration solution with NEMS.

## Audience

The target audience for this guideline document is primarily solution designers and application developers in organisations within the New Zealand health sector designing and developing solutions producing nationally significant healthcare events to NEMS.

## Prereading

The information of the NEMS key concepts, such as Event Driven Architecture, event, and topic taxonomy is provided in the NEMS Key Concepts document (--Reference link here--). Understanding these concepts will form a good basis for designing your integration application as a NEMS subscriber.

It is assumed the reader is familiar with the NEMS policy and standards documents. These documents contain important information for your integration design as a publisher.

## Design guidelines and considerations

NEMS is designed to facilitate Event Driven Architecture (EDA) for the New Zealand health sector. The EDA will enable better ability and loose coupling between the systems. NEMS is a cloud-based service providing internet connectivity to integrated systems. It supports various standards, including security practices, messaging protocols and programming languages.  

## Consider business events

Events are occurring in systems constantly. It is estimated that two million health events occur in New Zealand each day. Every time data is created, updated or deleted it can be considered an event. NEMS is an event-driven architecture solution, designed to manage events of national significance. Therefore, if you are aware of events in your organisation whose visibility could benefit the sector, let the NEMS team know about the use case for it to be evaluated and put on the NEMS backlog.

The ideal event is one that has the following characteristics:

- National significance (e.g. not limited to a regional or specific context)
- A clear benefit to the New Zealand health sector
- A clear business semantics (as a business event compared to a technical event)
- A potentially significant impact to the potential subscribers and their systems.

As an example, an enrolment event meets the characteristic requirements. When a patient is transferred between GPs, the GP that is losing the patient needs to be notified so they can close communications for repeat scripts etc.

If you have a business event that you want to publish to NEMS, please engage with the NEMS team before you start your design and development process. This will ensure the publisher has a clear understanding of NEMS requirements, which might impact their integration architecture.

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

The table below provides the network details of NEMS production and test environments for publishers.

|**Source**|**Target**|**Port**|**Comments**|
| :- | :- | :- | :- |
|Publisher application|nems.services.health.nz|55443|TCPS, SMF protocols|
|Publisher test application|nems-test.services.health.nz|55443|TCPS, SMF protocols|
|Publisher application|nems.services.health.nz|9443|HTTPS, REST endpoint|
|Publisher test application|nems-test.services.health.nz|9443|HTTPS, REST endpoint|

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

NEMS is a cloud-based service and provides access and interoperability based on internet protocols. All communications are secured. Data transfers between all systems are encrypted. Data in transition in NEMS is encrypted. Message playload is never decrypted in NEMS for security and data protection reasons.

As a publisher, you have full control of what information goes into event messages. The data held within your messages, whether they are in the message headers or message payload, may contain sensitive information. As a publisher you will not always know who your event messages will be sent to and how the message data will be used. You could weigh the following protection mechanism to protect the data according to the data sensitivity:

- Use thin event: include insensitive identification information of your event in the event message, and require the subscriber to retrieve more information from one or more services (through their APIs).
- Publish minimum but sufficient data and consider how your subscribers might process events to reduce the mandate of the subscriber to do additional API call. Please note, these API calls might cause extra load and stress to your systems.
- Avoid adding sensitive data into topic taxonomy, especially if you are publishing using the REST endpoint. The topic taxonomy is a part of your publishing API URL.

The diagram below represents a possible data flow for a thin event where the subscriber performs an API callback against the publisher’s service API. To achieve the highest level of interoperability Fast Healthcare Interoperability Resources (FHIR) is the recommended standard to use when exposing such an API.

Thin event flow

![Thin Event Flow](Aspose.Words.524df83d-d8f1-4d17-ae1b-cae20f9b09de.001.png)

## Data quality

As a publisher, you are responsible for the data quality of your events. Data quality is expected to be high standard and to conform to the event specification.

## Service migration

Depending on the nature of the event you are publishing, it is important the onboarding of publisher events are managed successfully. In some situations, events or data may already be provided by legacy solutions. This means subscribers of these events need to be managed from the existing process to the modern NEMS integration. It is not the role of the publisher to manage the migration of these events, however as a publisher you may be required to maintain the existing process while subscribers transition to the new solution. This may require you to take their system cutover and migration into your design considerations.

## Monitoring and alerting

As a publisher, it is your responsibility to ensure events are successfully published to NEMS by acknowledgement from the NEMS broker. You are responsible for ensuring your connection to NEMS is within the desired status and monitoring event publishing error rate. We recommend you define your APM and observability operations to make sure your publishing service meets its service-level design. NEMS is responsible for ensuring its availability and scalability to receive and deliver event messages.

## Error handling

Error management is in the publisher’s control as they are responsible for the event being sent to the NEMS publisher. If an event fails to be published to the NEMS broker, the publisher needs to implement logic that will retry until successful.

If the event has not been accepted by the NEMS broker, this essentially means the event never happened. Therefore, the responsibility is for the publisher to retry. It is recommended that the publisher separates the business logic that constructs the event, with the logic that sends the event. The diagram below provides a recommended approach to design your publisher application. The publisher upstream integration will construct the event to ensure it conforms to the NEMS event specification.

NEMS provides limited validation of the message. As long as the client implements the right technology for the protocol, messages will be acknowledged successfully. NEMS does not validate the message headers or the payload of the message due to performance and data protection reasons. Therefore, it is important :

- payload is valid
- all mandatory headers are populated.

As publisher, it is important you understand the error codes that are generated from the NEMS broker and manage them as required to support your process. It is also recommended that you have a catch-all error routine in case an error code is unmanaged.

## Scalability

The publisher-client application should be scaled as appropriate to handle the event throughput it will need to process. The NEMS team will be responsible for ensuring the event broker has the capacity to process the required event loads. The team will work with publishers to ensure publisher workloads are understood so they can anticipate any throughput changes.  

You need to consider the impact introduced by integrating with NEMS. Your underlying systems might need to be scaled to handle additional load due to the architecture moving to the event-driven style. For example, if you intend to use thin events where subscribers call back to retrieve the record via an API, publishers need to ensure the API subscribers’ connect-to is fit for purpose.

If an event is published to the NEMS broker and there are 100 subscribers to that event, this could generate 100 requests to the callback API. If scalability measures are not implemented it could cause detrimental issues to downstream systems. A recommended approach is to implement a cache capability as part of the construction of the event message. That way when the API requests are made, the backend systems are protected.

![Callback Capability](Aspose.Words.524df83d-d8f1-4d17-ae1b-cae20f9b09de.002.png)

## Testing

The publisher should be responsible for defining the testing strategy to ensure:

- Messages published are meeting the requirements and quality standards.
- Business logics for publishing events and event handling meet the requirements.
- The publishing application meets performance and scalability requirements.
- The publishing system meets other functional and non-functional requirements.

NEMS supports the development lifecycle of the publishing system with a NEMS test environment. This environment is a shared environment used by various NEMS publishers and subscribers for their integration development. When using the test environment, please don’t other NEMS tenants.

We recommend you implement your tests with as little integration with NEMS as possible in order to validate your application against your requirements. You could use unit tests and/or mocks to test your application.

End-to-end tests are possible, depending on demand and planning. Since end-to-end testing is expensive, we recommend conducting it only when necessary.

## Disaster recovery

The NEMS service has a high availability service level with disaster recovery capabilities. It meets zero RPO requirements, which means no data loss in a disastrous scenario.  

There are no specific requirements of the publisher to support NEMS disaster recovery, other than from basic error handling. In the event of a disaster scenario, NEMS would be unavailable for a short period of time while the environment was recovered.  During this time, the publisher application will experience connection errors. Once the environment has been recovered, the publisher will automatically reconnect and should begin processing messages from the point of failure.

It is also important that the publisher can recover from failure to reduce the risk of losing or duplicating events. We recommend you design your disaster recovery process according to the RTO and RPO requirements, which will relate to the data loss you want to tolerate and the timeliness of your messages in a recovery.

##Traceability and Audit

The publisher should at least recording the `messageId`, `messageSubjectId` and `publishing timestamp` in your logs (or traces) to satisfy the end to end traceability requirements.