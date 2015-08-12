#GM Advisor


***

## Quick Start

Install Node.js and then:

```
$ from root of repo, run these commands. 
$ npm install
$ grunt watch //build and watch any files that are being updated in the code and re-build them
$ grunt serve //launchs a local app. server with the app. opened in a new browser
$ grunt deploy // "compile" all the project code into a deployable war file
```

### Alternate Build:

It is possible to build as a WAR archive for deployment to WebLogic or other containers. From the root of the repo run the following command to generate an advisor.war file in the app build directory.

```
$ grunt deploy
```

### App GET Request Inputs:
URL parameters can be passed when requesting /home.

General Stuff:

- Advisor ID: /index.html#/home?advisorId=123123123
- vehicleLatitude: /index.html#/home?vehicleLatitude=123.13
- vehicleLongitude: /index.html#/home?vehicleLongitude=123.13&

##Needed for Reservation section:

- User email: /index.html#/home?email=joe@test.com
- Trip #: /index.html#/home?trip_number=123123
- Last 4 digits of Credit Card number: /index.html#/home?credit_card_number=1234
- Reference ID(for which whitelabel site to load): /index.html#/home?refid=1111

##Needed to complete booking in step #4:

- firstName: /index.html#/home?firstName=Joe
- lastName: /index.html#/home?lastName=Smith
- middleName: /index.html#/home?middleName=T
- mailingAddressLine1: /index.html#/home?mailingAddressLine1=123 B Street
- mailingAddressCountryCode: /index.html#/home?mailingAddressCountryCode=CA
- mailingAddressStateProvince: /index.html#/home?mailingAddressStateProvince=NE
- mailingAddressCity: /index.html#/home?mailingAddressCity=Bakersfield
- mailingAddressPostalCode: /index.html#/home?mailingAddressPostalCode=95993
- emailAddress: /index.html#/home?emailAddress=test@test.com
- mobilePhoneNumber: /index.html#/home?mobilePhoneNumber=5555555555

##Full URL with all params:

/index.html#/home?refid=1111&advisorId=123123123&vehicleLatitude=30.270601&vehicleLongitude=-97.734233&emailAddress=joe@test.com&trip_number=123123&trip_number=1234&credit_card_number=1234&firstName=Joe&lastName=Smith&middleName=T&mailingAddressLine1=123%20B%20Street&mailingAddressCountryCode=CA&mailingAddressStateProvince=NE&mailingAddressCity=Bakersfield&mailingAddressPostalCode=95993&mobilePhoneNumber=5555555555

### API Endpoints used:
* Search for hotels: http://api.rezserver.com/api/hotel/getResultsWithCacheV2. (Specify the parameters of your search with URL parameters.)
* Get nearby cities: http://api.rezserver.com/api/hotel/getNearby
* Get suggested places for location autocomplete inputs: http://api.rezserver.com/api/hotel/getAutoSuggestV2
* Get list of rooms available in a certain hotel (used in screen 3): http://api.rezserver.com/api/hotel/getLiveRates
* Get the form for booking a room: http://secure.rezserver.com/hotels/book/. 
(Unlike all the other calls, this is a POST request. There is a hidden form in screen 4, which gets any availablecustomer information inserted into it, then is submitted to this endpoint when screen 4 is loaded. There are also URL params that can be passed with this, like refid.)


###Params for building iframe url 
Sample url - http://secure.rezserver.com/hotels/results/?latitude=&longitude=&query=Dallas%2FFort+Worth+Intl+Airport&check_in=5%2F13%2F2014&check_out=5%2F14%2F2014&rooms=1&chain_id=&refid=5935&refclickid=track_me&airport_code=DFW#p1

- latitude
- longitude
- query
- check_in
- check_out
- rooms
- chain_id
- refid
- refclickid
- airport_code


### OFFERS Application:
To access the offers application you can go to:
/offers?emailAddress=joe@test.com
or
/offers?activityId=23877&interactionId=abc1235&accountId=138293&vehicleId=283439&mobilePhoneNumber=3823322832&emailAddress=azwar@hotmail.com

This will load up all nearby offers.  From which you can select the offer(s) you would like the customer to receive by email.