---
title: "Death Event Technical Design"
---

This a technical design document for NEMS death event. The target audiences are those working on death event publisher applications, death event subscriber applications, and NEMS implementation of death events.

## **Background**

The NHI system process and record the patient information, including death. Death information is of interest to various stakeholders in the health sector, including patient administration systems (PAS), assisted dying service (ADS) and others.

## **Process view**

Death event process view:

flowchart LR

~~~text

    A["Death Record"] --> B("NHI Publisher")  
    B -- Death Event ---> C["NEMS"]      
    C -- Death Event --> D["Subscriber1 Connector"] & E["Subscriber2 Connector"] & F["Subscriber3 Connector"]  
subgraph x["Subscriber Process"]  
    y["Subscriber Connector"] --> W{"Is Relevent"} -- Yes --> z["Downstream Process"]   
    W --"No"-->v["Discard"]  
  end  

~~~

Death events and event data:

~~~text

classDiagram
    class Death  
    &lt;&lt;interface&gt;&gt; Death  
    Death : callbackUrl  
    Death &lt;&#124;.. New  
    New : deathDate  
    Death &lt;&#124;.. Update  
    Update : deathDate  
    Death &lt;&#124;.. Delete  

~~~

## **Topic taxonomy**

For death events, the topic taxonomy structure follows the overall topic taxonomy structure:

service-domain/resource/event/verb/version/event-properties

The topic fields are elaborated in the table below (with **dark-green** for root taxonomy; **light-green** for event property)

|**Enrolment Event Topic Field**|**Field Type**|**Value**|**Description**|
| :-: | :-: | :-: | :-: |
|service-domain|Root|“demographics”|Healthcare service domain|
|resource|Root|“patient”|Aligned with FHIR EpsodeOfCare resource|
|event category|Root|“death”|Event category|
|verb|Root|Variable: new, edit, delete|Event action, one of the values|
|version|Root|“0.1.0”|Starting version|
|District|Event Property|8 character code or "null" (lowercase)|Location of the district relating to the person’s primary residential address. [Code Tables](https://www.tewhatuora.govt.nz/our-health-system/data-and-statistics/nz-health-statistics/data-references/code-tables/)common-code-tables#district-health-board-code-table |
|Domicile|Event Property|4 character district code or "null" (lowercase)| Domicile code, representing a person’s primary residential address. [Domicile Codes](https://fhir.org.nz/ig/base/CodeSystem-domicile-code.html) |
|GP Practice|Event Property|8 character code or "null" (lowercase)|The active GP practice of the deceased healthcare user. [Facility Codes](https://www.tewhatuora.govt.nz/our-health-system/data-and-statistics/nz-health-statistics/data-references/code-tables/common-code-tables#facility-code-table) **Note**: Not all healthcare users have a GP practice. Where no GP practice exists for the NHI, this field will be "**null**"|
|NHI ID|Event Property|7 character code or "null" (lowercase)|Identification number (NHI number) of the deceased healthcare user.**Note**: A death event will be generated for live and dormant NHIs|

## **Message header (Event metadata)**

|**Header**|**Key Literal**|**Description**|**Required**|**Format/Values**|**Example**|
| :-: | :-: | :-: | :-: | :-: | :-: |
|ID|solace-user-property-id|Message id, unique for each publisher|Required|GUID correlation ID|987298dd-c484-462f-a15d-f18a97267959|
|Source|solace-user-property-source|publisher URI reference|Required|[https://hip-uat.digital.health.nz](https://hip-uat.digital.health.nz/) for UAT [https://hip.digital.health.nz](https://hip.digital.health.nz/)  for prod| [https://hip-uat.digital.health.nz](https://hip-uat.digital.health.nz/) for UAT and [https://hip.digital.health.nz](https://hip.digital.health.nz/)  for prod|
|Time|solace-user-property-time|UTC time when the message is published|Required|YYYY-MM-DDTHH:MM:SS|2023-11-30T18:54:43Z|
|Spec Version|version|version of the CloudEvents spec|Optional|major.minor|1.0|
|Type|solace-user-property-type|substring of the topic taxonomy including root to version|Required|\{root\}/\{version\}|demographics/patient/death/new/v1.0.0|
|Subject|solace-user-property-subject|NHI number|Required|[A-Z]\{3\}([0-9]\{4\}\|([0-9]\{2\}[A-Z]\{2\}))|ZZZ0008 ZXE24NV|
|Content type|solace-user-property-datacontenttype or content-type for REST API|Content type of event data|Required|application/json|application/jso|

## Message payload

## Event : death/new

### Payload Schema

~~~JSON

{
  "$schema": "https://json-schema.org/draft/2019-09/schema",
  "type": "object",
  "properties": {
    "callbackUrl": {
      "type": "string",
      "description": "Call back url for deseased patient record",     
    },
    "deathDate": {
      "type": "string",
      "description": "Death date following the FHIR primitive date data type definition. This can be date or partial date.",
      "pattern": "^([0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)(-(0[1-9]|1[0-2])(-(0[1-9]|[1-2][0-9]|3[0-1]))?)?$",
  }
  },
  "additionalProperties": false,
  "required": [
    "callbackUrl",
    "deathDate",
  ]
}

~~~

### Example

~~~JSON

{
  "$schema": "https://json-schema.org/draft/2019-09/schema",
  "type": "object",
  "properties": {
    "callbackUrl": {
      "type": "string",
      "description": "Call back url for deseased patient record",     
    },
    "deathDate": {
      "type": "string",
      "description": "Death date following the FHIR primitive date data type definition. This can be date or partial date.",
      "pattern": "^([0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)(-(0[1-9]|1[0-2])(-(0[1-9]|[1-2][0-9]|3[0-1]))?)?$",
  }
  },
  "additionalProperties": false,
  "required": [
    "callbackUrl",
    "deathDate",
  ]
},
{
 "callbackUrl": "https://api.hip-uat.digital.health.nz/fhir/nhi/v1/Patient/ZGT56KB",
 "deathDate": "2023-11",
}

~~~

## Event : death/update

### Payload Schema

As Above

### Example

As Above

## Event : death/delete

**Payload Schema**

~~~JSON

{
 "$schema": "https://json-schema.org/draft/2019-09/schema",
 "type": "object",
 "properties": {
 "callbackUrl": {
 "type": "string",
 "description": "Call back url for deseased patient record", 
},
 },
 "additionalProperties": false,
 "required": [
 "callbackUrl",
 ]
}

~~~

**Example**

~~~text

TBD

~~~

## **AsyncAPI Spec**

~~~YAML

components:
  schemas:
    DeathNotice:
      $schema: "http://json-schema.org/draft-07/schema"
      description: "This document records the death of a patient"
      x-ep-schema-state-name: "DRAFT"
      x-ep-schema-name: "DeathNotice"
      title: "Death Notice"
      type: "object"
      x-ep-application-domain-id: "oto0lsyymf1"
      x-ep-schema-version-displayname: ""
      x-ep-shared: "true"
      x-ep-application-domain-name: "Demographics"
      x-ep-schema-state-id: "1"
      examples:
        - callbackUrl: "https://api.hip-uat.digital.health.nz/fhir/nhi/v1/Patient/ZAT2348"
          deathDate: "2016-10-18"
        - callbackUrl: "https://api.hip-uat.digital.health.nz/fhir/nhi/v1/Patient/ZAT2348"
          deathDate: "2016-10"
        - callbackUrl: "https://api.hip-uat.digital.health.nz/fhir/nhi/v1/Patient/ZAT2348"
          deathDate: "2016"
      additionalProperties: false
      properties:
        callbackUrl:
          description: "The URL of the patient resource"
          optional: false
          type: "string"
        deathDate:
          format: "([0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)(-(0[1-9]|1[0-2])(-(0[1-9]|[1-2][0-9]|3[0-1]))?)?"
          description:
            "Death date following the FHIR primitive date data type definition.\
            \ This can be the full date or partial date of year and month"
          optional: true
          type: "string"
  messages:
    DeathNotice:
      x-ep-event-version-displayname: ""
      payload:
        $ref: "#/components/schemas/DeathNotice"
      x-ep-event-name: "DeathNotice"
      description: ""
      x-ep-application-domain-id: "oto0lsyymf1"
      schemaFormat: "application/vnd.aai.asyncapi+json;version=2.0.0"
      contentType: "application/json"
      x-ep-event-state-id: "1"
      x-ep-event-state-name: "DRAFT"
      x-ep-shared: "true"
      x-ep-application-domain-name: "Demographics"
      headers:
        type: object
        required:
          - content-type
          - solace-user-property-id
          - solace-user-property-source
          - solace-user-property-type
          - solace-user-property-subject
          - solace-user-property-time
          - solace-user-property-datacontenttype
        properties:
          content-type:
            type: string
            description: "Content type, used for REST only"
            example: application/json
          solace-user-property-id:
            type: string
            description: this is the event id provided by the publisher
            example: 80fb8f56-1da3-48a4-a33d-bc4b14e15563
          solace-user-property-source:
            description: "This is the source organisation from where the event originated from."
            type: string
            example: https://hip.uat.digital.health.nz
          solace-user-property-time:
            description: "The timestamp when the event was created by the publisher"
            type: string
            format: date-time
          solace-user-property-subject:
            description: "This is the subject for the event, e.g. patient NHI."
            type: string
            example: ZAT2348
          solace-user-property-type:
            description: "Provides metadata for the type of event"
            type: string
            example: demographics/patient/death/new/1.0.0
          solace-user-property-datacontenttype:
            description: "Provides metadate for the type of event"
            type: string
            example: application/json
          solace-user-property-version:
            description: "AsyncAPI version"
            type: string
            example: v1.0
channels:
  demographics/patient/death/{verb}/0.1.0/{district}/{domicle}/{gp_practice}/{nhi_id}:
    subscribe:
      message:
        $ref: "#/components/messages/DeathNotice"
    parameters:
      nhi_id:
        schema:
          type: "string"
        x-ep-parameter-name: "nhi_id"
      gp_practice:
        schema:
          type: "string"
        x-ep-parameter-name: "gp_practice"
      district:
        schema:
          type: "string"
        x-ep-parameter-name: "district"
      verb:
        schema:
          type: "string"
          enum:
            - "edit"
            - "new"
            - "delete"
        x-ep-enum-state-name: "DRAFT"
        x-ep-enum-version-displayname: ""
        x-ep-enum-name: "Death Verbs"
        x-ep-enum-state-id: "1"
        x-ep-application-domain-id: "oto0lsyymf1"
        x-ep-shared: "true"
        x-ep-parameter-name: "verb"
        x-ep-application-domain-name: "Demographics"
      domicle:
        schema:
          type: "string"
        x-ep-parameter-name: "domicle"
asyncapi: "2.5.0"
info:
  x-ep-state-name: "DRAFT"
  title: "Death Notice"
  x-ep-application-domain-id: "oto0lsyymf1"
  version: "0.1.0"
  x-ep-state-id: "1"
  x-ep-application-domain-name: "Demographics"
  x-ep-shared: "false"

~~~
