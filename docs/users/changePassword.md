# 🔐 User Change Password API

---

## Endpoint
`PUT /users/change-password`

---


## Description
Allows a user to change their password by providing their current password for verification, along with their new password.

---

## 📥 Request

**Headers:**
`Content-Type: application/json`

**Body Parameters:**
```json
{
  "loginId": "string",          // Required - The user's userId or employeeId
  "currentPassword": "string",  // Required - The user's current password
  "newPassword": "string"       // Required - The user's new password
}
```

---

## 📤 Response

### ✅ Success (200 OK)
```json
{
  "message": "Password changed successfully"
}
```

### ❌ Errors

| Status Code | Message | Reason |
| :--- | :--- | :--- |
| `400` | `loginId, currentPassword, and newPassword are required` | Missing fields in request body |
| `401` | `Invalid credentials` | Current password does not match or user not found |
| `500` | `Failed to change password` | Internal server error during password update |

---

## ⚙️ Internal Logic (for developers)
* Verifies the user by attempting to log in with the `loginId` and `currentPassword`.
* If the credentials are valid, it updates the user's password with the `newPassword`.

---

## Example cURL Request
```sh
curl -X PUT http://localhost:3000/users/change-password \
  -H "Content-Type: application/json" \
  -d '{"loginId": "NICOD-1234", "currentPassword": "old_password", "newPassword": "new_strong_password"}'
