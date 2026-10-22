---
title: "Simple POCT Result Event - Technical Design"
---
# Simple POCT Result Event - Technical Design

This is a technical design document for the NEMS **Simple POCT Result event** (Point of Care Test).

The publisher system is the **Health NZ FHIR Server**, and the initial subscriber system will be the **Northern Region's Eclair system**. The national **Diagnostic Data Repository (DDR)** may also become a future subscriber to this event.

## Background

[Requirements - POCT Upload Solutions - Hira Programme - Confluence](https://3dhbictservice.atlassian.net/wiki/spaces/HIRAP/pages/4008247575)

## Process View

1. User submits the POCT form via Provider View.
2. Data is stored in the FHIR Server.
3. The FHIR Server publishes a NEMS event.
4. NEMS distributes the event to the subscriber.
5. The API receives the event notification via the CloudHub proxy NEMS subscriber.
6. The API calls the FHIR Server API to retrieve the actual POCT result.
7. The API transforms the result into HL7 format and loads it into Eclair/TestSafe.

### TBC Events and Event Data

> **Note:** All **POCT Result** submissions via the *Viral Hepatitis Point of Care Test* FHIR form will result in a NEMS event notification being published.

---

## Topic Taxonomy

For **POCT Result** events, the topic taxonomy follows the overall NEMS topic taxonomy structure:

```text
service-domain/resource/eventcategory/verb/version/loinccode/testingdistrictcode/domiciledistrictcode
```

Example:

```text
diagnostic/result/simplepoct/submitted/v1/75410-1/G00026-A/G00013-C
```

The topic fields are described below.

| Event Topic Field | Field Type | Value | Description |
|---|---|---|---|
| `service-domain` | Root | `diagnostic` | Healthcare domain |
| `resource` | Root | `result` | Subject of the event. Ref. [Resource List - FHIR v5.0.0](https://hl7.org/fhir/resourcelist.html) |
| `event category` | Root | `simplepoct` | Event category |
| `verb` (past tense) | Root | `submitted` | Action that triggered the event |
| `version` | Root | `v1` | Starting version |
| `loinc code` | Event Property | Test LOINC code | LOINC code defining the nature of the submitted test. Ref. [LOINC Codes - Logical Observation Identifiers Names and Codes](https://www.findacode.com/loinc/) |
| `testing district code` | Event Property | 8-character Org ID code | HPI Org ID for the health district where the POCT took place. Ref. [Health NZ Common Code Tables](https://www.healthnz.govt.nz/about-us/data-management-and-standards/data-references/code-tables/common-code-tables#district-health-board-codes-20570) |
| `domicile district code` | Event Property | 8-character Org ID code | HPI Org ID for the patient's residential health district. Ref. [Health NZ Common Code Tables](https://www.healthnz.govt.nz/about-us/data-management-and-standards/data-references/code-tables/common-code-tables#district-health-board-codes-20570) |

---

## Message Header (Event Metadata)

| Header | Key Literal | Description | Required | Format / Values | Example |
|---|---|---|---|---|---|
| ID | `solace-user-property-id` | Message ID, unique for each publisher |  | GUID correlation ID | `987298dd-c484-462f-a15d-f18a97267959` |
| Source | `solace-user-property-source` | Publisher URI reference |  | URI | UAT: `https://uat.nes.digital.health.nz`<br>Prod: `https://nes.digital.health.nz` |
| Time | `solace-user-property-time` | UTC time when the message is published |  | `YYYY-MM-DDTHH:MM:SS` | `2024-11-30T18:54:43Z` |
| Spec Version | `version` | Version of the CloudEvents specification | Optional | `{major}.{minor}` | `1.0` |
| Type | `solace-user-property-type` | Substring of the topic taxonomy including root through version |  | `{root}/{version}` | `diagnostic/result/simplepoct/submitted/1.0.0` |
| Subject | `solace-user-property-subject` | Identifier of the Diagnostic Report |  | GUID | `987298dd-c484-462f-a15d-f18a97267959` |
| Content Type | `solace-user-property-datacontenttype` or `content-type` for REST API | Content type of event data |  | `application/json` | `application/json` |

---

## Message Payload

### Submitted Event

#### Payload Schema

```json
{
  "$schema": "https://json-schema.org/draft/2019-09/schema",
  "type": "object",
  "properties": {
    "callbackUrl": {
      "type": "string",
      "description": "Call back url for test result record"
    }
  },
  "additionalProperties": false,
  "required": [
    "callbackUrl"
  ]
}
```

#### Example

```json
{
  "callbackUrl": "https://api.nes.digital.health.nz/fhir/nhi/v1/"
}
```