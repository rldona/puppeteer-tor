[ ] Dejar de usar el proceso short y usar siempre el long.
    [ ] Segun estadisticas en 1 días el batch hace el scrapping del 40%
    [ ] En 2 días y medio posiblemnte haga el millon de registros
    [ ] En una semana hace la versión española y la inglesa
[ ] Cambiar el nombre del proyecto: filmaffinity-scrapper-etl
[OK] Realizar una copia de seguridad de la base de datos y subir a: 1. Google Drive y 2. One Drive
    [OK] Manualmente: usando la Mongo Compass
    [ ] Automatizado mediante un script que lo envie a un AWS S3 o bucket de Google Cloud
        [ ] ¿Es posible a Google Drive mediante su API? (investigar)
[~] Realizar un script (batch) que cada cierto tiempo pase lo datos de las base de datos a un Elastic Search
    [ ] Es necesario eliminar el campo '_id' para que no tenga coflictos con Elastic Search
[~] Crear un punto de entrada en la app de node.js para que:
  [ ] 1. Lance el batch-long
  [ ] 2. Lance la Google Cloud Function
  [ ] 3. Lance el batch-short (depende de 2.)
[ ] Terminar de dearrollar el API multidioma
[ ] Dockerizar los servicios: batches, mongodb, redis, grafana, api-node, ¿react-spa?
[ ] Crear un proceso de reintentos para los fallos de la colección: reviews-[language]-updated-error
[ ] Crear una SPA para controlar los procesos y sus estados: usar socket.io
[ ] Modifiacr la Google Cloud Function para que coja por defecto el idioma 'es' y que acepte por query otro idioma ('en')
[ ] El proceso batch-short hay que lanzarlo con un argumento de idioma ('es' ó 'en')
[ ] Pasar la base de datos de mongo a Postgress o MySQL para tener la posibilidad de usar Grafana como visualizador
[ ] Implementar Redis (si no usamos Elastic Search)
[~] Configuar Jest
[~] Añadir tests unitaros
[ ] Configuar Cypress
[ ] Añadir test E2E
