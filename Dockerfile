# OBINexus Governance Platform
# Trident Architecture: OHA (Public) | IWU (Law) | IJI (Order)
FROM node:20-alpine

LABEL maintainer="Nnamdi Michael Okpala <okpalan@protonmail.com>"
LABEL description="OBINexus Trident Governance Web Platform"

WORKDIR /app

# Copy workspace root and all subdomain packages
COPY package.json package-lock.json* ./
COPY shared/ ./shared/
COPY obinexus.org/ ./obinexus.org/
COPY oha.obinexus.org/ ./oha.obinexus.org/
COPY iwu.obinexus.org/ ./iwu.obinexus.org/
COPY iji.obinexus.org/ ./iji.obinexus.org/
COPY server.js ./

# Install dependencies
RUN npm install --production

# Expose governance platform port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

# Start the governance platform
CMD ["node", "server.js"]
