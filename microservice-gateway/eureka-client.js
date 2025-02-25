const { Eureka } = require('eureka-js-client');
require('dotenv').config();

const eurekaClient = new Eureka({
    instance: {
        app: "API-GATEWAY",
        hostName: process.env.HOSTNAME || "localhost",
        ipAddr: "127.0.0.1",
        statusPageUrl: `http://localhost:${process.env.PORT}/health`,
        port: { "$": process.env.PORT, "@enabled": true },
        vipAddress: "API-GATEWAY",
        dataCenterInfo: { "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo", name: "MyOwn" }
    },
    eureka: {
        host: "localhost",
        port: 8761,
        servicePath: "/eureka/apps/"
    }
});

eurekaClient.start();
console.log("✅ API Gateway enregistré dans Eureka");

module.exports = eurekaClient;
