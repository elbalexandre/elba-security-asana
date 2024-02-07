// /app/install/actions.ts
'use server';
import { logger } from '@elba-security/logger';
import { z } from 'zod';
import { MySaasError } from '@/connectors/commons/error';
import { env } from '@/env';

const formSchema = z.object({
  token: z.string().min(1),
  organisationId: z.string().uuid(),
  region: z.string().min(1),
});

export type FormState = {
  redirectUrl?: string;
  errors?: {
    token?: string[] | undefined;
    // we are not handling organisationId and region errors in the client as fields are hidden
  };
};
export const install = async (_: FormState, formData: FormData): Promise<FormState> => {
  const result = formSchema.safeParse({
    token: formData.get('token'),
    organisationId: formData.get('organisationId'),
    region: formData.get('region'),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    // handling await
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
    return {
      redirectUrl: `${env.ELBA_REDIRECT_URL}?source_id=${env.ELBA_SOURCE_ID}&success=true`,
    };
  } catch (error) {
    logger.warn('Could not register organisation', { error });
    logger.debug(`ELBA_REDIRECT_URL: ${env.ELBA_REDIRECT_URL}`);
    logger.debug(`ELBA_SOURCE_ID: ${env.ELBA_SOURCE_ID}`);
    // Handle errors accordingly and provide a redirectUrl
    if (error instanceof MySaasError && error.response && error.response.status === 401) {
      logger.info(
        `Redirecting to: ${env.ELBA_REDIRECT_URL}?source_id=${env.ELBA_SOURCE_ID}&error=unauthorized`
      );
      return {
        redirectUrl: `${env.ELBA_REDIRECT_URL}?source_id=${env.ELBA_SOURCE_ID}&error=unauthorized`,
      };
    }
    logger.info(
      `Redirecting to: ${env.ELBA_REDIRECT_URL}?source_id=${env.ELBA_SOURCE_ID}&error=internal_error`
    );
    return {
      redirectUrl: `${env.ELBA_REDIRECT_URL}?source_id=${env.ELBA_SOURCE_ID}&error=internal_error`,
    };
  }
};
