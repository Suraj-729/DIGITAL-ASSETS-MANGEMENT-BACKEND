# 📊 Project Details API

---

## Endpoint
`GET /dashboard/projectDetails/:projectName`

---

## Description
This endpoint retrieves detailed information for a specific project. The search is performed using the project name, which is case-insensitive. The response aggregates various details about the project's business plan, security audits, infrastructure, technical stack, TLS certificates, and disaster recovery information.

---

## 📥 Request

**Path Parameters:**

| Name | Type | Description | Required | Example |
| :--- | :--- | :--- | :--- | :--- |
| `projectName`| `string` | The name of the project to retrieve details for. | Yes | `MyProject` |

---

## 📤 Response

### ✅ Success (200 OK)
Returns a JSON object containing all the project's details. Dates are formatted as ISO 8601 strings.

```json
{
  "assetsId": "string",
  "projectName": "string",
  "BP": {
    "prismId": "string",
    "deptName": "string",
    "employeeId": "string",
    "url": "string",
    "publicIp": "string",
    "HOD": "string",
    "nodalOfficerNIC": {
      "name": "string",
      "empCode": "string",
      "mobile": "string",
      "email": "string"
    },
    "nodalOfficerDept": {
      "name": "string",
      "designation": "string",
      "mobile": "string",
      "email": "string"
    }
  },
  "SA": {
    "securityAudit": [
      {
        "auditDate": "ISO date string or null",
        "expireDate": "ISO date string or null",
        "report": "string or null",
        "score": "string or null",
        "tlsNextExpiry": "string or null",
        "sslLabScore": "string or null"
      }
    ]
  },
  "Infra": {
    "typeOfServer": "string",
    "location": "string",
    "deployment": "string",
    "dataCentre": "string",
    "gitUrls": ["string"],
    "vaRecords": [
      {
        "ipAddress": "string",
        "purposeOfUse": "string",
        "vaScore": "string",
        "dateOfVA": "ISO date string or null",
        "vaReport": "string"
      }
    ],
    "additionalInfra": ["string"]
  },
  "TS": {
    "frontend": ["string"],
    "framework": ["string"],
    "database": ["string"],
    "os": ["string"],
    "osVersion": ["string"],
    "repoUrls": ["string"]
  },
  "TLS": {
    "tlsInfo": [
      {
        "domainName": "string",
        "certProvider": "string",
        "issueDate": "ISO date string or null",
        "expiryDate": "ISO date string or null",
        "certStatus": "string",
        "score": "string",
        "procuredFrom": "string"
      }
    ]
  },
  "DR": {
    "drLocation": "string",
    "drStatus": "string",
    "lastDrTestDate": "ISO date string or null",
    "remarks": "string",
    "serverType": "string",
    "dataCentre": "string",
    "deployment": "string",
    "gitUrls": ["string"],
    "vaRecords": [
      {
        "ipAddress": "string",
        "dbServerIp": "string",
        "purposeOfUse": "string",
        "vaScore": "string",
        "dateOfVA": "ISO date string or null",
        "vaReport": "string"
      }
    ]
  },
  "createdAt": "ISO date string or null"
}
```

### ❌ Errors

| Status Code | Message | Reason |
| :--- | :--- | :--- |
| `400` | `Project name is required` | The `projectName` parameter was not provided in the URL. |
| `404` | `Project not found` | No project with the given name was found in the database. |
| `500` | `Failed to fetch project details` | An internal server error occurred during data retrieval. |

---

## ⚙️ Internal Logic (for developers)
* Finds a project in the `Assets` collection by its `BP.name` field.
* The search is case-insensitive, using a regular expression (`$regex`).
* Uses a MongoDB projection to return a predefined set of fields.
* Formats several nested arrays (`tlsInfo`, `vaRecords` in `Infra` and `DR`) to ensure all fields are present and dates are converted to ISO strings for consistency.
* Handles potential null or missing values by providing default empty strings or arrays.

---

## Example cURL Request
```sh
curl -X GET http://localhost:3000/dashboard/projectDetails/MyProjectName
