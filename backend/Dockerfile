FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Copy prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy source and seed
COPY src ./src

EXPOSE 3001

CMD ["node", "src/app.js"]
