# SIT Profile Analyzer Client

## A. Setup production environment:

- Docker docker version 20.10.8 or later (recommended)

Install docker by command

 ```bash
  sudo snap install docker
```

## B. Build production:
- Step 1:
Replace proxy_pass on docker/config/nginx.conf to your server  
Example: proxy_pass http://localhost:4500 -> proxy_pass http://10.78.96.161:4500

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
- Step 2: Run command

```bash
  docker-compose up -d --build
```

> If your server can connect to the external internet. You just need to go to this step on your server and check the website run at http://your-ip-server

> If your server don't have internet connection you need to do production build on local machine and follow below steps:  

1. Compress and save the Docker image with the command

```bash
  docker save frontend_sit_profile_analizer_client -o ./frontend_sit_profile_analizer_client.tar
```

1. Upload the zipped file from localhost to your server (frontend_sit_profile_analizer_client.tar)

2. On the server at the directory containing the 2 files you just uploaded, run the following command to import the docker image into your docker server:
  
```bash
  docker load < ./frontend_sit_profile_analizer_client.tar
```

<div style="page-break-after: always;"></div>

4. To run the newly loaded docker images, we use the following command:

```bash
  docker run -dit --name sit_profile_analizer_web -p 80:80 frontend_sit_profile_analizer_client
```

Check the website run at http://your-ip-server

## C. References

- [Docker CLI](https://docs.docker.com/engine/reference/commandline/cli/)
- [Nginx server](https://www.nginx.com/)
