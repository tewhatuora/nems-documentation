---
title: "NEMS Technical Instructions for Publishers"
---

This guide explains how to connect to the National Event Management Service (NEMS), enabling your organisation to produce events of national significance. This document is applicable to health organisations or health application vendors that support the health sector in Aotearoa New Zealand.

## Getting started

Before you start, you will need to have registered your application with the NEMS team and have the following information available:

- Host            URL of the message broker
- VPN Name        The name of the NEMS broker
- Topic Name      The name of the topic you are publishing to
- Token Server    The OAuth server to renew your token
- Client ID       Your client ID used for getting the OAuth token
- Client Secret   Your client secret used for getting the OAuth token
- Scope           The scope to renew your OAuth token.

Initially, you will receive this information for the NEMS test broker. This environment supports your integration with NEMS for event publishing. Once your development is tested and ready for production, the NEMS team will release the credentials for the NEMS production environment for your production release.

## Configure your network

The NEMS event broker is publicly available and requires an internet connection to be accessible to the NEMS to publish to the NEMS event broker. You can choose a TCP connection to use the native messaging protocols or publish to the NEMS REST endpoint. For this the following target servers and ports are required.

|**Protocol**|**Source**|**Target**|**Connection**|
| :-: | :- | :- | :- |
|Native|NEMS production environment |api.nems.digital.health.nz|TCP 55443|
|Native|NEMS test environment|api.test.nems.digital.health.nz|TCP 55443|
|REST|NEMS production environment|api.nems.digital.health.nz|HTTP 9443|
|REST|NEMS test environment|api.test.nems.digital.health.nz|HTTP 9443|

## Connect and authenticate

The NEMS Publisher application will connect, authenticate, and publish the event messages. It will require the NEMS connection information provided as part of the NEMS application process.

## Obtaining the ID and access tokens

Publishers need to authenticate the publishing application to connect to NEMS. NEMS mandate the OAuth2.0 Client Credential flow regardless of the connectivity or protocols.

Your connection client ID and credential are provided to you if you have completed the NEMS onboarding process. As a publisher you will have the following responsibilities regarding OAuth credentials:

1. Ensure confidential authentication details such as secrets are stored and managed securely.
2. Manage the life cycle of secrets. They must be renewed prior to expiry.

   **Note**: Renewal is currently a manual process via the NEMS service desk, but an automated process is under development.

## Connecting to NEMS

Connecting to a NEMS event is a 2-step process.

1. Connect to the broker
2. Publish to a topic

Regardless of the chosen protocol the publisher wants to implement, an OAuth token must be acquired to establish a connection.

Below is the code snippet to demonstrate the initialisation of NEMS connection.

~~~Java

final MessagingService messagingService = EventUtil.ConnectOAuth();

~~~

OAuth 2.0 access tokens are ephemeral. When the token expires your client will be disconnected. To mitigate this issue the sample code will listen for a reconnection event, when that happens it will renew the token and update the connection properties.

~~~Java

public void onReconnecting(ServiceEvent e) {
   String reconnectToken = RestUtil.RenewToken(TOKEN_SERVER, CLIENT_ID, CLIENT_SECRET, SCOPE);
   messagingService.updateProperty(SolaceProperties.AuthenticationProperties.SCHEME_OAUTH2_ACCESS_TOKEN,
      reconnectToken);
}

~~~

## Publishing messages

Once successfully connected to the broker the client application needs to connect publish the message to the topic. If your credentials have the privileges to publish to the desired topic you can publish your message.

The same code used to publish a message to a topic is provided below.

~~~Java

String topicString = "nems/sample/topic";
publisher.publish(message,Topic.of(topicString));

~~~

You will need to construct the event message by typically populating the message headers and construct message payload according to the event message specification.

Each event type has its own event specification, which is co-designed by the publisher team and the NEMS team. The event specification should be designed and made available for your development. NEMS guidelines for publishers provides more details on this.

## Testing

NEMS has a test event broker environment available to you. This allows you to test your publishing systems prior to release it into production. It facilitates and support your publishing application development lifecycle.

We recommend you implement your unit tests with mocks to test your application logics of producing NEMS event. Once you have developed your NEMS connection, you should consider reducing the dependency to the NEMS test environment in your development and testing process.
