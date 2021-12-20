# docker-node-nginx-redis

- By freeCodeCamp.org [Learn Docker - DevOps with Node.js & Express](https://youtu.be/9zUHg7xjIqQ)
- [What is Docker Volume | How to create Volumes | What is Bind Mount | Docker Storage](https://youtu.be/VOK06Q4QqvE)

- `Nginx` is baiscally a load balancer, but it is very fast as it's asynchronous i.e It does not wait for response to comeback. <br>
  Here nginx is forwording the request to `http://node-app-container:5000` <br> 
  Which is a internal DNS created by docker-compose, <br> 
  As both `nginx` and `node-app-container` is created by same docker-compose. <br>
  Here we have multiple `node-app-container` created by docker-componse but `nginx` is not load balancing, <br>
  It's done by internet DNS only not `nginx`. <br>
  Here We are uing `nginx` just for `reverse-proxy`, <br>
  Just like `proxy` server takes the `outgoing-trafic` from `host-machine` and `redirects` it to actual address, <br>
  So `target` will only know the `proxy` address not the acutal `host-machine`, Or It could be used for monitoring or some special sites might only be accessible by `proxy`. <br>
  Where as `reverse-proxy` Takes the `incoming-request to the server` and `proxy` the request for actual `resolver-servers`. <br>
