import fastifyCors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import fastify from 'fastify';
import {
	serializerCompiler,
	validatorCompiler,
	jsonSchemaTransform,
	type ZodTypeProvider,
} from 'fastify-type-provider-zod';

import { errorHandler } from './error-handler';
import { checkIn } from './routes/check-in';
import { createEvent } from './routes/create-event';
import { getAttendeeBadge } from './routes/get-attendee-badge';
import { getEvent } from './routes/get-event';
import { getEventAttendees } from './routes/get-event-attendees';
import { registerForEvent } from './routes/register-for-event';

export const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
	origin: '*',
});

app.register(fastifySwagger, {
	swagger: {
		consumes: ['application/json'],
		produces: ['application/json'],
		info: {
			title: 'pass.in',
			description:
				'Especificações da API para o back-end da aplicação pass.in construída durante o NLW Unite da Rocketseat.',
			version: '1.0.0',
		},
	},
	transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUI, {
	routePrefix: '/docs',
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createEvent);
app.register(registerForEvent);
app.register(getEvent);
app.register(getAttendeeBadge);
app.register(checkIn);
app.register(getEventAttendees);

app.setErrorHandler(errorHandler);

const port = 3333;
const host = '0.0.0.0';

(async () => {
	try {
		await app.listen({ port, host });

		console.info('🚀 HTTP server running!');
	} catch (error) {
		console.error('Error when starting HTTP server: ', console.trace(error));
	}
})();
