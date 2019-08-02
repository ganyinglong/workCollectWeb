FROM node:10.16.0

MAINTAINER gyl
#移动当前目录下面的文件到app目录下
RUN mkdir /home/web
ADD . /home/web
#进入到app目录下面
WORKDIR /home/web

RUN npm config set registry https://registry.npm.taobao.org
RUN npm install webpack -g
RUN npm install webpack-dev-server -g 

RUN npm install

# 暴露8069端口
EXPOSE 8069
CMD [ "npm","start"]