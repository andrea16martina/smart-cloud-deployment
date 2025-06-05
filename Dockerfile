# Step 1: Usa un'immagine base con Node.js
FROM node:16

# Step 2: Imposta la directory di lavoro
WORKDIR /app

# Step 3: Copia il package.json e package-lock.json
COPY package*.json ./

# Step 4: Installa le dipendenze
RUN npm install

# Step 5: Copia il resto del codice sorgente
COPY . .

# Step 6: Costruisci l'app in modalità produzione
RUN npm run build

# Step 7: Espone la porta su cui il server gira
EXPOSE 3000

# Step 8: Comando per avviare l'app
CMD ["npm", "start"]
