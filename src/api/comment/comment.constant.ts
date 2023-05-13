import { swaggerSchemaExample } from 'src/share/utils/swagger_schema';

export const COMMENT_CONST = {
  MODEL_NAME: 'comment',
  MODEL_PROVIDER: 'COMMENT_PROVIDER',
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
