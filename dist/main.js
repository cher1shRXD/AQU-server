"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config = require("config");
const swagger_1 = require("./util/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const serverConfig = config.get('server');
    (0, swagger_1.setupSwagger)(app);
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
        allowedHeaders: [
            'Origin',
            'Accept',
            'X-Requested-With',
            'Content-Type',
            'Authorization',
        ],
        preflightContinue: false,
    });
    await app.listen(serverConfig.port, '0.0.0.0');
}
bootstrap();
//# sourceMappingURL=main.js.map