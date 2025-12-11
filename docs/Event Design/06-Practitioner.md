---
title: "Practitioner Event Technical Design"
---


This a technical design document for HPI Practitioner NEMS event. The target audiences are those working on enrolment publisher application, enrolment subscriber applications, and NEMS implementation of HPI Practitioner events.  

# **Background**
Te Whatu Ora Health Identity Team maintains a register of practitioners that deliver health services, in the Health Provider Index system (HPI).

Registered practitioners are assigned an HPI Common Person Number (CPN) based on information provided periodically from the 18 Responsible Authorities as legislated under the Health Practitioners Competence Assurance Act | Ministry of Health NZ. 

When HPI CPNs are created, or changes to HPI CPNs are made with regards to their status, qualifications or personal details, this information is recorded in HPI.

HPI practitioner current state information is required by

Dependent Te Whatu Ora systems including Hospital Patient Administration Systems and DHB clinical systems.

Dependent multi-agency systems including Death Documents

# **Process view**
Practitioner event process view:

flowchart LR
 
    A["HIP"] --> B("HIP Publisher")
    B -- HIP Event ---> C["NEMS"]
    C -- HIP Event --> D["Subscriber1 Connector"] & E["Subscriber2 Connector"] & F["Subscriber3 Connector"]
subgraph x["Subscriber Process"]
  end

Practitioner events and event data:

classDiagram
  class Practitioner{
  <<Interface>>
  practitionerId
  dormantPractitionerIDs
  resourceVersion
  }
  class Created{
  }
  class Updated{
  }
  Practitioner <|.. Created
  Practitioner <|.. Updated


# **Topic taxonomy**
For practitioner events, the topic taxonomy structure follows the overall topic taxonomy structure:

service-domain/resource/event/verb/version/registration-authority

The topic fields are elaborated in the table below (with **dark-green** for root taxonomy; **light-green** for event property)

|**Event Topic Field**|**Field Type**|**Value**|**Description**|
| :- | :- | :- | :- |
|service-domain|Root|“provideridentity”|“provider identity” is the service domain of facility events|
|resource|Root|“practitioner”|The practitioner exposed by the HPI. This is the person who delivers healthcare or healthcare related services. The set of valid registration authority identifiers. [HPI Practitioner - New Zealand HPI Implementation Guide v1.4.10](https://hpi-ig.hip-uat.digital.health.nz/StructureDefinition-HPIPractitioner.html)  |
|event category|Root|“practitioner”|The set of valid registration authority identifiers.|
|verb|Root|created, updated|Event action, one of the values|
|version|Root|“v1”|Starting version|
|registration authority|Event Property|Registration Authority ID|The regulatory body responsible for the registration of health practitioners e.g. CH Chiropractic Board Register<br> [RaIdentifier - HIP FHIR Common Terminology Guide v1.9.5](https://common-ig.hip.digital.health.nz/site/ValueSet-hpi-ra-identifier-1.0.html) <br>Multiple events will be prompted where the practitioner is associated to multiple Registration Authorities|


# **Message header (Event metadata)**

|**Header**|**Key Literal**|**Description**|**Required**|**Format/Values**|**Example**|
| :- | :- | :- | :- | :- | :- |
|ID|solace-user-property-id|Message id, unique for each publisher|Required|GUID correlation ID|987298dd-c484-462f-a15d-f18a97267959|
|Source|solace-user-property-source|publisher URI reference|Required|[https://hip-uat.digital.health.nz](https://hip-uat.digital.health.nz/) for UAT [https://hip.digital.health.nz](https://hip.digital.health.nz/)  for prod| [https://hip-uat.digital.health.nz](https://hip-uat.digital.health.nz/) for UAT and [https://hip.digital.health.nz](https://hip.digital.health.nz/)  for prod|
|Time|solace-user-property-time|UTC time when the message is published|Required|YYYY-MM-DDTHH:MM:SS|2023-11-30T18:54:43Z|
|Spec Version|version|version of the CloudEvents spec|Optional|major.minor|1.0|
|Type|solace-user-property-type|substring of the topic taxonomy including root to version|Required|\{root\}/\{version\}|demographics/patient/death/new/v1.0.0|
|Subject|solace-user-property-subject|NHI number|Required|[A-Z]\{3\}([0-9]\{4\}|([0-9]\{2\}[A-Z]\{2\}))|ZZZ0008 ZXE24NV|
|Content type|solace-user-property-datacontenttype or content-type for REST API|Content type of event data|Required|application/json|application/jso|


## Message payload
HPI Practitioner ID

Dormant HPI Practitioner IDs

Resource version
## Event : Create

**Payload Schema**

~~~
{
    "$schema": "https://json-schema.org/draft/2019-09/schema",
    "type": "object",
    "properties": {
      "practitionerID": {
        "type": "string",
        "description": "Practitioner ID"     
      },
      "dormantPractitionerIDs": {
        "type": "array",
        "items": {
          "type": "string"
        },
        "description": "Dormant Practitioner ID's"
      },
      "resourceVersion": {
        "type": "string",
        "description": "Resource Version"     
      }
    },
    "additionalProperties": false,
    "required": [
      "practitionerID",
      "resourceVersion"
    ]
}
~~~

**Example**

~~~
{
 "practitionerID": "90ZZLP",
 "dormantPractitionerIDs": ["80ZZLA"],
 "resourceVersion": "1.4.10"
}
~~~



## Event : death/update

**Payload Schema**

As Above

**Example**

As Above


## Event : updated

**Payload Schema**

~~~
Same as above
~~~

**Example**
~~~
As above
~~~
