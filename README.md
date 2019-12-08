# RabbitMQ + Winston

Gestion de colas con RabbitMQ para el almacenamiento logs con Winston. 

## Estructura del Proyecto

    docker-compose.yml                      # Crea la red, imagenes y contenedores (RabbitMQ, Producer y Cnsumer)
        ├───consumer                        # Archivos para el contenerdor Consumer
        |       ├───consumers               # Consumidores de las colas
        |       ├───controllers             # Controladores (Winston)
        |       ├───logs                    # Almacenamiento de Logs
        |       ├───test                    # Archivos de Test
        |       ├───Dockerfile              # Acciones sobre el contenedor
        |       └───index.js                # Archivo de inicializacion (RabbitMQ)
        └───producer                        # Archivos para el contenerdor Consumer
                ├───config                  # Configuraciones (RabbitMQ)
                ├───controllers             # Controladores (Métodos Routing y RPC de RabbitMQ)
                ├───routes                  # Rutas para recibir los Logs
                ├───test                    # Archivos de Test
                ├───Dockfile                # Acciones sobre el contenedor
                └───index.js                # Utilidades comunes para todas las colecciones

## Inicio

1. Instalar Docker y Docker-compose:
    - [Docker](https://docs.docker.com/docker-for-mac/install/)
    - [Docker-compose](https://docs.docker.com/compose/install/)
    
2. Clonar el repositorio:
            
    `git clone https://github.com/JaimeRC/rabbitMQ-winston.git`
    
3. Inicializar Docker-compose:

    `docker-compose up -d`
    
            Creating network "rabbitmq_app-network" with driver "bridge"
            Creating rabbitmq ... done
            Creating producer ... done
            Creating consumer ... done

    
4. Verificar que las conexiones se han realizado correctamente:

   - `docker logs -f producer`
       
            > producer_rabbitmq@1.0.0 start /src
            > node index.js
            
            Server init in port 8080
            RabbitMQ connected in amqp://rabbitmq
             [*] Created queues in Routing method: logs -> info, error
             [*] Created queues in RPC method:  amq.gen-C0E2GxWAoPxbGpFwz_5UFg 21307ae3-610c-4b54-b249-c3dc9ef70288
            
   - `docker logs -f consumer`
   
           > consumer_rabbitmq@1.0.0 start /src
           > node index.js
           
           RabbitMQ connected in amqp://rabbitmq
            [*] Awaiting RPC requests
            [*] Waiting for logs.
 
5. En el caso de que no se haya conectado correctamente, reiniciamos el contenedor que no se haya conectado correctamente:

        `docker restart consumer` 
        `docker restart producer` 


        
