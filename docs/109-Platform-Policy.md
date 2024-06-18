---
title: "Platform Policy"
---

# National Event Management Service (NEMS) Platform Policy

## Overview

## Purpose

1. This policy establishes the rules for the use of the National Event Management Service to ensure its secure, efficient, and ethical use in alignment with Health New Zealand | Te Whatu Ora values.
2. This policy has been guided by the health sector principles as set out in the Pae Ora (Healthy Futures) Act 2022 (the Pae Ora Act) and enables Health NZ to support the Crown’s responsibilities under the Treaty of Waitangi / Te Tiriti o Waitangi (Te Tiriti). The health sector principles underpin the transformation of our health system to create a more equitable, accessible, cohesive, and people-centred system that will improve the health and wellbeing of all New Zealanders. This policy supports the Health System Principles as set out in the Pae Ora (Healthy Futures) Act 2022.

## Audience

1. This policy applies to all internal and external entities including Health NZ staff, contractors, developers, and third-party applications that will use the National Event Management Service including:

- Publishers: producers of events published on the platform
  - Health NZ publishers; or
  - External third-party collaborators.
- Subscribers: consumers subscribing to events published on the platform.
- The National Event Management Service operations and management team.
- The relevant Health NZ technical governance authority.

## Application

1. For this policy, the National Event Management Service is the event publishing, management and subscribing platform comprised of the following technology components:

- Solace PubSub+ SaaS product and deployed event brokers.
- Solace PubSub+ management operational oversight console.
- Logging and audit data stores for operational and regulatory purposes.
- The event topic catalogue and taxonomy.
- The CI/CD toolchain pipelines for development, deployment, and quality control.

## Background

1. The National Event Management Service improves accessibility to New Zealand health data through an event notification service. The purpose of the National Event Management Service is to provide a nationally managed operational environment where events are published and subscribed to by onboarded consumers within the New Zealand health sector.

## Definitions, translations and acronyms

1. The following definitions are used for the purposes of this policy:

|**Term**|**Definition / Description**|
| :- | :- |
|**API**|Application programming interface. An API is an interface that allows a software application to communicate with another software application.|
|**EDA**|Event-driven architecture (EDA) is a way of designing software where parts talk to each other by sending and receiving events. This lets them work independently, without waiting for each other, making the system more flexible and responsive.|
|**Loose coupling**|Design principle where components interact with each other with minimal dependencies, characteristic of EDA and pub/sub systems.|
|**Asynchronous API**|A communication method where a client initiates a request to a server and continues its operations without waiting for an immediate response, allowing for non-blocking processing, while the server manages the request and provides a response <a name="_int_crps4ifh"></a>at a later time.|
|**Pattern**|In architecture, a pattern refers to a reusable solution to a commonly occurring problem in design, providing a structured approach for addressing specific architectural challenges or requirements.|
|**Pub sub**|Short for publish/subscribe, this is a messaging pattern where senders (publishers) of messages do not directly communicate with specific receivers (subscribers). Messages are published to channels (topics) to which subscribers can subscribe, enabling asynchronous communication between components or systems.|
|**Business event**|Events represent significant activities or changes related to patient care, administrative processes, or other healthcare-related operations such as patient admissions or updates to a healthcare provider’s practicing certificate.|
|**Technical event**|Events related to the functioning, performance, or state of the underlying technical infrastructure or system supporting healthcare operations. E.g. platform errors or security alerts.|
|**Topic**|A digital channel where events are shared (published) and listened to (subscribed). It helps organise events based on what they are about. For instance, "Death" could be a topic covering diverse types of death-related events, like additions or edits.|
|**Eligibility**|Refers to the criteria a subscriber or publisher must meet to publish to or receive events for a specific topic.|
|**Thin event**|Refers to a lightweight, minimalistic event, containing only essential information necessary for notification or processing.|
|**Thick event**|Unlike its lean counterpart (thin event), a thick event contains more detailed information, including core data and metadata.|
|**Consumers of the platform**|Organisations using <a name="_int_sqyz2vxd"></a>the platform capability.|
|**Publisher**|A publisher is an application that generates and sends event messages. Publishers supply information about a subject without needing to know anything about the consumers.|
|**Subscriber**|A subscriber is an entity that consumes event messages. Subscribers consume information about a topic without needing to know anything else about the publishers except for the subject (name or topic) of the event messages.|

## Key principles

1. The following principles underpin this policy:

- The National Event Management Service platform provides nationally significant events that contribute value to the health sector by addressing health-related concerns for subscribers.
- Use of the National Event Management Service platform conforms to established EDA patterns and standards defined in the Health NZ API Standards and is governed by the appropriate and relevant Health NZ governance forum.
- Provides a common experience for organisations that are external or internal to Health NZ and wish to use digital services.
- Privacy and security by design and conformance at the point of consumption.

## Policy

1. The policy for the National Event Management Service to give effect to the principles is set out below:

## Nationally significant events support business problems with a health-related focus

1. In addition to events (topics) originating within Health NZ systems, the platform will also encompass broader events across the health sector, such as events originating in GP practice management systems (PMS).
1. Topics must be defined through an agreed analysis process to provide health-focused business events.
1. A prioritisation and impact analysis of new topics must be completed with clearly defined problem and benefit statements led by Health NZ with input and insights from the health sector.

## Use of the platform conforms to established EDA patterns and is governed by a central function

1. Consumers of the platform must conform to established EDA patterns and standards (refer to the Health NZ API Standards listed in the ‘Related policies, procedures, and resources’ section).
1. Designs to consume the platform will be reviewed and approved via a Health NZ governance process in accordance with all required privacy, security, and health data exchange policies.
1. Evidence of security and privacy approvals for publishing and consumption of events from the platform should be requested to confirm alignment to Health NZ policies.
1. One platform with one operator for all of Health NZ with reuse of the platform and its established implementation(s) for different but conformal patterns and use cases.

## A common experience for external and internal organisations wishing to use digital services

1. Subscribers will be onboarded as an organisation and for each additional event consumed using the prescribed onboarding process via the Digital Services Hub.
1. Publishers will be onboarded as an organisation and for each published event service using the prescribed onboarding process via the Digital Services Hub.

## Privacy and security by design and conformance at the point of consumption

1. Eligibility criteria to the event notification is determined by the nature of the event topic and the sensitivity of the underlying data resource.

- Each topic will be assessed for eligibility including additional access controls and exceptions as part of the topic requirements gathering and design process.
- Eligibility by default will be contingent on subscriber access to the underlying source data resource. For example, a subscriber is considered eligible for the death event if they have access to the National Health Index, which holds the death data.
- Exceptions or additions to the default eligibility will be defined in the schedule of the “Usage policy” (listed in section Related pPolicies, Pprocedures and rResources).
- Defining eligibility (including additional access controls and exceptions) is the responsibility of source data owner.
- Implementation of the eligibility, access controls and exceptions where feasible is the responsibility of the National Event Management Service team.

1. Subscribers must only action and retain events appropriate to their use, all other events must be securely discarded with an audit log to show the event was received and discarded.
1. Responsibility for consumer consent to publish events lies with the publishing systems, as these systems are the source of data. NEMS The National Event Management Service will support and facilitate this process by implementing access controls where feasible. Ultimate control over data consent and sharing rests with the respective publishing systems.
1. Ongoing security assurance of the National Event Management ServiceNEMS platform must be maintained by the following:

   1. Platform -level changes must be assessed to check for any security impacts.
   2. Regular access reviews (for all roles).
   3. Platform patch and vulnerability management.
   4. Annual penetration testing.
   5. Security incident monitoring and management.
   6. High-availability and dDisaster rRecovery to meet service levels.
   7. Backup and restoration tests.
   8. Security assurance reviews for any new provider/subscriber/topic onboarding.

## Roles and responsibilities

|**Role**|**Responsibilities**|
| :- | :- |
|**All users that publish or subscribe to events**|- Complying with this policy.|
|**Operators of the National Event Management Service platform**|- Complying with this policy.- Ensuring operational teams are familiar with this policy.- Support the governance and onboarding process in relation to this policy.|
|**People managers**|- Ensuring direct reports are familiar with this policy.|
|**Policy owner**|- Ensure non-compliance governance and onboarding process is followed where required. - Policy guidance and direction. - Alignment of policy to any changes in legislation. - Updating this policy in accordance with review timelines.|

## Support

1. Information relating to the National Event Management Service, onboarding and its use can be found here: [National Event Management Service (NEMS) – Health New Zealand | Te Whatu Ora](https://www.tewhatuora.govt.nz/preview/2e36ed009e29fedb/dd54b515b2bf24dc "https://www.tewhatuora.govt.nz/preview/2e36ed009e29fedb/dd54b515b2bf24dc")

## Non-compliance with policy

1. Failure to comply with this policy may breach the Usage Ppolicy and could result in suspension of event access, removal of connection keys, or termination of contracts.
1. Non-compliance with this policy must be by agreement using the onboarding process during the onboarding of the services being consumed.

## Monitor and review

1. Audits: publishers and subscribers of events must conduct regular audits of event usage to ensure they remain compliant with this policy and all relevant regulatory requirements.
1. Updates and revisions: Health NZ will periodically review and update this policy to incorporate any changes in technology, standards, or regulations impacting event consumption which may result in a policy change.
1. Indicators that measure the effectiveness of this policy are incorporated into routine internal audit undertaken by Health NZ on behalf of the policy owner.

## Related policies, procedures, and resources

1. National Event Management ServiceNEMS Usage pPolicy:

- [NEMS Subscriber Usage Policy (for organisations EXTERNAL to Health NZ) (sharepoint.com)](https://hauoraaotearoa.sharepoint.com/:w:/r/sites/2000084/_layouts/15/Doc.aspx?sourcedoc=%7B425F8594-D6B0-47CE-A6A6-77B6A20AE2FD%7D&file=NEMS%20Subscriber%20Usage%20Policy%20\(For%20External%20Te%20Whatu%20Ora%20Organisations\)%20V1.0.docx&action=default&mobileredirect=true)

1. Schedule of standards for conformance:

- [Async Patterns Introduction | Health New Zealand | Te Whatu Ora API Standards (digital.health.nz)](https://apistandards.digital.health.nz/api-development/Asynchronous%20APIs/Async%20Patterns/Intro/)

1. Government and health standards:

- [HISO 10029:2022 Health Information Security Framework](https://www.health.govt.nz/publication/hiso-100292015-health-information-security-framework)
- [HISO 10064:2017 Health Information Governance Guidelines](https://www.health.govt.nz/publication/hiso-100642017-health-information-governance-guidelines)
- [HISO 10083:2020 Interoperability Roadmap](https://www.tewhatuora.govt.nz/our-health-system/digital-health/data-and-digital-standards/approved-standards/interoperability-standards/#:~:text=Endpoint%20Naming%20Scheme-,HISO%2010083%3A2020%20Interoperability%20Roadmap,-Digital%20health%20can)
- New Zealand Digital Identity Management Standards
- [Digital Identity Services Trust Framework](https://www.digital.govt.nz/standards-and-guidance/identification-management/identification-management-standards/applying-the-standards/%22%20%EF%B7%9FHYPERLINK%20%22https:/www.digital.govt.nz/digital-government/programmes-and-projects/digital-identity-programme/trust-framework/)
- [New Zealand Information Security Manual (NZISM)](https://www.nzism.gcsb.govt.nz/#:~:text=The%20New%20Zealand%20Information%20Security%20Manual%20%28NZISM%29%20is,contractors%20and%20consultants%20who%20provide%20services%20to%20agencies.)

## <a name="_toc151021389"></a><a name="_toc161131095"></a>**Related legislation**

1. Related legislation:

- [Health Act 1956](https://www.bing.com/ck/a?!&&p=31b2597d690509faJmltdHM9MTY5OTkyMDAwMCZpZ3VpZD0xZWI3OWE5Yy1kZjQxLTZjNTMtMmE1Ni04OTM3ZGVjNDZkMTcmaW5zaWQ9NTE5NA&ptn=3&ver=2&hsh=3&fclid=1eb79a9c-df41-6c53-2a56-8937dec46d17&psq=Health+Act+1956&u=a1aHR0cHM6Ly93d3cubGVnaXNsYXRpb24uZ292dC5uei9hY3QvcHVibGljLzE5NTYvMDA2NS9sYXRlc3QvRExNMzA1ODQwLmh0bWw&ntb=1)
- [Health Information Privacy Code 2020](https://privacy.org.nz/privacy-act-2020/codes-of-practice/hipc2020/)
- [Official Information Act 1982](http://legislation.govt.nz/act/public/1982/0156/latest/DLM64785.html)
- [Privacy Act 2020](http://www.legislation.govt.nz/act/public/2020/0031/latest/LMS23223.html)
- [Public Rrecords Act 2005](https://www.legislation.govt.nz/act/public/2005/0040/latest/DLM345529.html)
- [Retention of Health Information Regulations 1996](https://www.legislation.govt.nz/regulation/public/1996/0343/latest/DLM225616.html)

|**OWNER TITLE:**||**DOC ID:**|**HNZXXXX**|||
| :- | :-: | :- | :-: | :- | :- |
|**PUBLISHED:**|MMM YYYY|**REVIEW DUE:**|MMM YYYY|**VERSION:**|1\.0|
|**IF THIS DOCUMENT IS PRINTED, IT IS VALID ONLY FOR THE DAY OF PRINTING**|**PAGE NO:**|1 of 3||||
