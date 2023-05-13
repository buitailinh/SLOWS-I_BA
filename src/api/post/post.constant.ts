import { swaggerSchemaExample } from 'src/share/utils/swagger_schema';
export const POST_CONST = {
  MODEL_NAME: 'posts',
  MODEL_PROVIDER: 'POST_MODEL',
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
