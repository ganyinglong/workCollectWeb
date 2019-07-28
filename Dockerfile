FROM node:10.16.0

MAINTAINER gyl
#移动当前目录下面的文件到app目录下
RUN mkdir /home/web
#进入到app目录下面
WORKDIR /home/web
RUN npm install

# 暴露8099端口
EXPOSE 8099
CMD [ "npm","start" ]



