# 📊 Dashboard Filter API

---

## Endpoints

* `GET /dashboard/filter/department/:deptName/employee/:employeeId`
* `GET /dashboard/filter/datacenter/:dataCenter`
* `GET /dashboard/filter/prismid/:prismId`

---

## Description
This endpoint retrieves dashboard data based on various filters, including department, employee, data center, and Prism ID.

---

## `GET /dashboard/filter/department/:deptName/employee/:employeeId`

**Description:** This endpoint retrieves dashboard data for a specific department and an employee. It filters assets based on the `deptName` and `employeeId` provided in the path.

### 📥 Request

**Path Parameters:**

| Name | Type | Description | Required | Example |
| :--- | :--- | :--- | :--- | :--- |
| `deptName` | `string` | The name of the department to filter by. | Yes | `IT` |
| `employeeId` | `string` | The ID of the employee to filter by. | Yes | `1234` |

### 📤 Response

### ✅ Success (200 OK)
Returns an array of project objects that match the specified department and employee.

```json
[
  {
    "assetsId": "string",
    "projectName": "string",
    "prismId": "string",
    "deptName": "string",
    "HOD": "string",
    "employeeId": "string",
    "auditDate": "ISO date string or null",
    "expireDate": "ISO date string or null",
    "tlsNextExpiry": "string or null",
    "sslLabScore": "string or null",
    "certificate": "string or null",
    "auditStatus": "string or null",
    "sslStatus": "string or null",
    "dataCentre": "string",
    "createdAt": "ISO date string"
  }
]
```

### ❌ Errors

| Status Code | Message | Reason |
| :--- | :--- | :--- |
| `400` | `Department name and Employee ID are required.` | Missing `deptName` or `employeeId` path parameters. |
| `404` | `No assets found for this department and employee.` | No assets matched the provided `deptName` and `employeeId`. |
| `500` | `Internal Server Error` | An unexpected server error occurred during data retrieval. |

---

## `GET /dashboard/filter/datacenter/:dataCenter`

**Description:** This endpoint retrieves dashboard data for all assets located in a specific data center.

### 📥 Request

**Path Parameters:**

| Name | Type | Description | Required | Example |
| :--- | :--- | :--- | :--- | :--- |
| `dataCenter` | `string` | The name of the data center to filter by. | Yes | `Noida` |

### 📤 Response

### ✅ Success (200 OK)
Returns an array of project objects that match the specified data center. The response structure is the same as the department/employee filter.

### ❌ Errors

| Status Code | Message | Reason |
| :--- | :--- | :--- |
| `400` | `Data Center name is required.` | Missing `dataCenter` path parameter. |
| `404` | `No assets found for this data center.` | No assets matched the provided `dataCenter`. |
| `500` | `Internal Server Error` | An unexpected server error occurred during data retrieval. |

---

## `GET /dashboard/filter/prismid/:prismId`

**Description:** This endpoint retrieves dashboard data for a specific asset by its Prism ID.

### 📥 Request

**Path Parameters:**

| Name | Type | Description | Required | Example |
| :--- | :--- | :--- | :--- | :--- |
| `prismId` | `string` | The Prism ID to filter by. | Yes | `PRISM123` |

### 📤 Response

### ✅ Success (200 OK)
Returns an array of project objects that match the specified Prism ID. The response structure is the same as the other filters.

### ❌ Errors

| Status Code | Message | Reason |
| :--- | :--- | :--- |
| `400` | `Prism ID is required.` | Missing `prismId` path parameter. |
| `404` | `No assets found for this Prism ID.` | No assets matched the provided `prismId`. |
| `500` | `Internal Server Error` | An unexpected server error occurred during data retrieval. |

---

## ⚙️ Internal Logic (for developers)
* The endpoints extract the necessary filter parameters from the URL.
* These parameters are used to create a `$match` stage for a MongoDB aggregation pipeline.
* The `getFilteredDashboard` helper function executes the pipeline, which performs the following steps:
    1.  `$match` documents based on the filter criteria (`BP.deptName` and `BP.employeeId`, `Infra.dataCentre`, or `BP.prismId`).
    2.  `$project` specific fields from the document.
    3.  `$unwind` the `SA.securityAudit` array, preserving documents without audits.
    4.  `$project` again to flatten the security audit details.
    5.  `$sort` the final results by `expireDate`.

---

## Example cURL Requests
```sh
# Filter by department and employee
curl -X GET http://localhost:3000/dashboard/filter/department/IT/employee/1234

# Filter by data center
curl -X GET http://localhost:3000/dashboard/filter/datacenter/Noida

# Filter by Prism ID
curl -X GET http://localhost:3000/dashboard/filter/prismid/PRISM123
