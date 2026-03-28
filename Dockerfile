FROM node:20-alpine AS frontend-build

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build


FROM maven:3.9.9-eclipse-temurin-21 AS backend-build

WORKDIR /app/backend

COPY backend/pom.xml ./
RUN mvn -q -DskipTests dependency:go-offline

COPY backend/src ./src
COPY --from=frontend-build /app/frontend/dist ./src/main/resources/static

RUN mvn -DskipTests clean package


FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY --from=backend-build /app/backend/target/hotel-management-backend-0.0.1-SNAPSHOT.war ./app.war

ENV PORT=10000
EXPOSE 10000

CMD ["sh", "-c", "java -Dserver.port=${PORT:-10000} -jar /app/app.war"]
