FROM golang:1.13.0-alpine as build

WORKDIR /home/app

COPY . .

RUN go build -o /home/application main.go

RUN chmod +x /home/application

FROM alpine

COPY --from=build /home/application /home/application

EXPOSE 8080

CMD [ "/home/application" ]
