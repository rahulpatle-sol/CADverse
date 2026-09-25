# backend/Dockerfile — Single image for Render free tier
FROM python:3.11-slim

# Install Node.js + ODA Converter
RUN apt-get update && apt-get install -y --no-install-recommends \
    nodejs npm ca-certificates wget unzip \
    && rm -rf /var/lib/apt/lists/*

# ODA File Converter (Linux headless)
RUN wget -q https://github.com/OpenDesignAlliance/ODAFileConverter/releases/download/ODAFileConverter_27.1.0/ODAFileConverter_Linux.zip \
    && unzip -q ODAFileConverter_Linux.zip -d /opt/oda \
    && chmod +x /opt/oda/ODAFileConverter \
    && ln -s /opt/oda/ODAFileConverter /usr/local/bin/ODAFileConverter \
    && rm ODAFileConverter_Linux.zip

# Python deps
RUN pip install --no-cache-dir ezdxf

WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --only=production

COPY backend/server.js backend/parser.py backend/convert_dwg.py backend/costEngine.js backend/rate_card.json ./

# Fix Windows path in convert_dwg.py (raw string for ODA_PATH)
RUN sed -i "s|C:\\\\Program Files\\\\ODA\\\\ODAFileConverter 27.1.0\\\\ODAFileConverter.exe|/usr/local/bin/ODAFileConverter|" convert_dwg.py

ENV PORT=10000 \
    PYTHON_BIN=python3 \
    ODA_PATH=/usr/local/bin/ODAFileConverter \
    NODE_ENV=production

EXPOSE 10000
CMD ["node", "server.js"]