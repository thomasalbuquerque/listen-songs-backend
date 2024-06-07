# API Documentation - Rofars Backend

<aside>
💡 This document serves as the API documentation for the Rofars Backend. Please note that this is a preliminary API documentation and some details may change in the future.
</aside>

## Endpoints

<details>
<summary><b>/auth</b></summary>

- **POST /rofars/v1/auth** - Login - Generates a new access token and refresh token, being the access token valid for 15 minutes and the refresh token valid for 7 days. The access token is used to authenticate the user in the application, and the refresh token is used to generate a new access token when the current one expires.

- Admin Only: ❌
- Admin Validation: ❌
- User logged: ❌
- Public: ✅

  1. **Request**

     1. Body

     ```json
     {
       "email": "user1@email.com",
       "password": "user1Password!"
     }
     ```

  2. **Response** - Status 201

     ```json
     {
       "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwYTI0MmYwZS00NDRiLTRkMzEtYjRhNC1iNTE4ZTMzNzczNmEiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDc1MDU3ODksImV4cCI6MTcwNzUwNjY4OX0.T_HHp3vvFJyJXbUHKohGZJSLh2PDmczJdbg4CXPiN90",
       "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwYTI0MmYwZS00NDRiLTRkMzEtYjRhNC1iNTE4ZTMzNzczNmEiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDc1MDU3ODksImV4cCI6MTcwODExMDU4OX0.TN4VwkQMUlJSc-79jBm3dR88KL48dVOEYJ41v2nEMIM"
     }
     ```

- **POST /rofars/v1/auth** - Logout - Clears the refresh token in the database, making it impossible to generate a new access token.

- Admin Only: ❌
- Admin Validation: ❌
- User logged: ✅
- Public: ❌

  1. **Rules**
     1. The user must be logged
  2. **Header**
     1. Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhOGE4NmUzZi0zZjdmLTRlMDQtOWUwMy03NmU3Nzc1Nzg3NTYiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDczMTIyMTcsImV4cCI6MTcwNzMxMzExN30.2hS4o8tZ5woOWQMQWofmPXucgj0FyaW39qMJEoHh5oE`
  3. **Response** - Status 201

     ```json
     {
       "message": "User logged out successfully"
     }
     ```

- **GET /rofars/v1/auth** - Retrieves the current user logged, the data is the req.user object from the access token. Sub is the user id, role is the user role, iat is the access token creation date and exp is the access token expiration date.

- Admin Only: ❌
- Admin Validation: ❌
- User logged: ✅
- Public: ❌

  1. **Rules**
     1. The user must be logged
  2. **Header**
     1. Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhOGE4NmUzZi0zZjdmLTRlMDQtOWUwMy03NmU3Nzc1Nzg3NTYiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDczMTIyMTcsImV4cCI6MTcwNzMxMzExN30.2hS4o8tZ5woOWQMQWofmPXucgj0FyaW39qMJEoHh5oE`
  3. **Response** - Status 200

     ```json
     {
       "sub": "0a242f0e-444b-4d31-b4a4-b518e337736a",
       "role": "user",
       "iat": 1707506221,
       "exp": 1707507121
     }
     ```

- **GET /rofars/v1/auth/refresh** - Generates a new access token and refresh token based on the refresh token provided in the request header. The access token is valid for 15 minutes and the refresh token is valid for 7 days.

- Admin Only: ❌
- Admin Validation: ❌
- User logged: ✅
- Public: ❌

  1. **Header**
     1. Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhOGE4NmUzZi0zZjdmLTRlMDQtOWUwMy03NmU3Nzc1Nzg3NTYiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDczMTIyMTcsImV4cCI6MTcwNzMxMzExN30.2hS4o8tZ5woOWQMQWofmPXucgj0FyaW39qMJEoHh5oE`
  2. **Response** - Status 200

     ```json
     {
       "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwYTI0MmYwZS00NDRiLTRkMzEtYjRhNC1iNTE4ZTMzNzczNmEiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDc1MDY0MzQsImV4cCI6MTcwNzUwNzMzNH0.MqcB0fGChgO2rS4Ymx_QnU0MS1qJbp6tZCc2Gmo4AI0",
       "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwYTI0MmYwZS00NDRiLTRkMzEtYjRhNC1iNTE4ZTMzNzczNmEiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDc1MDY0MzQsImV4cCI6MTcwODExMTIzNH0.GC9SvXnYhM3TY7SYIr-mABp7iABFDPn4zL5yRQ7tQao"
     }
     ```

- **POST /rofars/v1/auth/forgot-password** - Sends an email with a code to be used to reset the user's password in the next endpoint - POST /rofars/v1/auth/reset-password. The generated code will be valid for 10 minutes.

- Admin Only: ❌
- Admin Validation: ❌
- User logged: ❌
- Public: ✅

  1. **Request**

     1. Body

     ```json
     {
       "email": "user@email.com"
     }
     ```

  2. **Response** - Status 201

     ```json
     {
       "message": "Email was sent sucessfully."
     }
     ```

     or

     ```json
     {
       "message": "Email was not sent."
     }
     ```

- **POST /rofars/v1/auth/reset-password** - Resets the user's password using the code sent to the user's email in the previous endpoint.

- Admin Only: ❌
- Admin Validation: ❌
- User logged: ❌
- Public: ✅

  1. **Request**

     1. Body

     ```json
     {
       "code": "123456",
       "email": "user1@email.com", //should be a valid email
       "password": "user1Password!" //should contain 8+ char., and at least one: lowercase, uppercase, digit and special char.
     }
     ```

  2. **Response** - Status 201

     ```json
     {
       "message": "Password was reset successfully."
     }
     ```

</details>

<details>
<summary><b>/users</b></summary>

- **POST /rofars/v1/users** - Creates a new user

- Admin Only: ❌
- Admin Validation: ❌
- User logged: ❌
- Public: ✅

  1. **Request**

     1. Body

     ```json
     {
       "firstname": "user6firstname", //should not contain spaces
       "lastname": "user6lasttname", //should not contain spaces
       "email": "user6@email.com", //should be a valid email
       "username": "user6_username", //should not contain spaces
       "password": "user6Password!", //should contain 8+ char., and at least one: lowercase, uppercase, digit and special char.
       "phone": "5511900007777", //country code + phone number with ddd
       "cpf": "66600066606" // should contain 11 digits
     }
     ```

  2. **Response** - Status 201

     ```json
     {
       "id": "1a97e1d9-5fa5-4301-b355-2c48db1e5dd2",
       "email": "user@email.com",
       "role": "user",
       "isActive": true
     }
     ```

- **GET /rofars/v1/users** - Retrieves a list of all users

- Admin Only: ✅
- Admin Validation: ✅
- User logged: ✅
- Public: ❌

  1. **Rules**
     1. Only tokens of users with admin role
     2. It is possible to filter by userId, passing it in the query; If it is not specified, it will return all users
     3. It the admin wants to retrieve only active users, it should pass the query `isActive=true`, if it wants to retrieve only inactive users, it should pass `isActive=false`, if it is not specified, it will return all users
  2. **Header**
     1. Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhOGE4NmUzZi0zZjdmLTRlMDQtOWUwMy03NmU3Nzc1Nzg3NTYiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDczMTIyMTcsImV4cCI6MTcwNzMxMzExN30.2hS4o8tZ5woOWQMQWofmPXucgj0FyaW39qMJEoHh5oE`
  3. **Queries**
     1. userId: string
     2. isActive: boolean
     3. Example:
        1. `GET /rofars/v1/users?userId=1a97e1d9-5fa5-4301-b355-2c48db1e5dd2?isActive=true`
  4. **Response** - Status 200

     ```json
     [
       {
         "id": "1a97e1d9-5fa5-4301-b355-2c48db1e5dd2",
         "email": "user@email.com",
         "password": "$2b$10$5mOMaQvRWcV1vTDCj.028Oh0atbfJSZYj7UdfFTbUTjWU0tcwRkfy",
         "role": "admin",
         "isActive": true,
         "blocked": false,
         "createdAt": "2024-02-05T18:22:08.267",
         "updatedAt": "2024-02-06T12:12:28.658",
         "firstname": "John",
         "lastname": "Doe",
         "phone": "5512987865432",
         "phoneVerified": false,
         "emailVerified": true,
         "cpf": "44477788822",
         "birthdate": "1995-02-07T13:23:37.832Z",
         "nationality": "brasileiro",
         "genre": "male",
         "civilStatus": "solteiro",
         "sourceMidia": "google",
         "politicalExposed": false,
         "profileImage": "https://imageurl.com",
         "refreshToken": "$argon2d$v=19$m=65536,t=2,p=4$BPi0XDSvCgCj9H4Ad+/DZQ$ZaMq/6iJ8T/vUHtpX+qcqkhyPOsfp0sxSmddY1ftqNg"
       }
     ]
     ```

- **GET /rofars/v1/users/me** - Retrieves the user logged

- Admin Only: ❌
- Admin Validation: ❌
- User logged: ✅
- Public: ❌

  1. **Rules**
     1. The user must be logged - must have a valid access token
  2. **Header**
     1. Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhOGE4NmUzZi0zZjdmLTRlMDQtOWUwMy03NmU3Nzc1Nzg3NTYiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDczMTIyMTcsImV4cCI6MTcwNzMxMzExN30.2hS4o8tZ5woOWQMQWofmPXucgj0FyaW39qMJEoHh5oE`
  3. **Param :id**
     1. Example - `GET /rofars/v1/users/2aaf9b7b-be7c-4cc6-af4f-4a0d69821acf`
  4. **Queries** - if it is true, the response object will contain its value, if is false or not specified, it will not
     1. address: boolean
     2. profession: boolean
     3. paymentData: boolean
     4. Example:
        1. `GET /rofars/v1/users/me?address=true?profession=true&paymentData=true`
  5. **Response** - Status 200

     ```json
     {
       "id": "31b562f6-bc9a-4b0b-85e3-3283806e5b9f",
       "email": "user2@email.com",
       "password": "$2b$10$bY3XUQCNbMERnPnPzhGjlO.LjUWaHUVQ3HqIAHqzLfFLPqKKOSnhG",
       "role": "admin",
       "isActive": true,
       "blocked": false,
       "firstname": "User2firstname",
       "lastname": "User2lasttname",
       "phone": "5520000000002",
       "phoneVerified": false,
       "emailVerified": false,
       "cpf": "22200022202",
       "birthdate": null,
       "nationality": null,
       "genre": null,
       "civilStatus": null,
       "sourceMidia": null,
       "politicalExposed": false,
       "profileImage": null,
       "refreshToken": "$2b$10$ws4ps2af9Hk4pUOITzUQgeYuNc0FS7v.A7VBMlAoBwMNe0O6QJoIe",
       "createdAt": "2024-01-31T19:32:03.730Z",
       "updatedAt": "2024-02-05T18:22:08.267Z",
       "Address": {
         "id": "18a14676-cebb-46f1-a79a-d6741caef96d",
         "userId": "26855122-22cb-439b-95af-0e8c23dcb1c6",
         "cep": "12345678",
         "street": "Rua das Flores",
         "number": "123",
         "complement": "Casa",
         "neighborhood": "Centro",
         "city": "São Paulo",
         "state": "SP",
         "country": "Brasil",
         "createdAt": "2021-08-25T00:00:00.143Z",
         "updatedAt": "2022-01-15T05:22:12.653Z"
       },
       "Profession": {
         "id": "d3ff0f23-bf31-4d4c-8548-358204f9cafd",
         "userId": "a8a86e3f-3f7f-4e04-9e03-76e777578756",
         "name": "Programador1222222222",
         "company": "Astro Cash2",
         "position": "Dev Backend2",
         "createdAt": "2024-02-06T21:02:30.107Z",
         "updatedAt": "2024-02-06T21:03:24.024Z"
       },
       "PaymentData": {
         "id": "2281cd94-9589-44b6-81ff-7c1651e9ca97",
         "userId": "31b562f6-bc9a-4b0b-85e3-3283806e5b9f",
         "bank": "Nubank",
         "branch": "001",
         "accountNumber": "1423431",
         "accountNumberDigit": "4",
         "pixType": "CPF",
         "pixKey": "24354657689",
         "createdAt": "2024-01-31T19:44:36.162Z",
         "updatedAt": "2024-01-31T19:44:36.162Z"
       }
     }
     ```

- **PATCH /rofars/v1/users** - Updates a user - the user logged can update their own data, and the admin can update any user data

- Admin Only: ❌
- Admin Validation: ✅
- User logged: ✅
- Public: ❌

  1. **Rules**
     1. If `password` is provided in the body, `oldPassword` will also be required
     2. Only admins can update other users, by passing their userId in the body
     3. Admins can update a user field, but never their password
  2. **Header**
     1. Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhOGE4NmUzZi0zZjdmLTRlMDQtOWUwMy03NmU3Nzc1Nzg3NTYiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDczMTIyMTcsImV4cCI6MTcwNzMxMzExN30.2hS4o8tZ5woOWQMQWofmPXucgj0FyaW39qMJEoHh5oE`
  3. **Request**

     1. Body - Obs: all fields below are optional, depending on what the user wants to change

     ```json
     {
       "email": "user@email.com",
       "password": "$2b$10$5mOMaQvRWcV1vTDCj.028Oh0atbfJSZYj7UdfFTbUTjWU0tcwRkfy",
       "role": "admin",
       "isActive": true,
       "blocked": false,
       "createdAt": "2024-02-05T18:22:08.267",
       "updatedAt": "2024-02-06T12:12:28.658",
       "firstname": "John",
       "lastname": "Doe",
       "phone": "5512987865432",
       "phoneVerified": false,
       "emailVerified": true,
       "cpf": "44477788822",
       "birthdate": "1995-02-07T13:23:37.832Z",
       "nationality": "brasileiro",
       "genre": "male",
       "civilStatus": "solteiro",
       "sourceMidia": "google",
       "politicalExposed": false
     }
     ```

  4. **Response** - Status 200

     ```json
     {
       "id": "1a97e1d9-5fa5-4301-b355-2c48db1e5dd2",
       "email": "user@email.com",
       "password": "$2b$10$5mOMaQvRWcV1vTDCj.028Oh0atbfJSZYj7UdfFTbUTjWU0tcwRkfy",
       "role": "admin",
       "isActive": true,
       "blocked": false,
       "createdAt": "2024-02-05T18:22:08.267",
       "updatedAt": "2024-02-06T12:12:28.658",
       "firstname": "John",
       "lastname": "Doe",
       "phone": "5512987865432",
       "phoneVerified": false,
       "emailVerified": true,
       "cpf": "44477788822",
       "birthdate": "1995-02-07T13:23:37.832Z",
       "nationality": "brasileiro",
       "genre": "male",
       "civilStatus": "solteiro",
       "sourceMidia": "google",
       "politicalExposed": false,
       "profileImage": "https://imageurl.com",
       "refreshToken": "$argon2d$v=19$m=65536,t=2,p=4$BPi0XDSvCgCj9H4Ad+/DZQ$ZaMq/6iJ8T/vUHtpX+qcqkhyPOsfp0sxSmddY1ftqNg",
       "createdAt": "2024-01-31T13:51:00.002Z",
       "updatedAt": "2024-02-08T19:49:44.728Z"
     }
     ```

- **DELETE /rofars/v1/users/me** - Anonymize current logged user

- Admin Only: ❌
- Admin Validation: ❌
- User logged: ✅
- Public: ❌

  1. **Rules**
     1. The user to be annonymized will be the user logged
  2. **Header**
     1. Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhOGE4NmUzZi0zZjdmLTRlMDQtOWUwMy03NmU3Nzc1Nzg3NTYiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDczMTIyMTcsImV4cCI6MTcwNzMxMzExN30.2hS4o8tZ5woOWQMQWofmPXucgj0FyaW39qMJEoHh5oE`
  3. **Response** - Status 204 (No content)

- **PATCH /rofars/v1/users/block/:id** - Blocks a user

- Admin Only: ✅
- Admin Validation: ✅
- User logged: ✅
- Public: ❌

  1. **Rules**
     1. Only tokens of users with admin role
  2. **Header**
     1. Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhOGE4NmUzZi0zZjdmLTRlMDQtOWUwMy03NmU3Nzc1Nzg3NTYiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDczMTIyMTcsImV4cCI6MTcwNzMxMzExN30.2hS4o8tZ5woOWQMQWofmPXucgj0FyaW39qMJEoHh5oE`
  3. **Param :id**
     1. Example - `GET /rofars/v1/users/block/2aaf9b7b-be7c-4cc6-af4f-4a0d69821acf`
  4. **Response** - Status 200

     ```json
     {
       "id": "ea8c5850-7f36-42c4-8093-806a3dbc9efc",
       "email": "user12@email.com",
       "password": "$2b$10$h4gWpRULKwytMqY/4XXufe386hsYuKvmehBMkwlQPb1vTOh9J630e",
       "role": "user",
       "isActive": true,
       "blocked": true,
       "firstname": "User1firstname2",
       "lastname": "User1lasttname2",
       "phone": "5510000000012",
       "phoneVerified": false,
       "emailVerified": false,
       "cpf": "11100011102",
       "birthdate": null,
       "nationality": null,
       "genre": null,
       "civilStatus": null,
       "sourceMidia": null,
       "politicalExposed": false,
       "profileImage": null,
       "refreshToken": null,
       "createdAt": "2024-03-13T14:48:40.396Z",
       "updatedAt": "2024-03-13T17:11:41.761Z"
     }
     ```

</details>

<details>
<summary><b>/products</b></summary>

- **POST /rofars/v1/products** - Creates a new product

- Admin Only: ✅
- Admin Validation: ✅
- User logged: ✅
- Public: ❌

  1. **Rules**
     1. Only tokens of users with admin role
     2. Fields essentialInformation, documents and timeline are optional
     3. Fields operation and essentialInformation are strings but are expected to be in HTML format
  2. **Header**
     1. Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhOGE4NmUzZi0zZjdmLTRlMDQtOWUwMy03NmU3Nzc1Nzg3NTYiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDczMTIyMTcsImV4cCI6MTcwNzMxMzExN30.2hS4o8tZ5woOWQMQWofmPXucgj0FyaW39qMJEoHh5oE`
  3. **Request**

     1. Body

     ```json
     {
       "title": "Cinco mil Parafusadeiras",
       "subtitle": "Participe da compra de mil parafusadeiras",
       "description": "Vel laboriosam quia in quaerat voluptatem aut odit maxime ab impedit.",
       "productPrice": 40000,
       "quotaPrice": 800,
       "totalQuotas": 50,
       "interestRate": 0.2,
       "imageUrl": "https://imageUrl.com",
       "operation": "<div><h1>Title</h1><p>Short text.</p></div>",
       "financial": {
         "deadline": "07/10/2025",
         "payments": "Amortização do Principal: Ao final da operação. Juros: Fixos: 1,10% a.m. + IPCA atualizados e pagos mensalmente.",
         "remuneration": "1,10% a.m. + IPCA atualizados e pagos mensalmente",
         "tir": "1,40% a.m.  ou  18,18% a.a.*",
         "payback": "30 meses",
         "roi": "45,3% ao longo de 30 meses"
       },
       "essentialInformation": "<div><h1>Title</h1><p>Short text.</p></div>",
       "documents": [
         {
           "title": "Certidões",
           "description": "Certidões agrupadas",
           "url": "https://imageUrl.com"
         },
         {
           "title": "Plano Financeiro",
           "description": "Todo o plano financeiro",
           "url": "https://imageUrl.com"
         }
       ],
       "timeline": [
         {
           "date": "2024-03-14T11:00:00.000Z",
           "description": "Uma remessa de 1000 unidades chegou no Brasil"
         }
       ]
     }
     ```

  4. **Response** - Status 201

  ```json
  {
    "id": "484d2836-069a-4a2f-8847-ac0da4611a0f",
    "title": "Cinco mil Parafusadeiras",
    "subtitle": "Participe da compra de mil parafusadeiras",
    "productPrice": 40000,
    "quotaPrice": 800,
    "totalQuotas": 50,
    "interestRate": 0.2,
    "imageUrl": "https://imageUrl.com",
    "isActive": true,
    "operation": "<div><h1>Title</h1><p>Short text.</p></div>",
    "financial": {
      "roi": "45,3% ao longo de 30 meses",
      "tir": "1,40% a.m.  ou  18,18% a.a.*",
      "payback": "30 meses",
      "deadline": "07/10/2025",
      "payments": "Amortização do Principal: Ao final da operação. Juros: Fixos: 1,10% a.m. + IPCA atualizados e pagos mensalmente.",
      "remuneration": "1,10% a.m. + IPCA atualizados e pagos mensalmente"
    },
    "essentialInformation": "<div><h1>Title</h1><p>Short text.</p></div>",
    "documents": [
      {
        "url": "https://imageUrl.com",
        "title": "Certidões",
        "description": "Certidões agrupadas"
      },
      {
        "url": "https://imageUrl.com",
        "title": "Plano Financeiro",
        "description": "Todo o plano financeiro"
      }
    ],
    "timeline": [
      {
        "date": "2024-03-14T11:00:00.000Z",
        "description": "Uma remessa de 1000 unidades chegou no Brasil"
      }
    ],
    "quotasSold": 0,
    "moneyRaised": 0,
    "adminSpent": 0,
    "adminSpentReceipts": [],
    "adminEarned": 0,
    "adminEarnedReceipts": [],
    "profitDistributed": 0,
    "profitDistributedReceipts": [],
    "futureDistributions": [],
    "createdAt": "2024-03-15T13:23:51.448Z",
    "updatedAt": "2024-03-15T13:23:51.448Z"
  }
  ```

- **GET /rofars/v1/products** - Retrieves a list of all products

- Admin Only: ❌
- Admin Validation: ❌
- User logged: ❌
- Public: ✅

  1. **Queries**

     1. isActive: boolean - if it is true, it will return only active products, if it is false, only inactive products, if not specified, it will return all orders
     2. Example:
        1. `GET /rofars/v1/products?isActive=true`

  2. **Response** - Status 200

  ```json
  [
    {
      "id": "484d2836-069a-4a2f-8847-ac0da4611a0f",
      "title": "Cinco mil Parafusadeiras",
      "subtitle": "Participe da compra de mil parafusadeiras",
      "productPrice": 40000,
      "quotaPrice": 800,
      "totalQuotas": 50,
      "interestRate": 0.2,
      "imageUrl": "https://imageUrl.com",
      "isActive": true,
      "operation": "<div><h1>Title</h1><p>Short text.</p></div>",
      "financial": {
        "roi": "45,3% ao longo de 30 meses",
        "tir": "1,40% a.m.  ou  18,18% a.a.*",
        "payback": "30 meses",
        "deadline": "07/10/2025",
        "payments": "Amortização do Principal: Ao final da operação. Juros: Fixos: 1,10% a.m. + IPCA atualizados e pagos mensalmente.",
        "remuneration": "1,10% a.m. + IPCA atualizados e pagos mensalmente"
      },
      "essentialInformation": "<div><h1>Title</h1><p>Short text.</p></div>",
      "documents": [
        {
          "url": "https://imageUrl.com",
          "title": "Certidões",
          "description": "Certidões agrupadas"
        },
        {
          "url": "https://imageUrl.com",
          "title": "Plano Financeiro",
          "description": "Todo o plano financeiro"
        }
      ],
      "timeline": [
        {
          "date": "2024-03-14T11:00:00.000Z",
          "description": "Uma remessa de 1000 unidades chegou no Brasil"
        }
      ],
      "quotasSold": 0,
      "moneyRaised": 0,
      "adminSpent": 0,
      "adminSpentReceipts": [],
      "adminEarned": 0,
      "adminEarnedReceipts": [],
      "profitDistributed": 0,
      "profitDistributedReceipts": [],
      "futureDistributions": [],
      "createdAt": "2024-03-15T13:23:51.448Z",
      "updatedAt": "2024-03-15T13:23:51.448Z"
    }
  ]
  ```

- **GET /rofars/v1/products/:id** - Retrieves a specific product by ID

- Admin Only: ❌
- Admin Validation: ❌
- User logged: ❌
- Public: ✅

  1. **Param :id**
     1. Example - `GET /rofars/v1/products/242dbac3-4e4e-49ec-b51c-5371fe5e67bf`
  2. **Response** - Status 200

  ```json
  {
    "id": "484d2836-069a-4a2f-8847-ac0da4611a0f",
    "title": "Cinco mil Parafusadeiras",
    "subtitle": "Participe da compra de mil parafusadeiras",
    "productPrice": 40000,
    "quotaPrice": 800,
    "totalQuotas": 50,
    "interestRate": 0.2,
    "imageUrl": "https://imageUrl.com",
    "isActive": true,
    "operation": "<div><h1>Title</h1><p>Short text.</p></div>",
    "financial": {
      "roi": "45,3% ao longo de 30 meses",
      "tir": "1,40% a.m.  ou  18,18% a.a.*",
      "payback": "30 meses",
      "deadline": "07/10/2025",
      "payments": "Amortização do Principal: Ao final da operação. Juros: Fixos: 1,10% a.m. + IPCA atualizados e pagos mensalmente.",
      "remuneration": "1,10% a.m. + IPCA atualizados e pagos mensalmente"
    },
    "essentialInformation": "<div><h1>Title</h1><p>Short text.</p></div>",
    "documents": [
      {
        "url": "https://imageUrl.com",
        "title": "Certidões",
        "description": "Certidões agrupadas"
      },
      {
        "url": "https://imageUrl.com",
        "title": "Plano Financeiro",
        "description": "Todo o plano financeiro"
      }
    ],
    "timeline": [
      {
        "date": "2024-03-14T11:00:00.000Z",
        "description": "Uma remessa de 1000 unidades chegou no Brasil"
      }
    ],
    "quotasSold": 0,
    "moneyRaised": 0,
    "adminSpent": 0,
    "adminSpentReceipts": [],
    "adminEarned": 0,
    "adminEarnedReceipts": [],
    "profitDistributed": 0,
    "profitDistributedReceipts": [],
    "futureDistributions": [],
    "createdAt": "2024-03-15T13:23:51.448Z",
    "updatedAt": "2024-03-15T13:23:51.448Z"
  }
  ```

- **PATCH /rofars/v1/products/:id** - Updates a specific product by ID

- Admin Only: ✅
- Admin Validation: ✅
- User logged: ❌
- Public: ❌

  1. **Rules**
     1. Only tokens of users with admin role
     2. If the client wants to update one field of financial, it is necessary to send the entire object
     3. If the client wants to update one field of documents, it is necessary to send the entire array
     4. If the client wants to update one field of timeline, it is necessary to send the entire array
  2. **Header**
     1. Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhOGE4NmUzZi0zZjdmLTRlMDQtOWUwMy03NmU3Nzc1Nzg3NTYiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDczMTIyMTcsImV4cCI6MTcwNzMxMzExN30.2hS4o8tZ5woOWQMQWofmPXucgj0FyaW39qMJEoHh5oE`
  3. **Request**

     1. Body - Obs: all fields below are optional, depending on what the user wants to change

     ```json
     {
       "title": "Três mil Parafusadeiras",
       "subtitle": "Participe da compra de mil parafusadeiras",
       "description": "Vel laboriosam quia in quaerat voluptatem aut odit maxime ab impedit nihil et molestiae sint et nobis aspernatur.\n",
       "productPrice": 10000,
       "quotaPrice": 10000,
       "totalQuotas": 50,
       "interestRate": 0.2,
       "imageUrl": "https://imageUrl.com",
       "isActive": true,
       "operation": "<div><h1>Title</h1><p>Short text.</p></div>",
       "financial": {
         "deadline": "07/10/2025",
         "payments": "Amortização do Principal: Ao final da operação. Juros: Fixos: 1,10% a.m. + IPCA atualizados e pagos mensalmente.",
         "remuneration": "1,10% a.m. + IPCA atualizados e pagos mensalmente",
         "tir": "1,40% a.m.  ou  18,18% a.a.*",
         "payback": "30 meses",
         "roi": "45,3% ao longo de 30 meses"
       },
       "essentialInformation": "<div><h1>Title</h1><p>Short text.</p></div>",
       "documents": [
         {
           "title": "Certidões",
           "description": "Certidões agrupadas",
           "url": "https://imageUrl.com"
         },
         {
           "title": "Plano Financeiro",
           "description": "Todo o plano financeiro",
           "url": "https://imageUrl.com"
         }
       ],
       "timeline": [
         {
           "date": "2024-03-14T11:00:00.000Z",
           "description": "Uma remessa de 1000 unidades chegou no Brasil"
         }
       ],
       "quotasSold": 0,
       "moneyRaised": 0,
       "adminSpent": 0,
       "adminSpentReceipts": [],
       "adminEarned": 0,
       "adminEarnedReceipts": [],
       "profitDistributed": 0,
       "profitDistributedReceipts": [],
       "futureDistributions": [],
       "createdAt": "2024-03-13T17:39:17.747Z",
       "updatedAt": "2024-03-13T17:39:17.747Z"
     }
     ```

  4. **Response** - Status 200

     ```json
     {
       "id": "484d2836-069a-4a2f-8847-ac0da4611a0f",
       "title": "Cinco mil Parafusadeiras",
       "subtitle": "Participe da compra de mil parafusadeiras",
       "productPrice": 40000,
       "quotaPrice": 800,
       "totalQuotas": 50,
       "interestRate": 0.2,
       "imageUrl": "https://imageUrl.com",
       "isActive": true,
       "operation": "<div><h1>Title</h1><p>Short text.</p></div>",
       "financial": {
         "roi": "45,3% ao longo de 30 meses",
         "tir": "1,40% a.m.  ou  18,18% a.a.*",
         "payback": "30 meses",
         "deadline": "07/10/2025",
         "payments": "Amortização do Principal: Ao final da operação. Juros: Fixos: 1,10% a.m. + IPCA atualizados e pagos mensalmente.",
         "remuneration": "1,10% a.m. + IPCA atualizados e pagos mensalmente"
       },
       "essentialInformation": "<div><h1>Title</h1><p>Short text.</p></div>",
       "documents": [
         {
           "url": "https://imageUrl.com",
           "title": "Certidões",
           "description": "Certidões agrupadas"
         },
         {
           "url": "https://imageUrl.com",
           "title": "Plano Financeiro",
           "description": "Todo o plano financeiro"
         }
       ],
       "timeline": [
         {
           "date": "2024-03-14T11:00:00.000Z",
           "description": "Uma remessa de 1000 unidades chegou no Brasil"
         }
       ],
       "quotasSold": 0,
       "moneyRaised": 0,
       "adminSpent": 0,
       "adminSpentReceipts": [],
       "adminEarned": 0,
       "adminEarnedReceipts": [],
       "profitDistributed": 0,
       "profitDistributedReceipts": [],
       "futureDistributions": [],
       "createdAt": "2024-03-15T13:23:51.448Z",
       "updatedAt": "2024-03-15T13:23:51.448Z"
     }
     ```

- **DELETE /rofars/v1/products/:id** - Deactivates a specific product by ID

- Admin Only: ✅
- Admin Validation: ✅
- User logged: ❌
- Public: ❌

  1. **Rules**
     1. Only tokens of users with admin role
  2. **Header**
     1. Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhOGE4NmUzZi0zZjdmLTRlMDQtOWUwMy03NmU3Nzc1Nzg3NTYiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDczMTIyMTcsImV4cCI6MTcwNzMxMzExN30.2hS4o8tZ5woOWQMQWofmPXucgj0FyaW39qMJEoHh5oE`
  3. **Response** - Status 200

     ```json
     {
       "id": "242dbac3-4e4e-49ec-b51c-5371fe5e67bf",
       "title": "Três mil Parafusadeiras",
       "subtitle": "Participe da compra de mil parafusadeiras",
       "description": "Vel laboriosam quia in quaerat voluptatem aut odit maxime ab impedit nihil et molestiae sint et nobis aspernatur.\n",
       "productPrice": 10000,
       "quotaPrice": 10000,
       "totalQuotas": 50,
       "interestRate": 0.2,
       "imageUrl": "https://imageUrl.com",
       "isActive": false,
       "operation": "<div><h1>Title</h1><p>Short text.</p></div>",
       "financial": {
         "deadline": "07/10/2025",
         "payments": "Amortização do Principal: Ao final da operação. Juros: Fixos: 1,10% a.m. + IPCA atualizados e pagos mensalmente.",
         "remuneration": "1,10% a.m. + IPCA atualizados e pagos mensalmente",
         "tir": "1,40% a.m.  ou  18,18% a.a.*",
         "payback": "30 meses",
         "roi": "45,3% ao longo de 30 meses"
       },
       "essentialInformation": "<div><h1>Title</h1><p>Short text.</p></div>",
       "documents": [
         {
           "title": "Certidões",
           "description": "Certidões agrupadas",
           "url": "https://imageUrl.com"
         },
         {
           "title": "Plano Financeiro",
           "description": "Todo o plano financeiro",
           "url": "https://imageUrl.com"
         }
       ],
       "timeline": [
         {
           "date": "2024-03-14T11:00:00.000Z",
           "description": "Uma remessa de 1000 unidades chegou no Brasil"
         }
       ],
       "quotasSold": 0,
       "moneyRaised": 0,
       "adminSpent": 0,
       "adminSpentReceipts": [],
       "adminEarned": 0,
       "adminEarnedReceipts": [],
       "profitDistributed": 0,
       "profitDistributedReceipts": [],
       "futureDistributions": [],
       "createdAt": "2024-03-13T17:39:17.747Z",
       "updatedAt": "2024-03-13T17:39:17.747Z"
     }
     ```

- **POST /rofars/v1/products/:id/admin-spent** - Updates a product with the amount spent by the admin, and its receipts

- Admin Only: ✅
- Admin Validation: ✅
- User logged: ❌
- Public: ❌

  1. **Rules**
     1. Only tokens of users with admin role
     2. Max number of files to be uploaded is 10
     3. Max file size is 10MB
  2. **Header**
     1. Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhOGE4NmUzZi0zZjdmLTRlMDQtOWUwMy03NmU3Nzc1Nzg3NTYiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDczMTIyMTcsImV4cCI6MTcwNzMxMzExN30.2hS4o8tZ5woOWQMQWofmPXucgj0FyaW39qMJEoHh5oE`
  3. **Request**

     1. Body - form-data
        | Key | Type | Value |
        |-------|------|-----------------|
        | files | File | [files uploaded] |
        | value | Text | 3200 |
     2. Param :id (productId)
     3. Example  
        <img src="https://github.com/thomasalbuquerque/rofars-backend/assets/7840248/2638ff0b-e649-488d-b2e2-32a4d0705dfb" alt="admin-spent request format" width="480"/>

  4. **Response** - Status 201

  ```json
  {
    "id": "0a2ffa07-c508-4aab-9714-142a72349f21",
    "title": "Cinco mil Parafusadeiras",
    "subtitle": "Participe da compra de mil parafusadeiras",
    "description": "Vel laboriosam quia in quaerat voluptatem aut odit maxime ab impedit.",
    "productPrice": 40000,
    "quotaPrice": 800,
    "totalQuotas": 50,
    "interestRate": 0.2,
    "imageUrl": "https://imageUrl.com",
    "isActive": true,
    "operation": "<div><h1>Title</h1><p>Short text.</p></div>",
    "financial": {
      "deadline": "07/10/2025",
      "payments": "Amortização do Principal: Ao final da operação. Juros: Fixos: 1,10% a.m. + IPCA atualizados e pagos mensalmente.",
      "remuneration": "1,10% a.m. + IPCA atualizados e pagos mensalmente",
      "tir": "1,40% a.m.  ou  18,18% a.a.*",
      "payback": "30 meses",
      "roi": "45,3% ao longo de 30 meses"
    },
    "essentialInformation": "<div><h1>Title</h1><p>Short text.</p></div>",
    "documents": [
      {
        "title": "Certidões",
        "description": "Certidões agrupadas",
        "url": "https://imageUrl.com"
      },
      {
        "title": "Plano Financeiro",
        "description": "Todo o plano financeiro",
        "url": "https://imageUrl.com"
      }
    ],
    "timeline": [
      {
        "date": "2024-03-14T11:00:00.000Z",
        "description": "Uma remessa de 1000 unidades chegou no Brasil"
      }
    ],
    "quotasSold": 4,
    "moneyRaised": 3200,
    "adminSpent": 3200,
    "adminSpentReceipts": [
      {
        "date": "2024-02-26T20:40:05.168Z",
        "receiptsUrls": [
          "https://www.example.com/receipt1",
          "https://www.example.com/receipt2"
        ]
      }
    ],
    "adminEarned": 0,
    "adminEarnedReceipts": [],
    "futureDistributions": [],
    "profitDistributed": 0,
    "profitDistributedReceipts": [],
    "createdAt": "2024-02-26T16:26:08.937Z",
    "updatedAt": "2024-02-26T20:40:05.169Z"
  }
  ```

- **POST /rofars/v1/products/:id/admin-earned** - Updates a product with the amount earned by the admin, and its receipts

- Admin Only: ✅
- Admin Validation: ✅
- User logged: ❌
- Public: ❌

  1. **Rules**
     1. Only tokens of users with admin role
     2. Max number of files to be uploaded is 10
     3. Max file size is 10MB
  2. **Header**
     1. Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhOGE4NmUzZi0zZjdmLTRlMDQtOWUwMy03NmU3Nzc1Nzg3NTYiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDczMTIyMTcsImV4cCI6MTcwNzMxMzExN30.2hS4o8tZ5woOWQMQWofmPXucgj0FyaW39qMJEoHh5oE`
  3. **Request**

     1. Body - form-data
        | Key | Type | Value |
        |-------|------|-----------------|
        | files | File | [files uploaded] |
        | value | Text | 4000 |
     2. Param :id (productId)
     3. Example
        <img src="https://github.com/thomasalbuquerque/rofars-backend/assets/7840248/73c107b7-a772-4768-86a7-bc2b031892dd" alt="admin-earned request format" width="480"/>

  4. **Response** - Status 201

  ```json
  {
    "id": "0a2ffa07-c508-4aab-9714-142a72349f21",
    "title": "Cinco mil Parafusadeiras",
    "subtitle": "Participe da compra de mil parafusadeiras",
    "description": "Vel laboriosam quia in quaerat voluptatem aut odit maxime ab impedit.",
    "productPrice": 40000,
    "quotaPrice": 800,
    "totalQuotas": 50,
    "interestRate": 0.2,
    "imageUrl": "https://imageUrl.com",
    "isActive": true,
    "operation": "<div><h1>Title</h1><p>Short text.</p></div>",
    "financial": {
      "deadline": "07/10/2025",
      "payments": "Amortização do Principal: Ao final da operação. Juros: Fixos: 1,10% a.m. + IPCA atualizados e pagos mensalmente.",
      "remuneration": "1,10% a.m. + IPCA atualizados e pagos mensalmente",
      "tir": "1,40% a.m.  ou  18,18% a.a.*",
      "payback": "30 meses",
      "roi": "45,3% ao longo de 30 meses"
    },
    "essentialInformation": "<div><h1>Title</h1><p>Short text.</p></div>",
    "documents": [
      {
        "title": "Certidões",
        "description": "Certidões agrupadas",
        "url": "https://imageUrl.com"
      },
      {
        "title": "Plano Financeiro",
        "description": "Todo o plano financeiro",
        "url": "https://imageUrl.com"
      }
    ],
    "timeline": [
      {
        "date": "2024-03-14T11:00:00.000Z",
        "description": "Uma remessa de 1000 unidades chegou no Brasil"
      }
    ],
    "quotasSold": 4,
    "moneyRaised": 3200,
    "adminSpent": 3200,
    "adminSpentReceipts": [
      {
        "date": "2024-02-26T20:54:16.773Z",
        "receiptsUrls": [
          "https://www.example.com/receipt1",
          "https://www.example.com/receipt2"
        ]
      }
    ],
    "adminEarned": 4000,
    "adminEarnedReceipts": [
      {
        "date": "2024-02-26T20:59:15.448Z",
        "receiptsUrls": [
          "https://www.example.com/receipt1",
          "https://www.example.com/receipt2"
        ]
      }
    ],
    "futureDistributions": [],
    "profitDistributed": 0,
    "profitDistributedReceipts": [],
    "createdAt": "2024-02-26T16:26:08.937Z",
    "updatedAt": "2024-02-26T20:59:15.449Z"
  }
  ```

  - **POST /rofars/v1/products/:id/future-distributions** - Updates a product with the its future distributions

- Admin Only: ✅
- Admin Validation: ✅
- User logged: ❌
- Public: ❌

  1. **Rules**
     1. Only tokens of users with admin role
     2. The objects of the array of the body will be added to the current future_distributions array field in the database
  2. **Header**
     1. Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhOGE4NmUzZi0zZjdmLTRlMDQtOWUwMy03NmU3Nzc1Nzg3NTYiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDczMTIyMTcsImV4cCI6MTcwNzMxMzExN30.2hS4o8tZ5woOWQMQWofmPXucgj0FyaW39qMJEoHh5oE`
  3. **Request**

     1. Body

     ```json
     {
       "futureDistributions": [
         {
           "date": "2024-02-23T14:00:00.000Z",
           "value": 24000
         },
         {
           "date": "2024-02-23T14:00:00.000Z",
           "value": 34000
         },
         {
           "date": "2024-02-23T14:00:00.000Z",
           "value": 44000
         }
       ]
     }
     ```

  4. **Response** - Status 201

  ```json
  {
    "id": "0a2ffa07-c508-4aab-9714-142a72349f21",
    "title": "Cinco mil Parafusadeiras",
    "subtitle": "Participe da compra de mil parafusadeiras",
    "description": "Vel laboriosam quia in quaerat voluptatem aut odit maxime ab impedit.",
    "productPrice": 40000,
    "quotaPrice": 800,
    "totalQuotas": 50,
    "interestRate": 0.2,
    "imageUrl": "https://imageUrl.com",
    "isActive": true,
    "operation": "<div><h1>Title</h1><p>Short text.</p></div>",
    "financial": {
      "deadline": "07/10/2025",
      "payments": "Amortização do Principal: Ao final da operação. Juros: Fixos: 1,10% a.m. + IPCA atualizados e pagos mensalmente.",
      "remuneration": "1,10% a.m. + IPCA atualizados e pagos mensalmente",
      "tir": "1,40% a.m.  ou  18,18% a.a.*",
      "payback": "30 meses",
      "roi": "45,3% ao longo de 30 meses"
    },
    "essentialInformation": "<div><h1>Title</h1><p>Short text.</p></div>",
    "documents": [
      {
        "title": "Certidões",
        "description": "Certidões agrupadas",
        "url": "https://imageUrl.com"
      },
      {
        "title": "Plano Financeiro",
        "description": "Todo o plano financeiro",
        "url": "https://imageUrl.com"
      }
    ],
    "timeline": [
      {
        "date": "2024-03-14T11:00:00.000Z",
        "description": "Uma remessa de 1000 unidades chegou no Brasil"
      }
    ],
    "quotasSold": 4,
    "moneyRaised": 3200,
    "adminSpent": 3200,
    "adminSpentReceipts": [
      {
        "date": "2024-02-26T20:54:16.773Z",
        "receiptsUrls": [
          "https://www.example.com/receipt1",
          "https://www.example.com/receipt2"
        ]
      }
    ],
    "adminEarned": 4000,
    "adminEarnedReceipts": [
      {
        "date": "2024-02-26T20:59:15.448Z",
        "receiptsUrls": [
          "https://www.example.com/receipt1",
          "https://www.example.com/receipt2"
        ]
      }
    ],
    "futureDistributions": [
      {
        "date": "2024-02-23T14:00:00.000Z",
        "value": 24000
      },
      {
        "date": "2024-02-23T14:00:00.000Z",
        "value": 34000
      },
      {
        "date": "2024-02-23T14:00:00.000Z",
        "value": 44000
      }
    ],
    "profitDistributed": 0,
    "profitDistributedReceipts": [],
    "createdAt": "2024-02-26T16:26:08.937Z",
    "updatedAt": "2024-02-26T20:59:15.449Z"
  }
  ```

</details>

<details>
<summary><b>/orders</b></summary>

- **POST /rofars/v1/orders** - Creates a new order

- Admin Only: ❌
- Admin Validation: ✅
- User logged: ✅
- Public: ❌

  1. **Rules**
     1. Only admins can pass userId field in the body, meaning that the admin wants to create an order for a user
     2. If the user does not have admin role, the userId will be taken from token
  2. **Header**
     1. Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhOGE4NmUzZi0zZjdmLTRlMDQtOWUwMy03NmU3Nzc1Nzg3NTYiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDczMTIyMTcsImV4cCI6MTcwNzMxMzExN30.2hS4o8tZ5woOWQMQWofmPXucgj0FyaW39qMJEoHh5oE`
  3. **Request**

     1. Body

     ```json
     {
       "productId": "46807eae-1fcc-438e-be0a-8ec0940ae5a5",
       "userId": "0a242f0e-444b-4d31-b4a4-b518e337736a", //only admins
       "quotasQuantity": 15
     }
     ```

  4. **Response** - Status 201

  ```json
  {
    "id": "da250e31-6df7-4ab2-9d91-cfa695c53b8c",
    "productId": "242dbac3-4e4e-49ec-b51c-5371fe5e67bf",
    "userId": "0a242f0e-444b-4d31-b4a4-b518e337736a",
    "quotasQuantity": 15,
    "ratioOfProduct": 0.14,
    "quantityInMoney": 5600,
    "isActive": true,
    "totalProfitToReceive": 6720,
    "paidByUser": false,
    "paidByUserReceipts": [],
    "receivedProfit": 0,
    "receivedProfitReceipts": [],
    "createdAt": "2024-03-13T17:48:38.209Z",
    "updatedAt": "2024-03-13T17:48:38.209Z"
  }
  ```

- **GET /rofars/v1/orders** - Retrieves a list of all orders

- Admin Only: ❌
- Admin Validation: ✅
- User logged: ✅
- Public: ❌

  1. **Rules**
     1. The userId in query must be the same as the user logged id, unless the user logged has admin role. If the user logged has admin role, the userId in query is optional
  2. **Header**
     1. Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhOGE4NmUzZi0zZjdmLTRlMDQtOWUwMy03NmU3Nzc1Nzg3NTYiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDczMTIyMTcsImV4cCI6MTcwNzMxMzExN30.2hS4o8tZ5woOWQMQWofmPXucgj0FyaW39qMJEoHh5oE`
  3. **Queries**

     1. userId: string
     2. isActive: boolean - if it is true, it will return only active orders, if it is false, only inactive orders, if not specified, it will return all orders
     3. Example:
        1. `GET /rofars/v1/orders?userId=31b562f6-bc9a-4b0b-85e3-3283806e5b9f&isActive=true`

  4. **Response** - Status 200

  ```json
  [
    {
      "id": "da250e31-6df7-4ab2-9d91-cfa695c53b8c",
      "productId": "242dbac3-4e4e-49ec-b51c-5371fe5e67bf",
      "userId": "0a242f0e-444b-4d31-b4a4-b518e337736a",
      "quotasQuantity": 15,
      "ratioOfProduct": 0.14,
      "quantityInMoney": 5600,
      "isActive": true,
      "totalProfitToReceive": 6720,
      "paidByUser": false,
      "paidByUserReceipts": [],
      "receivedProfit": 0,
      "receivedProfitReceipts": [],
      "createdAt": "2024-03-13T17:48:38.209Z",
      "updatedAt": "2024-03-13T17:48:38.209Z",
      "User": "{id, ..., updatedAt} -> the whole user object",
      "Product": "{id, ..., updatedAt} -> the whole product object"
    }
  ]
  ```

- **GET /rofars/v1/orders/:id** - Retrieves a specific order by ID

- Admin Only: ❌
- Admin Validation: ✅
- User logged: ✅
- Public: ❌

  1. **Rules**
     1. The order id provided in the path must be from the user logged id, unless the user logged has admin role
  2. **Header**
     1. Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhOGE4NmUzZi0zZjdmLTRlMDQtOWUwMy03NmU3Nzc1Nzg3NTYiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDczMTIyMTcsImV4cCI6MTcwNzMxMzExN30.2hS4o8tZ5woOWQMQWofmPXucgj0FyaW39qMJEoHh5oE`
  3. **Param :id**
     1. Example - `GET /rofars/v1/orders/242dbac3-4e4e-49ec-b51c-5371fe5e67bf`
  4. **Response** - Status 200

  ```json
  {
    "id": "da250e31-6df7-4ab2-9d91-cfa695c53b8c",
    "productId": "242dbac3-4e4e-49ec-b51c-5371fe5e67bf",
    "userId": "0a242f0e-444b-4d31-b4a4-b518e337736a",
    "quotasQuantity": 15,
    "ratioOfProduct": 0.14,
    "quantityInMoney": 5600,
    "isActive": true,
    "totalProfitToReceive": 6720,
    "paidByUser": false,
    "paidByUserReceipts": [],
    "receivedProfit": 0,
    "receivedProfitReceipts": [],
    "createdAt": "2024-03-13T17:48:38.209Z",
    "updatedAt": "2024-03-13T17:48:38.209Z"
  }
  ```

- **PATCH /rofars/v1/orders/:id** - Updates a specific order by ID

- Admin Only: ❌
- Admin Validation: ✅
- User logged: ✅
- Public: ❌

  1. **Rules**
     1. quotasQuantity is the only field that can be changed
     2. The order id provided in the path must be from the user logged id, unless the user logged has admin role
     3. It is not possible to update the order if it is inactive, or if it is paid by the user, or if it has already received any profit amount
     4. The quotasQuantity must be less than or equal to the totalQuotas of the product
     5. The quotasQuantity must be a positive integer
  2. **Header**
     1. Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhOGE4NmUzZi0zZjdmLTRlMDQtOWUwMy03NmU3Nzc1Nzg3NTYiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDczMTIyMTcsImV4cCI6MTcwNzMxMzExN30.2hS4o8tZ5woOWQMQWofmPXucgj0FyaW39qMJEoHh5oE`
  3. **Request**

     1. Path :id
        1. Example - `PATCH /rofars/v1/orders/242dbac3-4e4e-49ec-b51c-5371fe5e67bf`
     2. Body

     ```json
     {
       "quotasQuantity": 30
     }
     ```

  4. **Response** - Status 200

     ```json
     {
       "id": "6ca64e12-45ed-4b04-b9e8-40b969bcdd29",
       "productId": "242dbac3-4e4e-49ec-b51c-5371fe5e67bf",
       "userId": "0a242f0e-444b-4d31-b4a4-b518e337736a",
       "quotasQuantity": 30,
       "ratioOfProduct": 0.14,
       "quantityInMoney": 5600,
       "isActive": true,
       "totalProfitToReceive": 6720,
       "paidByUser": false,
       "paidByUserReceipts": [],
       "receivedProfit": 0,
       "receivedProfitReceipts": [],
       "createdAt": "2024-03-13T17:48:38.209Z",
       "updatedAt": "2024-03-13T17:48:38.209Z"
     }
     ```

- **DELETE /rofars/v1/orders/:id** - Deactivate a specific order by ID

- Admin Only: ❌
- Admin Validation: ✅
- User logged: ✅
- Public: ❌

  1. **Rules**
     1. In this endpoint, the order will be only deactivated, not deleted
     2. The order id provided in the path must be from the user logged id, unless the user logged has admin role
     3. An order can only be deactivated if it is active
     4. An order can only be deactivated if it is not paid by the user (paidByUser = false)
     5. An order can only be deactivated if it has not received any profit amount yet (receivedProfit = 0)
  2. **Header**
     1. Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhOGE4NmUzZi0zZjdmLTRlMDQtOWUwMy03NmU3Nzc1Nzg3NTYiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDczMTIyMTcsImV4cCI6MTcwNzMxMzExN30.2hS4o8tZ5woOWQMQWofmPXucgj0FyaW39qMJEoHh5oE`
  3. **Param :id** - The id is the id of the order to be deactivated
     1. Example - `DELETE /rofars/v1/orders/242dbac3-4e4e-49ec-b51c-5371fe5e67bf`
  4. **Response** - Status 204

     ```json
     {
       "id": "6ca64e12-45ed-4b04-b9e8-40b969bcdd29",
       "productId": "242dbac3-4e4e-49ec-b51c-5371fe5e67bf",
       "userId": "0a242f0e-444b-4d31-b4a4-b518e337736a",
       "quotasQuantity": 30,
       "ratioOfProduct": 0.14,
       "quantityInMoney": 5600,
       "isActive": false,
       "totalProfitToReceive": 6720,
       "paidByUser": false,
       "paidByUserReceipts": [],
       "receivedProfit": 0,
       "receivedProfitReceipts": [],
       "createdAt": "2024-03-13T17:48:38.209Z",
       "updatedAt": "2024-03-13T17:48:38.209Z"
     }
     ```

- **POST /rofars/v1/orders/:id/paid-by-user** - Updates a order with the value true in paid_by_user, and its receipts (also - updates the product with the amount received by the user +quotasSold, +moneyRaised)

- Admin Only: ✅
- Admin Validation: ✅
- User logged: ❌
- Public: ❌

  1. **Rules**
     1. Only tokens of users with admin role
     2. Max number of files to be uploaded is 10
     3. Max file size is 10MB
  2. **Header**
     1. Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhOGE4NmUzZi0zZjdmLTRlMDQtOWUwMy03NmU3Nzc1Nzg3NTYiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDczMTIyMTcsImV4cCI6MTcwNzMxMzExN30.2hS4o8tZ5woOWQMQWofmPXucgj0FyaW39qMJEoHh5oE`
  3. **Request**

     1. Body - form-data
        | Key | Type | Value |
        |-------|------|-----------------|
        | files | File | [files uploaded] |
     2. Param :id (orderId)
     3. Example
        <img src="https://github.com/thomasalbuquerque/rofars-backend/assets/7840248/7f14d970-5552-4a7a-894a-cd690e2a4705" alt="paid-by-user request format" width="480"/>

  4. **Response** - Status 201

  ```json
  {
    "id": "cf90e08a-6708-45f6-a31e-987094ef9136",
    "productId": "0a2ffa07-c508-4aab-9714-142a72349f21",
    "userId": "46807eae-1fcc-438e-be0a-8ec0940ae5a5",
    "quotasQuantity": 4,
    "ratioOfProduct": 0.08,
    "quantityInMoney": 3200,
    "isActive": true,
    "totalProfitToReceive": 3840,
    "paidByUser": true,
    "paidByUserReceipts": [
      {
        "date": "2024-02-26T20:39:33.682Z",
        "receiptsUrls": [
          "https://www.example.com/receipt1",
          "https://www.example.com/receipt2"
        ]
      }
    ],
    "receivedProfit": 0,
    "receivedProfitReceipts": [],
    "createdAt": "2024-02-26T16:27:14.110Z",
    "updatedAt": "2024-02-26T20:39:33.683Z",
    "Product": {
      "id": "0a2ffa07-c508-4aab-9714-142a72349f21",
      "title": "Cinco mil Parafusadeiras",
      "subtitle": "Participe da compra de mil parafusadeiras",
      "description": "Vel laboriosam quia in quaerat voluptatem aut odit maxime ab impedit.",
      "productPrice": 40000,
      "quotaPrice": 800,
      "totalQuotas": 50,
      "interestRate": 0.2,
      "imageUrl": "https://imageUrl.com",
      "isActive": true,
      "quotasSold": 4,
      "moneyRaised": 3200,
      "adminSpent": 0,
      "adminSpentReceipts": [],
      "adminEarned": 0,
      "adminEarnedReceipts": [],
      "futureDistributions": [],
      "profitDistributed": 0,
      "profitDistributedReceipts": [],
      "createdAt": "2024-02-26T16:26:08.937Z",
      "updatedAt": "2024-02-26T20:39:33.686Z"
    }
  }
  ```

- **GET /rofars/v1/orders/due-profit/:productId** - Retrieves a list of userId's that are due to receive profit from a specific product, and the amount they are due to receive

- Admin Only: ✅
- Admin Validation: ✅
- User logged: ❌
- Public: ❌

  1. **Rules**
     1. Only tokens of users with admin role
  2. **Header**
     1. Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhOGE4NmUzZi0zZjdmLTRlMDQtOWUwMy03NmU3Nzc1Nzg3NTYiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDczMTIyMTcsImV4cCI6MTcwNzMxMzExN30.2hS4o8tZ5woOWQMQWofmPXucgj0FyaW39qMJEoHh5oE`
  3. **Param :productId**

     1. Example - `GET /rofars/v1/orders/due-profit/6ab6191f-6950-45eb-934a-fa7b01f319a6`

  4. **Response** - Status 201

  ```json
  {
    "46807eae-1fcc-438e-be0a-8ec0940ae5a5": 3840,
    "0a242f0e-444b-4d31-b4a4-b518e337736a": 8640
  }
  ```

- **POST /rofars/v1/orders/profit-distribution** - Route to admin register how much he distributed to a user reative to a product, and the API is responsible to update all respective orders of that user and that product. It adds the proportional value distributed in received_profit field of the order, and its receipts (also updates the product with the amount distributed to the user, and its receipts +profitDistributed, profitDistributedReceipts)

- Admin Only: ✅
- Admin Validation: ✅
- User logged: ❌
- Public: ❌

  1. **Rules**
     1. Only tokens of users with admin role
     2. Max number of files to be uploaded is 10
     3. Max file size is 10MB
  2. **Header**
     1. Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhOGE4NmUzZi0zZjdmLTRlMDQtOWUwMy03NmU3Nzc1Nzg3NTYiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDczMTIyMTcsImV4cCI6MTcwNzMxMzExN30.2hS4o8tZ5woOWQMQWofmPXucgj0FyaW39qMJEoHh5oE`
  3. **Request**

     1. Body - form-data
        | Key | Type | Value |
        |-------|------|-----------------|
        | files | File | [files uploaded] |
        | productId | Text | 0a2ffa07-c508-4aab-9714-142a72349f21 |
        | userId | Text | 46807eae-1fcc-438e-be0a-8ec0940ae5a5 |
        | value | Text | 3840 |
     2. Example
        <img src="https://github.com/thomasalbuquerque/rofars-backend/assets/7840248/a198bcca-3418-4468-b8f4-7458e550eec6" alt="profit-distribution request format" width="480"/>

  4. **Response** - Status 201

  ```json
  [
    {
      "id": "cf90e08a-6708-45f6-a31e-987094ef9136",
      "productId": "0a2ffa07-c508-4aab-9714-142a72349f21",
      "userId": "46807eae-1fcc-438e-be0a-8ec0940ae5a5",
      "quotasQuantity": 4,
      "ratioOfProduct": 0.08,
      "quantityInMoney": 3200,
      "isActive": true,
      "totalProfitToReceive": 3840,
      "paidByUser": true,
      "paidByUserReceipts": [
        {
          "date": "2024-02-26T20:39:33.682Z",
          "receiptsUrls": [
            "https://www.example.com/receipt1",
            "https://www.example.com/receipt2"
          ]
        }
      ],
      "receivedProfit": 3840,
      "receivedProfitReceipts": [
        {
          "date": "2024-02-26T22:47:45.525Z",
          "receiptsUrls": [
            "https://www.example.com/receipt1",
            "https://www.example.com/receipt2"
          ]
        }
      ],
      "createdAt": "2024-02-26T16:27:14.110Z",
      "updatedAt": "2024-02-26T22:47:45.526Z",
      "Product": {
        "id": "0a2ffa07-c508-4aab-9714-142a72349f21",
        "title": "Cinco mil Parafusadeiras",
        "subtitle": "Participe da compra de mil parafusadeiras",
        "description": "Vel laboriosam quia in quaerat voluptatem aut odit maxime ab impedit.",
        "productPrice": 40000,
        "quotaPrice": 800,
        "totalQuotas": 50,
        "interestRate": 0.2,
        "imageUrl": "https://imageUrl.com",
        "isActive": true,
        "quotasSold": 13,
        "moneyRaised": 10400,
        "adminSpent": 3200,
        "adminSpentReceipts": [
          {
            "date": "2024-02-26T20:54:16.773Z",
            "receiptsUrls": [
              "https://www.example.com/receipt1",
              "https://www.example.com/receipt2"
            ]
          }
        ],
        "adminEarned": 4000,
        "adminEarnedReceipts": [
          {
            "date": "2024-02-26T20:59:15.448Z",
            "receiptsUrls": [
              "https://www.example.com/receipt1",
              "https://www.example.com/receipt2"
            ]
          }
        ],
        "futureDistributions": [],
        "profitDistributed": 3840,
        "profitDistributedReceipts": [
          {
            "date": "2024-02-26T22:47:45.530Z",
            "receiptsUrls": [
              "https://www.example.com/receipt1",
              "https://www.example.com/receipt2"
            ]
          }
        ],
        "createdAt": "2024-02-26T16:26:08.937Z",
        "updatedAt": "2024-02-26T22:47:45.531Z"
      }
    }
  ]
  ```

</details>

<details>
<summary><b>/addresses</b></summary>

- **POST /rofars/v1/addresses** - Creates a new address for the user logged

- Admin Only: ❌
- Admin Validation: ❌
- User logged: ✅
- Public: ❌

  1. **Rules**
     1. Only if the user is logged
  2. **Header**
     1. Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhOGE4NmUzZi0zZjdmLTRlMDQtOWUwMy03NmU3Nzc1Nzg3NTYiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDczMTIyMTcsImV4cCI6MTcwNzMxMzExN30.2hS4o8tZ5woOWQMQWofmPXucgj0FyaW39qMJEoHh5oE`
  3. **Request**

     1. Body

     ```json
     {
       "cep": "12234440",
       "street": "Rua das Flores",
       "number": "15",
       "complement": "Casa",
       "neighborhood": "Jardim Industrial",
       "city": "Taubaté",
       "state": "São Paulo",
       "country": "Brasil"
     }
     ```

  4. **Response** - Status 201

  ```json
  {
    "id": "0b56dac7-1460-4f09-9854-e314177c0d14",
    "userId": "46807eae-1fcc-438e-be0a-8ec0940ae5a5",
    "cep": "12234440",
    "street": "Rua das Flores",
    "number": "15",
    "complement": "Casa",
    "neighborhood": "Jardim Industrial",
    "city": "Taubaté",
    "state": "São Paulo",
    "country": "Brasil",
    "createdAt": "2024-02-09T17:13:28.254Z",
    "updatedAt": "2024-02-09T17:13:28.254Z"
  }
  ```

- **GET /rofars/v1/addresses** - Retrieves a list of all addresses

- Admin Only: ✅
- Admin Validation: ✅
- User logged: ✅
- Public: ❌

  1. **Rules**
     1. Only tokens of users with admin role
  2. **Header**
     1. Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhOGE4NmUzZi0zZjdmLTRlMDQtOWUwMy03NmU3Nzc1Nzg3NTYiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDczMTIyMTcsImV4cCI6MTcwNzMxMzExN30.2hS4o8tZ5woOWQMQWofmPXucgj0FyaW39qMJEoHh5oE`
  3. **Response** - Status 200

  ```json
  [
    {
      "id": "0b56dac7-1460-4f09-9854-e314177c0d14",
      "userId": "46807eae-1fcc-438e-be0a-8ec0940ae5a5",
      "cep": "88765440",
      "street": "Rua das Pedras",
      "number": "7788",
      "complement": "Casa",
      "neighborhood": "deleted-5cnhbb",
      "city": "Curitiba",
      "state": "Paraná",
      "country": "Brasil",
      "createdAt": "2024-02-09T17:13:28.254Z",
      "updatedAt": "2024-02-09T17:22:22.952Z"
    }
  ]
  ```

- **GET /rofars/v1/addresses/me** - Retrieves the address of the user logged

- Admin Only: ❌
- Admin Validation: ❌
- User logged: ✅
- Public: ❌

  1. **Rules**
     1. Only if the user is logged
  2. **Header**
     1. Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhOGE4NmUzZi0zZjdmLTRlMDQtOWUwMy03NmU3Nzc1Nzg3NTYiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDczMTIyMTcsImV4cCI6MTcwNzMxMzExN30.2hS4o8tZ5woOWQMQWofmPXucgj0FyaW39qMJEoHh5oE`
  3. **Response** - Status 200

  ```json
  {
    "id": "0b56dac7-1460-4f09-9854-e314177c0d14",
    "userId": "46807eae-1fcc-438e-be0a-8ec0940ae5a5",
    "cep": "12234440",
    "street": "Rua das Flores",
    "number": "15",
    "complement": "Casa",
    "neighborhood": "Jardim Industrial",
    "city": "Taubaté",
    "state": "São Paulo",
    "country": "Brasil",
    "createdAt": "2024-02-09T17:13:28.254Z",
    "updatedAt": "2024-02-09T17:13:28.254Z"
  }
  ```

- **PATCH /rofars/v1/addresses** - Updates the address of the user logged

- Admin Only: ❌
- Admin Validation: ❌
- User logged: ✅
- Public: ❌

  1. **Rules**
     1. Only if the user is logged
  2. **Header**
     1. Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhOGE4NmUzZi0zZjdmLTRlMDQtOWUwMy03NmU3Nzc1Nzg3NTYiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDczMTIyMTcsImV4cCI6MTcwNzMxMzExN30.2hS4o8tZ5woOWQMQWofmPXucgj0FyaW39qMJEoHh5oE`
  3. **Request**

     1. Body - Obs: all fields below are optional, depending on what the user wants to change

     ```json
     {
       "cep": "88765440",
       "street": "Rua das Pedras",
       "number": "7788",
       "complement": "Casa",
       "neighborhood": "Parque Industrial",
       "city": "Curitiba",
       "state": "Paraná",
       "country": "Brasil"
     }
     ```

  4. **Response** - Status 200

     ```json
     {
       "id": "0b56dac7-1460-4f09-9854-e314177c0d14",
       "userId": "46807eae-1fcc-438e-be0a-8ec0940ae5a5",
       "cep": "88765440",
       "street": "Rua das Pedras",
       "number": "7788",
       "complement": "Casa",
       "neighborhood": "Parque Industrial",
       "city": "Curitiba",
       "state": "Paraná",
       "country": "Brasil",
       "createdAt": "2024-02-09T17:13:28.254Z",
       "updatedAt": "2024-02-09T17:22:22.952Z"
     }
     ```

- **DELETE /rofars/v1/addresses** - Annonymize the address of the user logged

- Admin Only: ❌
- Admin Validation: ❌
- User logged: ✅
- Public: ❌

  1. **Rules**
     1. In this endpoint, the address will be only annonimized, not deleted
  2. **Header**
     1. Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhOGE4NmUzZi0zZjdmLTRlMDQtOWUwMy03NmU3Nzc1Nzg3NTYiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDczMTIyMTcsImV4cCI6MTcwNzMxMzExN30.2hS4o8tZ5woOWQMQWofmPXucgj0FyaW39qMJEoHh5oE`
  3. **Response** - Status 204 No Content

     ```json

     ```

</details>

<details>
<summary><b>/professions</b></summary>

- **POST /rofars/v1/professions** - Creates a new profession for the user logged

- Admin Only: ❌
- Admin Validation: ❌
- User logged: ✅
- Public: ❌

  1. **Rules**
     1. Only if the user is logged
  2. **Header**
     1. Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhOGE4NmUzZi0zZjdmLTRlMDQtOWUwMy03NmU3Nzc1Nzg3NTYiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDczMTIyMTcsImV4cCI6MTcwNzMxMzExN30.2hS4o8tZ5woOWQMQWofmPXucgj0FyaW39qMJEoHh5oE`
  3. **Request**

     1. Body

     ```json
     {
       "name": "Programador",
       "company": "Companhia A",
       "position": "Pleno"
     }
     ```

  4. **Response** - Status 201

  ```json
  {
    "id": "3f66d87f-6255-427e-99d2-9f513e8f92d5",
    "userId": "46807eae-1fcc-438e-be0a-8ec0940ae5a5",
    "name": "Programador",
    "company": "Companhia A",
    "position": "Pleno",
    "createdAt": "2024-02-09T17:19:51.031Z",
    "updatedAt": "2024-02-09T17:19:51.031Z"
  }
  ```

- **GET /rofars/v1/professions** - Retrieves a list of all professions

- Admin Only: ✅
- Admin Validation: ✅
- User logged: ✅
- Public: ❌

  1. **Rules**
     1. Only tokens of users with admin role
  2. **Header**
     1. Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhOGE4NmUzZi0zZjdmLTRlMDQtOWUwMy03NmU3Nzc1Nzg3NTYiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDczMTIyMTcsImV4cCI6MTcwNzMxMzExN30.2hS4o8tZ5woOWQMQWofmPXucgj0FyaW39qMJEoHh5oE`
  3. **Response** - Status 200

  ```json
  [
    {
      "id": "3f66d87f-6255-427e-99d2-9f513e8f92d5",
      "userId": "46807eae-1fcc-438e-be0a-8ec0940ae5a5",
      "name": "Programador",
      "company": "Companhia A",
      "position": "Pleno",
      "createdAt": "2024-02-09T17:19:51.031Z",
      "updatedAt": "2024-02-09T17:19:51.031Z"
    }
  ]
  ```

- **GET /rofars/v1/professions/me** - Retrieves the profession of the user logged

- Admin Only: ❌
- Admin Validation: ❌
- User logged: ✅
- Public: ❌

  1. **Rules**
     1. Only if the user is logged
  2. **Header**
     1. Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhOGE4NmUzZi0zZjdmLTRlMDQtOWUwMy03NmU3Nzc1Nzg3NTYiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDczMTIyMTcsImV4cCI6MTcwNzMxMzExN30.2hS4o8tZ5woOWQMQWofmPXucgj0FyaW39qMJEoHh5oE`
  3. **Response** - Status 200

  ```json
  {
    "id": "3f66d87f-6255-427e-99d2-9f513e8f92d5",
    "userId": "46807eae-1fcc-438e-be0a-8ec0940ae5a5",
    "name": "Programador",
    "company": "Companhia A",
    "position": "Pleno",
    "createdAt": "2024-02-09T17:19:51.031Z",
    "updatedAt": "2024-02-09T17:19:51.031Z"
  }
  ```

- **PATCH /rofars/v1/professions** - Updates the profession of the user logged

- Admin Only: ❌
- Admin Validation: ❌
- User logged: ✅
- Public: ❌

  1. **Rules**
     1. Only if the user is logged
  2. **Header**
     1. Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhOGE4NmUzZi0zZjdmLTRlMDQtOWUwMy03NmU3Nzc1Nzg3NTYiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDczMTIyMTcsImV4cCI6MTcwNzMxMzExN30.2hS4o8tZ5woOWQMQWofmPXucgj0FyaW39qMJEoHh5oE`
  3. **Request**

     1. Body - Obs: all fields below are optional, depending on what the user wants to change

     ```json
     {
       "name": "Programador Frontend",
       "company": "XTHub",
       "position": "Senior"
     }
     ```

  4. **Response** - Status 200

     ```json
     {
       "id": "3f66d87f-6255-427e-99d2-9f513e8f92d5",
       "userId": "46807eae-1fcc-438e-be0a-8ec0940ae5a5",
       "name": "Programador Frontend",
       "company": "XTHub",
       "position": "Senior",
       "createdAt": "2024-02-09T17:19:51.031Z",
       "updatedAt": "2024-02-09T17:49:11.564Z"
     }
     ```

- **DELETE /rofars/v1/professions** - Annonymize the profession of the user logged

- Admin Only: ❌
- Admin Validation: ❌
- User logged: ✅
- Public: ❌

  1. **Rules**
     1. In this endpoint, the profession will be only annonimized, not deleted
  2. **Header**
     1. Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhOGE4NmUzZi0zZjdmLTRlMDQtOWUwMy03NmU3Nzc1Nzg3NTYiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDczMTIyMTcsImV4cCI6MTcwNzMxMzExN30.2hS4o8tZ5woOWQMQWofmPXucgj0FyaW39qMJEoHh5oE`
  3. **Response** - Status 204 No Content

     ```json

     ```

  4. Database Data - The fields name, company and position will receive the value "deleted-[random small string]"
     ```json
     {
       "id": "3f66d87f-6255-427e-99d2-9f513e8f92d5",
       "userId": "46807eae-1fcc-438e-be0a-8ec0940ae5a5",
       "name": "deleted-dbsze",
       "company": "deleted-f6mgv",
       "position": "deleted-xf2s7q",
       "createdAt": "2024-02-09T17:19:51.031Z",
       "updatedAt": "2024-02-09T17:49:11.564Z"
     }
     ```

</details>

<details>
<summary><b>/payment-data</b></summary>

- **POST /rofars/v1/payment-data** - Creates a new payment-data for the user logged

- Admin Only: ❌
- Admin Validation: ❌
- User logged: ✅
- Public: ❌

  1. **Rules**
     1. Only if the user is logged
  2. **Header**
     1. Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhOGE4NmUzZi0zZjdmLTRlMDQtOWUwMy03NmU3Nzc1Nzg3NTYiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDczMTIyMTcsImV4cCI6MTcwNzMxMzExN30.2hS4o8tZ5woOWQMQWofmPXucgj0FyaW39qMJEoHh5oE`
  3. **Request**

     1. Body

     ```json
     {
       "bank": "Inter",
       "branch": "001",
       "accountNumber": "6554327",
       "accountNumberDigit": "1",
       "pixType": "CPF",
       "pixKey": "25345678909"
     }
     ```

  4. **Response** - Status 201

  ```json
  {
    "id": "2decdbeb-7ef2-42b2-ac38-d00398e90ff4",
    "userId": "46807eae-1fcc-438e-be0a-8ec0940ae5a5",
    "bank": "Inter",
    "branch": "001",
    "accountNumber": "6554327",
    "accountNumberDigit": "1",
    "pixType": "CPF",
    "pixKey": "25345678909",
    "createdAt": "2024-02-09T18:06:14.252Z",
    "updatedAt": "2024-02-09T18:06:14.252Z"
  }
  ```

- **GET /rofars/v1/payment-data** - Retrieves a list of all payment-data

- Admin Only: ✅
- Admin Validation: ✅
- User logged: ✅
- Public: ❌

  1. **Rules**
     1. Only tokens of users with admin role
  2. **Header**
     1. Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhOGE4NmUzZi0zZjdmLTRlMDQtOWUwMy03NmU3Nzc1Nzg3NTYiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDczMTIyMTcsImV4cCI6MTcwNzMxMzExN30.2hS4o8tZ5woOWQMQWofmPXucgj0FyaW39qMJEoHh5oE`
  3. **Response** - Status 200

  ```json
  [
    {
      "id": "2decdbeb-7ef2-42b2-ac38-d00398e90ff4",
      "userId": "46807eae-1fcc-438e-be0a-8ec0940ae5a5",
      "bank": "Inter",
      "branch": "001",
      "accountNumber": "6554327",
      "accountNumberDigit": "1",
      "pixType": "CPF",
      "pixKey": "25345678909",
      "createdAt": "2024-02-09T18:06:14.252Z",
      "updatedAt": "2024-02-09T18:06:14.252Z"
    }
  ]
  ```

- **GET /rofars/v1/payment-data/me** - Retrieves the payment-data of the user logged

- Admin Only: ❌
- Admin Validation: ❌
- User logged: ✅
- Public: ❌

  1. **Rules**
     1. Only if the user is logged
  2. **Header**
     1. Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhOGE4NmUzZi0zZjdmLTRlMDQtOWUwMy03NmU3Nzc1Nzg3NTYiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDczMTIyMTcsImV4cCI6MTcwNzMxMzExN30.2hS4o8tZ5woOWQMQWofmPXucgj0FyaW39qMJEoHh5oE`
  3. **Response** - Status 200

  ```json
  {
    "id": "2decdbeb-7ef2-42b2-ac38-d00398e90ff4",
    "userId": "46807eae-1fcc-438e-be0a-8ec0940ae5a5",
    "bank": "Inter",
    "branch": "001",
    "accountNumber": "6554327",
    "accountNumberDigit": "1",
    "pixType": "CPF",
    "pixKey": "25345678909",
    "createdAt": "2024-02-09T18:06:14.252Z",
    "updatedAt": "2024-02-09T18:06:14.252Z"
  }
  ```

- **PATCH /rofars/v1/payment-data** - Updates the payment-data of the user logged

- Admin Only: ❌
- Admin Validation: ❌
- User logged: ✅
- Public: ❌

  1. **Rules**
     1. Only if the user is logged
  2. **Header**
     1. Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhOGE4NmUzZi0zZjdmLTRlMDQtOWUwMy03NmU3Nzc1Nzg3NTYiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDczMTIyMTcsImV4cCI6MTcwNzMxMzExN30.2hS4o8tZ5woOWQMQWofmPXucgj0FyaW39qMJEoHh5oE`
  3. **Request**

     1. Body - Obs: all fields below are optional, depending on what the user wants to change

     ```json
     {
       "bank": "Nubank",
       "branch": "001",
       "accountNumber": "6554327",
       "accountNumberDigit": "1",
       "pixType": "CPF",
       "pixKey": "25345678909"
     }
     ```

  4. **Response** - Status 200

     ```json
     {
       "id": "2decdbeb-7ef2-42b2-ac38-d00398e90ff4",
       "userId": "46807eae-1fcc-438e-be0a-8ec0940ae5a5",
       "bank": "Nubank",
       "branch": "001",
       "accountNumber": "6554327",
       "accountNumberDigit": "1",
       "pixType": "CPF",
       "pixKey": "25345678909",
       "createdAt": "2024-02-09T18:06:14.252Z",
       "updatedAt": "2024-02-09T18:08:01.754Z"
     }
     ```

- **DELETE /rofars/v1/payment-data** - Annonymize the payment-data of the user logged

- Admin Only: ❌
- Admin Validation: ❌
- User logged: ✅
- Public: ❌

  1. **Rules**
     1. In this endpoint, the payment-data will be only annonimized, not deleted
  2. **Header**
     1. Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhOGE4NmUzZi0zZjdmLTRlMDQtOWUwMy03NmU3Nzc1Nzg3NTYiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDczMTIyMTcsImV4cCI6MTcwNzMxMzExN30.2hS4o8tZ5woOWQMQWofmPXucgj0FyaW39qMJEoHh5oE`
  3. **Response** - Status 204 No Content

     ```json

     ```

  4. Database Data - The fields bank, branch, accountNumber, accountNumberDigit, pixType and pixKey will be replaced by "deleted-[uuid]" in the database

     ```json
     {
       "id": "2decdbeb-7ef2-42b2-ac38-d00398e90ff4",
       "userId": "46807eae-1fcc-438e-be0a-8ec0940ae5a5",
       "bank": "deleted-2169a230-7eea-49b4-8517-890edf71d6e5",
       "branch": "deleted-70850c21-703b-422d-bc7f-e42257de2e78",
       "accountNumber": "deleted-9518cf65-0ea2-43af-bedf-7a06019bc251",
       "accountNumberDigit": "deleted-1e4a6ed3-fa12-4228-b195-d62f21e291ac",
       "pixType": "deleted-2fb05eef-3d5c-4e75-a536-f86264226659",
       "pixKey": "deleted-1708f197-95b1-457d-b52c-2852f18f6b9c",
       "createdAt": "2024-02-09T18:06:14.252Z",
       "updatedAt": "2024-02-09T18:08:01.754Z"
     }
     ```

</details>

<details>
<summary><b>/health</b></summary>

- **GET /rofars/v1/health** - Health check route

- Admin Only: ❌
- Admin Validation: ❌
- User logged: ❌
- Public: ✅

  1. **Response** - Status 200

  ```txt
  Status: OK!
  ```

</details>
