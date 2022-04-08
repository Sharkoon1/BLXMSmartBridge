FROM node:16.13.2
RUN apt-get update || : && apt-get install python -y
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
CMD ["npm", "run", "start"]