# 📊 Dashboard Data API (SIO)

---

## Endpoint
`GET /dashboard/dataSio`

---

## Description
Retrieves a comprehensive list of all projects and their associated security audit details for the Security and Information Officer (SIO) dashboard. The data is aggregated from the database, including projects without any security audits.

---

## 📥 Request

This endpoint does not require any query parameters or request body.

---

## 📤 Response

### ✅ Success (200 OK)
Returns an array of objects, where each object represents a project and its security audit details.

```json
[
  {
    "assetsId": "string",
    "prismId": "string",
    "HOD": "string",
    "deptName": "string",
    "projectName": "string",
    "auditDate": "ISO date string or null",
    "expireDate": "ISO date string or null",
    "tlsNextExpiry": "ISO date string or null",
    "sslLabScore": "string or null"
  },
  // ... more objects
]
```

### ❌ Errors

| Status Code | Message | Reason |
| :--- | :--- | :--- |
| `404` | `No projects found for dashboard` | No projects were found in the database. |
| `500` | `Failed to fetch dashboard data` | An internal server error occurred during data retrieval. |

---

## ⚙️ Internal Logic (for developers)
* Performs a MongoDB aggregation on the `Assets` collection.
* Projects key data fields from nested objects, including `prismId`, `HOD`, `deptName`, and `projectName`.
* Uses `$unwind` on the `securityAudits` array with `preserveNullAndEmptyArrays: true` to ensure projects with no audits are still included in the result.
* Sorts the final output by `expireDate` in ascending order.

---

## Example cURL Request
```sh
curl -X GET http://localhost:3000/dashboard/dataSio
