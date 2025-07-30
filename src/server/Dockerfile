FROM node:18-alpine

WORKDIR /app

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodeuser -u 1001

COPY package*.json ./

RUN npm ci --only=production && npm cache clean --force

COPY . .

RUN chown -R nodeuser:nodejs /app
USER nodeuser

EXPOSE 3001

CMD ["npm", "start"]