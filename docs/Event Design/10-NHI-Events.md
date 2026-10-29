```
title: "NHI Events - Technical Design"
```

## Purpose

This is a technical design document for the NEMS NHI event. The target audiences are those working on:

- NHI event publisher applications
- NHI event subscriber applications
- NEMS implementation of NHI events

---

## Background

The National Health Index (NHI) system processes and records personal health information. The NHI event information is of interest to various stakeholders in the health sector, including the PASes (Patient Administration Systems) and others.

---

## NHI Event Semantics

A NHI event is an event indicating NHI demographic changes for a patient.

A **REGISTERED** NHI event indicates a new NHI record is created for a patient.

An **EDITED** NHI event indicates a change of data on the NHI record for a patient.

A **DELETED** NHI event indicates the removal of an existing NHI record for a patient, such as upon reversal of a death recorded in error.

### NHI Record State Transitions

> **Diagram unavailable:** NHI record state transitions.

---

## Process View

### NHI Event Process View

> **Diagram unavailable:** NHI event process view.

### NHI Events and Event Data

> **Diagram unavailable:** NHI events and event data.

---

## NHI Event Component Diagram

> **Diagram unavailable:** NHI event component diagram.

---

## Topic Taxonomy

For NHI events, the topic taxonomy structure follows the overall topic taxonomy structure:

```text
service-domain/resource/event/verb/version/<District>/<Domicile Code>/<GP Practice>/<Age Group>
```

Example:

```text
administration/patient/contactdetails/edited/v1/1022/0410/G06766-E/adult
```

The topic fields are elaborated in the table below.

In the original document:

- **Dark-green** indicates root taxonomy fields.
- **Light-green** indicates event property fields.

| # | Event Topic Field | Field Type | Value | Description |
|---|---|---|---|---|
| 1 | `service-domain` | Root | `administration` | Healthcare service domain |
| 2 | `resource` | Root | `patient` | Aligned with FHIR Patient resource. Patient - FHIR v5.0.0 |
| 3 | `event category` | Root | `address`, `contactdetails`, `demographics`, `linkage`, `registration` | Event category |
| 4 | `verb` | Root | `registered`, `edited`, `deleted` | Event action, one of the values |
| 5 | `version` | Root | `v1` | Starting version |
| 6 | `District` | Event Property | 8 character code or `null` (lowercase) | Health district of the person's primary residential address |
| 7 | `Domicile Code` | Event Property | 4 character district code or `null` (lowercase) | Domicile code, representing a person's primary residential address |
| 8 | `GP Practice` | Event Property | 8 character code or `null` (lowercase) | The HPI Organisation code of the active GP practice enrolment of the Healthcare User, if enrolled (enrolment type = `FLS`) |
| 9 | `Age Group` | Event Property | `newborn`, `infant`, `child`, `adult`, `olderadult` | Age group definition |

### District

**Value:** 8 character code or `null` (lowercase)

Health district of the person's primary residential address.

Reference:

[District Health Board Code Table](https://www.tewhatuora.govt.nz/our-health-system/data-and-statistics/nz-health-statistics/data-references/code-tables/common-code-tables#district-health-board-code-table)

### Domicile Code

**Value:** 4 character district code or `null` (lowercase)

Domicile code, representing a person's primary residential address.

Reference:

**Domicile Code - HL7® FHIR® New Zealand Base Implementation Guide v3.1.0**

### GP Practice

**Value:** 8 character code or `null` (lowercase)

The HPI Organisation code of the active GP practice enrolment of the Healthcare User, if enrolled (enrolment type = `FLS`).

Reference:

[Facility Code Table](https://www.tewhatuora.govt.nz/our-health-system/data-and-statistics/nz-health-statistics/data-references/code-tables/common-code-tables#facility-code-table)

> **Note:** Not all healthcare users are enrolled with a GP practice. Where no GP enrolment exists for the NHI, this field will be `null`.

### Age Group

The supported age group values are:

- `newborn`
- `infant`
- `child`
- `adult`
- `olderadult`

| Age Group | Definition |
|---|---|
| `newborn` | Birth → < 42 days |
| `infant` | ≥ 42 days, < 1 year |
| `child` | ≥ 1 year, < 16 years |
| `adult` | ≥ 16 years, < 65 years |
| `olderadult` | ≥ 65 years |

---

## Message Header (Event Metadata)

| Header | Key Literal | Description | Required | Format / Values | Example |
|---|---|---|---|---|---|
| ID | `solace-user-property-id` | Message id, unique for each publisher | Required | GUID correlation ID | `987298dd-c484-462f-a15d-f18a97267959` |
| Source | `solace-user-property-source` | Publisher URI reference | Required | Environment-specific URI | See Source values below |
| Time | `solace-user-property-time` | UTC time when the message is published | Required | `YYYY-MM-DDTHH:MM:SS` | `2023-11-30T18:54:43Z` |
| Spec Version | `version` | Version of the CloudEvents spec | Optional | `{major}.{minor}` | `1.0` |
| Type | `solace-user-property-type` | Substring of the topic taxonomy including root to version | Required | `{root}/{version}` | `demographics/patient/death/new/v1` |
| Subject | `solace-user-property-subject` | NHI number | Required | `[A-Z]{3}([0-9]{4}\|([0-9]{2}[A-Z]{2}))` | `ZZZ0008`, `ZXE24NV` |
| Content type | `solace-user-property-datacontenttype` or `content-type` for REST API | Content type of event data | Required | `application/json` | `application/json` |

### Source

Publisher URI reference:

#### UAT

```text
https://hip-uat.digital.health.nz
```

#### Production

```text
https://hip.digital.health.nz
```

The original source lists the UAT and production values twice:

1. `https://hip-uat.digital.health.nz` for UAT
2. `https://hip.digital.health.nz` for prod
3. `https://hip-uat.digital.health.nz` for UAT
4. `https://hip.digital.health.nz` for prod

### ID

**Key Literal**

```text
solace-user-property-id
```

**Description:** Message id, unique for each publisher.

**Required:** Required

**Format / Values:** GUID correlation ID

**Example:**

```text
987298dd-c484-462f-a15d-f18a97267959
```

### Time

**Key Literal**

```text
solace-user-property-time
```

**Description:** UTC time when the message is published.

**Required:** Required

**Format / Values:**

```text
YYYY-MM-DDTHH:MM:SS
```

**Example:**

```text
2023-11-30T18:54:43Z
```

### Spec Version

**Key Literal**

```text
version
```

**Description:** Version of the CloudEvents spec.

**Required:** Optional

**Format / Values:**

```text
{major}.{minor}
```

**Example:**

```text
1.0
```

### Type

**Key Literal**

```text
solace-user-property-type
```

**Description:** Substring of the topic taxonomy including root to version.

**Required:** Required

**Format / Values:**

```text
{root}/{version}
```

**Example:**

```text
demographics/patient/death/new/v1
```

### Subject

**Key Literal**

```text
solace-user-property-subject
```

**Description:** NHI number.

**Required:** Required

**Format / Values:**

```regex
[A-Z]{3}([0-9]{4}|([0-9]{2}[A-Z]{2}))
```

**Examples:**

```text
ZZZ0008
ZXE24NV
```

### Content Type

For Solace messages:

```text
solace-user-property-datacontenttype
```

For the REST API:

```text
content-type
```

**Description:** Content type of event data.

**Required:** Required

**Format / Values:**

```text
application/json
```

**Example:**

```text
application/json
```

---

## Message Payload

| Event | Payload Schema | Example |
|---|---|---|
| `NHI/registered` | See NHI/registered schema below | See example below |
| `NHI/edited` | Same as `NHI/registered` | Same as `NHI/registered` |
| `NHI/deleted` | Same as `NHI/registered` | Same as `NHI/registered` |

### NHI/registered

#### Payload Schema

```json
{
  "$schema": "https://json-schema.org/draft/2019-09/schema",
  "type": "object",
  "properties": {
    "NHI": {
      "type": "string",
      "description": "NHI"
    },
    "dormantNHIs": {
      "type": "array",
      "items": {
        "type": "string",
        "description": "Dormant NHIs"
      }
    }
  },
  "additionalProperties": false,
  "required": [
    "NHI"
  ]
}
```

#### Example

```json
{
  "NHI": "ZZZ00CX",
  "dormantNHIs": [
    "PQT598",
    "VHJ478"
  ]
}
```

### NHI/edited

#### Payload Schema

The same as `NHI/registered`.

#### Example

The same as `NHI/registered`.

```json
{
  "NHI": "ZZZ00CX",
  "dormantNHIs": [
    "PQT598",
    "VHJ478"
  ]
}
```

### NHI/deleted

#### Payload Schema

The same as `NHI/registered`.

#### Example

The same as `NHI/registered`.

```json
{
  "NHI": "ZZZ00CX",
  "dormantNHIs": [
    "PQT598",
    "VHJ478"
  ]
}
```