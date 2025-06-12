FROM nginx:alpine

# Remove arquivos padrão
RUN rm -rf /usr/share/nginx/html/*

# Copia tudo da pasta frontend para o Nginx
COPY . /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
