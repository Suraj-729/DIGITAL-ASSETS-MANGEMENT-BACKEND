# 🔐 User Login API

---

## Endpoint
`POST /users/login`

---

## Description
Authenticates a user using either their `userId` or `employeeId`, along with a password. On successful login, a user session is established and essential user details are returned.

---

## 📥 Request

**Headers:**
`Content-Type: application/json`

**Body Parameters:**
```json
{
  "loginId": "string",   // Required - Can be either userId or employeeId
  "password": "string"   // Required - Plain text password
}
```

---

## 📤 Response

### ✅ Success (200 OK)
```json
{
  "message": "Login successful",
  "user": {
    "userId": "NICOD-1234",
    "employeeId": "EMP001",
    "employeeType": "admin",
    "HOD": "John Doe"
  }
}
```

### ❌ Errors

| Status Code | Message | Reason |
| :--- | :--- | :--- |
| `400` | `Login ID and password are required` | Missing fields in request body |
| `401` | `Invalid credentials` | User not found or password mismatch |
| `500` | `Login failed` | Internal server error during login |

---

## ⚙️ Session
On successful login, the following data is saved in the session (`req.session`):
```javascript
{
  user: {
    userId: string,
    employeeId: string,
    employeeType: string
  },
  createdAt: timestamp
}
```

---

## Internal Logic (for developers)
* Tries to find the user by `userId` or `employeeId` from the `Users` collection.
* Uses `bcrypt.compare` to verify the password.
* If the credentials are valid, returns user details and stores session data.
* `HOD` is sent as an empty string if not a valid string.

---

## Example cURL Request
```sh
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{"loginId": "NICOD-1234", "password": "your_password"}'
