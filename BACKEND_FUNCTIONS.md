# Backend Function Documentation

## Controllers/assets.controller.js

| Function                                                  | Description                                                                |
| --------------------------------------------------------- | -------------------------------------------------------------------------- |
| **createAsset(req, res)**                           | Creates a new asset from multipart/form-data sections (BP, SA, TS, Infra). |
| **getAsset(req, res)**                              | Retrieves a single asset by its `assetsId`.                              |
| **deleteAsset(req, res)**                           | Deletes an asset by its `assetsId`.                                      |
| **updateBP(req, res)**                              | Updates the Basic Profile (BP) section of an asset.                        |
| **updateSA(req, res)**                              | Updates the Security Audit (SA) section of an asset.                       |
| **updateInfra(req, res)**                           | Updates the Infrastructure (Infra) section of an asset.                    |
| **updateTS(req, res)**                              | Updates the Technology Stack (TS) section of an asset.                     |
| **getAssetsByDataCentre(req, res)**                 | Returns all assets for a given data centre.                                |
| **getAssetsByDepartment(req, res)**                 | Returns all assets for a given department.                                 |
| **getDashboardAllProjectBySIO(req, res)**           | Returns dashboard data for all projects, including audit expiry info.      |
| **getProjectDetailsByName(req, res)**               | Returns detailed information for a project by its name.                    |
| **getDashboardByType(req, res)**                    | Returns dashboard data filtered by user role (Admin, HOD, PM).             |
| **updateAssetByProjectName(req, res)**              | Updates an asset by its project name.                                      |
| **filterByDepartment(req, res)**                    | Returns dashboard data filtered by department.                             |
| **filterByDataCenter(req, res)**                    | Returns dashboard data filtered by data center.                            |
| **filterByPrismId(req, res)**                       | Returns dashboard data filtered by Prism ID.                               |
| **getFilteredDashboard(matchStage)**                | Aggregates dashboard data based on a MongoDB match stage.                  |
| **assignHodProject(req, res)**                      | Assigns a project to a HOD (Head of Department).                           |
| **getProjectManagersAssignedByHOD(req, res)**       | Returns project managers assigned by a specific HOD.                       |
| **getAllProjectManagers(req, res)**                 | Returns all project managers.                                              |
| **getProjectAssignData(req, res)**                  | Returns project assignment data for a given employee code.                 |
| **getAuditExpiryNotificationsByEmployee(req, res)** | Returns audit expiry notifications for a given employee.                   |
| **getAuditExpiryByAssetId(req, res)**               | Returns audit expiry notifications for a given asset.                      |
| **getNotificationByEmployeeId(req, res)**           | Returns notifications for a given employee.                                |
| **getAuditExpiryForUser(req, res)**                 | Returns audit expiry notifications for a user, filtered by their role.     |

---

## Controllers/user.controller.js

| Function                           | Description                                                       |
| ---------------------------------- | ----------------------------------------------------------------- |
| **createUser(req, res)**     | Creates a new user.                                               |
| **getUserById(req, res)**    | Retrieves a user by their `assetsId`.                           |
| **updatePassword(req, res)** | Updates a user's password.                                        |
| **deleteUser(req, res)**     | Deletes a user by their `assetsId`.                             |
| **login(req, res)**          | Authenticates a user and starts a session.                        |
| **logout(req, res)**         | Logs out a user and clears their session.                         |
| **register(req, res)**       | Registers a new user.                                             |
| **changePassword(req, res)** | Changes a user's password after verifying their current password. |

---

## Db/Db.js

| Function                | Description                                                                        |
| ----------------------- | ---------------------------------------------------------------------------------- |
| **connectToDb()** | Connects to the MongoDB database and reuses the connection if already established. |
| **getDb()**       | Returns the database instance. Throws an error if not connected.                   |
| **closeDb()**     | Closes the MongoDB connection.                                                     |

---

## utils/checkAndNotifyExpiringCerts.js

| Function                                  | Description                                                                                                         |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **send(email, text)**               | Sends an email using nodemailer.                                                                                    |
| **notifyUsersAboutExpiringCerts()** | Checks all assets for expiring SSL/TLS certificates and notifies users by email if any are expiring within 30 days. |
