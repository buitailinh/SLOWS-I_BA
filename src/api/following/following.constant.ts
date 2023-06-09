import { swaggerSchemaExample } from "src/share/utils/swagger_schema";

export const FOLLOWING_CONST = {
  MODEL_NAME: 'following',
  MODEL_PROVIDER: 'FOLLOWING_MODEL'
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
