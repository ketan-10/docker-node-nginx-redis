# Custome image with will run in container 
# NOTE this costom image is only for nodejs container

# Base image
FROM node:16
# default directory -> run commands on this directory
WORKDIR /app     

# Copy package.json to image to current directory -> it will be /app as its our workdir
COPY package.json .

# running command npm install 
# During build time -> when image is building
# RUN npm install 

# this is passed from argument while creating container (in 'run' command or 'docker-compose')
# dcoker will cach the image -> if image is cached with arg 'development' 
# and now we run with arg 'production' we have to re-build the image, otherwise it will use old image with 'developemt' args
ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
      then npm install; \
      else npm install --only=production; \
      fi

# COPY everything to  current image . == ./ 
# We dont want to copy all the files as node_modules are buil on docker, also dockerfile
COPY . ./

# Sequence is in this way because of cashing each step in docker, It check changes, 
# if change then only command is runed

# Create enviroment variables 
ENV PORT 3000

# Expose the port 
EXPOSE ${PORT}

# Run after deployed, at run time
# CMD ["node", "index.js"]
# This is the command run when container is created 
# CMD ["npm", "run", "dev"]
CMD [ "node", "index.js" ]


# CONTAINER ID   IMAGE                     COMMAND                  CREATED       STATUS       PORTS                                                 NAMES
# 4c91a7e19760   node_node-app-container   "docker-entrypoint.s…"   4 hours ago   Up 4 hours   3000/tcp, 0.0.0.0:4000->5000/tcp, :::4000->5000/tcp   node_node-app-container_1
# d58ff585019d   redis                     "docker-entrypoint.s…"   4 hours ago   Up 4 hours   6379/tcp                                              node_redis_1     
# 2eebc917e34a   mongo                     "docker-entrypoint.s…"   4 hours ago   Up 4 hours   27017/tcp                                             node_mongo_1   