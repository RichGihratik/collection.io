import { Request } from 'express';
import { FastifyRequest } from 'fastify';

export type PlatformRequest = FastifyRequest | Request;
