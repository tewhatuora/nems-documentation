---
title: "NEMS Technical Instructions for Subscribers"
---

This document provides technical instructions for subscribers to implement the integration application connecting to the National Event Management Service (NEMS), enabling your organisation to receive events of national significance in real-time. This guide is applicable to health organisations or health application vendors that support the health sector in Aotearoa New Zealand.

NEMS mandates the OAuth 2.0 open standard to authenticate to the NEMS broker. While this guide will walk you through the technical aspects of the authentication process, it is not intended as an OAuth tutorial. It assumes the reader is familiar with the use of OAuth and how to implement it using their technology of choice.

## Getting started

Before you start, you will need to have registered your application with the NEMS team and have the following information available:  

- Host             URL of the message broker
- VPN Name         The name of the NEMS broker
- Queue Name       The name of the queue for the event you are consuming
- Token Server     The OAuth server used to renew your token
- Client ID        Your Client ID used for getting the OAuth token
- Client Secret    Your Client Secret used for getting the OAuth token
- Scope            Your Scope used for getting the OAuth token
- Issuer           Used to establish a connection with the NEMS broker

Initially, you will receive this information for the NEMS test broker. This is an environment where you can receive production like events with simulated data. This environment can also be used for completing your end-to-end integrations. Once testing is completed to satisfaction, the NEMS team will release the credentials for the production environment.

## Subscriber reference implementations

You can use your technologies and programming languages of choice to implement the NEMS integration. NEMS provides the reference implementations of containerised java and .net integration applications of NEMS.

Please note these are examples only and you should consult the documentation of your chosen library.

- [Java reference implementation](https://github.com/tewhatuora/nems-subscriber-java)

- [.Net reference implementation](https://github.com/tewhatuora/nems-subscriber-dotnet)

## Configure your network

The NEMS event broker is publicly available and requires outbound ports to be accessible to subscribers to make the connection to the NEMS event broker. The connectivity details will be provided to you once your NEMS onboarding request has been approved.

## Connect and authenticate

### Obtaining the ID and Access Tokens

Your connection client id and credential are provided to you if you have completed the NEMS onboard process. As a subscriber you will have the following responsibilities regarding OAuth credentials:

1. Ensure confidential authentication details such as secrets are stored and managed securely.
2. Manage the life cycle of secrets. They must be renewed prior to expiry.

   **Note**: Renewal is currently a manual process via the NEMS support team, but an automated process is under development.

### Connecting to NEMS

Connecting to a NEMS event is a two-step process.

1. Connect to the broker
2. Connect to the queue.

To authenticate to NEMS the client application must implement OAuth 2.0 Client Credential flow. The GitHub code samples provide the connectivity logic for you; however, it is important to understand the connectivity workflow for your implementation.

If the application properties have been populated correctly the code below will connect your subscriber application to the NEMS broker.

~~~Java

final MessagingService messagingService = EventUtil.ConnectOAuth();

~~~

The following code snippet renews the access token and establishes a connection to NEMS with the following commands.

~~~Java

String accessToken = RestUtil.RenewToken(TOKEN_SERVER, CLIENT_ID, CLIENT_SECRET, SCOPE);

final MessagingService messagingService = MessagingService.builder(ConfigurationProfile.V1)
   .fromProperties(SOLACE_PROPERTIES)
   .withAuthenticationStrategy(OAuth2.of(accessToken).withIssuerIdentifier(ISSUER))
   .build();

~~~

OAuth 2.0 access tokens are ephemeral and typically expire after a short period. When the token expires your client will be disconnected. To mitigate this issue, the sample code will listen for a reconnection event. When that happens, it will renew the token and update the connection properties.

~~~Java

public void onReconnecting(ServiceEvent e) {
   String reconnectToken = RestUtil.RenewToken(TOKEN_SERVER, CLIENT_ID, CLIENT_SECRET, SCOPE);
   messagingService.updateProperty(SolaceProperties.AuthenticationProperties.SCHEME_OAUTH2_ACCESS_TOKEN,
      reconnectToken);
            }

~~~

Once successfully connected to the broker, the client application needs to connect to the queue. As part of the onboarding process, NEMS will provide you the queue details and apply the appropriate access controls to the subscriber queue based on their requirements and approvals.

The sample code used to connect to the queue is provided below.

~~~Java

final PersistentMessageReceiver receiver = messagingService
   .createPersistentMessageReceiverBuilder()
   .build(Queue.durableExclusiveQueue(QUEUE\_NAME));

~~~

## Consuming NEMS events

OOnce a connection to NEMS has been established, your application can begin consuming the events that it has been authorised to receive.

Event information is contained within the event metadata and payload. Your application can retrieve and process this information to support downstream business processes, workflows, and integrations.

- [NEMS - Standards Reference](/docs/100-PubSub%20Standards.md)

- [NEMS Event Detail e.g. Death Event](/docs/Event%20Design/01-DeathEventTechnical.md)

## Testing

NEMS provides a test event broker environment that allows organisations to test and validate their subscriber applications before moving to production.

The test environment can also be used to support ongoing development, testing, and release activities throughout the application lifecycle.

We recommend using mocked events in unit tests to validate your NEMS event consumption logic once your connection to NEMS has been established.

This approach reduces dependency on the NEMS test environment and supports a more efficient development and testing process.
