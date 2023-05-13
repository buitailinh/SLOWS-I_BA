import { swaggerSchemaExample } from "src/share/utils/swagger_schema";


export const CHATAI_CONST = {
  MODEL_NAME: 'chat_ai',
  MODEL_PROVIDER: 'CHATAI_PROVIDER',
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
