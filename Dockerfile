FROM node:19
WORKDIR /usr/src/app
COPY ./ ./
RUN ["npm", "install"]
RUN ["npm", "run", "build"]
RUN ["rm", "-rf", "./src"]
VOLUME /data
EXPOSE 6378
ENV PORT=6378
ENV HOST=0.0.0.0
ENV ACTIVITY_FILE=/data/activity.log
ENV DATA_FILE=/data/data.json
ENV DATA_RECORD_INTERVAL=60
CMD ["npm", "run", "start"]
