---
title: "NHI Event Technical Design"
---

This a technical design document for NEMS NHI event. The target audiences are those working on NHI event publisher applications, NHI event subscriber applications, and NEMS implementation of NHI events.

## **Background**

The NHI system process and record the patient information, including NHI. NHI information is of interest to various stakeholders in the health sector, including patient administration systems (PAS), assisted dying service (ADS) and others.

## **Process view**

NHI event process view:

```mermaid
flowchart LR
    A["NHI Record"] --> B("NHI Publisher")
    B -- NHI Event ---> C["NEMS"]
    C -- NHI Event --> D["Subscriber1 Connector"] & E["Subscriber2 Connector"] & F["Subscriber3 Connector"]
subgraph x["Subscriber Process"]
    y["Subscriber Connector"] --> W{"Is Relevent"} -- Yes --> z["Downstream Process"]
    W --"No"-->v["Discard"]
  end
```

NHI events and event data:

```mermaid
---
title: Class Diagram
---
classDiagram
    class NHI  
    <<interface>> NHI  
    NHI : callbackUrl  
    NHI <|.. New  
    New : NHIDate  
    NHI <|.. Update  
    Update : NHIDate  
    NHI <|.. Delete  
```

## **Topic taxonomy**

For NHI events, the topic taxonomy structure follows the overall topic taxonomy structure:

service-domain/resource/event/verb/version/event-properties

The topic fields are elaborated in the table below 

|**Enrolment Event Topic Field**|**Field Type**|**Value**|**Description**|
| :-: | :-: | :-: | :-: |
|service-domain|Root|“demographics”|Healthcare service domain|
|resource|Root|“patient”|Aligned with FHIR EpisodeOfCare resource|
|event category|Root|Address<BR/>Contact<br/>AgeGroup<BR/>Demographics<BR/>Linking<BR>Registration<BR/>Birth|Event Category|
|verb|Root|Variable: new, edit, delete|Event action, one of the values|
|version|Root|“0.1.0”|Starting version|
|District|Event Property|8 character code or "null" (lowercase)|Location of the district relating to the person’s primary residential address. [Code Tables](https://www.tewhatuora.govt.nz/our-health-system/data-and-statistics/nz-health-statistics/data-references/code-tables/)|
|Domicile|Event Property|4 character district code or "null" (lowercase)| Domicile code, representing a person’s primary residential address. [Domicile Codes](https://fhir.org.nz/ig/base/CodeSystem-domicile-code.html) |
|GP Practice|Event Property|8 character code or "null" (lowercase)|The active GP practice of the deceased healthcare user. [Facility Codes](https://www.tewhatuora.govt.nz/our-health-system/data-and-statistics/nz-health-statistics/data-references/code-tables/common-code-tables#facility-code-table) **Note**: Not all healthcare users have a GP practice. Where no GP practice exists for the NHI, this field will be "**null**"|
|AgeGroup|Event Property|Infant<br/>Child<br/>Adolescence<br/>Adult<br/>Senior|AgeGroup of NHI|

## **Message header (Event metadata)**

|**Header**|**Key Literal**|**Description**|**Required**|**Format/Values**|**Example**|
| :-: | :-: | :-: | :-: | :-: | :-: |
|ID|solace-user-property-id|Message id, unique for each publisher|Required|GUID correlation ID|987298dd-c484-462f-a15d-f18a97267959|
|Source|solace-user-property-source|publisher URI reference|Required|[https://hip-uat.digital.health.nz](https://hip-uat.digital.health.nz/) for UAT [https://hip.digital.health.nz](https://hip.digital.health.nz/)  for prod| [https://hip-uat.digital.health.nz](https://hip-uat.digital.health.nz/) for UAT and [https://hip.digital.health.nz](https://hip.digital.health.nz/)  for prod|
|Time|solace-user-property-time|UTC time when the message is published|Required|YYYY-MM-DDTHH:MM:SS|2023-11-30T18:54:43Z|
|Spec Version|version|version of the CloudEvents spec|Optional|major.minor|1.0|
|Type|solace-user-property-type|substring of the topic taxonomy including root to version|Required|\{root\}/\{version\}|demographics/patient/NHI/new/v1.0.0|
|Subject|solace-user-property-subject|NHI number|Required|[A-Z]\{3\}([0-9]\{4\}\|([0-9]\{2\}[A-Z]\{2\}))|ZZZ0008 ZXE24NV|
|Content type|solace-user-property-datacontenttype or content-type for REST API|Content type of event data|Required|application/json|application/jso|

## Message payload

## Event : NHI Event/new

### Payload Schema

~~~JSON

{
  "$schema": "https://json-schema.org/draft/2019-09/schema",
  "type": "object",
    "properties": {
      "NHI": {
        "type": "string",
        "description": "NHI"     
      },
  },
  "additionalProperties": false,
  "required": [
    "NHI"
  ]
}

~~~

### Example

~~~JSON

{
 "NHI": "90ZZLP"
}

~~~

## Event : NHI Event/update

### Payload Schema

As Above

### Example

As Above

