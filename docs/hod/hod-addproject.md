# ✍️ Add Project by HOD API

---

## Endpoint
`POST /addprojectbyhod`

---

## Description
This endpoint allows a Head of Department (HOD) to assign a new project. It validates the required project details and inserts a new entry into the `AssignedAssets` collection.

---

## 📥 Request

**Headers:**
`Content-Type: application/json`

**Body Parameters:**

| Name | Type | Description | Required | Example |
| :--- | :--- | :--- | :--- | :--- |
| `projectName` | `string` | The name of the project. | Yes | `"Project Phoenix"` |
| `employeeId` | `string` | The ID of the employee responsible for the project. | Yes | `"EMP5678"` |
| `deptName` | `string` | The name of the department. | Yes | `"Engineering"` |
| `hodName` | `string` | The name of the HOD assigning the project. | No | `"Jane Doe"` |
| `projectManagerName` | `string` | The name of the project manager. | No | `"Alice Smith"` |
| `empCode` | `string` | The employee code. | No | `"9012"` |

---

## 📤 Response

### ✅ Success (201 Created)
Returns a success message along with the unique ID of the newly created project asset.

```json
{
  "message": "Project assigned successfully by HOD",
  "insertedId": "64d0d3b64c12564c7e6c4331"
}
```

### ❌ Errors

| Status Code | Message | Reason |
| :--- | :--- | :--- |
| `400` | `Required fields missing` | Missing `projectName`, `employeeId`, or `deptName` in the request body. |
| `500` | `Failed to assign project by HOD` | An internal server error occurred during project assignment. |

---

## ⚙️ Internal Logic (for developers)
* The endpoint validates that `projectName`, `employeeId`, and `deptName` are present in the request body.
* It constructs an object with the provided data and a `createdAt` timestamp.
* The data is then inserted as a new document into the `AssignedAssets` MongoDB collection.
* The `insertedId` from the database operation is returned to the client.

---

## Example cURL Request

```sh
curl -X POST http://localhost:3000/addprojectbyhod \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "Project Phoenix",
    "employeeId": "EMP5678",
    "deptName": "Engineering",
    "hodName": "Jane Doe",
    "projectManagerName": "Alice Smith",
    "empCode": "9012"
  }'
