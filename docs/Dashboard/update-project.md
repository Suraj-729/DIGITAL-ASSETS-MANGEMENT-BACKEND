# ✍️ Update Asset API

---

## Endpoint
`PUT /assets/update/by-project-name/:projectName`

---

## Description
This endpoint updates an existing asset's details in the database. The update is performed by identifying the asset using its project name. It can handle updates to various sections of the asset document and also accepts an optional file upload for a security audit certificate.

---

## 📥 Request

**Path Parameters:**

| Name | Type | Description | Required | Example |
| :--- | :--- | :--- | :--- | :--- |
| `projectName` | `string` | The case-insensitive name of the project to update. | Yes | `MyProject` |

**Headers:**
`Content-Type: multipart/form-data`

**Body Parameters:**
This endpoint accepts a `multipart/form-data` request body. The following fields should be included:

| Name | Type | Description | Required | Example |
| :--- | :--- | :--- | :--- | :--- |
| `BP` | `string` | A JSON string representing the updated Business Plan object. | Yes | `'{ "prismId": "123", "name": "MyProject" }'` |
| `SA` | `string` | A JSON string representing the updated Security Audit object. | Yes | `'{ "securityAudit": [{ "auditDate": "2023-01-01" }] }'` |
| `TS` | `string` | A JSON string representing the updated Technical Stack object. | Yes | `'{ "framework": ["React", "Express"] }'` |
| `Infra` | `string` | A JSON string representing the updated Infrastructure object. | Yes | `'{ "typeOfServer": "Dedicated" }'` |
| `certificate` | `file` | The certificate file to be uploaded. Optional. | No | `cert.pdf` |

---

## 📤 Response

### ✅ Success (200 OK)
Returns a success message and the number of documents that were modified.

```json
{
  "message": "Asset updated successfully",
  "modifiedCount": 1
}
```

### ❌ Errors

| Status Code | Message | Reason |
| :--- | :--- | :--- |
| `400` | `Project name is required` | The `projectName` path parameter was not provided. |
| `404` | `Asset not found for this project name` | No asset with the given project name was found in the database. |
| `500` | `Error updating asset` | An internal server error occurred during the update process. |

---

## ⚙️ Internal Logic (for developers)
* The request is handled as a `multipart/form-data` payload.
* It first extracts the `projectName` from the URL parameters.
* It parses the `BP`, `SA`, `TS`, and `Infra` fields from their JSON string format in the request body.
* If a `certificate` file is uploaded (`req.file`), its original filename is attached to the first element of the `SA.securityAudit` array.
* A MongoDB `updateOne` operation is performed to find the asset by its `BP.name` (using a case-insensitive regex) and replace the entire `BP`, `SA`, `TS`, and `Infra` objects with the new data using the `$set` operator.

---

## Example cURL Request

```sh
curl --request PUT \
  --url http://localhost:3000/assets/update/by-project-name/MyProject \
  --header 'Content-Type: multipart/form-data' \
  --form 'BP="{\"prismId\": \"123\", \"name\": \"MyProject\"}"' \
  --form 'SA="{\"securityAudit\": [{\"auditStatus\": \"Passed\"}]}"' \
  --form 'TS="{\"framework\": [\"React\"]}"' \
  --form 'Infra="{\"dataCentre\": \"New Datacenter\"}"' \
  --form 'certificate=@/path/to/your/certificate.pdf'
