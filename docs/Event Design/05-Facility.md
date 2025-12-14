---
title: "Facility Event Technical Design"
---
  
This a technical design document for Health Identity HPI Facility NEMS events. The target audiences are those working on enrolment publisher application, enrolment subscriber applications, and NEMS implementation of HPI Facility events.  

# **Background**
Te Whatu Ora Health Identity Team maintains a register of facilities that deliver health services in the Health Provider Index system (HPI). 

HPI Facilities are operated by a registered practitioner (having HPI CPN) under the umbrella of an HPI-registered Organisation (having HPI Org ID).

When HPI facilities are created, or changes to HPI facilities are made with regards to their status, type, name, managing organisation, location or contact details, this information is recorded in HPI.

HPI facility current state information is required by 

Dependent Te Whatu Ora systems including Hospital Patient Administration Systems and DHB clinical systems. 

Crown entities including Accident Compensation Corporation

Hospital and private facilities (GP, Pharmacy) for HL7 messaging via Healthlink

Pharmacies for NZePS integration

GP Practices, Community Midwives and others for prescribing 
# **Process view**
Event process view:

flowchart LR
 
    A["HIP"] --> B("HIP Publisher")
    B -- HIP Event ---> C["NEMS"]
    C -- HIP Event --> D["Subscriber1 Connector"] & E["Subscriber2 Connector"] & F["Subscriber3 Connector"]
subgraph x["Subscriber Process"]
  end 

Events and event data:

classDiagram
  class Facility{
  <<Interface>>
  facilityId
  dormantFacilityIDs
  resourceVersion
  }
  class Created{
  }
  class Updated{
  }
  Facility <|.. Created
  Facility <|.. Updated


# **Topic taxonomy**
For facility eve|**Event Topic Field**|**Field Type**|**Value**|**Description**|
| :-: | :-: | :-: | :-: |
|service-domain|Root|“provideridentity”|“provider identity” is the service domain of facility events|
|resource|Root|“location”|The Location resource represents named Facilities at which an organisation provides health services [HPI Location - New Zealand HPI Implementation Guide v1.4.10](https://hpi-ig.hip-uat.digital.health.nz/StructureDefinition-HpiLocation.html) |
|event category|Root|“facility”|A physical location from which health goods and/or services are provided. They are also referred to as an HPI Facility.|
|verb|Root|created, updated|Event action, one of the values|
|version|Root|“v1”|Starting version|
|facility type|Event Property|alphanumeric|A coded value used to describe the type of healthcare facility (e.g. dhbhosp Public Hospital, a facility offering inpatient, outpatient and day patient services run by a DHB) [HPI Location Type - HIP FHIR Common Terminology Guide v1.9.5](https://common-ig.hip.digital.health.nz/site/ValueSet-hpi-location-type-1.0.html)|
|managing organisation|Event Property|HPI Org ID|The HPI organisation ID of the organisation that operates the facility. [Organization Identifier](https://hpi-ig.hip.digital.health.nz/Organization-GZZ956-B.html)|
|DHB|Event Property|HPI Org ID|The HPI organisation ID of the District Health Board in which the facility is located. [District Health Board Identifer - HL7® FHIR® New Zealand Base Implementation Guide v3.0.1](https://fhir.org.nz/ig/base/ValueSet-dhb.html)|nts, the topic taxonomy structure follows the overall topic taxonomy structure:

service-domain/resource/event/verb/version/facility-type/managing-organisation/DHB

The topic fields are elaborated in the table below (with Dark-green for root taxonomy; Light-green for event property)



# **Message header (Event metadata)**

|**Header**|**Key Literal**|**Description**|**Required**|**Format/Values**|**Example**|
| :-: | :-: | :-: | :-: | :-: | :-: |
|ID|solace-user-property-id|Message id, unique for each publisher|Required|GUID correlation ID|987298dd-c484-462f-a15d-f18a97267959|
|Source|solace-user-property-source|publisher URI reference|Required|[https://hip-uat.digital.health.nz](https://hip-uat.digital.health.nz/) for UAT [https://hip.digital.health.nz](https://hip.digital.health.nz/)  for prod| [https://hip-uat.digital.health.nz](https://hip-uat.digital.health.nz/) for UAT and [https://hip.digital.health.nz](https://hip.digital.health.nz/)  for prod|
|Time|solace-user-property-time|UTC time when the message is published|Required|YYYY-MM-DDTHH:MM:SS|2023-11-30T18:54:43Z|
|Spec Version|version|version of the CloudEvents spec|Optional|major.minor|1.0|
|Type|solace-user-property-type|substring of the topic taxonomy including root to version|Required|\{root\}/\{version\}|demographics/patient/death/new/v1.0.0|
|Subject|solace-user-property-subject|NHI number|Required|[A-Z]\{3\}([0-9]\{4\}|([0-9]\{2\}[A-Z]\{2\}))|ZZZ0008 ZXE24NV|
|Content type|solace-user-property-datacontenttype or content-type for REST API|Content type of event data|Required|application/json|application/jso|


## Message payload
HPI Facility ID

Dormant HPI Facility IDs

Resource version


## Event : created

**Payload Schema**

~~~
{
    "$schema": "https://json-schema.org/draft/2019-09/schema",
    "type": "object",
    "properties": {
      "facilityID": {
        "type": "string",
        "description": "Facility ID"     
      },
      "dormantFacilityIDs": {
        "type": "array",
        "items": {
          "type": "string"
        },
        "description": "Dormant Facility ID's"
      },
      "resourceVersion": {
        "type": "string",
        "description": "Resource Version"     
      }
    },
    "additionalProperties": false,
    "required": [
      "facilityID",
      "resourceVersion"
    ]
}	
~~~

**Example**

~~~
{
 "facilityID": "FZZ941-D",
 "dormantFacilityIDs": ["FZZ941-C"],
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
