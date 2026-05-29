FROM maven:3.9.9-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn -B -DskipTests clean package

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
RUN apk add --no-cache tini
COPY --from=builder /app/target/ternurines-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["java", "-XX:+UseG1GC", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
