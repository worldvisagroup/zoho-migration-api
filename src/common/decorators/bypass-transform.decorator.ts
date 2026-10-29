import { SetMetadata } from '@nestjs/common';

export const BYPASS_TRANSFORM_KEY = 'bypassTransform';

/**
 * Decorator to bypass the global TransformInterceptor response envelope.
 * Used for endpoints requiring a custom root response contract (e.g. migration endpoints).
 */
export const BypassTransform = (): MethodDecorator & ClassDecorator =>
  SetMetadata(BYPASS_TRANSFORM_KEY, true);
