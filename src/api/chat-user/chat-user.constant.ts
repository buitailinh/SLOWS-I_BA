import { swaggerSchemaExample } from "src/share/utils/swagger_schema";


export const CHATUSER_CONST = {
  MODEL_NAME: 'chat_user',
  MODEL_PROVIDER: 'CHATUSER_PROVIDER',
}

export const SWAGGER_RESPONSE = {
  HEALTH_CHECK: swaggerSchemaExample(
    {
      data: {
        message: 'OK Test',
      },
      statusCode: 200,
    },
    'API for health check',
  ),
};
