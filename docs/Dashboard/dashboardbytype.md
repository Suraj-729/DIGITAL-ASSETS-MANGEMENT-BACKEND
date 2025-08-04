# 📊 Dashboard Data API (By Type)

---

## Endpoint
`GET /dashboard/by-type/:employeeId`

---

## Description
This endpoint retrieves dashboard data tailored to a specific user's role (`employeeType`). The data returned is filtered based on whether the user is an `Admin`, `HOD`, or `PM`. It fetches the latest security audit details for the projects visible to that user.

---

## 📥 Request

**Path Parameters:**

| Name | Type | Description | Required | Example |
| :--- | :--- | :--- | :--- | :--- |
| `employeeId` | `string` | The user's `employeeId` or `empCode`. | Yes | `1234` |

**Query Parameters:**

| Name | Type | Description | Required | Example |
| :--- | :--- | :--- | :--- | :--- |
| `employeeType` | `string` | The user's role. Must be `Admin`, `HOD`, or `PM`. | Yes | `HOD` |
| `name` | `string` | The user's name (optional). | No | `John Doe` |

---

## 📤 Response

### ✅ Success (200 OK)
Returns an array of project objects, each containing details of its most recent security audit.

```json
[
  {
    "assetsId": "string",
    "projectName": "string",
    "prismId": "string",
    "deptName": "string",
    "HOD": "string",
    "employeeId": "string",
    "auditDate": "ISO date string",
    "expireDate": "ISO date string",
    "tlsNextExpiry": "ISO date string",
    "sslLabScore": "string",
    "certificate": "string",
    "auditStatus": "string",
    "sslStatus": "string",
    "dataCentre": "string",
    "createdAt": "ISO date string"
  },
  // ... more objects
]
```

### ❌ Errors

| Status Code | Message | Reason |
| :--- | :--- | :--- |
| `400` | `employeeId and employeeType are required` | Missing `employeeId` or `employeeType` in the request. |
| `403` | `Unauthorized: Invalid employeeId or employeeType` | The provided `employeeId` or `employeeType` is not a valid combination. |
| `500` | `Failed to fetch dashboard data` | An internal server error occurred during data retrieval. |

---

## ⚙️ Internal Logic (for developers)
* Determines the appropriate MongoDB `$match` filter based on the `employeeType`:
    * `Admin`: No filter is applied, returning all projects.
    * `HOD`: Filters for projects where `BP.employeeId` matches the provided `employeeId`.
    * `PM`: Filters for projects where `BP.nodalOfficerNIC.empCode` matches the provided `employeeId`.
* An aggregation pipeline is used to:
    * `$match` the documents according to the user's role.
    * `$unwind` the `SA.securityAudit` array to flatten the documents.
    * `$sort` the documents to place the most recent audit first.
    * `$group` the results by `assetsId` to return only the latest audit entry for each project.
    * `$sort` the final output by `expireDate` in descending order.

---

## Example cURL Request
```sh
curl -X GET "http://localhost:3000/dashboard/by-type/1234?employeeType=HOD"
