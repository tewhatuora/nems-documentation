---
title: "Enrollment Event Technical Design"
---

This a technical design document for the NEMS enrolment event. The target audiences are those working on enrolment publisher applications, enrolment subscriber applications, and NEMS implementation of enrolment events. 
# **Background**
The National Enrolment Service (NES) records the relationship of a patient to their provider for a particular health service. Changes to these relationships (“events”) are of interest to organisations and systems in the health sector. 
# **Process view**
Enrolment event process view:

~~~
flowchart LR
    A["NHI/NES Enrolment Change"] --> B("NHI Publisher")
    B -- Enrolment Event ---> C["NEMS"]
    C -- Enrolment Event --> D["Subscriber1 Connector"] & E["Subscriber2 Connector"] & F["Subscriber3 Connector"] 
    subgraph x["Subscriber Process"]
        y["Subscriber Connector"] --> W\{"Is Relevent"\} -- Yes --> z["Downstream Process"] 
        W --"No"-->v["Discard"]
    end
~~~

Enrolment events and event data:
~~~
classDiagram
    class Enrolment
    <<interface>> Enrolment
    Enrolment : enrolmentId
    Enrolment : NHI
    Enrolment : dormantNHIs[]
    Enrolment <|.. Created
    Enrolment <|.. Ended
    Enrolment <|.. Updated
    Ended:endReason
~~~

Note:

- An enrolment transfer should result in two enrolment events: an enrolment end event and an enrolment new event.
# **Topic taxonomy**
For enrolment events, the topic taxonomy structure follows the overall topic taxonomy structure:

service-domain/resource/event/verb/version/patient-district/facility-district/pho/enrolling-org/service-type

The topic fields are elaborated in the table below (with **dark-green** for root taxonomy; **light-green** for event property)

|**Enrolment Event Topic Field**|**Field Type**|**Value**|**Description**|
| :-: | :-: | :-: | :-: |
|service-domain|Root|careadmin|“careadmin” is the service domain of enrolment events|
|resource|Root|episodeofcare|Aligned with FHIR EpsodeOfCare resource|
|event category|Root|enrolment|Event category|
|verb (past tense)|Root|[created, ended, updated]|Event action, one of the values|
|version|Root|v1|Starting version|
|patient-district|Event Property|String value of DHB Code of patient’s physical address from NHI|DHB Code of patient’s physical address from NHI|
|facility-district|Event Property|String value of DHB Code of practice’s physical address from HPI Location|DHB Code of practice’s physical address from HPI Location|
|pho|Event Property|String value of HPI ORG ID of the Affiliated PHO of the GP Practice (uses PPA table)|HPI ORG ID of the Affiliated PHO of the GP Practice|
|enrolling-org|Event Property|String value of organisation ID of the enrolment|Organisation ID of the enrolment|
|service-type|Event Property|[“FLS”,”FLS-NF”,”LMC”,”WCTO”]|[NES Enrolment Type - HIP FHIR Common Terminology Guide v1.8.2 (digital.health.nz)](https://common-ig.hip.digital.health.nz/site/ValueSet-nes-enrolment-type-1.0.html)|

# **Message header (Event metadata)**

|**Header**|**Key Literal**|**Description**|**Required**|**Format/Values**|**Example**|
| :-: | :-: | :-: | :-: | :-: | :-: |
|ID|solace-user-property-id|Message id, unique for each publisher|✅ |GUID correlation ID|987298dd-c484-462f-a15d-f18a97267959|
|Source|solace-user-property-source|Publisher URI reference|✅ |[https://uat.nes.digital.health.nz](https://hip-uat.digital.health.nz/) for UAT [https://nes.digital.health.nz](https://hip.digital.health.nz/)  for prod| [https://uat.nes.digital.health.nz](https://hip-uat.digital.health.nz/) for UAT and [https://nes.digital.health.nz](https://hip.digital.health.nz/)  for prod|
|Time|solace-user-property-time|UTC time when the message is published|✅ |YYYY-MM-DDTHH:MM:SS|2024-11-30T18:54:43Z|
|Spec version|version|version of the CloudEvents spec|Optional|\{major\}.\{minor\}|1.0|
|Type|solace-user-property-type|substring of the topic taxonomy including root to version|✅ |\{root\}/\{version\}|careadmin/episodeofcare/enrolment/created/1.0.0|
|Subject|solace-user-property-subject|Enrolment ID|✅ |||
|Content type|solace-user-property-datacontenttype or content-type for REST API|Content type of event data|✅ |application/json|application/json|

## Message payload

## Event : Enrolment created

**Payload Schema**
~~~
{
  "$schema": "https://json-schema.org/draft/2019-09/schema",
  "type": "object",
  "properties": {
    "enrolmentId": {
      "type": "string",
      "description": "Enrolment ID",     
    },
    "NHI": {
      "type": "string",
      "description": "NHI ID",     
    },
    "dormantNHIs": {
      "type": "array",
      "items": {
        "type": "string",
      },
      "description": "Dormant NHI's"
    }
  },
  "additionalProperties": false,
  "required": [
    "enrolmentId",
    "NHI"
  ]
}
~~~

**Example**
~~~
{ 
    "enrolmentId": "xyz1234", 
    "NHI": "ZGT56KB", 
    "dormantNHIs": ["ZZZ0008"]
}
~~~


## Event : Enrolment ended

**Payload Schema**
~~~
{
  "$schema": "https://json-schema.org/draft/2019-09/schema",
  "type": "object",
  "properties": {
    "enrolmentId": {
      "type": "string",
      "description": "Enrolment ID",     
    },
    "NHI": {
      "type": "string",
      "description": "NHI ID",     
    },
    "dormantNHIs": {
      "type": "array",
      "items": {
        "type": "string",
      },
      "description": "Dormant NHI's"
    },
    "endReason": {
      "type": "string",
      "description": "Reason of ending enrolment",
      "enum": [
        "Transfer",
        "OptOut",
        "Died",
        "NotEligible",
        "LinkNHI",
        "Expire",
        "OrgEnd",
        "Overseas",
        "EnrolledInError"
      ]
    }
  },
  "additionalProperties": false,
  "required": [
    "enrolmentId",
    "NHI",
    "endReason"
  ]
}
~~~

**Example**
~~~
{
 "enrolmentId": "xyz1234",
 "NHI": "ZGT56KB",
 "dormantNHIs": ["ZZZ0008"],
 "endReason": "Transfer"
}
~~~