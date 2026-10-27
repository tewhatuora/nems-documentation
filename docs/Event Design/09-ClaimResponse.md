---
title: "Claim Response Event - Technical Design"
---

## Introduction

This is a technical design document for the NEMS Claim Response event.

The target audience is community-based healthcare providers who submit payment requests to Health NZ as FHIR Claims and need to be notified when those FHIR Claims have been determined and the outcome has been published as a FHIR ClaimResponse.

Providers will consume the NEMS event and make a call to the FHIR API to retrieve the published ClaimResponse resource.

---

## Background

The **Claims Gateway** solution, published via the **Digital Services Hub (DSH)**, enables providers, via their Practice Management System (PMS), to submit payment requests (FHIR Claims) to the Health NZ FHIR API.

Health NZ determines whether a claim is approved or denied by applying business rules relevant to the service being delivered. A determination outcome, represented as a FHIR **`ClaimResponse`**, details the approval or denial of the claim and is submitted to the FHIR API.

NEMS notifies the provider that a new or updated ClaimResponse is available. On receipt of the event, the provider will, via their PMS, fetch and store the ClaimResponse from the API.

The technical design of the NEMS Claim Response event is based on and supports the **Claims Gateway** solution.

The Health NZ FHIR server is the publisher of the Claim Response event whenever a new or updated FHIR `ClaimResponse` is submitted to the FHIR API.

### Initial Consumers

Initial consumers of the Claims Gateway and subscribers to the NEMS Claim Response event include:

1. Online GP/telehealth service providers via their GP PMS, for example:
   - indici
   - Medtech

   These consumers submit General Medical Services claims for fee for service consultations.

2. Pharmacies via their Pharmacy Management System (PhMS), for example:
   - Toniq
   - RxOne
   - Script Sense

   These consumers submit Integrated Community Pharmacy Services Agreement (ICPSA) claims for dispensed medications.

---

## Process View

1. A NEMS Claim Response event is produced.
2. The consumer (PMS or PhMS) makes a request to the FHIR API to retrieve the `ClaimResponse` specified in the event message for further processing.

### Event Verb

Successful and unsuccessful `ClaimResponse` resources are both modelled using the single verb **`produced`**.

The reasons for this approach are:

- The subscriber must make a request based on the content of the event notification to determine the appropriate downstream processing. The status, including the different types of business outcome, is encapsulated within the `ClaimResponse` resource.
- There is no requirement for event routing based on different verbs or status values.

---

## Topic Taxonomy

For Claim Response events, the topic taxonomy follows the structure below:

```text
`operating/claimresponse/{claim type}/{verb}/v1/{org identifier}/
```

The topic fields are described in the following table.

| # | Claim Response Event Topic Field | Field Type | Value | Description |
|---|---|---|---|---|
| 1 | service-domain | Root | `operations` | `finance` is the service domain for financial management events |
| 2 | resource | Root | `claimresponse` | Aligned with the FHIR `ClaimResponse` resource |
| 3 | event category | Root | `icpsa`, `onlinegp` | Claim type. See [FHIR Claim Type ValueSet](https://build.fhir.org/valueset-claim-type.html) |
| 4 | verb (past tense) | Root | `produced`, `cancelled` | Event action, using one of the defined values |
| 5 | version | Root | `v1` | Starting version |
| 6 | claiming organisation id | Event Property | `orgId`, `claimant id`| HPI Organisation ID of the claiming organisation (or use case specific organisation identifier). Consider whether this is sufficient for message routing. |

---

## Message Header (Event Metadata)

| Header | Key Literal | Description | Required | Format / Values | Example |
|---|---|---|---|---|---|
| ID | `solace-user-property-id` | Message ID, unique for each publisher |  | UUID | `987298dd-c484-462f-a15d-f18a97267959` |
| Source | `solace-user-property-source` | Publisher URI reference: FHIR Server URI |  | Environment-specific FHIR Server URI | UAT / Prod |
| Time | `solace-user-property-time` | UTC time when the message is published |  | `YYYY-MM-DDTHH:MM:SS` | `2024-11-30T18:54:43Z` |
| Spec Version | `version` | Version of the CloudEvents specification | Optional | `{major}.{minor}` | `1.0` |
| Type | `solace-user-property-type` | Substring of the topic taxonomy including root through to version |  | `{root}/{version}` | `operation/claimresponse/produced/v1` |
| Subject | `solace-user-property-subject` | ClaimResponse ID (FHIR Resource ID) |  | String |  |
| Content Type | `solace-user-property-datacontenttype` or `content-type` for REST API | Content type of event data |  | `application/json` | `application/json` |

---

## Message Payload

### Produced Event

#### Payload Schema

```json
{
  "$schema": "https://json-schema.org/draft/2019-09/schema",
  "type": "object",
  "properties": {
    "claimResponseId": {
      "type": "string",
      "description": "ID of the ClaimResponse FHIR resource"
    },
    "claimResponseVersion": {
      "type": "string",
      "description": "Version of the ClaimResponse resource"
    }
  },
  "additionalProperties": false,
  "required": [
    "claimResponseId",
    "claimResponseVersion"
  ]
}
```

#### Example Payload

```json
{
  "claimResponseId": "CR-123456789",
  "claimResponseVersion": "2"
}
```