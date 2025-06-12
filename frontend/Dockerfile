# Usa a imagem oficial do nginx como base
FROM nginx:alpine

# Remove os arquivos padrão do nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia os arquivos do seu frontend para o diretório onde o nginx serve os arquivos
COPY ./dist /usr/share/nginx/html

# Expõe a porta 80 para o container
EXPOSE 80

# Comando padrão para rodar o nginx em foreground
CMD ["nginx", "-g", "daemon off;"]
