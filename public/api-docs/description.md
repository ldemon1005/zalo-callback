# Introduction
This is Salesforce Commerce API

# Authentication
Use Salesforce 
 - client_id 
 - client_secret 
 - username 
 - password 
# Status code
| Code | Description |
| ---- | ----------- |
| 200 | “OK” success code, for GET or HEAD request. |
| 201 | “Created” success code, for POST request. |
| 204 | “No Content” success code, for DELETE request. |
| 300 | The value returned when an external ID exists in more than one record. The response body contains the list of matching records.|
| 304 | The request content has not changed since a specified date and time. The date and time is provided in a If-Modified-Since header. See Get Object Metadata Changes for an example. |
| 400 | The request couldn’t be understood, usually because the JSON or XML body contains an error.   |
| 401 | The session ID or OAuth token used has expired or is invalid. The response body contains the message and errorCode. |
| 403 | The request has been refused. Verify that the logged-in user has appropriate permissions. If the error code is REQUEST_LIMIT_EXCEEDED, you’ve exceeded API request limits in your org. |
| 404 | The requested resource couldn’t be found. Check the URI for errors, and verify that there are no sharing issues.   |
| 405 | The method specified in the Request-Line isn’t allowed for the resource specified in the URI.   |
| 409 |  The request could not be completed due to a conflict with the current state of the resource. Check that the API version is compatible with the resource you are requesting.   |
| 414 | The length of the URI exceeds the 16,384 byte limit. |
| 415 | The entity in the request is in a format that’s not supported by the specified method. |
| 431 | The combined length of the URI and headers exceeds the 16,384 byte limit. |
| 500 | An error has occurred within Lightning Platform, so the request couldn’t be completed. Contact Salesforce Customer Support. |

# Getting Started Guide

<p>Link document SOQL: <a href="https://blog.bessereau.eu/assets/pdfs/salesforce_soql_sosl.pdf" target="_blank">click here</a>.</p>

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
