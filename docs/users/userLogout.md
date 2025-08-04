# 🔐 User Logout API

---

## Endpoint
`POST /users/logout`

---

## Description
This endpoint logs out the currently authenticated user by clearing the user data from the session.

---

## 📥 Request

**Headers:**
`Content-Type: application/json`

**Body Parameters:**
This endpoint does not require any body parameters.

---

## 📤 Response

### ✅ Success (200 OK)
```json
{
  "message": "Logout successful"
}
```

### ❌ Errors

| Status Code | Message | Reason |
| :--- | :--- | :--- |
| `500` | `Logout failed` | An internal server error occurred while attempting to clear the session. |

---

## ⚙️ Internal Logic (for developers)
* Checks for an active session (`req.session`).
* If a session exists, it sets `req.session.user` to `null` to effectively log out the user.

---

## Example cURL Request
```sh
curl -X POST http://localhost:3000/users/logout \
  -H "Content-Type: application/json"
