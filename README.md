# MongoJustMeatServer
## A simple server with CRUD Api that use mongo as storage method using Ionic.


#### :page_facing_up: USAGE :page_facing_up:



### - :fork_and_knife: restaurant.ts :fork_and_knife:
###### Restaurant takes ID, name, address, email, plates, typology, raiting. 

##### Within the restaurant.ts are implemented several functions, starting from the possibility to create and add a new restaurant to the network, to finish with many filtering methods to quickly find a particular information.


 ###### POST call
 
**- `(/restaurant)`** Creating a new Restaurant.

###### PUT call

 **- `(/:id)`** Searching restaurant by ID .

 **- `(/:id/status)`** Changing status of order by using ID of the order .
 
 **- `(/:restaurantId/raiting)`** Calculate Restaurant raiting, using a PUT and not a GET cause changing the default value (0)
 
 ###### DELETE call
 
**- `(/:id)`** Delete a Restaurant using ID.





### - :stew: orders.ts :stew:
###### Order takes user, restaurant, date, shippingAddress, OrderItems, totalAmount, rating, statusOrder (NEW,ACCEPTED,SHIPPED,DELIVERED).

##### Through the order.ts is possible to manage every kind of order the users have made. 


 ###### POST call

**- `(/orders)`** Creating new Order.

###### DELETE call

**- `(/delete/:id)`** Searching order by ID and delete it.



### - :woman: user.ts :man:
###### User takes username, password, name, surname, address, phone, email.


###### GET call:

**- `(/users)`** Searching all the users.

**- `(/users/:userId/orders)`** Searching user ID and checking the orders connected with.


 ###### POST call

**- `(/users/login)`** Allow an user to log in.

**- `(/users/)`** Creating a new user.

###### PUT call

**- `(/users/:username)`** Used for changing user informations.

**- `(/users/putRating/:restaurantId)`** Allows an user to put a rating to a Restaurant

###### DELETE call

**- `(/users/:username)`** Delete the user.





#### - :honeybee: API :honeybee:

The API calls, to manage the requests from a client are implemented following the CRUD basic operations (Create, Read, Update, Delete), according to the REST philosophy (Post, Get, Put, Delete). 



#### :bust_in_silhouette: CONTRIBUTORS :bust_in_silhouette:
- RedMemories (https://github.com/RedMemories)
- stealth90 (https://github.com/stealth90)
- davideturzo (https://github.com/davideturzo)
- Zelos23 (https://github.com/Zelos23)
- Peppe01 (https://github.com/Peppe01)
- domenicosf92 (https://github.com/domenicosf92)


#### NPM MODULES
- Express
- body-parser
- UTIL
- UUID
- bcryptjs
- cors 
- express-validator
- jsonwebtoken
- mongoose
- nodemon
- socket.io
- swagger-ui-express
`
