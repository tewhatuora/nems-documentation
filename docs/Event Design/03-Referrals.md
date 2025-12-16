# Outreach Referral Events

## Outreach Referral Events (technical design)

This is a technical design document for Outreach Referral (OR) events. The target audiences are those working on OR task events publisher (FHIR Task Service), Placer and Filler service applications, and NEMS implementation of these task events.

---

## Background

The Outreach Referral FHIR Task Service will be the central integration point to connect different services utilising the outreach capability by Whaihua. Together with the support of NEMS on task events, the FHIR workflow pattern H will be implemented to support the communications between the task placers and task fillers, see [Outreach Referral FHIR Task Solution Architecture Document](https://mohits.atlassian.net/wiki/spaces/FORT/pages/4073062700/Outreach+Referral+FHIR+Task+Solution+Architecture+Document).

---

## Process View

Outreach Referral solution is based on the events triggered by the state changes of the outreach referral requests. These events will be routed to the interested parties to enable the system to react on the request state changes and initiate the adequate downstream process.

#### ServiceRequest state diagram:

```
@startuml
active : The request is in force and ready to be acted upon.
onHold : The request (and any implicit authorization to act) has been temporarily withdrawn but is expected to resume in the future.
revoked : The request (and any implicit authorization to act) has been terminated prior to the known full completion of the intended actions. No further activity should occur.
completed : The activity described by the request has been fully performed. No further activity will occur.
[*] --> active : created
active --> active : claimed
active --> onHold : paused
active --> revoked : revoked
active --> active : updated
active --> completed: complete
onHold --> active : resumed
onHold --> revoked : revoked
onHold --> onHold : updated
revoked --> [*]
completed --> [*]
@enduml
```

---

## Topic Taxonomy

For outreach referral task events, the topic taxonomy structure follows the overall topic taxonomy structure:

```
careadmin/servicerequest/outreachreferral/{verb}/v1/{code}/{actioned-by}/{request-status}
```

### Table:

| # | Event Topic Field        | Field Type    | Value                                                                                                   | Description                                                                                                      |
|---|---------------------------|--------------|---------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------|
| 1 | service-domain           | Root         | careadmin                                                                                              | “careadmin” is the service domain of outreach referral request events                                           |
| 2 | resource                 | Root         | servicerequest                                                                                        | Aligned with FHIR ServiceRequest resource                                                                        |
| 3 | event category           | Root         | outreachreferral                                                                                      | Event category (outreach referral)                                                                               |
| 4 | verb (past tense)        | Root         | [created, claimed, updated, paused, resumed, revoked, completed]                                      | Event action, one of the values                                                                                  |
| 5 | version                  | Root         | v1                                                                                                     | Starting version                                                                                                  |
| 6 | code                     | Event Property| String value of intent code (e.g., “CervicalScreening”, “Immunization”, “BreastScreening”)             | Specifies the intent subject type. [FHIR ValueSet](https://fhir-ig-uat.digital.health.nz/shared-care/ValueSet-hnz-task-code-valueset.html) |
| 7 | actioned-by              | Event Property| String value of service/system which caused the event action (e.g., “whaihua”, “csr”, “bsa”)          | The service/system took the action and caused this event.                                                       |
| 8 | service-request-status   | Event Property| String value of the current status of the service request (e.g., “active”, “on-hold”, “completed”, “revoked”) | The status of the service request after the action.                                                             |

---

## Message Header (Event Metadata)

| Header        | Key Literal                               | Description                                | Required | Format/Values                                                                                     | Example                                      |
|--------------|-------------------------------------------|--------------------------------------------|----------|---------------------------------------------------------------------------------------------------|---------------------------------------------|
| ID           | solace-user-property-id                  | Message id, unique for each publisher     | ★        | GUID correlation ID                                                                               | 987298dd-c484-462f-a15d-f18a97267959       |
| Source       | solace-user-property-source              | Publisher URI reference                   | ★        | - [UAT](https://hip-uat.digital.health.nz/) <br/>- [Prod](https://hip.digital.health.nz/)         |                                             |
| Time         | solace-user-property-time                | UTC time when the message is published    | ★        | YYYY-MM-DDTHH:MM:SS                                                                               | 2024-11-30T18:54:43Z                       |
| Spec Version | version                                  | Version of the CloudEvents spec           | Optional | `{major}.{minor}`                                                                                 | 1.0                                         |
| Type         | solace-user-property-type                | Substring of the topic taxonomy           | ★        | `{root}/{version}`                                                                                | careadmin/servicerequest/outreachreferral/created/v1 |
| Subject      | solace-user-property-subject             | ServiceRequest Id                         | ★        | servicerequest id                                                                                 | servicerequest id                           |
| Content type | content-type / solace-user-property-datacontenttype | Content type of event data               | ★        | application/json                                                                                   | application/json                             |

---

## Message Payload

### ServiceRequest created
**Schema:**
```json
{
 "$schema": "https://json-schema.org/draft/2019-09/schema",
 "type": "object",
 "properties": {
   "serviceRequestId": { "type": "string", "description": "ServiceRequest ID" },
   "NHI": { "type": "string", "description": "NHI ID" },
   "performer": { "type": "string", "description": "assigned performer display value" },
   "eventTime": { "type": "string", "description": "time of eventing", "format": "date-time" }
 },
 "required": ["serviceRequestId", "NHI", "eventTime", "performer"]
}
```

**Example:**
```json
{
 "serviceRequestId": "xyz1234",
 "NHI": "ZGT56KB",
 "eventTime": "2025-04-23T18:25:43.511Z",
 "performer": "air"
}
```
