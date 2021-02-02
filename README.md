# eq-product-role
Live Demo :- https://eq-product-role.web.app/


Solution #1 : Limiter will send the status 429(too many requests) when users make 10 requests and the time between the first and tenth request is less than 50 sec. Each request will push JWT with date.now in an array and if the array size is greater than 11 the last element JWT array object will be removed.

Solution #2.1 : To Visualize data in various charts, "Chart.js" is used.
         #2.2 : For implementing Fuzzy search, "Fuse.js" is used.
         #2.3 : For visualizing map location, "mapbox" is used displaying a map on a canvas and "Leaflet" is used to drop a marker on specified coordinates 
         
         
Express app:- https://git.heroku.com/eq-product-role.git

![alt text](https://github.com/ShubhamRanaDev/eq-product-role/blob/main/Client/public/gif1.gif " Gif")


