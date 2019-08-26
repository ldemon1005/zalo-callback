# Introduction
This is VNPOST GATEWAY API
# Authentication
Use Salesforce username/password login.
<!-- ReDoc-Inject: <security-definitions> -->
# Status code
| Code | Description |
| ---- | ----------- |
| 200 | Success |
| 201 | Success |
| 204 | Success |
| 401 |  Unauthorized   |
| 400 |  Bad request   |
| 403 | Forbidden |
| 404 |  Not found   |
| 500 |  Server error   |
| 502 |  Database Error   |
| 503 | Unavailable |

# Getting Started Guide

## Query q:

Query with LIKE AND Equal

```
Name LIKE 'A%' AND MailingState='California'
```

Query with >, <

```
CreatedDate > 2011-04-26T10:00:00-08:00
```

Using null

```
ActivityDate != null
```

```
Contact.LastName = null
```

Filtering on Boolean Fields

```
BooleanField = TRUE
```

Query with And Or

```
fieldExpression1 AND (fieldExpression2 OR fieldExpression3)
```

```
(fieldExpression1 AND fieldExpression2) OR fieldExpression3
```

Query with multi-select picklists

```
MSP1__c = 'AAA;BBB'
```

```
MSP1__c includes ('AAA;BBB','CCC')
```
