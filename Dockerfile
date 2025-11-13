# ==========================
# Unified Event Analytics App
# ==========================

FROM node:22-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

# ✅ Copy .env file (this was missing)
COPY .env .env

# ✅ Copy rest of the source
COPY . .

EXPOSE 5000
ENV NODE_ENV=production

CMD ["node", "src/server.js"]
