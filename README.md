# SIT Profile Analyzer Client

## I. Deploy & Run

> Deploy app on developer mode.

if you have docker available on your server just Replace proxy_pass on docker/config/nginx.conf to your server and run the command: 


```bash
  docker-compose up -d
```

### 1. Prerequisites

- Yarn
- NodeJs
- Nginx Server

You shouldn't execute yarn command or any command relate to nodejs on sudo mode. Only install nodejs on standard user.

### 2. Install

> yarn install

### 3. Setup server api

#### a. Dev mode

Open config.js and find proxy block. Replace 'target' with your server.

```javascript
...
  dev: {
  '/api/': {
    target: 'http://localhost:4500',
    changeOrigin: true,
    pathRewrite: {
      '^': '',
    },
  },
...
```

#### b. Deploy mode

Replace proxy_pass on docler/nginx.conf to your server then copy this file to /etc/nginx/conf.d then restart server nginx to apply.

> sudo service nginx restart

```nginx
server {
    server_name _;
    listen 80 default_server;
# gzip config
    gzip on;
    gzip_min_length 1k;
    gzip_comp_level 9;
    gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;
    gzip_vary on;
    gzip_disable "MSIE [1-6]\.";
    root /usr/share/nginx/html;
# Limit size
    client_max_body_size 20M;
    location / {
# Used in conjunction with browserHistory
        try_files $uri $uri/ /index.html;
    }
    location /api {
        rewrite /(.*) /$1 break;
        proxy_pass http://localhost:4500;
        proxy_redirect off;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Host $server_name;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header X-Forwarded-Host $server_name;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_http_version 1.1;
    }
    location /images {
        rewrite /(.*) /$1 break;
        proxy_pass http://localhost:4500;
        proxy_redirect off;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Host $server_name;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header X-Forwarded-Host $server_name;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_http_version 1.1;
    }
}


```

Noitice: 'root' is path of build package. You must be put content of build pacakge(dist directory) on here.

### 3. Run

Executing below command if you want run app on dev mode.

> yarn start

Executing this command if you want build app to deploy on server nginx. You will get dist directory on root directory of repository

> yarn build

## II. References

- [NodeJS](https://nodejs.org/en/)
- [Yarn Install](https://yarnpkg.com/lang/en/docs/install)
- [Ant design pro](https://pro.ant.design/)
- [Nginx server](https://www.nginx.com/)
