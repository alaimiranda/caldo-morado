export const host = process.env.APP_HOST || 'localhost';
export const port = parseInt(process.env.APP_PORT || 8080);
export const baseUrl = `http://${host}${port !== 80 ? `:${port}` : ''}`;
