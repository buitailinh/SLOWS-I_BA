import { swaggerSchemaExample } from 'src/share/utils/swagger_schema';

export const DALLE_CONST = {
  MODEL_NAME: 'dalle',
  MODEL_PROVIDER: 'DALLE_MODEL'
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
