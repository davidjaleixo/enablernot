## Notification Enabler
### Read me

#### 1. Prerequisite

In order to run this enabler code on your local machine you should have installed Docker.

#### 2. Instalation

Make sure the docker is installed on the system environment. 

##### 2.1. Clone the code repository:

`git clone https://<username>@opensourceprojects.eu/git/p/vfos/assets/enablers/nen/code vfos-assets-enablers-nen-code`

##### 2.2. Run multi-container Docker application

`This multi-container Docker application is composed by two services: `enabler` and `MySQL`.`

`Navigate to the clone directory and execute `docker-compose up --build` to startup the multi-container enabler on background.`

#### 2.3. Configuration JSON File

Notification enabler will need the following Variables on JSON File:
`{
    "Email":{
        "USEREMAIL": "user_email",
        "USERPWD": "password_email",
        "EMAILON": "false"
    },
    "Database":{
        "DBUSER": "rootUser_db",
        "DBPASSWORD": "rootPassword_db",
        "DATABASE": "name_db",
        "DBCONLIMIT": connectionLimit_db,
        "DBDEBUG": "debug_db"
    },
    "Logger":{
        "DEBUGLEVEL": "level_debug"
    },
    "Enabler":{
        "PORT": port,
    }
}`

`This Variables will be in config.json, locate on the clone directory.`

#### 3. Usage

It´s necessary create a folder named `dbdata` on the clone directory.

Whenever it's needed to have this enabler runnig, please execute `docker-compose up`.

Using your favorite web browser please navigate to `localhost:5919` to reach the frontend module.
Please note that `<localhost>` it's related to the Docker environment which you are using.

The following Frontend endpoints are now available:
`localhost:5919/`
`localhost:5919/:developerid`
`localhost:5919/:developerid/:appid`
`localhost:5919/:developerid/:appid/listrules`
`localhost:5919/:developerid/:appid/create/rule`
`localhost:5919/:developerid/:appid/:rulesid/statistics`
`localhost:5919/create/new/app/:developerid`
`localhost:5919/:developerid/:appid/:rulesid/edit`


#### 4. API

API latest version is <v0>. To use it please replace `<api_version>` with `v0`.
    

## vf-OS Enablers

### Enabler 2 - Register vApp

```http
POST /api/vf-os-enabler/v0/register
Accept: */*
Content-Type: application/json; charset=utf-8

{
    "appID":[
        "my_appID1"
    ],
    "developerID":[
        "my_developerID"
    ]
}
```

```http
HTTP/1.1 200 OK
Content-type: application/json
X-Powered-By: Express
Date: Tue, 29 Aug 2017 15:00:00 GMT
Connection: keep-alive
Transfer-Encondig: chunked

    "success": true,
    "data": {
        "token": "Z58oqMmXJJzC1KHAaPurgohg00xgklomu5DVXgcZwj4"
    }
```

Use this API call whenever is needed to create vApp.

#### Request
`POST /api/vf-os-enabler/<api_version>/register`

#### URL Parameters

Resource Parameter | Description
------------------ | -----------
api_version        | Identifies the API version that will be used for the request.

#### JSON Body Payload

Name          | Required    | Type   | Description
------------- | ----------- | ------ | -----------
appID         |    Yes      | STRING | String where is the appID.  
developerID   |    Yes      | STRING | String where is the developerID.  

Example of JSON body payload structure: 
`   {
        "appID": [
            "TR3",
            "TR4"
         ],
        "developerID": [
            "miguel.rodrigues@knowledgebiz.pt",
            "miguel.rodrigues@knowledgebiz.pt"
         ],
    }`

#### Return Payload

The API response will contain a JSON document with the property `success`: **true**, **false** and the `data` if the `success` became **false**.

Example:

```json
{
    "success": true,
    "data": [
        {
            "token": "CQegGDPYvXRSEc6aGS19D4yRNn0usWnS8tyiDNC6ji3"
        },
        {
            "token": "4q6xB8dsjwy9dv5NN4Thdd6zCO75K6SiF82aJHC45rb"
        }
    ]
}
```

#### Return Codes
Code | Description
---- | ----
200  | Register Vapp: Successfully.
404  | App is already registered or AppID is Null.
500  | Internal Server Error - There was an unexpected error at some point during the processing of the request.


### Enabler 2 - Create Rules

```http
POST /api/vf-os-enabler/v0/notification/rules
Accept: */*
Content-Type: application/json; charset=utf-8

{
    "body":[
        {
            "appID": "AppID",
            "description": "Description",
            "parameter": "Parameter",
            "conditionValue": "Condition Value",
            "controlValue": "Control Value",
            "threshold": "Threshold",
            "notifyType": "Notify Type",
            "notificationType": "Notification Type",
            "hostname": "Hostname",
            "port": "Port",
            "path": "Path",
            "method": "Method",
            "emailTo":[
                "emailTo_1",
                "emailTo_2"
            ]
        }
    ]
}
```

```http
HTTP/1.1 200 OK
Content-type: application/json
X-Powered-By: Express
Date: Tue, 29 Aug 2017 15:00:00 GMT
Connection: keep-alive
Transfer-Encondig: chunked

{
    "success": true,
    "data": [
        {
            "description": "Description",
            "ruleId": 101,
            "reason": "Success"
        }
    ]
}
```

Use this API call whenever is needed to create a rule of vApp.

#### Request
`POST /api/vf-os-enabler/<api_version>/notification/rules/`

#### URL Parameters

Resource Parameter | Description
------------------ | -----------
api_version        | Identifies the API version that will be used for the request.

#### JSON Body Payload

Name             | Required | Type   | Description
---------------- | -------- | ------ | -----------
appID            | Yes      | STRING | String where is the vAppID. 
description      | Yes      | STRING | String where is the description.
parameter        | Yes      | STRING | String where is the parameter for the rule.
conditionValue   | Yes      | STRING | String where is the conditionValue (>, <, >=, <=).
controlValue     | Yes      | STRING | String where is the controlValue.
threshold        | Yes      | STRING | String where is the Threshold.
notifyType       | Yes      | STRING | String where is the notifyType ("Email" or "HTTP Request").
notificationType | Yes      | STRING | String where is the Notification Type (1 - Notify End of Month, 2 - Notify End of Two Weeks, 3 - Notify End of Week, 4 - Notify End of Three Days, 5 - Notify Immediately).
hostname         | Yes      | STRING | String where is the Hostname.
port             | Yes      | STRING | String where is the Port.
path             | Yes      | STRING | String where is the Path.
method           | Yes      | STRING | String where is the Method ("POST", "GET", "PUT" or "DELETE").
emailTo          | Yes      | STRING | Array of Strings where is the emails.

Example of JSON body payload structure: 
`{
    "body": [
    {
            "appID": "TR1",
            "description": "TR97",
            "parameter": "TR47",
            "conditionValue": ">",
            "controlValue": "47",
            "threshold": "20",
            "notifyType": "Email",
            "notificationType": 5,
            "hostname": "null",
            "port": 0,
            "path": "null",
            "method": "null",
            "emailTo": [
                "miguel.rodrigues@knowledgebiz.pt",
                "miguel.andre.rodrigues@gmail.com",
                "ma.rodrigues@campus.fct.unl.pt"
            ]
    },
        {
            "appID": "TR1",
            "description": "TR87",
            "parameter": "TR57",
            "conditionValue": ">",
            "controlValue": "57",
            "threshold": "20",
            "notifyType": "HTTP Request",
            "notificationType": 0,
            "hostname": "teste",
            "port": 80,
            "path": "/api",
            "method": "POST",
            "emailTo": [
                "miguel.rodrigues@knowledgebiz.pt",
                "miguel.andre.rodrigues@gmail.com",
                "ma.rodrigues@campus.fct.unl.pt"
            ]
        }
]
}`

#### Return Payload

The API response will contain a JSON document with the property `success`: **true**, **false** and the `reason` if the `success` became **false**.

Example:

```json
{
    "success": true,
    "data": [
        {
            "description": "TR97",
            "ruleId": 101,
            "reason": "Success"
        },
        {
            "description": "TR87",
            "ruleId": 102,
            "reason": "Success"
        }
    ]
}
```

#### Return Codes
Code | Description
---- | ----
200  | Rule created successfully.
500  | Internal Server Error - There was an unexpected error at some point during the processing of the request.


### Enabler 2 - Create Notifications

```http
POST /api/vf-os-enabler/v0/notifications
Accept: */*
Content-Type: application/json; charset=utf-8

{
    "token":"my_token",
    "body":[
        {"subject":"my_Subject_1",
         "subjectValue": "my_SubjectValue_1"
        },
        {"subject":"my_Subject_2",
         "subjectValue": "my_SubjectValue_2"
        },
        {"subject":"my_Subject_3",
         "subjectValue": "my_SubjectValue_3"
        }
    ]
}
```

```http
HTTP/1.1 200 OK
Content-type: application/json
X-Powered-By: Express
Date: Tue, 29 Aug 2017 15:00:00 GMT
Connection: keep-alive
Transfer-Encondig: chunked

{
    "success": true,
    "reason": [
        {
            "subject": "my_Subject_1",
            "subjectValue": "my_SubjectValue_1",
            "total": 1,
            "results": [
                {
                    "ruleid": 1,
                    "success": true,
                    "comment": "Rule applied",
                    "notType": 5
                }
            ]
        }
    ]
}
```

Use this API call whenever is needed to create a new notification.

#### Request
`POST /api/vf-os-enabler/<api_version>/notifications`

#### URL Parameters

Resource Parameter | Description
------------------ | -----------
api_version        | Identifies the API version that will be used for the request.

#### JSON Body Payload

Name    | Required    | Type   | Description
------- | ----------- | ------ | -----------  
token   |    Yes      | STRING | String where is the token. 
body    |    Yes      | JSON   | JSON document where is the subject and subjectValue. 

Example of JSON body payload structure: 
`   {
        "token": "string",
        "body": [
            {
                "subject" : "stirng",
                "subjectValue" : "string"
            },{
                "subject" : "string",
                "subjectValue" : "string"
            },{
                "subject" : "stirng",
                "subjectValue" : "string"
            }
        ]
    }`

#### Return Payload

The API response will contain a JSON document with the property `success`: **true**, **false** and the `reason` if the `success` became **false**.

Example:

```json
{
    "success": true,
    "reason": [
        {
            "subject": "TR37",
            "subjectValue": "100",
            "total": 1,
            "results": [
                {
                    "ruleid": 1,
                    "success": true,
                    "comment": "Rule applied",
                    "notType": 5
                }
            ]
        }
    ]
}
```

#### Return Codes
Code | Description
---- | ----
200  | Notification created successfully.
404  | There is no Rules for this vApp.
500  | Internal Server Error - There was an unexpected error at some point during the processing of the request.


### Enabler 2 - Get Apps

```http
GET /api/vf-os-enabler/v0/getApps/david.aleixo@knowledgebiz.pt
Accept: */*
```


```http
HTTP/1.1 200 OK
Content-type: application/json
X-Powered-By: Express
Date: Tue, 29 Aug 2017 13:00:00 GMT
Connection: keep-alive
Transfer-Encondig: chunked

{
    "success": true,
    "data": [
        {
            "token": "token",
            "appID": "AppID",
            "developerID": "DeveloperID"
        }
    ]
}
```
Use this API call whenever is needed to retrieve all apps of developerid.

#### Request
`GET /api/vf-os-enabler/<api_version>/getApps/<developer_id>`


#### URL Parameters

Resource Parameter | Description
------------------ | -----------
api_version        | Identifies the API version that will be used for the request.
developer_id       | Identifies the Developer.


#### Return Payload

The API response will contain a JSON document with the property `success`: **true**, **false** and the `data` with the notifications of app (if found).

In the following Example it's queried the all Apps of specific developerID:

```json
{
    "success": true,
    "data": [
        {
            "token": "0ahobLza90bTxNPF9wBYVOtMCoPOD8DMonijqthUila",
            "appID": "TR",
            "developerID": "miguel.rodrigues@knowledgebiz.pt"
        }
    ]
}
```

#### Return Codes
Code | Description
---- | -----------
200  | Data Found.
404  | DeveloperID does not exist.
500  | Internal Server Error - There was an unexpected error at some point during the processing of the request.


### Enabler 2 - Get Rules

```http
GET /api/vf-os-enabler/v0/getRules/myawesomeappid
Accept: */*
```

```http
HTTP/1.1 200 OK
Content-type: application/json
X-Powered-By: Express
Date: Tue, 29 Aug 2017 11:04:31 GMT
Connection: keep-alive
Transfer-Encondig: chunked

{
    "success": true,
    "data": [
        {
            "rulesID": ruleID,
            "description": "Description",
            "parameter": "Parameter",
            "conditionValue": "Condition Value",
            "controlValue": "Control Value",
            "threshold": "Threshold",
            "notifyType": "Notify Type",
            "emailTo": "Emails",
            "notificationType": notificationType,
            "hostname": "Hostname",
            "port": Port,
            "path": "Path",
            "method": "Method",
            "token": "Token"
        }
    ]
}
```

Use this API call whenever is needed to retrieve all rules related to vApp.  

#### Request
`GET /api/vf-os-enabler/<api_version>/getRules/<app_id>`

#### URL Parameters

Resource Parameter | Description
------------------ | -----------
api_version        | Identifies the API version that will be used for the request.
app_id             | Identifies the APP.


#### Return Payload

The API response will contain a JSON document with the property `success`: **true**, **false** and the `data` with the rules of app (if found).

In the following Example it's queried all rules related to specific appID:


```json
{
    "success": true,
    "data": [
        {
            "rulesID": 1,
            "description": "TR37",
            "parameter": "TR37",
            "conditionValue": ">",
            "controlValue": "37",
            "threshold": "10",
            "notifyType": "Email",
            "emailTo": "miguel.rodrigues@knowledgebiz.pt,miguel.andre.rodrigues@gmail.com,ma.rodrigues@campus.fct.unl.pt",
            "notificationType": 5,
            "hostname": "null",
            "port": 0,
            "path": "null",
            "method": "null",
            "token": "0ahobLza90bTxNPF9wBYVOtMCoPOD8DMonijqthUila"
        }
    ]
}
```

#### Return Codes
Code | Description
---- | -----------
200  | Data Found.
404  | AppID Incorrect.
500  | Internal Server Error - There was an unexpected error at some point during the processing of the request.


### Enabler 2 - Get Notifications

```http
GET /api/vf-os-enabler/v0/getNotifications/myawesomeappid
Accept: */*
```

```http
HTTP/1.1 200 OK
Content-type: application/json
X-Powered-By: Express
Date: Tue, 29 Aug 2017 11:04:31 GMT
Connection: keep-alive
Transfer-Encondig: chunked

{
    "success": true,
    "data": [
        {
            "notificationID": 1,
            "subject": "Subject = Value of subject",
            "date": "2018-06-29T17:03:50.000Z",
            "token": "0ahobLza90bTxNPF9wBYVOtMCoPOD8DMonijqthUila",
            "rulesID": 2
        }
    ]
}
```
Use this API call whenever is needed to retrieve all notifications of vApp.

#### Request
`GET /api/vf-os-enabler/<api_version>/getNotifications/<app_id>`


#### URL Parameters

Resource Parameter | Description
------------------ | -----------
api_version        | Identifies the API version that will be used for the request.
app_id             | Identifies the APP to show the notifications.


#### Return Payload

The API response will contain a JSON document with the property `success`: **true**, **false** and the `data` with the notifications of app (if found).

In the following Example it's queried the all notifications of specific appID:

```json
{
    "success": true,
    "data": [
        {
            "notificationID": 1,
            "subject": "TR37 = 100",
            "date": "2018-06-29T17:03:50.000Z",
            "token": "0ahobLza90bTxNPF9wBYVOtMCoPOD8DMonijqthUila",
            "rulesID": 1
        }
    ]
}
```

#### Return Codes
Code | Description
---- | -----------
200  | Data Found.
404  | AppID Incorrect.
500  | Internal Server Error - There was an unexpected error at some point during the processing of the request.


### Enabler 2 - Get Statistics

```http
GET /api/vf-os-enabler/v0/getStatistics/1
Accept: */*
```

```http
HTTP/1.1 200 OK
Content-type: application/json
X-Powered-By: Express
Date: Tue, 29 Aug 2017 11:04:31 GMT
Connection: keep-alive
Transfer-Encondig: chunked

{
    "success": true,
    "data": [
        {
            "statisticsID": 102,
            "date": "2018-07-05T13:07:35.000Z",
            "result": "true",
            "subjectValue": "80",
            "subject": "TR47",
            "rulesID": 80
        }
    ],
    "total": {
        "totalNotifications": 1,
        "totalNotificationsApplyByRules": 1,
        "averageValue": "80.00",
        "percentage": "100.00"
    }
}
```

Use this API call whenever is needed to retrieve all statistics related to Rule.  

#### Request
`GET /api/vf-os-enabler/<api_version>/getStatistics/<rule_id>`

#### URL Parameters

Resource Parameter | Description
------------------ | -----------
api_version        | Identifies the API version that will be used for the request.
rule_id             | Identifies the Rule.


#### Return Payload

The API response will contain a JSON document with the property `success`: **true**, **false** and the `data` with the statistics of rule (if found).

In the following Example it's queried all statistics related to specific ruleID:


```json
{
    "success": true,
    "data": [
        {
            "statisticsID": 102,
            "date": "2018-07-05T13:07:35.000Z",
            "result": "true",
            "subjectValue": "80",
            "subject": "TR47",
            "rulesID": 80
        }
    ],
    "total": {
        "totalNotifications": 1,
        "totalNotificationsApplyByRules": 1,
        "averageValue": "80.00",
        "percentage": "100.00"
    }
}
```

#### Return Codes
Code | Description
---- | -----------
200  | Data Found.
404  | RuleID Incorrect.
500  | Internal Server Error - There was an unexpected error at some point during the processing of the request.


### Enabler 2 - Delete vApp

```http
DELETE /api/vf-os-enabler/v0/app/myawesomeappid
Accept: */*
```


```http
HTTP/1.1 200 OK
Content-type: application/json
X-Powered-By: Express
Date: Tue, 29 Aug 2017 13:00:00 GMT
Connection: keep-alive
Transfer-Encondig: chunked

{
    "success": true,
    "data": "Delete Vapp Successfully"
}
```
Use this API call whenever is needed to delete vApp.

#### Request
`DELETE /api/vf-os-enabler/<api_version>/app/<app_id>`


#### URL Parameters

Resource Parameter | Description
------------------ | -----------
api_version        | Identifies the API version that will be used for the request.
app_id             | Identifies the APP.


#### Return Payload

The API response will contain a JSON document with the property `success`: **true**, **false**.

In the following Example it's delete the vApp:

```json
{
    "success": true,
    "data": "Delete Vapp Successfully"
}
```

#### Return Codes

Code | Description
---- | ---
200  | Delete Vapp Successfully.
404  | AppID Incorrect.
500  | Internal Server Error - There was an unexpected error at some point during the processing of the request.


### Enabler 2 - Delete Rules

```http
DELETE /api/vf-os-enabler/v0/rule/1
Accept: */*
```


```http
HTTP/1.1 200 OK
Content-type: application/json
X-Powered-By: Express
Date: Tue, 29 Aug 2017 13:00:00 GMT
Connection: keep-alive
Transfer-Encondig: chunked

{
    "success": true,
    "data": "Delete Rule Successfully"
}
```
Use this API call whenever is needed to delete rule of vApp.

#### Request
`DELETE /api/vf-os-enabler/<api_version>/rule/<rule_id>`


#### URL Parameters

Resource Parameter | Description
------------------ | -----------
api_version        | Identifies the API version that will be used for the request.
rule_id            | Identifies the Rule.


#### Return Payload

The API response will contain a JSON document with the property `success`: **true**, **false**.

In the following Example it's delete the rule:

```json
{
    "success": true,
    "data": "Delete Rule Successfully"
}
```

#### Return Codes
Code | Description
---- | -----------
200  | Delete Rule Successfully.
404  | RuleID Incorrect.
500  | Internal Server Error - There was an unexpected error at some point during the processing of the request.


### Powered by:

![alt text](https://static.wixstatic.com/media/d65bd8_d460ab5a6ff54207a8ac3e7497af18c4~mv2_d_4201_2594_s_4_2.png "Notification Enabler")