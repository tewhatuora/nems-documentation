---
title: Publisher & Subscriber Standards
sidebar_position: 1
---

## Contents

[Purpose](#_toc168971886)

[Audiences](#_toc168971887)

[NEMS Standards](#_toc168971888)

[AsyncAPI](#_toc168971889)

[Authentication and authorisation](#_toc168971890)

[Protocols](#_toc168971891)

[Connectivity](#_toc168971892)

[Topic taxonomy](#_toc168971893)

[Message metadata](#_toc168971894)

[Message payload](#_toc168971895)

[Message delivery mode and rrder](#_toc168971896)

[FHIR subscription](#_toc168971897)

[Network](#_toc168971898)

## <a name="_toc168971886"></a>Purpose

This document represents a list of technological and technical standards of the National Event Management Service (NEMS) platform for its publishers, subscribers, and NEMS operators to adhere to in their development and operations.

The NEMS Standards adhere to the Health New Zealand | Te Whatu Ora <a name="_int_bidzchui"></a>[API Standards:](https://apistandards.digital.health.nz/), including the AsyncAPI Standards (work in progress), and service level standards.

## <a name="_toc168971887"></a>Audiences

The NEMS Standards are aimed at those considering, designing, developing, or planning to develop software to produce or consume event notifications; as well as the operators of the platform to manage the development, operation and maintenance of the platform.

## <a name="_toc168971888"></a>NEMS Standards

### <a name="_toc168971889"></a>AsyncAPI

NEMS adheres to the AsyncAPI specification standard. The NEMS API (AsyncAPI) shall be published to the Digital Services Hub.

## <a name="_toc168971890"></a>Authentication and authorisation

Authentication and authorisation to use the NEMS platform is managed by the IdP (Identity Provider) integration within the Health NZ Azure AD (Microsoft Entra ID) team.

This authentication and authorisation is for all client application connections, including publishers and subscribers, as well as access (human & machine) to the platform portal for operational purposes.

The authentication and authorisation follows the OAuth2.0 standard with client credential flow for client applications; and OIDC standard for platform portal access (including the Solace and Solace Datadog instances).

## <a name="_toc168971891"></a>Protocols

NEMS supports the event notification protocols listed below with underlying Solace platform:

- SMF (Solace Message Format)
- AMQP
- MQTT
- REST
- Websocket.

REST is the preferred protocol for publishers; SMF for subscribers.

## <a name="_toc168971892"></a>Connectivity

- Publishers – HTTPS based publisher API endpoint.
- Subscribers – TCPS based JMS style connectivity.

## <a name="_toc168971893"></a>**Topic taxonomy**

Topic taxonomy represents the event topic hierarchies to deal with large event data sets. The NEMS topic taxonomy has the following structure:

![NEMS Topic Taxonomy](Aspose.Words.d4f32979-9f2a-43ab-99d2-0c27a89d7f97.001.png)

See Topic Taxonomy

## <a name="_toc168971894"></a>Message metadata

NEMS message metadata adheres to the CloudEvents specification [Cloud Events Specification](https://cloudevents.io/).

For the Death Event, the message header specification is as follows: Death Event Message Header.

## <a name="_toc168971895"></a>Message payload

The NEMS message payload should adhere to a ‘thin’ message principle, meaning limited details of the event content are contained in the notification payload. The payload, if any, should be in json format.

The event should consistently contain the minimum information and leverage obfuscation where necessary, especially for those events containing sensitive data. Event consumers should rely on the APIs of the event-producing services for data retrieval and enrichment, rather than the notification payload.

As an example, for Death Event, the message payload includes deathDate and callbackUrl

For more details about death event message payload: Payload.

## <a name="_toc168971896"></a>Message delivery mode and order

NEMS uses “Guaranteed Messaging” delivery mode to ensure successful message delivery between the publisher and subscriber.

The messages are delivered in the order they were published.

## <a name="_toc168971897"></a>FHIR subscription

NEMS will support Fast Healthcare Interoperability Resources (FHIR) subscription as a part of the FHIR standards.

## <a name="_toc168971898"></a>Network

The publisher sends events to the REST-based event publishing endpoint, which is a Solace event broker endpoint with port 9443.

The subscriber connects to the Solace broker SMF TLS/SSL at port 55443. For AMQP, MQTT and other protocols, Solace default ports are used.
